import type { UiSurfacePreset } from "../themeBindings";
import type { GlassRecipe } from "./contract";

/** Glass composition defaults; Theme supplies only the raw scale values used by them. */
export const DEFAULT_GLASS_PRESETS = {
  glass2xs: { appearance: "glass", blur: 4, blurToken: "xs", borderToken: "xs", elevation: "2xs", innerElevation: "2xs", opacity: 46, opacityToken: "md" },
  glassXs: { appearance: "glass", blur: 8, blurToken: "sm", borderToken: "xs", elevation: "2xs", innerElevation: "2xs", opacity: 54, opacityToken: "lg" },
  glassSm: { appearance: "glass", blur: 12, blurToken: "md", borderToken: "sm", elevation: "xs", innerElevation: "xs", opacity: 62, opacityToken: "xl" },
  glassMd: { appearance: "glass", blur: 18, blurToken: "lg", borderToken: "sm", elevation: "sm", innerElevation: "xs", opacity: 70, opacityToken: "xl" },
  glassLg: { appearance: "glass", blur: 24, blurToken: "xl", borderToken: "md", elevation: "md", innerElevation: "sm", opacity: 76, opacityToken: "2xl" },
  glassXl: { appearance: "glass", blur: 32, blurToken: "2xl", borderToken: "md", elevation: "lg", innerElevation: "sm", opacity: 82, opacityToken: "2xl" },
  glass2xl: { appearance: "glass", blur: 42, blurToken: "3xl", borderToken: "lg", elevation: "xl", innerElevation: "md", opacity: 88, opacityToken: "3xl" },
  glass3xl: { appearance: "glass", blur: 54, blurToken: "3xl", borderToken: "lg", elevation: "3xl", innerElevation: "md", opacity: 92, opacityToken: "3xl" },
  glassSoft: { appearance: "glass", blur: 8, borderTone: 12, elevation: "xs", opacity: 42 },
  glassBlur: { appearance: "glass", blur: 14, borderTone: 18, elevation: "sm", opacity: 58 },
  glassStrong: { appearance: "glass", blur: 28, borderTone: 22, elevation: "lg", opacity: 76 },
} satisfies Record<string, UiSurfacePreset>;

export const DEFAULT_GLASS_RECIPE: GlassRecipe = DEFAULT_GLASS_PRESETS.glassMd;
