import { UI_BACKGROUND_RECIPE_MATERIALS } from "../themeBindings";
import { defineSemiComposedCatalog } from "../catalogTypes";
import type { BackgroundRecipeMaterial } from "./contract";
export const BACKGROUND_RECIPE_CATALOG = defineSemiComposedCatalog<"background", BackgroundRecipeMaterial>("background", UI_BACKGROUND_RECIPE_MATERIALS);
