"use client";

import type { CSSProperties } from "react";

type TokenStyle = CSSProperties & Record<`--${string}`, string | number>;

export const orderSurfaceStyles: Record<
  "cycle" | "history" | "image" | "modalItem" | "modalMetric" | "order" | "stat",
  TokenStyle
> = {
  cycle: {
    "--ui-surface-bg": "color-mix(in srgb, var(--theme--color-surface) 84%, var(--theme--color-accent-surface, var(--theme--color-accentSurface, var(--theme--color-accent))) 16%)",
    "--ui-surface-border": "color-mix(in srgb, var(--theme--color-border) 58%, var(--theme--color-accent-border, var(--theme--color-accentBorder, var(--theme--color-accent))) 42%)",
  },
  history: {
    "--ui-surface-bg": "color-mix(in srgb, var(--theme--color-surface) 92%, var(--theme--color-accent-surface, var(--theme--color-accentSurface, var(--theme--color-accent))) 8%)",
    "--ui-surface-border": "color-mix(in srgb, var(--theme--color-border) 76%, var(--theme--color-accent-border, var(--theme--color-accentBorder, var(--theme--color-accent))) 24%)",
  },
  image: {
    "--ui-surface-bg": "var(--theme--color-surface)",
    "--ui-surface-border": "color-mix(in srgb, var(--theme--color-border) 64%, var(--theme--color-accent-border, var(--theme--color-accentBorder, var(--theme--color-accent))) 36%)",
    "--ui-card-padding-x": 0,
    "--ui-card-padding-y": 0,
    "--ui-surface-padding-x": 0,
    "--ui-surface-padding-y": 0,
  },
  modalItem: {
    "--ui-surface-bg": "var(--theme--color-surface-container)",
    "--ui-surface-border": "var(--theme--color-border)",
  },
  modalMetric: {
    "--ui-surface-bg": "color-mix(in srgb, var(--theme--color-surface-container) 88%, var(--theme--color-accent-surface, var(--theme--color-accentSurface, var(--theme--color-accent))) 12%)",
    "--ui-surface-border": "color-mix(in srgb, var(--theme--color-border) 78%, var(--theme--color-accent-border, var(--theme--color-accentBorder, var(--theme--color-accent))) 22%)",
  },
  order: {
    "--ui-surface-bg": "color-mix(in srgb, var(--theme--color-surface) 88%, var(--theme--color-accent-surface, var(--theme--color-accentSurface, var(--theme--color-accent))) 12%)",
    "--ui-surface-border": "color-mix(in srgb, var(--theme--color-border) 58%, var(--theme--color-accent-border, var(--theme--color-accentBorder, var(--theme--color-accent))) 42%)",
  },
  stat: {
    "--ui-surface-bg": "color-mix(in srgb, var(--theme--color-surface-container) 82%, var(--theme--color-accent-surface, var(--theme--color-accentSurface, var(--theme--color-accent))) 18%)",
    "--ui-surface-border": "color-mix(in srgb, var(--theme--color-border) 68%, var(--theme--color-accent-border, var(--theme--color-accentBorder, var(--theme--color-accent))) 32%)",
  },
};
