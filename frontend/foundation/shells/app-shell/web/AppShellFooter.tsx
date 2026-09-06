"use client";

import React from "react";
import { Button } from "../../../ui/Button";
import { Container, Inline, type ContainerProps, type InlineProps } from "../../../ui/Layout";
import { Surface } from "../../../ui/Surface";
import { handleAppShellNavigation } from "./navigation";
import styles from "../AppShell.module.css";
import type { ResolvedAppShellModel } from "../foundation";

export interface AppShellFooterProps {
  model: ResolvedAppShellModel;
  onNavigate?: (path: string) => void;
}

export const AppShellFooter: React.FC<AppShellFooterProps> = ({ model, onNavigate }) => {
  if (!model.footerEnabled) return null;

  return (
    <Surface
      as="footer"
      appearance="solid"
      className={styles.footer}
      style={{
        "--ui-surface-bg": "var(--app-shell-panel-bg)",
        "--ui-surface-border": "var(--app-shell-border)",
        "--ui-surface-color": "var(--app-shell-color)",
        "--ui-surface-shadow": "none"
      } as React.CSSProperties}
    >
      <Container
        className={styles.footerInner}
        gutter={model.currentLayout.footer?.gutter as ContainerProps["gutter"]}
        width={model.currentLayout.footer?.width as ContainerProps["width"]}
      >
        <Inline align="center" className={styles.footerItems} justify={(model.currentLayout.footer?.align || "center") as InlineProps["justify"]}>
          {model.footerItems.map((item) => {
            const isActive = model.activePath === item.routePath;
            return (
              <Button
                appearance={isActive ? "soft" : "transparent"}
                className={[styles.navLink, isActive ? styles.navLinkActive : ""].filter(Boolean).join(" ")}
                key={item.key}
                onClick={(event) => handleAppShellNavigation(event, item, onNavigate)}
                size="sm"
                tone={isActive ? "primary" : "neutral"}
              >
                {item.label}
              </Button>
            );
          })}
        </Inline>
      </Container>
    </Surface>
  );
};
