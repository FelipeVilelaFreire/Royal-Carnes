"use client";

import type { CSSProperties } from "react";

type TokenStyle = CSSProperties & Record<`--${string}`, string | number>;

export const accountSurfaceStyles: Record<"panel" | "nested" | "highlight", TokenStyle> = {
  panel: {
    "--ui-surface-bg": "color-mix(in srgb, var(--theme--color-surface) 92%, var(--theme--color-accent-surface, var(--theme--color-accentSurface, var(--theme--color-accent))) 8%)",
    "--ui-surface-border": "color-mix(in srgb, var(--theme--color-border) 76%, var(--theme--color-accent-border, var(--theme--color-accentBorder, var(--theme--color-accent))) 24%)",
  },
  nested: {
    "--ui-surface-bg": "color-mix(in srgb, var(--theme--color-surface-container) 94%, var(--theme--color-accent-surface, var(--theme--color-accentSurface, var(--theme--color-accent))) 6%)",
    "--ui-surface-border": "color-mix(in srgb, var(--theme--color-border) 82%, var(--theme--color-accent-border, var(--theme--color-accentBorder, var(--theme--color-accent))) 18%)",
  },
  highlight: {
    "--ui-surface-bg": "color-mix(in srgb, var(--theme--color-surface) 84%, var(--theme--color-accent-surface, var(--theme--color-accentSurface, var(--theme--color-accent))) 16%)",
    "--ui-surface-border": "color-mix(in srgb, var(--theme--color-border) 55%, var(--theme--color-accent-border, var(--theme--color-accentBorder, var(--theme--color-accent))) 45%)",
  },
};
