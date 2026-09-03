"use client";

import React from "react";
import { Button } from "../../../ui/Button";
import { Icon } from "../../../ui/Icon";
import { ChevronRightIcon } from "../../../ui/Icon/AppIcons";
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
    <aside className={[styles.sidebar, isCollapsed ? styles.sidebarCollapsed : ""].filter(Boolean).join(" ")}>
      <div className={styles.verticalNav}>
        <div className={styles.sidebarBrand}>
          <AppShellBrand brand={model.brand} collapsed={isCollapsed} onNavigate={onNavigate} />
        </div>
        <nav className={styles.verticalNav}>
          {model.sidebarItems.map((item) => {
            const isActive = model.activePath === item.routePath;
            return (
              <a
                className={[styles.verticalLink, isActive ? styles.verticalLinkActive : ""].filter(Boolean).join(" ")}
                href={item.routePath}
                key={item.key}
                onClick={(event) => handleAppShellNavigation(event, item, onNavigate)}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon tone="inherit" size="md">{renderAppShellIcon(item, "currentColor", 20)}</Icon>
                {!isCollapsed && <span>{item.label}</span>}
              </a>
            );
          })}
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
            icon={isCollapsed ? <ChevronRightIcon size={16} /> : undefined}
            iconPosition={isCollapsed ? "only" : "start"}
            onClick={onToggleCollapsed}
            size="sm"
            tone="neutral"
          >
            {isCollapsed ? null : model.strings.collapseSidebar || "Collapse"}
          </Button>
        )}
      </div>
    </aside>
  );
};
