export interface ButtonConfig {
  defaults: {
    appearance: "solid" | "glass" | "outline" | "soft" | "transparent";
    level: "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
    tone: "neutral" | "primary" | "success" | "warning" | "danger";
  };
  recipes: Record<string, any>;
}

export const defaultUiButtonConfig: ButtonConfig = {
  defaults: {
    appearance: "solid",
    level: "md",
    tone: "primary",
  },
  recipes: {
    "2xs": { size: "2xs", padding: "4px 8px" },
    xs: { size: "xs", padding: "6px 12px" },
    sm: { size: "sm", padding: "8px 16px" },
    md: { size: "md", padding: "12px 24px" },
    lg: { size: "lg", padding: "16px 32px" },
    xl: { size: "xl", padding: "20px 40px" },
  },
};
