import React from "react";
import { AvatarCell } from "@foundation/ui/Avatar";
import { Badge } from "@foundation/ui/Badge";
import { Button } from "@foundation/ui/Button";
import { Card } from "@foundation/ui/Card";
import { Input } from "@foundation/ui/Input";
import { Inline, Stack } from "@foundation/ui/Layout";
import { SectionContainer } from "@foundation/ui/SectionContainer";
import { Select } from "@foundation/ui/Select";
import { Text } from "@foundation/ui/Text";
import { EditIcon, SearchIcon } from "@foundation/ui/Icon/AppIcons";
import type { AdminTranslate } from "@/locales/i18n";
import type { AdminStandardListViewModel } from "@/view-models/standard.view-model";
import styles from "./ListPage.module.css";

export interface ListPageProps {
  entityName: string;
  isLoading?: boolean;
  onCreateRow?: () => void;
  onSearchChange: (value: string) => void;
  onSelectRow?: (row: any) => void;
  onSetFilter: (key: string, value: string) => void;
  search: string;
  t: AdminTranslate;
  viewModel: AdminStandardListViewModel;
}

export const ListPage: React.FC<ListPageProps> = ({
  entityName,
  isLoading = false,
  onCreateRow,
  onSearchChange,
  onSelectRow,
  onSetFilter,
  search,
  t,
  viewModel,
}) => {
  return (
    <div className={styles.page}>
      <SectionContainer atmosphere="solid" usefulColumns={20} heightRecipe="auto">
        <Stack className={styles.content} gap="lg">
          <Inline align="start" justify="between" wrap>
            <Stack className={styles.heading} gap="xs">
              <Inline align="center" gap="sm" wrap>
                <Text as="h1" variant="h1">
                  {t(viewModel.titleKey || "", entityName)}
                </Text>
                {isLoading ? <Badge tone="neutral">{t("standard.loading")}</Badge> : null}
              </Inline>
              {viewModel.subtitleKey ? (
                <Text tone="muted" variant="body">
                  {t(viewModel.subtitleKey)}
                </Text>
              ) : null}
            </Stack>

            {onCreateRow ? (
              <Button appearance="solid" onClick={onCreateRow} size="md" tone="neutral">
                {t(viewModel.actionLabelKey || "", entityName)}
              </Button>
            ) : null}
          </Inline>

          <Inline align="center" className={styles.toolbar} gap="md" wrap>
            <Input
              className={styles.searchInput}
              icon={<SearchIcon aria-hidden="true" />}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={t(viewModel.searchPlaceholderKey || "common.searchPlaceholder")}
              type="search"
              value={search}
            />

            {viewModel.filters.map((filter) => (
              <Select
                className={styles.filterSelect}
                key={filter.key}
                onChange={(event) => onSetFilter(filter.key, event.target.value)}
                options={[
                  {
                    label: `${t("common.allFilter")} (${t(filter.labelKey, filter.key)})`,
                    value: "all",
                  },
                  ...filter.options.map((option) => ({
                    label: t(option.labelKey, option.value),
                    value: option.value,
                  })),
                ]}
                value={filter.value}
              />
            ))}
          </Inline>

          <Card className={styles.tableCard} size="lg">
            <div className={styles.tableScroller}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {viewModel.columns.map((column) => (
                      <th key={column.key}>{t(column.labelKey, column.key)}</th>
                    ))}
                    {viewModel.showActions ? <th>{t("common.actions")}</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td className={styles.emptyCell} colSpan={viewModel.emptyColSpan}>
                        {t("standard.loadingRows")}
                      </td>
                    </tr>
                  ) : viewModel.rows.length === 0 ? (
                    <tr>
                      <td className={styles.emptyCell} colSpan={viewModel.emptyColSpan}>
                        {t("common.emptyState")}
                      </td>
                    </tr>
                  ) : (
                    viewModel.rows.map((row, rowIndex) => (
                      <tr key={row.id || row.code || rowIndex} onClick={() => onSelectRow?.(row)}>
                        {viewModel.columns.map((column) => (
                          <td key={column.key}>
                            {column.showAvatar ? (
                              <AvatarCell
                                image={row.image}
                                name={String(row[column.key] || row.name || row.customerName || "")}
                              />
                            ) : column.showMedia ? (
                              <Inline gap="sm" wrap={false}>
                                {row.image ? (
                                  <img
                                    alt={String(row[column.key] || "")}
                                    className={styles.mediaThumb}
                                    src={row.image}
                                  />
                                ) : null}
                                <Text as="span" tone="default" variant="body" weight="var(--theme--typography-bold)">
                                  {String(row[column.key] || "")}
                                </Text>
                              </Inline>
                            ) : column.render ? (
                              column.render(row)
                            ) : (
                              String(row[column.key] ?? "")
                            )}
                          </td>
                        ))}
                        {viewModel.showActions ? (
                          <td>
                            <Button
                              appearance="transparent"
                              icon={<EditIcon aria-hidden="true" />}
                              onClick={(event) => {
                                event.stopPropagation();
                                onSelectRow?.(row);
                              }}
                              size="xs"
                              tone="neutral"
                            >
                              {t("common.edit")}
                            </Button>
                          </td>
                        ) : null}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <Text as="p" className={styles.paginationText} tone="muted" variant="caption">
              {t("common.showing")} <strong>{viewModel.rows.length}</strong> {t("common.of")}{" "}
              <strong>{viewModel.rowsTotal}</strong> {t("common.records")}
            </Text>
          </Card>
        </Stack>
      </SectionContainer>
    </div>
  );
};
