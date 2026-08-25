import { UI_MOTION_RECIPE_LEVELS } from "../themeBindings";
import { defineSemiComposedCatalog } from "../catalogTypes";
import type { MotionRecipeLevel } from "./contract";

export const MOTION_RECIPE_CATALOG = defineSemiComposedCatalog<"motion", MotionRecipeLevel>("motion", UI_MOTION_RECIPE_LEVELS);
