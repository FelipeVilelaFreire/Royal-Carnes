"use client";

import React from "react";
import { MenuIcon } from "../../../ui/Icon/AppIcons";
import { AppShellBrand } from "./AppShellBrand";
import { handleAppShellNavigation } from "./navigation";
import styles from "../AppShell.module.css";
import type { ResolvedAppShellModel } from "../foundation";

export interface AppShellHeaderProps {
  drawerEnabled?: boolean;
  model: ResolvedAppShellModel;
  onNavigate?: (path: string) => void;
  onOpenDrawer: () => void;
  rightSlot?: React.ReactNode;
  surfaceStyle?: string;
}

export const AppShellHeader: React.FC<AppShellHeaderProps> = ({
  drawerEnabled = true,
  model,
  onNavigate,
  onOpenDrawer,
  rightSlot,
  surfaceStyle,
}) => {
  if (!model.headerEnabled) return null;

  return (
    <header
      className={[styles.header, model.isFloatingHeader ? styles.headerFloating : ""].filter(Boolean).join(" ")}
      style={{ backdropFilter: surfaceStyle === "glassBlur" ? "blur(20px)" : undefined }}
    >
      <div className={styles.headerInner}>
        <div className={styles.headerLeft}>
          {drawerEnabled ? (
            <button
              aria-label={model.strings.openDrawerAriaLabel || "Open navigation"}
              className={styles.iconButton}
              onClick={onOpenDrawer}
              type="button"
            >
              <MenuIcon size={22} color="currentColor" />
            </button>
          ) : null}
          <AppShellBrand brand={model.brand} onNavigate={onNavigate} />
          <nav className={[styles.headerNav, styles.headerDesktopNav].join(" ")}>
            {model.headerItems.map((item) => {
              const isActive = model.activePath === item.routePath;
              return (
                <a
                  className={[styles.navLink, isActive ? styles.navLinkActive : ""].filter(Boolean).join(" ")}
                  href={item.routePath}
                  key={item.key}
                  onClick={(event) => handleAppShellNavigation(event, item, onNavigate)}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
        {rightSlot}
      </div>
    </header>
  );
};
