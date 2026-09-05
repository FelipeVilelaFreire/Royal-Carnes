"use client";

import React, { type ReactNode } from "react";
import type { ResolvedAppShellNavigationItem } from "../foundation";
import { resolveNativeAppShellModel } from "./resolver";
import type { NativeAppShellInput, NativeAppShellModel } from "./types";
import type { NativeStyleDescriptor } from "../../../native";

export type NativeHostComponentProps = Record<string, any> & {
  children?: ReactNode;
  style?: any;
};

export type NativeHostComponent = React.ComponentType<NativeHostComponentProps>;

export interface NativeAppShellHostComponents {
  Pressable: NativeHostComponent;
  SafeAreaView?: NativeHostComponent;
  Text: NativeHostComponent;
  View: NativeHostComponent;
}

export interface NativeAppShellRuntimeProps extends NativeAppShellInput {
  children?: ReactNode;
  hosts: NativeAppShellHostComponents;
  onNavigate?: (path: string, item: ResolvedAppShellNavigationItem) => void;
}

export interface NativeAppShellRegionProps {
  hosts: NativeAppShellHostComponents;
  model: NativeAppShellModel;
  onNavigate?: (path: string, item: ResolvedAppShellNavigationItem) => void;
}

const mergeNativeStyles = (...styles: Array<NativeStyleDescriptor | undefined>) => Object.assign({}, ...styles.filter(Boolean));

const createTextStyle = (model: NativeAppShellModel, active: boolean): NativeStyleDescriptor => ({
  color: active ? model.themeColors.text : model.themeColors.textMuted,
  fontSize: model.designSystem.theme.tokens.typography?.size2xs,
  fontWeight: model.designSystem.theme.tokens.typography?.bold,
});

const createTabItemStyle = (model: NativeAppShellModel, active: boolean): NativeStyleDescriptor => mergeNativeStyles(
  active ? model.navigationStyles.active : model.navigationStyles.inactive,
  {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    minHeight: model.designSystem.theme.tokens.dimensions?.height?.xl,
  }
);

const createHeaderItemStyle = (model: NativeAppShellModel, active: boolean): NativeStyleDescriptor => mergeNativeStyles(
  active ? model.navigationStyles.active : model.navigationStyles.inactive,
  {
    alignItems: "center",
    justifyContent: "center",
    minHeight: model.designSystem.theme.tokens.dimensions?.height?.md,
  }
);

export const isNativeAppShellItemActive = (model: NativeAppShellModel, item: ResolvedAppShellNavigationItem) =>
  model.activePath === item.routePath;

export const NativeAppShellHeader: React.FC<NativeAppShellRegionProps> = ({ hosts, model, onNavigate }) => {
  const { Pressable, Text, View } = hosts;
  const region = model.regions.header;
  if (!region.enabled) return null;

  return (
    <View style={mergeNativeStyles(region.surfaceStyle, { zIndex: model.designSystem.theme.tokens.zIndex?.appShellHeader })}>
      <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
        <Text>{model.brand.name}</Text>
        <View style={{ alignItems: "center", flexDirection: "row" }}>
          {region.items.map((item) => {
            const active = isNativeAppShellItemActive(model, item);
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                key={item.key}
                onPress={() => onNavigate?.(item.routePath, item)}
                style={createHeaderItemStyle(model, active)}
              >
                <Text style={createTextStyle(model, active)}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export const NativeAppShellTabBar: React.FC<NativeAppShellRegionProps> = ({ hosts, model, onNavigate }) => {
  const { Pressable, Text, View } = hosts;
  const region = model.regions.nativeTabBar;
  if (!region.enabled) return null;

  return (
    <View style={mergeNativeStyles(region.surfaceStyle, { flexDirection: "row", zIndex: model.designSystem.theme.tokens.zIndex?.appShellBottomBar })}>
      {region.items.map((item) => {
        const active = isNativeAppShellItemActive(model, item);
        return (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            key={item.key}
            onPress={() => onNavigate?.(item.routePath, item)}
            style={createTabItemStyle(model, active)}
          >
            <Text style={createTextStyle(model, active)}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export const NativeAppShellDrawer: React.FC<NativeAppShellRegionProps> = ({ hosts, model, onNavigate }) => {
  const { Pressable, Text, View } = hosts;
  const region = model.regions.drawer;
  if (!region.enabled) return null;

  return (
    <View style={mergeNativeStyles(region.surfaceStyle, { zIndex: model.designSystem.theme.tokens.zIndex?.appShellDrawer })}>
      {model.drawerGroups.map((group) => (
        <View key={group.key}>
          {group.label ? <Text>{group.label}</Text> : null}
          {group.items.map((item) => {
            const active = isNativeAppShellItemActive(model, item);
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                key={item.key}
                onPress={() => onNavigate?.(item.routePath, item)}
                style={createHeaderItemStyle(model, active)}
              >
                <Text style={createTextStyle(model, active)}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
};

export const NativeAppShell: React.FC<NativeAppShellRuntimeProps> = ({ children, hosts, onNavigate, ...input }) => {
  const model = resolveNativeAppShellModel(input);
  const Root = hosts.SafeAreaView || hosts.View;
  const { View } = hosts;

  return (
    <Root style={mergeNativeStyles(model.designSystem.primitives.Surface?.states.default, { flex: 1 })}>
      <NativeAppShellHeader hosts={hosts} model={model} onNavigate={onNavigate} />
      <View style={{ flex: 1 }}>
        {children}
      </View>
      <NativeAppShellTabBar hosts={hosts} model={model} onNavigate={onNavigate} />
    </Root>
  );
};
