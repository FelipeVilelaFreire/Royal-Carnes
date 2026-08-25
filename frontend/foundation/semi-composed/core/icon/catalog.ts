import { defineSemiComposedCatalog } from "../catalogTypes";
import { ICON_RECIPE_APPEARANCES, type IconRecipeAppearance } from "./contract";

export const ICON_RECIPE_CATALOG = defineSemiComposedCatalog<"icon", IconRecipeAppearance>("icon", ICON_RECIPE_APPEARANCES);
