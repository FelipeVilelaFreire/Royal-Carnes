import { UI_OVERLAY_LEVELS } from "../themeBindings";
import { defineSemiComposedCatalog } from "../catalogTypes";
import type { OverlayRecipeLevel } from "./contract";
export const OVERLAY_RECIPE_CATALOG = defineSemiComposedCatalog<"overlay", OverlayRecipeLevel>("overlay", UI_OVERLAY_LEVELS);
