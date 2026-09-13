"use client";

import React from "react";
import { Button } from "../../../ui/web/Button";
import { Container, Inline, type ContainerProps, type InlineProps } from "../../../ui/web/Layout";
import { Surface } from "../../../ui/web/Surface";
import { renderAppShellIcon } from "../iconResolver";
import styles from "../AppShell.module.css";
import type { ResolvedAppShellModel } from "../foundation";

export interface AppShellBottomTabBarProps {
  model: ResolvedAppShellModel;
  onOpenMore?: () => void;
  onNavigate?: (path: string) => void;
}

export const AppShellBottomTabBar: React.FC<AppShellBottomTabBarProps> = ({ model, onNavigate, onOpenMore }) => {
  if (!model.bottomTabEnabled || model.bottomItems.length === 0) return null;

  return (
    <Surface
      as="nav"
      appearance="solid"
      className={styles.bottomTabBar}
      data-presentation={model.bottomTabPresentation}
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
          {model.bottomMore ? (
            <Button
              aria-label={model.bottomMore.label}
              appearance="transparent"
              className={styles.bottomTabButton}
              icon={renderAppShellIcon({ iconIntent: model.bottomMore.iconIntent, key: "more" }, "currentColor")}
              iconPosition="start"
              onClick={onOpenMore}
              size="xs"
              tone="neutral"
              type="button"
            >
              <span className={styles.bottomTabLabel}>{model.bottomMore.label}</span>
            </Button>
          ) : null}
        </Inline>
      </Container>
    </Surface>
  );
};
