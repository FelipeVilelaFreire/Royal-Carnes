import { UI_LISTBOX_LEVELS } from "../themeBindings";
import { defineSemiComposedCatalog } from "../catalogTypes";
import type { ListboxOptionRecipeLevel } from "./contract";
export const LISTBOX_OPTION_RECIPE_CATALOG = defineSemiComposedCatalog<"listboxOption", ListboxOptionRecipeLevel>("listboxOption", UI_LISTBOX_LEVELS);
