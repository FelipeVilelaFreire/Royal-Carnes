export const nativeSemiComposedRecipeFamilies = [
  "ambient",
  "background",
  "disabled",
  "divider",
  "dropdown-panel",
  "field",
  "focus-ring",
  "glass",
  "gradient",
  "icon",
  "inner-elevation",
  "listbox",
  "listbox-option",
  "motion",
  "outer-elevation",
  "state-layer",
  "stroke",
  "surface",
  "text",
] as const;

export type NativeSemiComposedRecipeFamily = (typeof nativeSemiComposedRecipeFamilies)[number];

export interface NativeSemiComposedBridge {
  contractVersion: "semi-composed.native.v1";
  families: readonly NativeSemiComposedRecipeFamily[];
  output: "native-style-descriptor";
}

export const createNativeSemiComposedBridge = (): NativeSemiComposedBridge => ({
  contractVersion: "semi-composed.native.v1",
  families: nativeSemiComposedRecipeFamilies,
  output: "native-style-descriptor",
});
