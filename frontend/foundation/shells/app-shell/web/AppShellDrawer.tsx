"use client";

import React from "react";
import { Icon } from "../../../ui/Icon";
import { CloseIcon } from "../../../ui/Icon/AppIcons";
import { renderAppShellIcon } from "../iconResolver";
import { AppShellBrand } from "./AppShellBrand";
import { handleAppShellNavigation } from "./navigation";
import styles from "../AppShell.module.css";
import type { AppShellConfig, ResolvedAppShellModel } from "../foundation";

export interface AppShellDrawerProps {
  config?: AppShellConfig;
  isOpen: boolean;
  model: ResolvedAppShellModel;
  onClose: () => void;
  onNavigate?: (path: string) => void;
}

export const AppShellDrawer: React.FC<AppShellDrawerProps> = ({ config, isOpen, model, onClose, onNavigate }) => {
  if (!isOpen || config?.drawer?.enabled === false) return null;
  const isRight = (config?.drawer?.position || "right") === "right";

  return (
    <div className={[styles.drawerLayer, isRight ? styles.drawerLayerRight : ""].filter(Boolean).join(" ")}>
      <button aria-label={model.strings.closeDrawerAriaLabel || "Close navigation"} className={styles.drawerBackdrop} onClick={onClose} type="button" />
      <div className={styles.drawerPanel}>
        <div className={styles.drawerHeader}>
          <AppShellBrand brand={model.brand} onNavigate={onNavigate} />
          <button
            aria-label={model.strings.closeDrawerAriaLabel || "Close navigation"}
            className={styles.iconButton}
            onClick={onClose}
            type="button"
          >
            <CloseIcon size={20} color="currentColor" />
          </button>
        </div>
        <nav className={styles.verticalNav}>
          {model.drawerItems.map((item) => {
            const isActive = model.activePath === item.routePath;
            return (
              <a
                className={[styles.verticalLink, isActive ? styles.verticalLinkActive : ""].filter(Boolean).join(" ")}
                href={item.routePath}
                key={item.key}
                onClick={(event) => handleAppShellNavigation(event, item, onNavigate, onClose)}
              >
                <Icon tone="inherit" size="md">{renderAppShellIcon(item, "currentColor", 18)}</Icon>
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
