"use client";

import React from "react";
import { renderAppShellIcon } from "../iconResolver";
import styles from "../AppShell.module.css";
import type { ResolvedAppShellModel } from "../foundation";

export interface AppShellBottomTabBarProps {
  model: ResolvedAppShellModel;
  onNavigate?: (path: string) => void;
}

export const AppShellBottomTabBar: React.FC<AppShellBottomTabBarProps> = ({ model, onNavigate }) => {
  if (!model.bottomTabEnabled || model.bottomItems.length === 0) return null;

  return (
    <nav className={styles.bottomTabBar}>
      {model.bottomItems.map((item) => {
        const isActive = model.activePath === item.routePath;
        return (
          <button
            className={[styles.bottomTabButton, isActive ? styles.bottomTabButtonActive : ""].filter(Boolean).join(" ")}
            key={item.key}
            onClick={() => onNavigate?.(item.routePath)}
            type="button"
          >
            {renderAppShellIcon(item, "currentColor", 20)}
            <span className={styles.bottomTabLabel}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
