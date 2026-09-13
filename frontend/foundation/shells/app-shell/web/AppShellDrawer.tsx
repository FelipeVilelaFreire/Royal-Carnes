"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../../../ui/web/Button";
import { Icon } from "../../../ui/web/Icon";
import { CloseIcon } from "../../../ui/web/Icon/AppIcons";
import { Inline, Stack } from "../../../ui/web/Layout";
import { Surface } from "../../../ui/web/Surface";
import { renderAppShellIcon } from "../iconResolver";
import { AppShellBrand } from "./AppShellBrand";
import { handleAppShellNavigation } from "./navigation";
import styles from "../AppShell.module.css";
import type { AppShellConfig, ResolvedAppShellModel } from "../foundation";

export interface AppShellDrawerProps {
  config?: AppShellConfig;
  isMobileScreen?: boolean;
  isOpen: boolean;
  model: ResolvedAppShellModel;
  onClose: () => void;
  onNavigate?: (path: string) => void;
}

export const AppShellDrawer: React.FC<AppShellDrawerProps> = ({ config, isMobileScreen = false, isOpen, model, onClose, onNavigate }) => {
  const [isMounted, setIsMounted] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setIsMounted(true);
  }, [isOpen]);

  if (!isMounted || config?.drawer?.enabled === false) return null;
  const isRight = (config?.drawer?.position || "right") === "right";
  const isBottomSheet = isMobileScreen && config?.drawer?.mobilePresentation === "bottomSheet";

  return (
    <div className={[styles.drawerLayer, isRight ? styles.drawerLayerRight : "", isBottomSheet ? styles.drawerLayerBottomSheet : ""].filter(Boolean).join(" ")} data-state={isOpen ? "open" : "closed"}>
      <Button aria-label={model.strings.closeDrawerAriaLabel} appearance="transparent" className={styles.drawerBackdrop} onClick={onClose} type="button" />
      <Surface
        appearance="solid"
        aria-label={isBottomSheet ? model.bottomMore?.title : undefined}
        aria-modal="true"
        className={[styles.drawerPanel, isBottomSheet ? styles.drawerPanelBottomSheet : ""].filter(Boolean).join(" ")}
        onAnimationEnd={(event) => {
          if (!isOpen && event.currentTarget === event.target) setIsMounted(false);
        }}
        role="dialog"
      >
        {isBottomSheet ? <span aria-hidden="true" className={styles.drawerSheetHandle} /> : null}
        <Inline align="center" className={styles.drawerHeader} justify="between" wrap={false}>
          {isBottomSheet ? <span className={styles.drawerSheetTitle}>{model.bottomMore?.title || model.brand.name}</span> : <AppShellBrand brand={model.brand} onNavigate={onNavigate} />}
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
