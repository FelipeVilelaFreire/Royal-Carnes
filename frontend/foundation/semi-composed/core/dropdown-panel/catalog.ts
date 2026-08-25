import { UI_DROPDOWN_PANEL_LEVELS } from "../themeBindings";
import { defineSemiComposedCatalog } from "../catalogTypes";
import type { DropdownPanelRecipeLevel } from "./contract";
export const DROPDOWN_PANEL_RECIPE_CATALOG = defineSemiComposedCatalog<"dropdownPanel", DropdownPanelRecipeLevel>("dropdownPanel", UI_DROPDOWN_PANEL_LEVELS);
