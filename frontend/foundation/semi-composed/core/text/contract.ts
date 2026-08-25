import type { UiTypographyTokens } from "../themeBindings";

export const TEXT_RECIPE_ROLES = ["body", "label", "caption", "h1", "h2", "h3", "h4", "h5", "h6"] as const;
export type TextRecipeRole = (typeof TEXT_RECIPE_ROLES)[number];
export type TextRecipe = Readonly<Pick<UiTypographyTokens, "bodyFamily" | "headingFamily" | "monoFamily">>;
