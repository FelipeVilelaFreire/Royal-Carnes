import React from "react";
import { Stack } from "@foundation/ui/web/Layout";
import { Text } from "@foundation/ui/web/Text";
import type { settingsConfig } from "@/manifest/pages/settings.config";
import styles from "./SettingsPage.module.css";

export const SettingsHeader: React.FC<{ config: typeof settingsConfig; t: (key: string, fallback?: string) => string }> = ({ config, t }) => <Stack className={styles.header} gap="xs"><Stack className={styles.titleLine} gap="2xs"><Text as="h1" variant="h1">{t(config.titleKey)}</Text></Stack><Text tone="muted" variant="body">{t(config.subtitleKey)}</Text></Stack>;
