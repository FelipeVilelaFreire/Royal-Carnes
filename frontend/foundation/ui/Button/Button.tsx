"use client";

import { forwardRef, type ButtonHTMLAttributes, type ComponentType, type CSSProperties, type ReactNode } from "react";
import {
  resolveButtonConfig,
  resolveButtonRecipe,
  type ButtonAppearance,
  type ButtonConfig,
  type ButtonLevel,
  type ButtonTone,
} from "../core";
import { Icon } from "../Icon";
import { Surface } from "../Surface";
import { useUiConfig } from "../UiProvider";
import styles from "./Button.module.css";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  appearance?: ButtonAppearance;
  icon?: ReactNode;
  iconPosition?: "start" | "end" | "only";
  loading?: boolean;
  size?: ButtonLevel;
  tone?: ButtonTone;
};

const resolveButtonAppearanceInput = (appearance?: ButtonAppearance): ButtonAppearance | undefined => {
  return appearance;
};

const resolveButtonToneInput = (tone?: ButtonTone): ButtonTone | undefined => {
  return tone;
};

const resolveManifestButtonConfig = (button: unknown): Partial<ButtonConfig> | undefined => {
  if (!button || typeof button !== "object") return undefined;
  const candidate = button as Partial<ButtonConfig>;
  return candidate.defaults || candidate.recipes ? candidate : undefined;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    appearance,
    children,
    className,
    disabled,
    icon,
    iconPosition = "start",
    loading = false,
    size,
    style,
    type = "button",
    tone,
    ...props
  },
  ref
) {
  const ui = useUiConfig();
  const theme = (ui.theme || {}) as any;
  const buttonConfig = resolveButtonConfig(resolveManifestButtonConfig(ui.button));
  const resolved = resolveButtonRecipe(size, theme, undefined, buttonConfig, {
    appearance: resolveButtonAppearanceInput(appearance),
    tone: resolveButtonToneInput(tone),
  });

  const buttonStyle = {
    "--ui-button-duration": `${resolved.motionRecipe.durationMs}ms`,
    "--ui-button-easing": resolved.motionRecipe.easing,
    "--ui-button-font-family": resolved.textRecipe.fontFamily,
    "--ui-button-font-size": `${resolved.textRecipe.fontSize}px`,
    "--ui-button-font-weight": String(resolved.textRecipe.fontWeight),
    "--ui-button-gap": `${resolved.gap}px`,
    "--ui-button-height": `${resolved.height}px`,
    "--ui-button-letter-spacing": `${resolved.textRecipe.letterSpacing}px`,
    "--ui-button-lift": `${resolved.surfaceRecipe.interaction.lift}px`,
    "--ui-button-line-height": `${resolved.textRecipe.lineHeight}px`,
    "--ui-button-min-width": `${resolved.minWidth}px`,
    "--ui-button-padding-x": `${resolved.paddingX}px`,
    "--ui-button-padding-y": `${resolved.paddingY}px`,
    "--ui-button-pressed-scale": String(resolved.motionRecipe.pressedScale),
    "--ui-button-scale": String(resolved.surfaceRecipe.interaction.scale),
    ...style,
  } as CSSProperties;

  const textContent = iconPosition === "only" ? null : children;

  const SurfaceButton = Surface as ComponentType<any>;

  return (
    <SurfaceButton
      {...(props as any)}
      aria-busy={loading || undefined}
      as="button"
      appearance={resolved.appearance}
      className={[styles.button, className].filter(Boolean).join(" ")}
      data-appearance={resolved.appearance}
      data-disabled={disabled || loading || undefined}
      data-icon-position={iconPosition}
      data-loading={loading || undefined}
      data-size={resolved.level}
      data-tone={resolved.tone}
      disabled={disabled || loading}
      geometry={{
        borderWidth: resolved.surfaceRecipe.stroke.width,
        paddingX: resolved.paddingX,
        paddingY: resolved.paddingY,
        radius: resolved.surfaceRecipe.radius,
      }}
      interactive
      recipe={resolved.surfaceRecipe}
      ref={ref}
      style={buttonStyle}
      tone={resolved.tone}
      type={type}
    >
      {loading ? <span aria-hidden="true" className={styles.spinner} /> : icon && iconPosition !== "end" ? <Icon className={styles.icon} size={resolved.iconRecipe.size} tone="inherit">{icon}</Icon> : null}
      {iconPosition !== "only" ? <span>{textContent}</span> : null}
      {!loading && icon && iconPosition === "end" ? <Icon className={styles.icon} size={resolved.iconRecipe.size} tone="inherit">{icon}</Icon> : null}
    </SurfaceButton>
  );
});
