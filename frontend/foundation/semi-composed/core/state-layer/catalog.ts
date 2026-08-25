import { UI_STATE_LAYER_LEVELS } from "../themeBindings";
import { defineSemiComposedCatalog } from "../catalogTypes";
import type { StateLayerRecipeLevel } from "./contract";
export const STATE_LAYER_RECIPE_CATALOG = defineSemiComposedCatalog<"stateLayer", StateLayerRecipeLevel>("stateLayer", UI_STATE_LAYER_LEVELS);
