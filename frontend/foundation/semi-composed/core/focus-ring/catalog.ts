import { UI_FOCUS_RING_LEVELS } from "../themeBindings";
import { defineSemiComposedCatalog } from "../catalogTypes";
import type { FocusRingRecipeLevel } from "./contract";
export const FOCUS_RING_RECIPE_CATALOG = defineSemiComposedCatalog<"focusRing", FocusRingRecipeLevel>("focusRing", UI_FOCUS_RING_LEVELS);
