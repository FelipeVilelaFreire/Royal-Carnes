"use client";

import React from "react";
import { Button } from "../../../ui/Button";
import { Text } from "../../../ui/Text";
import styles from "../AppShell.module.css";
import type { AppShellBrand as AppShellBrandModel } from "../foundation";

export interface AppShellBrandProps {
  brand: Required<AppShellBrandModel>;
  collapsed?: boolean;
  display?: "logoText" | "text" | "logo";
  onNavigate?: (path: string) => void;
}

export const AppShellBrand: React.FC<AppShellBrandProps> = ({ brand, collapsed = false, display = "logoText", onNavigate }) => (
  <Button
    appearance="transparent"
    className={[
      styles.brand,
      collapsed ? styles.brandCollapsed : "",
      display === "text" ? styles.brandTextOnly : "",
      display === "logo" ? styles.brandLogoOnly : "",
    ].filter(Boolean).join(" ")}
    onClick={() => onNavigate?.(brand.routePath)}
    size="md"
    type="button"
  >
    {display !== "text" ? <span className={styles.brandLogoFrame}>
      {brand.logo ? (
        <img className={styles.brandLogo} src={brand.logo} alt={brand.name} />
      ) : (
        <Text as="span" variant="caption" tone="inherit" weight="var(--theme--typography-bold)">{brand.name.slice(0, 1).toUpperCase()}</Text>
      )}
    </span> : null}
    {!collapsed && display !== "logo" && (
      <span className={styles.brandText}>
        <Text as="span" variant="h3" tone="inherit" size="var(--app-shell-brand-name-size)" weight="var(--theme--typography-bold)" lineHeight="var(--theme--typography-lineHeightLg)">
          {brand.name}
        </Text>
        {brand.kicker && <span className={styles.brandKicker}>{brand.kicker}</span>}
      </span>
    )}
  </Button>
);
