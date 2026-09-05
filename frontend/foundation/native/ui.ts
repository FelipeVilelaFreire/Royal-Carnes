import {
  resolveBadgeRecipe,
  resolveButtonRecipe,
  resolveCardRecipe,
  resolveDividerRecipe,
  resolveDropdownPickerRecipe,
  resolveFieldRecipe,
  resolveSegmentedControlRecipe,
  resolveSelectRecipe,
  resolveSurfaceUiConfig,
  type SurfaceUiConfig,
} from "../ui/core";
import {
  resolveNativeSemiComposedDescriptor,
  toNativeIconStyle,
  toNativeSurfaceStyle,
  toNativeTextStyle,
} from "./semi-composed";
import { resolveNativeThemeTokens } from "./tokens";
import type {
  NativeFoundationBridge,
  NativeFoundationDesignSystem,
  NativeFoundationPrimitive,
  NativePrimitiveDescriptor,
  NativeStyleDescriptor,
} from "./types";

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

export interface NativeUiManifestResolveInput {
  mode?: string;
  ui?: Partial<SurfaceUiConfig>;
}

const source = {
  manifest: "shared-core",
  recipe: "foundation-semi-composed",
  runtime: "react-native",
} as const;

const primitive = (
  primitiveName: NativeFoundationPrimitive,
  role: string,
  states: NativePrimitiveDescriptor["states"],
): NativePrimitiveDescriptor => ({
  primitive: primitiveName,
  role,
  source,
  states,
});

const buttonStyle = (recipe: any): NativeStyleDescriptor => ({
  ...toNativeSurfaceStyle(recipe.surfaceRecipe),
  alignItems: "center",
  flexDirection: "row",
  gap: recipe.gap,
  justifyContent: "center",
  minHeight: recipe.height,
  minWidth: recipe.minWidth,
  paddingHorizontal: recipe.paddingX,
  paddingVertical: recipe.paddingY,
  text: toNativeTextStyle(recipe.textRecipe),
  icon: toNativeIconStyle(recipe.iconRecipe),
});

const cardStyle = (recipe: any): NativeStyleDescriptor => ({
  ...toNativeSurfaceStyle(recipe.surfaceRecipe),
  gap: recipe.gap,
  padding: recipe.padding,
});

const badgeStyle = (recipe: any): NativeStyleDescriptor => ({
  ...toNativeSurfaceStyle(recipe.surfaceRecipe),
  minHeight: recipe.blockSize,
  minWidth: recipe.inlineSize,
  paddingHorizontal: recipe.paddingX,
  paddingVertical: recipe.paddingY,
  text: toNativeTextStyle(recipe.textRecipe),
});

const fieldStyle = (recipe: any): NativeStyleDescriptor => ({
  gap: recipe.textGap,
  controlGap: recipe.controlGap,
  descriptionText: toNativeTextStyle(recipe.descriptionTextRecipe),
  errorText: toNativeTextStyle(recipe.errorTextRecipe),
  labelText: toNativeTextStyle(recipe.labelTextRecipe),
});

export const resolveNativeUiManifest = (
  input: NativeUiManifestResolveInput = {},
): NativeFoundationDesignSystem => {
  const ui = resolveSurfaceUiConfig(input.ui);
  const theme = {
    ...ui.theme,
    defaultMode: input.mode || ui.theme.defaultMode,
  } as any;
  const nativeTheme = resolveNativeThemeTokens({ mode: input.mode, theme });
  const semi = resolveNativeSemiComposedDescriptor({ mode: nativeTheme.mode, theme });

  const defaultButton = resolveButtonRecipe("md", theme, undefined, ui.button, { appearance: "solid", tone: "primary" });
  const inactiveButton = resolveButtonRecipe("sm", theme, undefined, ui.button, { appearance: "transparent", tone: "neutral" });
  const activeButton = resolveButtonRecipe("sm", theme, undefined, ui.button, { appearance: "soft", tone: "primary" });
  const disabledButton = resolveButtonRecipe("md", theme, undefined, ui.button, { appearance: "soft", tone: "neutral" });
  const defaultCard = resolveCardRecipe(theme, undefined, ui.card);
  const defaultBadge = resolveBadgeRecipe(theme, undefined, ui.badge);
  const defaultDivider = resolveDividerRecipe(theme, undefined, ui.divider);
  const defaultDropdownPicker = resolveDropdownPickerRecipe(theme, undefined, ui.dropdownPicker);
  const defaultField = resolveFieldRecipe(theme, undefined, ui.field);
  const defaultSelect = resolveSelectRecipe(ui.select);
  const defaultSegmentedControl = resolveSegmentedControlRecipe(theme, undefined, ui.segmentedControl);

  return {
    contractVersion: "foundation.native.design-system.v1",
    platform: "react-native",
    primitives: {
      Avatar: primitive("Avatar", "identity-media", {
        default: {
          backgroundColor: nativeTheme.colors.surfaceContainer,
          borderColor: nativeTheme.colors.border,
          borderRadius: nativeTheme.tokens.radius.full,
          color: nativeTheme.colors.text,
        },
      }),
      Badge: primitive("Badge", "status-label", { default: badgeStyle(defaultBadge) }),
      Button: primitive("Button", "action", {
        active: buttonStyle(activeButton),
        default: buttonStyle(defaultButton),
        disabled: { ...buttonStyle(disabledButton), opacity: 0.5 },
        inactive: buttonStyle(inactiveButton),
      }),
      Card: primitive("Card", "content-surface", { default: cardStyle(defaultCard) }),
      Divider: primitive("Divider", "separator", {
        default: {
          backgroundColor: defaultDivider.strokeRecipe.color,
          height: defaultDivider.orientation === "horizontal" ? defaultDivider.strokeRecipe.width : "100%",
          margin: defaultDivider.spacing,
          opacity: defaultDivider.opacity,
          width: defaultDivider.orientation === "vertical" ? defaultDivider.strokeRecipe.width : "100%",
        },
      }),
      DropdownPicker: primitive("DropdownPicker", "option-picker", {
        default: {
          ...toNativeSurfaceStyle(defaultDropdownPicker.panelSurfaceRecipe),
          gap: defaultDropdownPicker.gap,
          padding: defaultDropdownPicker.padding,
          zIndex: defaultDropdownPicker.layer,
        },
      }),
      EmptyState: primitive("EmptyState", "empty-feedback", {
        default: {
          alignItems: "center",
          gap: nativeTheme.tokens.spacing.spaceMd,
          padding: nativeTheme.tokens.spacing.spaceLg,
        },
      }),
      Field: primitive("Field", "form-field", { default: fieldStyle(defaultField) }),
      Icon: primitive("Icon", "semantic-icon", {
        default: {
          color: nativeTheme.colors.text,
          height: nativeTheme.tokens.dimensions.icon.md,
          width: nativeTheme.tokens.dimensions.icon.md,
        },
      }),
      Input: primitive("Input", "text-input", {
        default: {
          ...fieldStyle(defaultField),
          ...buttonStyle(inactiveButton),
          justifyContent: "flex-start",
          text: {
            color: nativeTheme.colors.text,
            fontFamily: nativeTheme.tokens.typography.bodyFamily,
            fontSize: nativeTheme.tokens.typography.sizeMd,
          },
        },
      }),
      Layout: primitive("Layout", "layout", {
        default: {
          containerMaxWidth: nativeTheme.tokens.layout.containerLg,
          gap: nativeTheme.tokens.spacing.spaceMd,
          paddingHorizontal: nativeTheme.tokens.spacing.spaceMd,
        },
      }),
      SegmentedControl: primitive("SegmentedControl", "choice-toggle", {
        active: buttonStyle(resolveButtonRecipe("sm", theme, undefined, ui.button, defaultSegmentedControl.activeOption as any)),
        default: {
          ...toNativeSurfaceStyle(defaultSegmentedControl.trackSurfaceRecipe),
          gap: defaultSegmentedControl.gap,
          padding: defaultSegmentedControl.padding,
        },
        inactive: buttonStyle(resolveButtonRecipe("sm", theme, undefined, ui.button, defaultSegmentedControl.option as any)),
      }),
      Select: primitive("Select", "select-field", {
        default: {
          ...fieldStyle(defaultField),
          minHeight: nativeTheme.tokens.dimensions.height[defaultSelect.level],
          width: defaultSelect.width,
        },
      }),
      Surface: primitive("Surface", "surface", {
        active: semi.surface?.md?.appearances?.soft?.primary,
        default: semi.surface?.md?.appearances?.solid?.neutral,
        inactive: semi.surface?.md?.appearances?.transparent?.neutral,
      }),
      Text: primitive("Text", "typography", {
        default: {
          color: nativeTheme.colors.text,
          fontFamily: nativeTheme.tokens.typography.bodyFamily,
          fontSize: nativeTheme.tokens.typography.sizeMd,
          lineHeight: nativeTheme.tokens.typography.lineHeightMd,
        },
      }),
    },
    source,
    theme: nativeTheme,
  };
};

export const createNativeFoundationBridge = (
  input: NativeUiManifestResolveInput = {},
): NativeFoundationBridge => ({
  contractVersion: "foundation.native.v1",
  designSystem: resolveNativeUiManifest(input),
  platform: "react-native",
  primitives: nativeFoundationPrimitives,
  rules: {
    copySource: "locales-or-manifest",
    navigationSource: "shared-core-navigation",
    recipeSource: "foundation-semi-composed",
    tokenSource: "shared-core-manifest-theme",
  },
});
