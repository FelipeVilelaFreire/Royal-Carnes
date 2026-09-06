"use client";

import type { CSSProperties } from "react";

type TokenStyle = CSSProperties & Record<`--${string}`, string | number>;

export const portalSurfaceStyles: Record<
  "emptyState" | "headerAction" | "primaryAction" | "profileActiveAction",
  TokenStyle
> = {
  emptyState: {
    "--ui-empty-state-bg": "color-mix(in srgb, var(--theme--color-surface) 88%, var(--theme--color-accent-surface, var(--theme--color-accentSurface, var(--theme--color-accent))) 12%)",
    "--ui-empty-state-border-color": "color-mix(in srgb, var(--theme--color-border) 58%, var(--theme--color-accent-border, var(--theme--color-accentBorder, var(--theme--color-accent))) 42%)",
    "--ui-empty-state-icon-bg": "var(--theme--color-accent-surface, var(--theme--color-accentSurface, var(--theme--color-surface-container)))",
    "--ui-empty-state-icon-color": "var(--theme--color-accent)",
  },
  headerAction: {
    "--ui-surface-bg": "var(--app-shell-surface-bg)",
    "--ui-surface-border": "var(--app-shell-border)",
    "--ui-surface-color": "var(--app-shell-color)",
    "--ui-surface-radius": "var(--theme--radius-full)",
    "--ui-button-height": "var(--theme--dimensions-height-lg)",
    "--ui-button-min-width": "var(--theme--dimensions-minWidth-sm)",
    "--ui-button-padding-x": "var(--theme--spacing-spaceSm)",
    "--ui-button-padding-y": "var(--theme--spacing-space2xs)",
  },
  primaryAction: {
    "--ui-surface-bg": "var(--theme--color-accent)",
    "--ui-surface-border": "var(--theme--color-accent-border, var(--theme--color-accentBorder, var(--theme--color-accent)))",
    "--ui-surface-color": "var(--theme--color-accent-contrast, var(--theme--color-accentContrast, var(--theme--color-background)))",
  },
  profileActiveAction: {
    "--ui-surface-bg": "color-mix(in srgb, var(--theme--color-surface) 70%, var(--theme--color-accent-surface, var(--theme--color-accentSurface, var(--theme--color-accent))) 30%)",
    "--ui-surface-border": "var(--theme--color-accent-border, var(--theme--color-accentBorder, var(--theme--color-accent)))",
    "--ui-surface-color": "var(--theme--color-text)",
    "--ui-surface-radius": "var(--theme--radius-full)",
    "--ui-button-height": "var(--theme--dimensions-height-lg)",
    "--ui-button-min-width": "var(--theme--dimensions-minWidth-sm)",
    "--ui-button-padding-x": "var(--theme--spacing-spaceSm)",
    "--ui-button-padding-y": "var(--theme--spacing-space2xs)",
  },
};
