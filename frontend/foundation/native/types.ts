export type NativeFoundationPlatform = "react-native";

export type NativeFoundationPrimitive =
  | "Avatar"
  | "Badge"
  | "Button"
  | "Card"
  | "Divider"
  | "DropdownPicker"
  | "EmptyState"
  | "Field"
  | "Icon"
  | "Input"
  | "Layout"
  | "SegmentedControl"
  | "Select"
  | "Surface"
  | "Text";

export interface NativeFoundationBridge {
  contractVersion: "foundation.native.v1";
  platform: NativeFoundationPlatform;
  primitives: NativeFoundationPrimitive[];
  rules: {
    copySource: "locales-or-manifest";
    navigationSource: "shared-core-navigation";
    recipeSource: "foundation-semi-composed";
    tokenSource: "shared-core-manifest-theme";
  };
}
