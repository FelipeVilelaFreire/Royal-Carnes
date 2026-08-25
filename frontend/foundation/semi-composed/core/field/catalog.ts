import { UI_FIELD_RECIPE_LEVELS } from "../themeBindings";
import { defineSemiComposedCatalog } from "../catalogTypes";
import type { FieldRecipeLevel } from "./contract";

export const FIELD_RECIPE_CATALOG = defineSemiComposedCatalog<"field", FieldRecipeLevel>("field", UI_FIELD_RECIPE_LEVELS);
