import React from "react";
import { AvatarCell } from "@foundation/ui/web/Avatar";
import { Badge } from "@foundation/ui/web/Badge";
import { Button } from "@foundation/ui/web/Button";
import { Inline, Stack } from "@foundation/ui/web/Layout";
import { Text } from "@foundation/ui/web/Text";
import { ArrowBackIcon, CheckIcon, CloseIcon, EditIcon, TrashIcon } from "@foundation/ui/web/Icon/AppIcons";
import type { AdminTranslate } from "@/locales/i18n";
import type { AdminStandardDetailViewModel } from "@/view-models/standard.view-model";
import styles from "./DetailPage.module.css";

type DetailHeaderEntry = AdminStandardDetailViewModel["headerMeta"][number];

function resolveHeaderValue(entry: DetailHeaderEntry, t: AdminTranslate): string {
  if (entry.valueType === "optionLabel") {
    const option = entry.options?.find((candidate) => String(candidate.value) === String(entry.rawValue));
    return option?.label || t(option?.labelKey || "", entry.value);
  }
  if (entry.valueType === "translationKey") return t(entry.value, "");
  return entry.value;
}

function resolveStatusTone(value: unknown, explicitTone?: DetailHeaderEntry["statusTone"]): "danger" | "neutral" | "primary" | "success" | "warning" {
  if (explicitTone) return explicitTone;
  const status = String(value || "").toLowerCase();
  if (["archived", "blocked", "canceled", "cancelled", "inactive"].includes(status)) return "danger";
  if (["draft", "paused", "pending"].includes(status)) return "warning";
  if (["active", "approved", "ready"].includes(status)) return "success";
  return "neutral";
}

interface DetailHeaderProps {
  image?: string;
  isEditing: boolean;
  isSubmitting: boolean;
  onBack: () => void;
  onCancelEdit?: () => void;
  onEdit?: () => void;
  onRequestDelete?: () => void;
  onSaveEdit?: () => void;
  t: AdminTranslate;
  viewModel: AdminStandardDetailViewModel;
}

export const DetailHeader: React.FC<DetailHeaderProps> = ({
  image,
  isEditing,
  isSubmitting,
  onBack,
  onCancelEdit,
  onEdit,
  onRequestDelete,
  onSaveEdit,
  t,
  viewModel,
}) => (
  <Inline align="center" className={styles.detailHeader} justify="between" wrap>
    <Inline align="center" className={styles.identity} gap="sm" wrap={false}>
      <Button aria-label={t("common.back")} appearance="soft" className={styles.backButton} icon={<ArrowBackIcon aria-hidden="true" />} iconPosition="only" onClick={onBack} size="sm" tone="neutral">
        {t("common.back")}
      </Button>

      <AvatarCell image={image} name={viewModel.displayName} showName={false} size="lg" />
      <Stack className={styles.identityCopy} gap="2xs">
        {viewModel.headerMeta.length || viewModel.headerStatus ? (
          <Inline className={styles.headerMeta} gap="sm" wrap>
            {viewModel.headerMeta.map((entry) => <Text as="span" key={entry.key} tone="muted" variant="caption">{resolveHeaderValue(entry, t)}</Text>)}
            {!isEditing && viewModel.headerStatus ? <Badge appearance="soft" indicator tone={resolveStatusTone(viewModel.headerStatus.rawValue, viewModel.headerStatus.statusTone)}>{resolveHeaderValue(viewModel.headerStatus, t)}</Badge> : null}
          </Inline>
        ) : null}
      </Stack>
    </Inline>

    {isEditing ? (
      <Inline align="center" className={styles.headerActions} gap="sm" wrap>
        <Button appearance="outline" icon={<CloseIcon aria-hidden="true" />} onClick={onCancelEdit} size="md" tone="neutral">{t("common.cancel")}</Button>
        <Button appearance="glass" className={styles.primaryAction} disabled={isSubmitting} icon={<CheckIcon aria-hidden="true" />} onClick={onSaveEdit} size="md" tone="neutral">
          {isSubmitting ? t("standard.saving") : t("common.save")}
        </Button>
      </Inline>
    ) : onEdit || onRequestDelete ? (
      <Inline align="center" className={styles.headerActions} gap="sm" wrap>
        {onEdit ? <Button appearance="glass" className={styles.primaryAction} icon={<EditIcon aria-hidden="true" />} onClick={onEdit} size="md" tone="neutral">{t("common.edit")}</Button> : null}
        {onRequestDelete ? <Button appearance="outline" icon={<TrashIcon aria-hidden="true" />} onClick={onRequestDelete} size="md" tone="danger">{t("common.remove")}</Button> : null}
      </Inline>
    ) : null}
  </Inline>
);
