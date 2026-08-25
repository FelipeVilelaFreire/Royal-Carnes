import { UI_AMBIENT_EFFECT_RECIPE_MATERIALS } from "../themeBindings";
import { defineSemiComposedCatalog } from "../catalogTypes";
import type { AmbientRecipeMaterial } from "./contract";
export const AMBIENT_RECIPE_CATALOG = defineSemiComposedCatalog<"ambient", AmbientRecipeMaterial>("ambient", UI_AMBIENT_EFFECT_RECIPE_MATERIALS);
