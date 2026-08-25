import { UI_STROKE_LEVELS } from "../themeBindings";
import { defineSemiComposedCatalog } from "../catalogTypes";
import type { StrokeRecipeLevel } from "./contract";

export const STROKE_RECIPE_CATALOG = defineSemiComposedCatalog<"stroke", StrokeRecipeLevel>("stroke", UI_STROKE_LEVELS);
