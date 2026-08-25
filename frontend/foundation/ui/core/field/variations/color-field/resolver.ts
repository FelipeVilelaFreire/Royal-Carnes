import type { ColorFieldConfig } from "./contract";

export const resolveColorFieldConfig = (overrides?: Partial<ColorFieldConfig>): ColorFieldConfig => ({
  defaults: {
    level: "md",
    preview: "bar",
    width: "full",
    ...overrides?.defaults,
  },
  recipes: overrides?.recipes || ({} as any),
});

export const resolveColorFieldRecipe = (
  theme?: any,
  semiOverrides?: any,
  colorFieldOverrides?: Partial<ColorFieldConfig>,
  options?: any
) => {
  const config = resolveColorFieldConfig(colorFieldOverrides);
  return {
    ...config.defaults,
    ...options,
    contentGap: 8,
    previewHeight: 24,
    previewSurfaceRecipe: {
      radius: 4,
      stroke: { width: 1, color: "rgba(255,255,255,0.1)" }
    },
    valueTextRecipe: {
      fontSize: 14,
      fontFamily: "sans-serif",
      fontWeight: 400
    }
  };
};
