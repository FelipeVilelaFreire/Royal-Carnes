"use client";

import React from "react";
import { Button } from "../../../ui/Button";
import { Icon } from "../../../ui/Icon";
import { ChevronRightIcon } from "../../../ui/Icon/AppIcons";
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

  return (
    <Surface
      as="aside"
      appearance="solid"
      className={[styles.sidebar, isCollapsed ? styles.sidebarCollapsed : ""].filter(Boolean).join(" ")}
      style={{
        "--ui-surface-bg": "var(--app-shell-panel-bg)",
        "--ui-surface-border": "var(--app-shell-border)",
        "--ui-surface-color": "var(--app-shell-color)",
        "--ui-surface-shadow": "none"
      } as React.CSSProperties}
    >
      <div className={styles.verticalNav}>
        <div className={styles.sidebarBrand}>
          <AppShellBrand brand={model.brand} collapsed={isCollapsed} onNavigate={onNavigate} />
        </div>
        <nav className={styles.verticalNav}>
          {model.sidebarGroups.map((group) => (
            <div className={styles.navGroup} key={group.key}>
              {group.label && !isCollapsed ? <span className={styles.navGroupLabel}>{group.label}</span> : null}
              <div className={styles.navGroupItems}>
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
                      <Icon tone="inherit" size="md">{renderAppShellIcon(item, "currentColor")}</Icon>
                      {!isCollapsed && <span>{item.label}</span>}
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
      <div className={styles.sidebarFooter}>
        {config?.sidebar?.showUserProfile && profile && !isCollapsed && (
          <div className={styles.userProfile}>
            <span className={styles.userAvatar}>{String(profile.name || "A").slice(0, 1).toUpperCase()}</span>
            <span className={styles.userText}>
              <span className={styles.userName}>{profile.name}</span>
              {profile.badge && <span className={styles.userBadge}>{profile.badge}</span>}
            </span>
          </div>
        )}
        {config?.sidebar?.collapsible !== false && (
          <Button
            appearance="outline"
            icon={isCollapsed ? <ChevronRightIcon /> : undefined}
            iconPosition={isCollapsed ? "only" : "start"}
            onClick={onToggleCollapsed}
            size="sm"
            tone="neutral"
          >
            {isCollapsed ? null : model.strings.collapseSidebar}
          </Button>
        )}
      </div>
    </Surface>
  );
};
