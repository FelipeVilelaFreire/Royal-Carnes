import React from "react";
import { Card } from "@foundation/ui/web/Card";
import { Inline, Stack } from "@foundation/ui/web/Layout";
import { BoxIcon, CartIcon, SettingsIcon, StoreIcon, TruckIcon, UserIcon } from "@foundation/ui/web/Icon/AppIcons";
import { Text } from "@foundation/ui/web/Text";
import type { AdminTranslate } from "@/locales/i18n";
import type { AdminStandardDetailSectionViewModel } from "@/view-models/standard.view-model";
import styles from "./DetailPage.module.css";

const sectionIcons = {
  box: BoxIcon,
  catalog: StoreIcon,
  commerce: CartIcon,
  delivery: TruckIcon,
  identity: UserIcon,
  settings: SettingsIcon,
} as const;

interface DetailSectionCardProps {
  children: React.ReactNode;
  section: AdminStandardDetailSectionViewModel;
  t: AdminTranslate;
}

export const DetailSectionCard: React.FC<DetailSectionCardProps> = ({ children, section, t }) => {
  const Icon = section.iconIntent ? sectionIcons[section.iconIntent as keyof typeof sectionIcons] : undefined;
  return (
    <Card className={styles.detailSectionCard} size="md">
      <Stack className={styles.detailSection} gap="xl">
        {section.titleKey ? (
          <Inline align="center" className={styles.sectionHeader} gap="sm">
            {Icon ? <Icon aria-hidden="true" className={styles.sectionIcon} /> : null}
            <Text as="h2" className={styles.sectionTitle} variant="h3">{t(section.titleKey)}</Text>
          </Inline>
        ) : null}
        <div className={styles.sectionContent}>{children}</div>
      </Stack>
    </Card>
  );
};
