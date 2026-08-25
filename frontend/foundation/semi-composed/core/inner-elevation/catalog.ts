import { UI_ELEVATION_LEVELS } from "../themeBindings";
import { defineSemiComposedCatalog } from "../catalogTypes";
import type { InnerElevationRecipeLevel } from "./contract";

export const INNER_ELEVATION_RECIPE_CATALOG = defineSemiComposedCatalog<"innerElevation", InnerElevationRecipeLevel>("innerElevation", UI_ELEVATION_LEVELS);
