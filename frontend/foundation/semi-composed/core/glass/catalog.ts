import { UI_GLASS_LEVELS } from "../themeBindings";
import { defineSemiComposedCatalog } from "../catalogTypes";
import type { GlassRecipeLevel } from "./contract";

export const GLASS_RECIPE_CATALOG = defineSemiComposedCatalog<"glass", GlassRecipeLevel>("glass", UI_GLASS_LEVELS);
