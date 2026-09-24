import { clientThemeTokens } from "./theme/tokens";

export const clientThemeManifest = {
  ...clientThemeTokens,
  appearanceEditor: {
    paletteOptions: [
      { id: "royal", colors: {} },
      { id: "warm", colors: { background: "#110F0D", surface: "#1C1814", surfaceContainer: "#25201B", border: "#5B4B3B", text: "#F2E9DF", textMuted: "#C9B9A7" } },
      { id: "linen", colors: { background: "#FCFBF7", surface: "#FCFBF7", surfaceContainer: "#F2F1ED", border: "#C7BCAA", text: "#211B16", textMuted: "#675B50", accentContrast: "#FCFBF7" } },
    ],
    fontOptions: [
      { id: "jakarta", tokens: { bodyFamily: "'Plus Jakarta Sans', sans-serif", headingFamily: "'Playfair Display', serif" } },
      { id: "inter", tokens: { bodyFamily: "'Inter', sans-serif", headingFamily: "'Montserrat', sans-serif" } },
      { id: "montserrat", tokens: { bodyFamily: "'Montserrat', sans-serif", headingFamily: "'Montserrat', sans-serif" } },
    ],
    radiusOptions: [
      { id: "balanced", tokens: { xl: 12, "2xl": 16 } },
      { id: "rounded", tokens: { xl: 16, "2xl": 24 } },
    ],
    borderOptions: [
      { id: "subtle", tokens: { hairline: 1, medium: 1 } },
      { id: "defined", tokens: { hairline: 1, medium: 2 } },
    ],
    glassOptions: [
      { id: "solid", material: "solid", tokens: { blur: { sm: 8, md: 16, lg: 24 } } },
      { id: "glass", material: "glass", tokens: { blur: { sm: 12, md: 20, lg: 28 } } },
    ],
  },
};
