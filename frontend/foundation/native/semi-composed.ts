import {
  resolveDisabledRecipe,
  resolveFocusRingRecipe,
  resolveGlassRecipe,
  resolveIconRecipe,
  resolveMotionRecipe,
  resolveSemiComposedConfig,
  resolveSemiTheme,
  resolveStateLayerRecipe,
  resolveStrokeRecipe,
  resolveSurfaceRecipe,
  resolveTextRecipe,
  SEMI_LEVELS,
  type SemiComposedConfig,
  type SemiLevel,
  type SemiThemeInput,
  type SurfaceAppearance,
  type SurfaceTone,
} from "../semi-composed/core";
import type { NativeStyleDescriptor } from "./types";

export const nativeSemiComposedRecipeFamilies = [
  "ambient",
  "background",
  "disabled",
  "divider",
  "dropdown-panel",
  "field",
  "focus-ring",
  "glass",
  "gradient",
  "icon",
  "inner-elevation",
  "listbox",
  "listbox-option",
  "motion",
  "outer-elevation",
  "state-layer",
  "stroke",
  "surface",
  "text",
] as const;

export type NativeSemiComposedRecipeFamily = (typeof nativeSemiComposedRecipeFamilies)[number];

export interface NativeSemiComposedBridge {
  contractVersion: "semi-composed.native.v1";
  families: readonly NativeSemiComposedRecipeFamily[];
  output: "native-style-descriptor";
  recipes?: NativeSemiComposedDescriptor;
}

export type NativeSemiComposedDescriptor = Partial<Record<NativeSemiComposedRecipeFamily, any>>;

export interface NativeSemiComposedResolveInput {
  mode?: string;
  semiComposed?: Partial<SemiComposedConfig>;
  theme?: SemiThemeInput;
}

const surfaceAppearances: SurfaceAppearance[] = ["solid", "soft", "outline", "transparent", "glass"];
const surfaceTones: SurfaceTone[] = ["neutral", "primary", "success", "warning", "danger"];

export const toNativeShadowStyle = (elevation: any): NativeStyleDescriptor => ({
  elevation: elevation?.native?.blur ? Math.round(Number(elevation.native.blur) / 4) : 0,
  shadowColor: elevation?.native?.color || elevation?.color,
  shadowOffset: {
    width: elevation?.native?.x ?? elevation?.x ?? 0,
    height: elevation?.native?.y ?? elevation?.y ?? 0,
  },
  shadowOpacity: elevation?.native?.opacity ?? elevation?.opacity ?? 0,
  shadowRadius: elevation?.native?.blur ?? elevation?.blur ?? 0,
});

export const toNativeSurfaceStyle = (recipe: any): NativeStyleDescriptor => ({
  ...toNativeShadowStyle(recipe?.outerElevation),
  backgroundColor: recipe?.bg,
  borderColor: recipe?.stroke?.color,
  borderRadius: recipe?.radius,
  borderWidth: recipe?.stroke?.width,
  color: recipe?.color,
  opacity: recipe?.bgOpacity,
});

export const toNativeTextStyle = (recipe: any): NativeStyleDescriptor => ({
  color: recipe?.color,
  fontFamily: recipe?.fontFamily,
  fontSize: recipe?.fontSize,
  fontWeight: recipe?.fontWeight,
  letterSpacing: recipe?.letterSpacing,
  lineHeight: recipe?.lineHeight,
});

export const toNativeIconStyle = (recipe: any): NativeStyleDescriptor => ({
  color: recipe?.color,
  fill: recipe?.fill,
  height: recipe?.size,
  strokeWidth: recipe?.strokeWidth,
  width: recipe?.size,
});

export const resolveNativeSemiComposedDescriptor = (
  input: NativeSemiComposedResolveInput = {},
): NativeSemiComposedDescriptor => {
  const semi = resolveSemiComposedConfig(input.semiComposed);
  const theme = resolveSemiTheme({
    ...input.theme,
    defaultMode: input.mode || (input.theme as any)?.defaultMode,
  } as SemiThemeInput);
  const levels = SEMI_LEVELS as readonly SemiLevel[];

  const byLevel = <T>(resolver: (level: SemiLevel) => T) =>
    Object.fromEntries(levels.map((level) => [level, resolver(level)]));

  return {
    disabled: byLevel((level) => resolveDisabledRecipe(semi.disabled[level], theme)),
    "focus-ring": byLevel((level) => resolveFocusRingRecipe(semi.focusRing[level], theme)),
    glass: byLevel((level) => resolveGlassRecipe(semi.glass[level], theme)),
    icon: byLevel((level) => toNativeIconStyle(resolveIconRecipe(semi.icon[level], theme))),
    motion: byLevel((level) => resolveMotionRecipe(semi.motion[level], theme)),
    "state-layer": byLevel((level) => resolveStateLayerRecipe(semi.stateLayer[level], theme)),
    stroke: byLevel((level) => resolveStrokeRecipe(semi.stroke[level], theme)),
    surface: byLevel((level) => ({
      appearances: Object.fromEntries(surfaceAppearances.map((appearance) => [
        appearance,
        Object.fromEntries(surfaceTones.map((tone) => [
          tone,
          toNativeSurfaceStyle(resolveSurfaceRecipe(semi.surface[level], semi, theme, { appearance, tone })),
        ])),
      ])),
    })),
    text: byLevel((level) => toNativeTextStyle(resolveTextRecipe(semi.text[level], theme))),
  };
};

export const createNativeSemiComposedBridge = (
  input: NativeSemiComposedResolveInput = {},
): NativeSemiComposedBridge => ({
  contractVersion: "semi-composed.native.v1",
  families: nativeSemiComposedRecipeFamilies,
  output: "native-style-descriptor",
  recipes: resolveNativeSemiComposedDescriptor(input),
});
