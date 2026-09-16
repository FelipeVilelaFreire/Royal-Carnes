import React from "react";
import { Inline, Stack } from "@foundation/ui/web/Layout";
import { Text } from "@foundation/ui/web/Text";
import type { AdminTranslate } from "@/locales/i18n";
import type { DashboardConfig } from "../config/types";
import styles from "./DashboardPage.module.css";

export const DashboardHeader: React.FC<{ config: DashboardConfig; t: AdminTranslate }> = ({ config, t }) => <Inline align="start" justify="between" wrap><Stack className={styles.heading} gap="xs">{config.headerBadge ? <span className={styles.headerEyebrow}><span aria-hidden="true" className={styles.headerEyebrowDot} /><Text as="span" tone="muted" variant="caption" weight="bold">{t(config.headerBadge.labelKey)}</Text></span> : null}<Text as="h1" variant="h1">{t(config.titleKey)}</Text><Text tone="muted" variant="body">{t(config.subtitleKey)}</Text></Stack></Inline>;
