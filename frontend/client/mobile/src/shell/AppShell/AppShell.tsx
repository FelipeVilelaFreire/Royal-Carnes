import React, { type ReactNode } from "react";
import type { ResolvedAppShellNavigationItem } from "../../../../../foundation/shells/app-shell/foundation";
import { resolveNativeAppShellModel, type NativeAppShellHostComponents } from "../../../../../foundation/shells/app-shell/native";
import type { NativeAppShellInput } from "../../../../../foundation/shells/app-shell/native";
import { Button, Icon, Surface, Text, UiProvider, mergeStyles } from "../../ui";
import type { AppThemeMode } from "./config";

export interface AppShellProps extends NativeAppShellInput {
  children?: ReactNode;
  hosts: NativeAppShellHostComponents;
  onNavigate?: (path: string, item: ResolvedAppShellNavigationItem) => void;
  themeMode?: AppThemeMode;
}

const isItemActive = (activePath: string, item: ResolvedAppShellNavigationItem) =>
  activePath === item.routePath;

export const AppShell: React.FC<AppShellProps> = ({
  children,
  hosts,
  mode = "client",
  onNavigate,
  themeMode = "dark",
  ...input
}) => {
  const model = resolveNativeAppShellModel({ ...input, mode });
  const Root = hosts.SafeAreaView || hosts.View;
  const View = hosts.View;

  return (
    <UiProvider designSystem={model.designSystem} hosts={hosts} mode={themeMode}>
      <Root style={mergeStyles(model.designSystem.primitives.Surface?.states.default, { flex: 1 })}>
        {model.regions.header.enabled ? (
          <Surface style={mergeStyles(model.regions.header.surfaceStyle, { zIndex: model.designSystem.theme.tokens.zIndex?.appShellHeader })}>
            <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
              <Text>{model.brand.name}</Text>
              <View style={{ alignItems: "center", flexDirection: "row" }}>
                {model.regions.header.items.map((item) => {
                  const active = isItemActive(model.activePath, item);
                  return (
                    <Button
                      accessibilityLabel={item.label}
                      appearance={active ? "soft" : "transparent"}
                      icon={<Icon intent={item.iconIntent} name={item.iconName} />}
                      key={item.key}
                      onAction={() => onNavigate?.(item.routePath, item)}
                      tone={active ? "primary" : "neutral"}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </View>
            </View>
          </Surface>
        ) : null}

        <View style={{ flex: 1 }}>
          {children}
        </View>

        {model.regions.nativeTabBar.enabled ? (
          <Surface style={mergeStyles(model.regions.nativeTabBar.surfaceStyle, { flexDirection: "row", zIndex: model.designSystem.theme.tokens.zIndex?.appShellBottomBar })}>
            {model.regions.nativeTabBar.items.map((item) => {
              const active = isItemActive(model.activePath, item);
              return (
                <Button
                  accessibilityLabel={item.label}
                  appearance={active ? "soft" : "transparent"}
                  icon={<Icon intent={item.iconIntent} name={item.iconName} />}
                  key={item.key}
                  onAction={() => onNavigate?.(item.routePath, item)}
                  style={{ flex: 1 }}
                  tone={active ? "primary" : "neutral"}
                >
                  {item.label}
                </Button>
              );
            })}
          </Surface>
        ) : null}
      </Root>
    </UiProvider>
  );
};
