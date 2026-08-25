import { UI_DISABLED_LEVELS } from "../themeBindings";
import { defineSemiComposedCatalog } from "../catalogTypes";
import type { DisabledRecipeLevel } from "./contract";
export const DISABLED_RECIPE_CATALOG = defineSemiComposedCatalog<"disabled", DisabledRecipeLevel>("disabled", UI_DISABLED_LEVELS);
