"use client";

import React from "react";
import { Button } from "../../../ui/Button";
import { Icon } from "../../../ui/Icon";
import { CloseIcon } from "../../../ui/Icon/AppIcons";
import { Surface } from "../../../ui/Surface";
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
      <Button aria-label={model.strings.closeDrawerAriaLabel} appearance="transparent" className={styles.drawerBackdrop} onClick={onClose} type="button" />
      <Surface
        appearance="solid"
        className={styles.drawerPanel}
        style={{
          "--ui-surface-bg": "var(--app-shell-panel-bg)",
          "--ui-surface-border": "var(--app-shell-border)",
          "--ui-surface-color": "var(--app-shell-color)",
          "--ui-surface-shadow": "var(--app-shell-panel-shadow, none)"
        } as React.CSSProperties}
      >
        <div className={styles.drawerHeader}>
          <AppShellBrand brand={model.brand} onNavigate={onNavigate} />
          <Button
            aria-label={model.strings.closeDrawerAriaLabel}
            appearance="transparent"
            className={styles.iconButton}
            icon={<CloseIcon color="currentColor" />}
            iconPosition="only"
            onClick={onClose}
            size="sm"
            tone="neutral"
            type="button"
          />
        </div>
        <nav className={styles.verticalNav}>
          {model.drawerGroups.map((group) => (
            <div className={styles.navGroup} key={group.key}>
              {group.label ? <span className={styles.navGroupLabel}>{group.label}</span> : null}
              <div className={styles.navGroupItems}>
                {group.items.map((item) => {
                  const isActive = model.activePath === item.routePath;
                  return (
                    <Button
                      appearance={isActive ? "soft" : "transparent"}
                      className={[styles.verticalLink, isActive ? styles.verticalLinkActive : ""].filter(Boolean).join(" ")}
                      key={item.key}
                      onClick={(event) => handleAppShellNavigation(event, item, onNavigate, onClose)}
                      size="md"
                      tone={isActive ? "primary" : "neutral"}
                    >
                      <Icon tone="inherit" size="md">{renderAppShellIcon(item, "currentColor")}</Icon>
                      <span>{item.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </Surface>
    </div>
  );
};
