import React from "react";
import { AvatarCell } from "@foundation/ui/Avatar";
import { Button } from "@foundation/ui/Button";
import { Card } from "@foundation/ui/Card";
import { Grid, Inline, Stack } from "@foundation/ui/Layout";
import { SectionContainer } from "@foundation/ui/SectionContainer";
import { SegmentedControl } from "@foundation/ui/SegmentedControl";
import { Text } from "@foundation/ui/Text";
import { ArrowBackIcon, EditIcon } from "@foundation/ui/Icon/AppIcons";
import type { AdminTranslate } from "@/locales/i18n";
import type { AdminStandardDetailViewModel } from "@/view-models/standard.view-model";
import styles from "./DetailPage.module.css";

export interface DetailPageProps {
  entityName: string;
  image?: string;
  onBack: () => void;
  onEdit?: () => void;
  onTabChange: (tab: string) => void;
  t: AdminTranslate;
  viewModel: AdminStandardDetailViewModel;
}

export const DetailPage: React.FC<DetailPageProps> = ({
  entityName,
  image,
  onBack,
  onEdit,
  onTabChange,
  t,
  viewModel,
}) => {
  return (
    <div className={styles.page}>
      <SectionContainer atmosphere="solid" usefulColumns={20} heightRecipe="auto">
        <Stack className={styles.content} gap="lg">
          <Inline align="center" justify="between" wrap>
            <Inline align="center" gap="md" wrap>
              <Button
                appearance="outline"
                icon={<ArrowBackIcon aria-hidden="true" />}
                onClick={onBack}
                size="sm"
                tone="neutral"
              >
                {t("common.back")}
              </Button>

              <Inline align="center" gap="md" wrap={false}>
                <AvatarCell image={image} name={viewModel.displayName} showName={false} size="lg" />
                <Text as="h1" variant="h1">
                  {viewModel.displayName}
                </Text>
              </Inline>
            </Inline>

            {onEdit ? (
              <Button
                appearance="solid"
                icon={<EditIcon aria-hidden="true" />}
                onClick={onEdit}
                size="md"
                tone="neutral"
              >
                {t("common.edit")} {entityName}
              </Button>
            ) : null}
          </Inline>

          <SegmentedControl
            items={viewModel.tabs.map((tab) => ({
              key: tab.id,
              label: t(tab.labelKey),
            }))}
            onChange={onTabChange}
            value={viewModel.activeTab}
            width="content"
          />

          <Card className={styles.detailCard} size="lg">
            {viewModel.activeTab === "summary" ? (
              <Grid className={styles.detailGrid} columns={3} gap="md">
                {viewModel.entries.length ? (
                  viewModel.entries.map((entry) => (
                    <div className={styles.detailEntry} key={entry.key}>
                      <Text as="span" className={styles.detailKey} tone="muted" variant="caption" weight="bold">
                        {entry.key}
                      </Text>
                      <Text as="strong" tone="default" variant="body" weight="var(--theme--typography-semibold)">
                        {entry.value}
                      </Text>
                    </div>
                  ))
                ) : (
                  <Text tone="muted" variant="body">
                    {t("details.emptySummary")}
                  </Text>
                )}
              </Grid>
            ) : null}

            {viewModel.activeTab === "specs" ? (
              <Text tone="muted" variant="body">
                {t("details.specsContent")}
              </Text>
            ) : null}

            {viewModel.activeTab === "history" ? (
              <Text tone="muted" variant="body">
                {t("details.historyContent")}
              </Text>
            ) : null}
          </Card>
        </Stack>
      </SectionContainer>
    </div>
  );
};
