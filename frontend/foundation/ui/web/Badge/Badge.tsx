"use client";

import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import {
  resolveBadgeConfig,
  resolveBadgeRecipe,
  type BadgeConfig,
  type BadgeLevel,
  type BadgeShape,
  type BadgeWidth,
} from "../../shared/core";
import type { SurfaceAppearance, SurfaceTone } from "../../../semi-composed/core";
import { Surface } from "../Surface";
import { useUiConfig } from "../UiProvider";
import styles from "./Badge.module.css";

export type BadgeTone = SurfaceTone | "accent" | "neutral";
export type BadgeAppearance = SurfaceAppearance;

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  appearance?: BadgeAppearance;
  children: ReactNode;
  level?: BadgeLevel;
  shape?: BadgeShape;
  tone?: BadgeTone;
  width?: BadgeWidth;
};

const resolveManifestBadgeConfig = (badge: unknown): Partial<BadgeConfig> | undefined => {
  if (!badge || typeof badge !== "object") return undefined;
  const candidate = badge as Partial<BadgeConfig>;
  return candidate.defaults || candidate.recipes ? candidate : undefined;
};

const toTextTone = (tone: BadgeTone | undefined, appearance: BadgeAppearance | undefined) => {
  if (appearance === "solid") return "inherit";
  if (tone === "success" || tone === "warning" || tone === "danger" || tone === "primary") return tone;
  return "default";
};

const semanticToneToken = (tone: BadgeTone | undefined) => {
  if (tone === "success") return "var(--theme--status-active, var(--theme--color-success, var(--theme--color-text)))";
  if (tone === "warning") return "var(--theme--status-paused, var(--theme--color-warning, var(--theme--color-accent, var(--theme--color-text))))";
  if (tone === "danger") return "var(--theme--status-canceled, var(--theme--color-danger, var(--theme--color-text)))";
  if (tone === "primary") return "var(--theme--color-accent, var(--theme--color-primary, var(--theme--color-text)))";
  return undefined;
};

const semanticSoftSurface = (tone: BadgeTone | undefined, appearance: BadgeAppearance | undefined) => {
  const token = semanticToneToken(tone);
  if (!token || appearance !== "soft") return {};
  return {
    "--ui-surface-bg": `color-mix(in srgb, ${token} 14%, var(--theme--color-surface))`,
    "--ui-surface-border": `color-mix(in srgb, ${token} 42%, var(--theme--color-border))`,
    "--ui-surface-color": token,
  } as CSSProperties;
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { appearance, children, className, level, shape, style, tone, width, ...props },
  ref,
) {
  const ui = useUiConfig();
  const theme = (ui.theme || {}) as any;
  const badgeConfig = resolveBadgeConfig(resolveManifestBadgeConfig(ui.badge));
  const resolved = resolveBadgeRecipe(theme, undefined, badgeConfig, {
    appearance,
    level,
    shape,
    tone: tone as SurfaceTone | undefined,
    width,
  });
  const badgeStyle = {
    ...semanticSoftSurface(tone || resolved.tone, appearance || resolved.appearance),
    "--ui-badge-font-family": resolved.textRecipe.fontFamily,
    "--ui-badge-font-size": `${resolved.textRecipe.fontSize}px`,
    "--ui-badge-font-weight": String(resolved.textRecipe.fontWeight),
    "--ui-badge-inline-size": resolved.inlineSize ? `${resolved.inlineSize}px` : "auto",
    "--ui-badge-letter-spacing": `${resolved.textRecipe.letterSpacing}px`,
    "--ui-badge-line-height": `${resolved.textRecipe.lineHeight}px`,
    "--ui-badge-min-block-size": resolved.blockSize ? `${resolved.blockSize}px` : "auto",
    "--ui-badge-padding-x": `${resolved.paddingX}px`,
    "--ui-badge-padding-y": `${resolved.paddingY}px`,
    "--ui-badge-text-color": semanticToneToken(tone || resolved.tone) || `var(--theme--color-${toTextTone(tone || resolved.tone, appearance || resolved.appearance)}, var(--ui-surface-color, var(--theme--color-text)))`,
    ...style,
  } as CSSProperties;

  return (
    <Surface
      {...props}
      as="span"
      appearance={resolved.appearance as any}
      className={[styles.badge, className].filter(Boolean).join(" ")}
      data-shape={resolved.shape}
      data-width={resolved.width}
      geometry={{
        borderWidth: resolved.surfaceRecipe.stroke.width,
        paddingX: resolved.paddingX,
        paddingY: resolved.paddingY,
        radius: resolved.radius,
      }}
      recipe={resolved.surfaceRecipe}
      ref={ref as any}
      style={badgeStyle}
      tone={resolved.tone}
    >
      {children}
    </Surface>
  );
});

export interface UiBadgeProps extends Omit<BadgeProps, "tone"> {
  status?: "active" | "paused" | "canceled" | "warning" | "neutral" | "primary";
}

const legacyStatusTone: Record<NonNullable<UiBadgeProps["status"]>, BadgeTone> = {
  active: "success",
  canceled: "danger",
  neutral: "neutral",
  paused: "warning",
  primary: "primary",
  warning: "warning",
};

export const UiBadge = forwardRef<HTMLSpanElement, UiBadgeProps>(function UiBadge(
  { status = "active", ...props },
  ref,
) {
  return <Badge {...props} ref={ref} tone={legacyStatusTone[status]} />;
});
