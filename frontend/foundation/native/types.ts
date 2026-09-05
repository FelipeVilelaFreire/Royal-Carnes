export type NativeFoundationPlatform = "react-native";

export type NativeStyleValue = string | number | boolean | undefined;

export interface NativeStyleDescriptor {
  [key: string]: NativeStyleValue | NativeStyleDescriptor;
}

export type NativeDescriptorSource = {
  manifest: "shared-core";
  recipe: "foundation-semi-composed";
  runtime: NativeFoundationPlatform;
};

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

export type NativePrimitiveState = "default" | "active" | "inactive" | "disabled";

export interface NativePrimitiveDescriptor {
  primitive: NativeFoundationPrimitive;
  role: string;
  states: Partial<Record<NativePrimitiveState, NativeStyleDescriptor>>;
  source: NativeDescriptorSource;
}

export interface NativeThemeDescriptor {
  colors: Record<string, string>;
  mode: string;
  platform: NativeFoundationPlatform;
  tokens: Record<string, any>;
}

export interface NativeFoundationDesignSystem {
  contractVersion: "foundation.native.design-system.v1";
  platform: NativeFoundationPlatform;
  primitives: Partial<Record<NativeFoundationPrimitive, NativePrimitiveDescriptor>>;
  source: NativeDescriptorSource;
  theme: NativeThemeDescriptor;
}

export interface NativeFoundationBridge {
  contractVersion: "foundation.native.v1";
  designSystem?: NativeFoundationDesignSystem;
  platform: NativeFoundationPlatform;
  primitives: NativeFoundationPrimitive[];
  rules: {
    copySource: "locales-or-manifest";
    navigationSource: "shared-core-navigation";
    recipeSource: "foundation-semi-composed";
    tokenSource: "shared-core-manifest-theme";
  };
}
