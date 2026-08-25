import { UI_ELEVATION_LEVELS } from "../themeBindings";
import { defineSemiComposedCatalog } from "../catalogTypes";
import type { OuterElevationRecipeLevel } from "./contract";

export const OUTER_ELEVATION_RECIPE_CATALOG = defineSemiComposedCatalog<"outerElevation", OuterElevationRecipeLevel>("outerElevation", UI_ELEVATION_LEVELS);
