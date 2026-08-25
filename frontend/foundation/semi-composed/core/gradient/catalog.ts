import { UI_GRADIENT_LEVELS } from "../themeBindings";
import { defineSemiComposedCatalog } from "../catalogTypes";
import type { GradientRecipeLevel } from "./contract";
export const GRADIENT_RECIPE_CATALOG = defineSemiComposedCatalog<"gradient", GradientRecipeLevel>("gradient", UI_GRADIENT_LEVELS);
