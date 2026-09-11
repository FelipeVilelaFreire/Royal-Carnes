"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import styles from "./GlassCursor.module.css";

const MAX_TRAIL = 40;

type CursorIntensity = "soft" | "medium" | "strong";
type PointerState = { smooth: [number, number]; target: [number, number] };
type CursorPreset = { blobSize: number; blurSpread: number; borderGlow: number; dampening: number; opacity: number; refraction: number; specularGain: number; tailFade: number; trailLength: number; warpAmount: number; warpScale: number };

const CURSOR_PRESETS: Record<CursorIntensity, CursorPreset> = {
  soft: { blobSize: 0.022, blurSpread: 0.16, borderGlow: 0.08, dampening: 0.1, opacity: 0.42, refraction: 0.12, specularGain: 0.2, tailFade: 0.54, trailLength: 18, warpAmount: 10, warpScale: 4 },
  medium: { blobSize: 0.028, blurSpread: 0.2, borderGlow: 0.12, dampening: 0.08, opacity: 0.52, refraction: 0.18, specularGain: 0.28, tailFade: 0.48, trailLength: 24, warpAmount: 14, warpScale: 5 },
  strong: { blobSize: 0.052, blurSpread: 0.26, borderGlow: 0.2, dampening: 0.08, opacity: 0.68, refraction: 0.24, specularGain: 0.42, tailFade: 0.38, trailLength: 28, warpAmount: 18, warpScale: 6 },
};

const vertexShader = `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

const fragmentShader = `
precision highp float;
varying vec2 vUv;
#define MAX_TRAIL 40
#define INV_81 0.01234567901
uniform sampler2D uImage;
uniform vec2 uViewport;
uniform vec2 uInvViewport;
uniform vec2 uTrail[MAX_TRAIL];
uniform float uRadii[MAX_TRAIL];
uniform int uTrailCount;
uniform float uPresence;
uniform float uRefract;
uniform float uSpread;
uniform float uRim;
uniform float uSpec;
uniform vec2 uBlobCenter;
uniform float uWarp;
uniform float uWarpScale;
uniform float uTime;
uniform float uAlpha;

float capsule(vec2 p, vec2 a, vec2 b, float r) {
  vec2 pa = p - a; vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / (dot(ba, ba) + 0.000001), 0.0, 1.0);
  float d = length(pa - ba * h);
  return (r * r) / (d * d + 0.000001);
}

float metaball(vec2 p) {
  float aspect = uViewport.x * uInvViewport.y;
  vec2 q = p;
  float warp = uWarp * 0.0008;
  q.x += (sin(q.y * uWarpScale + uTime * 2.3) * 0.6 + sin(q.y * 2.3 + q.x * 0.7 + uTime * 1.7) * 0.4) * warp;
  q.y += (cos(q.x * uWarpScale + uTime * 1.7) * 0.6 + cos(q.x * 2.1 + q.y * 0.9 + uTime * 2.3) * 0.4) * warp;
  q *= vec2(aspect, 1.0);
  float field = 0.0;
  for (int index = 0; index < MAX_TRAIL; index++) {
    if (index >= uTrailCount) break;
    float radius = uRadii[index];
    vec2 start = (uTrail[index] * uInvViewport) * vec2(aspect, 1.0);
    if (index < uTrailCount - 1) {
      vec2 end = (uTrail[index + 1] * uInvViewport) * vec2(aspect, 1.0);
      field += capsule(q, start, end, (radius + uRadii[index + 1]) * 0.5);
    } else {
      vec2 delta = q - start;
      field += (radius * radius) / (dot(delta, delta) + 0.000001);
    }
  }
  return field;
}

void main() {
  vec2 point = vUv;
  float field = metaball(point);
  float fill = smoothstep(0.86, 1.3, field) * uPresence;
  float edge = (smoothstep(0.5, 0.9, field) - smoothstep(1.0, 1.36, field)) * uPresence;
  if (fill + edge < 0.001) { gl_FragColor = vec4(0.0); return; }
  vec2 refracted = (point - uBlobCenter) * (1.0 - uRefract * fill) + uBlobCenter;
  vec2 stepSize = uSpread * uInvViewport;
  vec4 sampled = vec4(0.0);
  for (float x = -4.0; x <= 4.0; x++) for (float y = -4.0; y <= 4.0; y++) sampled += texture2D(uImage, refracted + vec2(x, y) * stepSize);
  sampled *= INV_81;
  vec2 head = uTrail[0] * uInvViewport;
  float glow = clamp((clamp(point.y - head.y, 0.0, 0.15) + 0.06) * 2.5, 0.0, 1.0);
  vec4 lit = clamp(sampled + vec4(fill * glow * uSpec + edge * uRim), 0.0, 1.0);
  gl_FragColor = vec4(lit.rgb, max(fill, edge) * uAlpha);
}
`;

export interface GlassCursorProps { disabledBelow?: number; intensity: CursorIntensity }

export function GlassCursor({ disabledBelow = 900, intensity }: GlassCursorProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const pointerRef = useRef<PointerState>({ smooth: [-9999, -9999], target: [-9999, -9999] });
  const presenceRef = useRef(0);
  const trailCountRef = useRef(0);
  const [enabled, setEnabled] = useState(false);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const preset = CURSOR_PRESETS[intensity];
  const trail = useMemo(() => Array.from({ length: MAX_TRAIL }, () => new THREE.Vector2(-9999, -9999)), []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(window.innerWidth >= disabledBelow && !query.matches);
    sync(); window.addEventListener("resize", sync); query.addEventListener("change", sync);
    return () => { window.removeEventListener("resize", sync); query.removeEventListener("change", sync); };
  }, [disabledBelow]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const computed = window.getComputedStyle(root);
    const nextTexture = createGlassTexture({ accent: computed.getPropertyValue("--ui-background-accent").trim(), background: computed.getPropertyValue("--ui-background-bg").trim(), surface: computed.getPropertyValue("--ui-background-surface-bg").trim() });
    setTexture(nextTexture);
    return () => nextTexture.dispose();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return;
    const rect = () => root.getBoundingClientRect();
    const onMove = (event: PointerEvent) => { const bounds = rect(); pointerRef.current.target = [event.clientX - bounds.left, event.clientY - bounds.top]; };
    const onLeave = () => { pointerRef.current.target = [-9999, -9999]; };
    window.addEventListener("pointermove", onMove, { passive: true }); window.addEventListener("pointerleave", onLeave);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerleave", onLeave); };
  }, [enabled]);

  return <span ref={rootRef} className={styles.root} aria-hidden="true">
    {enabled ? <Canvas className={styles.canvas} dpr={[1, 1.5]} gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }} orthographic camera={{ bottom: -1, left: -1, position: [0, 0, 1], right: 1, top: 1, zoom: 1 }}><CursorScene pointerRef={pointerRef} presenceRef={presenceRef} preset={preset} texture={texture} trail={trail} trailCountRef={trailCountRef} /></Canvas> : null}
  </span>;
}

function CursorScene({ pointerRef, presenceRef, preset, texture, trail, trailCountRef }: { pointerRef: React.MutableRefObject<PointerState>; presenceRef: React.MutableRefObject<number>; preset: CursorPreset; texture: THREE.Texture | null; trail: THREE.Vector2[]; trailCountRef: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null); const radiiRef = useRef(new Float32Array(MAX_TRAIL)); const { size } = useThree();
  const uniforms = useMemo(() => ({ uAlpha: { value: preset.opacity }, uImage: { value: texture }, uViewport: { value: new THREE.Vector2(1, 1) }, uInvViewport: { value: new THREE.Vector2(1, 1) }, uTrail: { value: trail }, uRadii: { value: new Float32Array(MAX_TRAIL) }, uTrailCount: { value: 0 }, uPresence: { value: 0 }, uRefract: { value: preset.refraction }, uSpread: { value: preset.blurSpread }, uRim: { value: preset.borderGlow }, uSpec: { value: preset.specularGain }, uBlobCenter: { value: new THREE.Vector2(0.5, 0.5) }, uWarp: { value: preset.warpAmount }, uWarpScale: { value: preset.warpScale }, uTime: { value: 0 } }), [preset, texture, trail]);
  useFrame((state, delta) => {
    if (!meshRef.current || !texture) return;
    const pointer = pointerRef.current; const active = pointer.target[0] > -999;
    if (active) {
      if (pointer.smooth[0] < -999) { pointer.smooth = [...pointer.target]; for (let index = 0; index < MAX_TRAIL; index += 1) trail[index].set(pointer.smooth[0], size.height - pointer.smooth[1]); trailCountRef.current = Math.min(preset.trailLength, MAX_TRAIL); }
      else { const ease = 1 - Math.pow(preset.dampening, Math.min(delta * 60, 4)); pointer.smooth[0] += (pointer.target[0] - pointer.smooth[0]) * ease; pointer.smooth[1] += (pointer.target[1] - pointer.smooth[1]) * ease; for (let index = MAX_TRAIL - 1; index >= 1; index -= 1) trail[index].copy(trail[index - 1]); trail[0].set(pointer.smooth[0], size.height - pointer.smooth[1]); trailCountRef.current = Math.min(trailCountRef.current + 1, preset.trailLength, MAX_TRAIL); }
    }
    presenceRef.current += ((active ? 1 : 0) - presenceRef.current) * (1 - Math.exp(-(active ? 8 : 3) * delta));
    if (!active && presenceRef.current < 0.002) { presenceRef.current = 0; pointer.smooth = [-9999, -9999]; trailCountRef.current = 0; }
    const radii = radiiRef.current; let centerX = 0; let centerY = 0; let weightSum = 0;
    for (let index = 0; index < MAX_TRAIL; index += 1) { if (index < trailCountRef.current) { const ratio = index / Math.max(trailCountRef.current - 1, 1); const weight = Math.pow(Math.max(1 - ratio, 0.001), preset.tailFade); radii[index] = preset.blobSize * presenceRef.current * weight; centerX += trail[index].x / size.width * weight; centerY += trail[index].y / size.height * weight; weightSum += weight; } else radii[index] = 0; }
    const material = meshRef.current.material as THREE.ShaderMaterial; material.uniforms.uImage.value = texture; material.uniforms.uViewport.value.set(size.width, size.height); material.uniforms.uInvViewport.value.set(1 / size.width, 1 / size.height); material.uniforms.uRadii.value = radii; material.uniforms.uTrailCount.value = trailCountRef.current; material.uniforms.uPresence.value = presenceRef.current; material.uniforms.uBlobCenter.value.set(weightSum ? centerX / weightSum : 0.5, weightSum ? centerY / weightSum : 0.5); material.uniforms.uTime.value = state.clock.elapsedTime;
  });
  if (!texture) return null;
  return <mesh ref={meshRef}><planeGeometry args={[2, 2]} /><shaderMaterial fragmentShader={fragmentShader} transparent uniforms={uniforms} vertexShader={vertexShader} /></mesh>;
}

function createGlassTexture(colors: { accent: string; background: string; surface: string }) {
  const canvas = document.createElement("canvas"); canvas.width = 1600; canvas.height = 1000; const context = canvas.getContext("2d");
  if (context) {
    const base = context.createLinearGradient(0, 0, 1600, 1000); base.addColorStop(0, colors.background); base.addColorStop(0.45, colors.surface); base.addColorStop(1, colors.background); context.fillStyle = base; context.fillRect(0, 0, canvas.width, canvas.height);
    const primaryGlow = context.createRadialGradient(360, 230, 0, 360, 230, 620); primaryGlow.addColorStop(0, colors.accent); primaryGlow.addColorStop(0.32, colors.accent); primaryGlow.addColorStop(1, "transparent"); context.globalAlpha = 0.34; context.fillStyle = primaryGlow; context.fillRect(0, 0, canvas.width, canvas.height);
    const secondaryGlow = context.createRadialGradient(1280, 700, 0, 1280, 700, 480); secondaryGlow.addColorStop(0, colors.accent); secondaryGlow.addColorStop(1, "transparent"); context.globalAlpha = 0.14; context.fillStyle = secondaryGlow; context.fillRect(0, 0, canvas.width, canvas.height);
    context.globalAlpha = 1;
  }
  const texture = new THREE.CanvasTexture(canvas); texture.minFilter = THREE.LinearFilter; texture.magFilter = THREE.LinearFilter; return texture;
}
