"use client";

import React from "react";
import { Button } from "../../../ui/Button";
import { Icon } from "../../../ui/Icon";
import { CloseIcon } from "../../../ui/Icon/AppIcons";
import { Inline, Stack } from "../../../ui/Layout";
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
      >
        <Inline align="center" className={styles.drawerHeader} justify="between" wrap={false}>
          <AppShellBrand brand={model.brand} onNavigate={onNavigate} />
          <Button
            aria-label={model.strings.closeDrawerAriaLabel}
            appearance="transparent"
            className={[styles.iconButton, styles.drawerCloseButton].filter(Boolean).join(" ")}
            icon={<CloseIcon color="currentColor" />}
            iconPosition="only"
            onClick={onClose}
            size="sm"
            tone="neutral"
            type="button"
          />
        </Inline>
        <nav className={styles.verticalNav}>
          <Stack className={styles.navGroups} gap="sm">
            {model.drawerGroups.map((group) => (
              <Stack className={styles.navGroup} gap="xs" key={group.key}>
              {group.label ? <span className={styles.navGroupLabel}>{group.label}</span> : null}
              <Stack className={styles.navGroupItems} gap="2xs">
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
                      <Icon className={styles.verticalLinkIcon} tone="inherit" size="md">{renderAppShellIcon(item, "currentColor")}</Icon>
                      <span className={styles.verticalLinkLabel}>{item.label}</span>
                    </Button>
                  );
                })}
              </Stack>
            </Stack>
            ))}
          </Stack>
        </nav>
      </Surface>
    </div>
  );
};
