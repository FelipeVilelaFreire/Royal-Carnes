"use client";

import React, { useState } from "react";
import { Button } from "../../../ui/web/Button";
import { Icon } from "../../../ui/web/Icon";
import { ChevronRightIcon } from "../../../ui/web/Icon/AppIcons";
import { Flex, Stack } from "../../../ui/web/Layout";
import { Surface } from "../../../ui/web/Surface";
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
  const groupButtonConfig = config?.sidebar?.groupButton || {};
  const routeButtonConfig = config?.sidebar?.routeButton || {};
  const groupsExpandable = groupButtonConfig.expandable !== false;
  const groupButtonStyle = groupButtonConfig.style || "accordion";
  const routeButtonStyle = routeButtonConfig.style || "navigation";
  const [closedGroups, setClosedGroups] = useState<Set<string>>(() => new Set());

  const toggleGroup = (groupKey: string) => {
    if (!groupsExpandable) return;
    setClosedGroups((current) => {
      const next = new Set(current);
      if (next.has(groupKey)) {
        next.delete(groupKey);
      } else {
        next.add(groupKey);
      }
      return next;
    });
  };

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
      <div className={styles.sidebarBrand}>
        <AppShellBrand brand={model.brand} collapsed={isCollapsed} onNavigate={onNavigate} />
      </div>
      <Stack className={styles.sidebarMain} gap="md">
        <nav className={styles.verticalNav}>
          <Stack className={styles.navGroups} gap="sm">
            {model.sidebarGroups.map((group) => {
              const isGroupExpanded = isCollapsed || !groupsExpandable || !closedGroups.has(group.key);

              return (
                <Stack
                  className={styles.navGroup}
                  data-expanded={isGroupExpanded ? "true" : "false"}
                  gap="xs"
                  key={group.key}
                >
                  {group.label ? (
                    <button
                      aria-expanded={isGroupExpanded}
                      className={styles.navGroupButton}
                      data-sidebar-group-button-style={groupButtonStyle}
                      onClick={() => toggleGroup(group.key)}
                      type="button"
                    >
                      <span className={styles.navGroupLabel}>{group.label}</span>
                      <ChevronRightIcon
                        aria-hidden="true"
                        className={isGroupExpanded ? styles.navGroupChevronExpanded : styles.navGroupChevron}
                      />
                    </button>
                  ) : null}
                  <div
                    aria-hidden={!isGroupExpanded}
                    className={styles.navGroupItems}
                    data-expanded={isGroupExpanded ? "true" : "false"}
                  >
                    <div className={styles.navGroupItemsInner}>
                      {group.items.map((item) => {
                        const isActive = model.activePath === item.routePath;
                        return (
                          <Button
                            appearance={isActive ? "soft" : "transparent"}
                            className={[styles.verticalLink, isActive ? styles.verticalLinkActive : ""].filter(Boolean).join(" ")}
                            data-sidebar-route-button-style={routeButtonStyle}
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
                    </div>
                  </div>
                </Stack>
              );
            })}
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
            appearance="transparent"
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
