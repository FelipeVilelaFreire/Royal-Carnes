import { AMBIENT_RECIPE_CATALOG } from "./ambient";
import { BACKGROUND_RECIPE_CATALOG } from "./background";
import { DISABLED_RECIPE_CATALOG } from "./disabled";
import { DIVIDER_RECIPE_CATALOG } from "./divider";
import { DROPDOWN_PANEL_RECIPE_CATALOG } from "./dropdown-panel";
import { FIELD_RECIPE_CATALOG } from "./field";
import { FOCUS_RING_RECIPE_CATALOG } from "./focus-ring";
import { GLASS_RECIPE_CATALOG } from "./glass";
import { GRADIENT_RECIPE_CATALOG } from "./gradient";
import { ICON_RECIPE_CATALOG } from "./icon";
import { INNER_ELEVATION_RECIPE_CATALOG } from "./inner-elevation";
import { LISTBOX_OPTION_RECIPE_CATALOG } from "./listbox-option";
import { LISTBOX_RECIPE_CATALOG } from "./listbox";
import { MOTION_RECIPE_CATALOG } from "./motion";
import { OUTER_ELEVATION_RECIPE_CATALOG } from "./outer-elevation";
import { OVERLAY_RECIPE_CATALOG } from "./overlay";
import { STATE_LAYER_RECIPE_CATALOG } from "./state-layer";
import { STROKE_RECIPE_CATALOG } from "./stroke";
import { SURFACE_RECIPE_CATALOG } from "./surface";
import { TEXT_RECIPE_CATALOG } from "./text";

/** Aggregates catalogs owned by each real Semi-composed family. */
export const SEMI_COMPOSED_CATALOG = {
  text: TEXT_RECIPE_CATALOG,
  icon: ICON_RECIPE_CATALOG,
  field: FIELD_RECIPE_CATALOG,
  outerElevation: OUTER_ELEVATION_RECIPE_CATALOG,
  innerElevation: INNER_ELEVATION_RECIPE_CATALOG,
  stroke: STROKE_RECIPE_CATALOG,
  motion: MOTION_RECIPE_CATALOG,
  glass: GLASS_RECIPE_CATALOG,
  gradient: GRADIENT_RECIPE_CATALOG,
  overlay: OVERLAY_RECIPE_CATALOG,
  focusRing: FOCUS_RING_RECIPE_CATALOG,
  disabled: DISABLED_RECIPE_CATALOG,
  stateLayer: STATE_LAYER_RECIPE_CATALOG,
  divider: DIVIDER_RECIPE_CATALOG,
  surface: SURFACE_RECIPE_CATALOG,
  background: BACKGROUND_RECIPE_CATALOG,
  ambient: AMBIENT_RECIPE_CATALOG,
  dropdownPanel: DROPDOWN_PANEL_RECIPE_CATALOG,
  listbox: LISTBOX_RECIPE_CATALOG,
  listboxOption: LISTBOX_OPTION_RECIPE_CATALOG,
} as const;

export type SemiComposedFamilyKey = keyof typeof SEMI_COMPOSED_CATALOG;
export const SEMI_COMPOSED_FAMILIES = Object.freeze(Object.keys(SEMI_COMPOSED_CATALOG) as SemiComposedFamilyKey[]);
export const getSemiComposedCatalog = () => SEMI_COMPOSED_CATALOG;
