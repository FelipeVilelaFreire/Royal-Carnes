"use client";

import React from "react";
import { Text } from "../../../ui/Text";
import styles from "../AppShell.module.css";
import type { AppShellBrand as AppShellBrandModel } from "../foundation";

export interface AppShellBrandProps {
  brand: Required<AppShellBrandModel>;
  collapsed?: boolean;
  onNavigate?: (path: string) => void;
}

export const AppShellBrand: React.FC<AppShellBrandProps> = ({ brand, collapsed = false, onNavigate }) => (
  <button
    className={styles.brand}
    onClick={() => onNavigate?.(brand.routePath)}
    style={collapsed ? { border: "0", padding: 0, background: "transparent" } : undefined}
    type="button"
  >
    <span className={styles.brandLogoFrame}>
      {brand.logo ? (
        <img className={styles.brandLogo} src={brand.logo} alt={brand.name} />
      ) : (
        <Text as="span" variant="caption" tone="inherit" weight="800">APP</Text>
      )}
    </span>
    {!collapsed && (
      <span className={styles.brandText}>
        <Text as="span" variant="h3" tone="inherit" style={{ fontSize: "18px", fontWeight: 800, lineHeight: 1.1 }}>
          {brand.name}
        </Text>
        {brand.kicker && <span className={styles.brandKicker}>{brand.kicker}</span>}
      </span>
    )}
  </button>
);
