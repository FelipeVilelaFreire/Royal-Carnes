import { UI_LISTBOX_LEVELS } from "../themeBindings";
import { defineSemiComposedCatalog } from "../catalogTypes";
import type { ListboxRecipeLevel } from "./contract";
export const LISTBOX_RECIPE_CATALOG = defineSemiComposedCatalog<"listbox", ListboxRecipeLevel>("listbox", UI_LISTBOX_LEVELS);
