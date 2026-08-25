import { UI_SURFACE_RECIPE_MATERIALS } from "../themeBindings";
import { defineSemiComposedCatalog } from "../catalogTypes";
import type { SurfaceRecipeMaterial } from "./contract";
export const SURFACE_RECIPE_CATALOG = defineSemiComposedCatalog<"surface", SurfaceRecipeMaterial>("surface", UI_SURFACE_RECIPE_MATERIALS);
