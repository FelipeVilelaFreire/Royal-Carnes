import { defineSemiComposedCatalog } from "../catalogTypes";
import { TEXT_RECIPE_ROLES, type TextRecipeRole } from "./contract";

export const TEXT_RECIPE_CATALOG = defineSemiComposedCatalog<"text", TextRecipeRole>("text", TEXT_RECIPE_ROLES);
