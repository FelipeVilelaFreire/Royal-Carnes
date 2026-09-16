import React from "react";
import { Card } from "@foundation/ui/web/Card";
import { Stack } from "@foundation/ui/web/Layout";
import { Text } from "@foundation/ui/web/Text";
import type { ApiErrorEnvelope } from "@shared-core";
import type { AdminTranslate } from "@/locales/i18n";
import styles from "./ListPage.module.css";

export const ListPageFeedback: React.FC<{ error?: ApiErrorEnvelope | null; t: AdminTranslate }> = ({ error, t }) => error ? <Card className={styles.errorCard} size="md"><Stack gap="xs"><Text as="strong" variant="body">{t("standard.apiErrorTitle")}</Text><Text tone="muted" variant="caption">{error.status ? `${t("standard.apiErrorStatus")} ${error.status}` : t("standard.apiErrorUnknown")}{error.message ? ` - ${error.message}` : ""}</Text></Stack></Card> : null;
