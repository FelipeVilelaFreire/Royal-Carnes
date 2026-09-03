"use client";

import React from "react";
import { handleAppShellNavigation } from "./navigation";
import styles from "../AppShell.module.css";
import type { ResolvedAppShellModel } from "../foundation";

export interface AppShellFooterProps {
  model: ResolvedAppShellModel;
  onNavigate?: (path: string) => void;
}

export const AppShellFooter: React.FC<AppShellFooterProps> = ({ model, onNavigate }) => {
  if (!model.footerEnabled) return null;

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        {model.footerItems.map((item) => (
          <a className={styles.navLink} href={item.routePath} key={item.key} onClick={(event) => handleAppShellNavigation(event, item, onNavigate)}>
            {item.label}
          </a>
        ))}
      </div>
    </footer>
  );
};
