import type { UiFieldRecipeTokens } from "../themeBindings";
import type { FieldRecipe } from "./contract";

export const DEFAULT_FIELD_RECIPES = {
  "2xs": { labelText: "label", feedbackIcon: "2xs", metaText: "caption", metaGap: "2xs", controlGap: "2xs", metaLayout: "between" },
  xs: { labelText: "label", feedbackIcon: "2xs", metaText: "caption", metaGap: "2xs", controlGap: "2xs", metaLayout: "between" },
  sm: { labelText: "label", feedbackIcon: "xs", metaText: "caption", metaGap: "2xs", controlGap: "xs", metaLayout: "between" },
  md: { labelText: "label", feedbackIcon: "xs", metaText: "caption", metaGap: "xs", controlGap: "field", metaLayout: "between" },
  lg: { labelText: "label", feedbackIcon: "sm", metaText: "caption", metaGap: "xs", controlGap: "field", metaLayout: "between" },
  xl: { labelText: "label", feedbackIcon: "sm", metaText: "caption", metaGap: "sm", controlGap: "lg", metaLayout: "stack" },
  "2xl": { labelText: "label", feedbackIcon: "md", metaText: "caption", metaGap: "sm", controlGap: "xl", metaLayout: "stack" },
  "3xl": { labelText: "label", feedbackIcon: "lg", metaText: "caption", metaGap: "md", controlGap: "2xl", metaLayout: "stack" },
} satisfies UiFieldRecipeTokens;

export const DEFAULT_FIELD_RECIPE: FieldRecipe = DEFAULT_FIELD_RECIPES.md;
