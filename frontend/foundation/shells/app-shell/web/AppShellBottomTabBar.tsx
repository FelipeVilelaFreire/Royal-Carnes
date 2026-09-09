"use client";

import React from "react";
import { Button } from "../../../ui/Button";
import { Container, Inline, type ContainerProps, type InlineProps } from "../../../ui/Layout";
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

  return (
    <Surface
      as="nav"
      appearance="solid"
      className={styles.bottomTabBar}
    >
      <Container
        className={styles.bottomTabInner}
        gutter={model.currentLayout.bottomTabBar?.gutter as ContainerProps["gutter"]}
        width={model.currentLayout.bottomTabBar?.width as ContainerProps["width"]}
      >
        <Inline
          align="center"
          className={styles.bottomTabItems}
          justify={(model.currentLayout.bottomTabBar?.align || "evenly") as InlineProps["justify"]}
          wrap={false}
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
                tone={isActive ? "primary" : "neutral"}
                type="button"
              >
                <span className={styles.bottomTabLabel}>{item.label}</span>
              </Button>
            );
          })}
        </Inline>
      </Container>
    </Surface>
  );
};
