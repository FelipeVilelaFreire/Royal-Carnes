import { UI_DIVIDER_LEVELS } from "../themeBindings";
import { defineSemiComposedCatalog } from "../catalogTypes";
import type { DividerRecipeLevel } from "./contract";
export const DIVIDER_RECIPE_CATALOG = defineSemiComposedCatalog<"divider", DividerRecipeLevel>("divider", UI_DIVIDER_LEVELS);
