"use client";

import React from "react";
import { Button } from "../../../ui/web/Button";
import { MenuIcon, MoonIcon, SunIcon } from "../../../ui/web/Icon/AppIcons";
import { Container, Inline, type ContainerProps, type InlineProps } from "../../../ui/web/Layout";
import { Surface } from "../../../ui/web/Surface";
import { AppShellBrand } from "./AppShellBrand";
import { handleAppShellNavigation } from "./navigation";
import styles from "../AppShell.module.css";
import type { AppShellHeaderAction, ResolvedAppShellModel } from "../foundation";

export interface AppShellHeaderProps {
  drawerEnabled?: boolean;
  headerConfig?: Record<string, any>;
  isScrolled?: boolean;
  model: ResolvedAppShellModel;
  onNavigate?: (path: string) => void;
  onOpenDrawer: () => void;
  onThemeModeToggle?: () => void;
  rightSlot?: React.ReactNode;
  surfaceStyle?: string;
  themeMode?: string;
}

export const AppShellHeader: React.FC<AppShellHeaderProps> = ({
  drawerEnabled = true,
  headerConfig,
  isScrolled = false,
  model,
  onNavigate,
  onOpenDrawer,
  onThemeModeToggle,
  rightSlot,
  surfaceStyle,
  themeMode = "dark",
}) => {
  if (!model.headerEnabled) return null;

  const drawerTriggerMode = headerConfig?.drawerTrigger || true;
  const showDrawerTrigger = drawerEnabled && drawerTriggerMode !== false && drawerTriggerMode !== "never";
  const drawerTriggerMobileOnly = drawerTriggerMode === "mobile";
  const navCentered = headerConfig?.navAlignment === "center";
  const mobileDrawerAtEnd = headerConfig?.mobileDrawerPlacement === "end";

  const resolveStringPath = (source: Record<string, any> | undefined, path: string | undefined) => {
    if (!source || !path) return undefined;
    return path.split(".").reduce<any>((value, segment) => value?.[segment], source);
  };

  const resolveActionLabel = (action: AppShellHeaderAction) => {
    if (action.type === "themeToggle") {
      const labelKey = themeMode === "dark" ? action.darkLabelKey : action.lightLabelKey;
      return resolveStringPath(model.strings, labelKey) || action.label || action.key;
    }
    return action.label || resolveStringPath(model.strings, action.labelKey) || action.key;
  };

  const renderHeaderAction = (action: AppShellHeaderAction) => {
    const label = resolveActionLabel(action);
    const isThemeAction = action.type === "themeToggle";
    const actionPath = action.type === "scroll" && action.targetId ? `#${action.targetId}` : action.path;

    return (
      <Button
        appearance={(action.appearance || (isThemeAction ? "outline" : "transparent")) as any}
        className={styles.headerAction}
        icon={isThemeAction ? (themeMode === "dark" ? <SunIcon color="currentColor" /> : <MoonIcon color="currentColor" />) : undefined}
        key={action.key}
        onClick={() => {
          if (isThemeAction) {
            onThemeModeToggle?.();
            return;
          }
          if (actionPath) onNavigate?.(actionPath);
        }}
        size={(action.size || "sm") as any}
        tone={(action.tone || "neutral") as any}
        type="button"
      >
        <span className={isThemeAction ? styles.headerActionResponsiveLabel : undefined}>{label}</span>
      </Button>
    );
  };

  return (
    <Surface
      as="header"
      appearance={surfaceStyle === "glassBlur" ? "glass" : "solid"}
      className={[
        styles.header,
        headerConfig?.visualStyle === "portalClassic" ? styles.headerPortalClassic : "",
        mobileDrawerAtEnd ? styles.headerMobileDrawerEnd : "",
        model.isFloatingHeader ? styles.headerFloating : "",
      ].filter(Boolean).join(" ")}
      data-mobile-actions={headerConfig?.mobileActions || "visible"}
      data-scrolled={isScrolled || undefined}
      data-surface-style={surfaceStyle || "solid"}
    >
      <Container
        className={styles.headerInner}
        gutter={model.currentLayout.header?.gutter as ContainerProps["gutter"]}
        width={model.currentLayout.header?.width as ContainerProps["width"]}
      >
      <Inline align="center" className={styles.headerInnerLayout} justify={(model.currentLayout.header?.align || "between") as InlineProps["justify"]} wrap={false}>
        <div className={[styles.headerLeft, navCentered ? styles.headerLeftCenteredNav : ""].filter(Boolean).join(" ")}>
          {showDrawerTrigger ? (
            <Button
              aria-label={model.strings.openDrawerAriaLabel}
              appearance="transparent"
              className={[styles.iconButton, drawerTriggerMobileOnly ? styles.mobileDrawerTrigger : ""].filter(Boolean).join(" ")}
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
              navCentered ? styles.headerNavCentered : "",
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
                  tone={isActive ? "primary" : "neutral"}
                >
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>
        {rightSlot || (
          <div className={styles.headerActions}>
            {(headerConfig?.actions || []).map((action: AppShellHeaderAction) => renderHeaderAction(action))}
          </div>
        )}
      </Inline>
      </Container>
    </Surface>
  );
};
