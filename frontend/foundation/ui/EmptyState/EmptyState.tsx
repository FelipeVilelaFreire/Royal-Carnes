"use client";

import React, { type CSSProperties, type HTMLAttributes } from "react";
import { themeColorsDefault, themeSpacingDefault } from "../../tokens/theme.tokens";
import { useUiConfig } from "../UiProvider";
import styles from "./EmptyState.module.css";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  align?: "left" | "center";
  size?: "compact" | "regular" | "spacious";
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actions,
  align = "center",
  size = "regular",
  className,
  style,
  ...props
}) => {
  const ui = useUiConfig();
  const themeColors = (ui.theme as any)?.colors || themeColorsDefault.dark;
  const spacing = themeSpacingDefault;

  const sizeConfig = {
    compact: {
      minHeight: "220px",
      paddingY: spacing.lg,
      paddingX: spacing.lg,
      iconFrame: "52px",
      titleSize: "22px"
    },
    regular: {
      minHeight: "320px",
      paddingY: spacing["2xl"],
      paddingX: spacing.xl,
      iconFrame: "64px",
      titleSize: "28px"
    },
    spacious: {
      minHeight: "440px",
      paddingY: spacing["3xl"],
      paddingX: spacing["2xl"],
      iconFrame: "76px",
      titleSize: "34px"
    }
  }[size];

  const emptyStateStyle = {
    "--ui-empty-state-align-items": align === "left" ? "flex-start" : "center",
    "--ui-empty-state-text-align": align,
    "--ui-empty-state-actions-justify": align === "left" ? "flex-start" : "center",
    "--ui-empty-state-gap": spacing.lg,
    "--ui-empty-state-content-gap": spacing.sm,
    "--ui-empty-state-actions-gap": spacing.sm,
    "--ui-empty-state-min-height": sizeConfig.minHeight,
    "--ui-empty-state-mobile-min-height": "220px",
    "--ui-empty-state-padding-y": sizeConfig.paddingY,
    "--ui-empty-state-padding-x": sizeConfig.paddingX,
    "--ui-empty-state-mobile-padding-y": spacing.xl,
    "--ui-empty-state-mobile-padding-x": spacing.md,
    "--ui-empty-state-content-width": "560px",
    "--ui-empty-state-icon-frame": sizeConfig.iconFrame,
    "--ui-empty-state-icon-radius": "18px",
    "--ui-empty-state-icon-bg": themeColors.surfaceContainer || themeColors.surface,
    "--ui-empty-state-icon-color": themeColors.primary,
    "--ui-empty-state-border-width": "1px",
    "--ui-empty-state-border-color": themeColors.border,
    "--ui-empty-state-title-color": themeColors.text,
    "--ui-empty-state-title-family": "'Playfair Display', serif",
    "--ui-empty-state-title-size": sizeConfig.titleSize,
    "--ui-empty-state-title-weight": 800,
    "--ui-empty-state-title-line-height": 1.1,
    "--ui-empty-state-description-color": themeColors.textMuted,
    "--ui-empty-state-description-size": "15px",
    "--ui-empty-state-description-line-height": 1.6,
    ...style
  } as CSSProperties;

  return (
    <div
      {...props}
      className={[styles.emptyState, className].filter(Boolean).join(" ")}
      style={emptyStateStyle}
    >
      {icon && <div className={styles.iconFrame}>{icon}</div>}
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
};
