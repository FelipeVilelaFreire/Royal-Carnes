"use client";

import React from "react";
import { Button } from "../../../ui/Button";
import { Surface } from "../../../ui/Surface";
import { renderAppShellIcon } from "../iconResolver";
import styles from "../AppShell.module.css";
import type { ResolvedAppShellModel } from "../foundation";

export interface AppShellBottomTabBarProps {
  model: ResolvedAppShellModel;
  onNavigate?: (path: string) => void;
}

export const AppShellBottomTabBar: React.FC<AppShellBottomTabBarProps> = ({ model, onNavigate }) => {
  if (!model.bottomTabEnabled || model.bottomItems.length === 0) return null;

  const resolveTabButtonStyle = (isActive: boolean) => ({
    "--ui-surface-bg": isActive ? "var(--app-shell-surface-bg)" : "transparent",
    "--ui-surface-border": isActive ? "var(--app-shell-accent)" : "transparent",
    "--ui-surface-border-width": "var(--app-shell-border-width)",
    "--ui-surface-color": isActive ? "var(--app-shell-color)" : "var(--app-shell-muted)",
    "--ui-surface-radius": "var(--theme--radius-full)",
    "--ui-surface-shadow": "none",
    "--ui-button-font-size": "var(--theme--typography-size2xs)",
    "--ui-button-font-weight": "var(--theme--typography-bold)",
    "--ui-button-gap": "var(--theme--spacing-space2xs)",
    "--ui-button-height": "var(--theme--dimensions-height-xl)",
    "--ui-button-letter-spacing": "var(--theme--typography-letterSpacingMd)",
    "--ui-button-line-height": "var(--theme--typography-lineHeight2xs)",
    "--ui-button-min-width": "var(--theme--dimensions-minWidth-sm)",
    "--ui-button-padding-x": "var(--theme--spacing-space2xs)",
    "--ui-button-padding-y": "var(--theme--spacing-space2xs)"
  } as React.CSSProperties);

  return (
    <Surface
      as="nav"
      appearance="solid"
      className={styles.bottomTabBar}
      style={{
        "--ui-surface-bg": "var(--app-shell-panel-bg)",
        "--ui-surface-border": "var(--app-shell-border)",
        "--ui-surface-color": "var(--app-shell-color)",
        "--ui-surface-shadow": "var(--app-shell-bottom-shadow, none)"
      } as React.CSSProperties}
    >
      {model.bottomItems.map((item) => {
        const isActive = model.activePath === item.routePath;
        return (
          <Button
            appearance={isActive ? "soft" : "transparent"}
            className={[styles.bottomTabButton, isActive ? styles.bottomTabButtonActive : ""].filter(Boolean).join(" ")}
            key={item.key}
            icon={renderAppShellIcon(item, "currentColor")}
            iconPosition="start"
            onClick={() => onNavigate?.(item.routePath)}
            size="xs"
            style={resolveTabButtonStyle(isActive)}
            tone={isActive ? "primary" : "neutral"}
            type="button"
          >
            <span className={styles.bottomTabLabel}>{item.label}</span>
          </Button>
        );
      })}
    </Surface>
  );
};
