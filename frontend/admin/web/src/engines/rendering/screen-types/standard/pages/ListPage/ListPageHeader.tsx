import React from "react";
import { Badge } from "@foundation/ui/web/Badge";
import { Button } from "@foundation/ui/web/Button";
import { Inline, Stack } from "@foundation/ui/web/Layout";
import { Text } from "@foundation/ui/web/Text";
import { CloseIcon } from "@foundation/ui/web/Icon/AppIcons";
import type { AdminTranslate } from "@/locales/i18n";
import type { AdminStandardListViewModel } from "@/view-models/standard.view-model";
import styles from "./ListPage.module.css";

interface ListPageHeaderProps { entityName: string; isLoading: boolean; onCreateRow?: () => void; t: AdminTranslate; viewModel: AdminStandardListViewModel; }

export const ListPageHeader: React.FC<ListPageHeaderProps> = ({ entityName, isLoading, onCreateRow, t, viewModel }) => (
  <Inline align="start" className={styles.header} justify="between" wrap>
    <Stack className={styles.heading} gap="xs"><Inline align="center" gap="sm" wrap><Text as="h1" variant="h1">{t(viewModel.titleKey || "", entityName)}</Text><Badge appearance="soft" indicator={viewModel.filteredRowsTotal > 0} tone="neutral">{t("standard.resultsCount", undefined, { count: viewModel.filteredRowsTotal })}</Badge>{isLoading ? <Badge appearance="soft" tone="neutral">{t("standard.loading")}</Badge> : null}</Inline>{viewModel.subtitleKey ? <Text tone="muted" variant="body">{t(viewModel.subtitleKey)}</Text> : null}</Stack>
    {onCreateRow && viewModel.actionLabelKey ? <Button className={styles.createButton} appearance="glass" icon={<CloseIcon aria-hidden="true" className={styles.createIcon} />} onClick={onCreateRow} size="md" tone="primary">{t(viewModel.actionLabelKey, entityName)}</Button> : null}
  </Inline>
);
