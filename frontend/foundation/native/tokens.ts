import { resolveThemePhysicalTokens } from "../tokens";
import type { NativeThemeDescriptor } from "./types";

export interface NativeThemeResolveInput {
  mode?: string;
  theme?: any;
}

export const resolveNativeThemeTokens = (input: NativeThemeResolveInput = {}): NativeThemeDescriptor => {
  const theme = input.theme || {};
  const mode = input.mode || theme.defaultMode || "dark";
  const colors = theme.colors || theme.modes?.[mode] || theme.modes?.dark || theme.modes?.light || {};

  return {
    colors,
    mode,
    platform: "react-native",
    tokens: resolveThemePhysicalTokens(theme.tokens),
  };
};
