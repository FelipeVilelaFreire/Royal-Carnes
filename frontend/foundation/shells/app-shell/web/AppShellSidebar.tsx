"use client";

import React from "react";
import { Button } from "../../../ui/Button";
import { Icon } from "../../../ui/Icon";
import { ChevronRightIcon } from "../../../ui/Icon/AppIcons";
import { Flex, Stack } from "../../../ui/Layout";
import { Surface } from "../../../ui/Surface";
import { renderAppShellIcon } from "../iconResolver";
import { AppShellBrand } from "./AppShellBrand";
import { handleAppShellNavigation } from "./navigation";
import styles from "../AppShell.module.css";
import type { AppShellConfig, ResolvedAppShellModel } from "../foundation";

export interface AppShellSidebarProps {
  config?: AppShellConfig;
  isCollapsed: boolean;
  model: ResolvedAppShellModel;
  onNavigate?: (path: string) => void;
  onToggleCollapsed: () => void;
}

export const AppShellSidebar: React.FC<AppShellSidebarProps> = ({
  config,
  isCollapsed,
  model,
  onNavigate,
  onToggleCollapsed,
}) => {
  if (!model.sidebarEnabled) return null;
  const profile = config?.sidebar?.userProfile;
  const density = config?.sidebar?.density || "default";

  return (
    <Surface
      as="aside"
      appearance="solid"
      className={[
        styles.sidebar,
        density === "compact" ? styles.sidebarCompact : "",
        isCollapsed ? styles.sidebarCollapsed : ""
      ].filter(Boolean).join(" ")}
      data-sidebar-density={density}
    >
      <Stack className={styles.sidebarMain} gap="md">
        <div className={styles.sidebarBrand}>
          <AppShellBrand brand={model.brand} collapsed={isCollapsed} onNavigate={onNavigate} />
        </div>
        <nav className={styles.verticalNav}>
          <Stack className={styles.navGroups} gap="sm">
            {model.sidebarGroups.map((group) => (
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
                        onClick={(event) => handleAppShellNavigation(event, item, onNavigate)}
                        size="md"
                        title={isCollapsed ? item.label : undefined}
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
      </Stack>
      <Stack className={styles.sidebarFooter} gap="md">
        {config?.sidebar?.showUserProfile && profile && !isCollapsed && (
          <Flex align="center" className={styles.userProfile} gap="sm">
            <span className={styles.userAvatar}>{String(profile.name || "A").slice(0, 1).toUpperCase()}</span>
            <span className={styles.userText}>
              <span className={styles.userName}>{profile.name}</span>
              {profile.badge && <span className={styles.userBadge}>{profile.badge}</span>}
            </span>
          </Flex>
        )}
        {config?.sidebar?.collapsible !== false && (
          <Button
            appearance="outline"
            className={styles.sidebarCollapseButton}
            icon={<ChevronRightIcon className={isCollapsed ? styles.sidebarCollapseIcon : styles.sidebarCollapseIconExpanded} />}
            iconPosition="start"
            onClick={onToggleCollapsed}
            size="sm"
            title={isCollapsed ? model.strings.collapseSidebar : undefined}
            tone="neutral"
          >
            {model.strings.collapseSidebar}
          </Button>
        )}
      </Stack>
    </Surface>
  );
};
