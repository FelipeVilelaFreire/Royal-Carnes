"use client";

import React from "react";
import { Button } from "../../../ui/Button";
import { MenuIcon } from "../../../ui/Icon/AppIcons";
import { Container, Inline, type ContainerProps, type InlineProps } from "../../../ui/Layout";
import { Surface } from "../../../ui/Surface";
import { AppShellBrand } from "./AppShellBrand";
import { handleAppShellNavigation } from "./navigation";
import styles from "../AppShell.module.css";
import type { ResolvedAppShellModel } from "../foundation";

export interface AppShellHeaderProps {
  drawerEnabled?: boolean;
  headerConfig?: Record<string, any>;
  model: ResolvedAppShellModel;
  onNavigate?: (path: string) => void;
  onOpenDrawer: () => void;
  rightSlot?: React.ReactNode;
  surfaceStyle?: string;
}

export const AppShellHeader: React.FC<AppShellHeaderProps> = ({
  drawerEnabled = true,
  headerConfig,
  model,
  onNavigate,
  onOpenDrawer,
  rightSlot,
  surfaceStyle,
}) => {
  if (!model.headerEnabled) return null;

  const resolveHeaderNavButtonStyle = (isActive: boolean) => ({
    "--ui-surface-bg": isActive ? "var(--app-shell-surface-bg)" : "transparent",
    "--ui-surface-border": isActive ? "var(--app-shell-accent)" : "transparent",
    "--ui-surface-border-width": "var(--app-shell-border-width)",
    "--ui-surface-color": isActive ? "var(--app-shell-color)" : "var(--app-shell-muted)",
    "--ui-surface-radius": "var(--theme--radius-full)",
    "--ui-surface-shadow": "none",
    "--ui-button-height": "var(--theme--dimensions-height-md)",
    "--ui-button-padding-x": "var(--theme--spacing-spaceMd)",
    "--ui-button-padding-y": "var(--app-shell-space-none)"
  } as React.CSSProperties);

  return (
    <Surface
      as="header"
      appearance={surfaceStyle === "glassBlur" ? "glass" : "solid"}
      className={[
        styles.header,
        headerConfig?.visualStyle === "portalClassic" ? styles.headerPortalClassic : "",
        model.isFloatingHeader ? styles.headerFloating : "",
      ].filter(Boolean).join(" ")}
      style={{
        "--ui-surface-bg": "var(--app-shell-header-bg, var(--theme--color-surface))",
        "--ui-surface-border": "var(--app-shell-border)",
        "--ui-surface-color": "var(--app-shell-color)",
        "--ui-surface-shadow": "none",
        backdropFilter: surfaceStyle === "glassBlur" ? "blur(var(--theme--blur-md))" : undefined
      } as React.CSSProperties}
    >
      <Container
        className={styles.headerInner}
        gutter={model.currentLayout.header?.gutter as ContainerProps["gutter"]}
        width={model.currentLayout.header?.width as ContainerProps["width"]}
      >
      <Inline align="center" className={styles.headerInnerLayout} justify={(model.currentLayout.header?.align || "between") as InlineProps["justify"]} wrap={false}>
        <div className={styles.headerLeft}>
          {drawerEnabled ? (
            <Button
              aria-label={model.strings.openDrawerAriaLabel}
              appearance="transparent"
              className={styles.iconButton}
              icon={<MenuIcon color="currentColor" />}
              iconPosition="only"
              onClick={onOpenDrawer}
              size="sm"
              tone="neutral"
              type="button"
            />
          ) : null}
          <AppShellBrand brand={model.brand} display={headerConfig?.brandDisplay} onNavigate={onNavigate} />
          <span className={styles.headerDivider} aria-hidden="true" />
          <nav
            className={[
              styles.headerNav,
              styles.headerDesktopNav,
              headerConfig?.navAppearance === "pill" ? styles.headerNavPill : "",
            ].filter(Boolean).join(" ")}
          >
            {model.headerItems.map((item) => {
              const isActive = model.activePath === item.routePath;
              return (
                <Button
                  appearance={isActive ? "soft" : "transparent"}
                  className={[styles.navLink, isActive ? styles.navLinkActive : ""].filter(Boolean).join(" ")}
                  key={item.key}
                  onClick={(event) => handleAppShellNavigation(event, item, onNavigate)}
                  size="sm"
                  style={headerConfig?.navAppearance === "pill" ? resolveHeaderNavButtonStyle(isActive) : undefined}
                  tone={isActive ? "primary" : "neutral"}
                >
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>
        {rightSlot}
      </Inline>
      </Container>
    </Surface>
  );
};
