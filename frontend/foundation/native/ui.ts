import type { NativeFoundationBridge, NativeFoundationPrimitive } from "./types";

export const nativeFoundationPrimitives: NativeFoundationPrimitive[] = [
  "Avatar",
  "Badge",
  "Button",
  "Card",
  "Divider",
  "DropdownPicker",
  "EmptyState",
  "Field",
  "Icon",
  "Input",
  "Layout",
  "SegmentedControl",
  "Select",
  "Surface",
  "Text",
];

export const createNativeFoundationBridge = (): NativeFoundationBridge => ({
  contractVersion: "foundation.native.v1",
  platform: "react-native",
  primitives: nativeFoundationPrimitives,
  rules: {
    copySource: "locales-or-manifest",
    navigationSource: "shared-core-navigation",
    recipeSource: "foundation-semi-composed",
    tokenSource: "shared-core-manifest-theme",
  },
});
