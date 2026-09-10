import React from "react";
import { Inline, Stack } from "@foundation/ui/Layout";
import { SectionContainer } from "@foundation/ui/SectionContainer";
import { Surface } from "@foundation/ui/Surface";
import { Text } from "@foundation/ui/Text";
import { TrashIcon } from "@foundation/ui/Icon/AppIcons";
import { adminPtBR } from "@/locales/pt-BR";
import { trashConfig } from "@/manifest/pages/trash.config";
import styles from "./TrashPage.module.css";

export interface TrashPageProps {
  config?: typeof trashConfig;
}

export const TrashPage: React.FC<TrashPageProps> = ({ config = trashConfig }) => {
  const items = config?.items || [];

  return (
    <div className={styles.page}>
      <SectionContainer atmosphere="transparent" usefulColumns={20} heightRecipe="auto">
        <Stack className={styles.content} gap="lg">
          <Stack gap="xs">
            <Inline align="center" className={styles.titleLine} gap="sm" wrap={false}>
              <TrashIcon aria-hidden="true" size={32} />
              <Text as="h1" variant="h1">
                {adminPtBR.lixeira.title}
              </Text>
            </Inline>
            <Text tone="muted" variant="body">
              {adminPtBR.lixeira.subtitle}
            </Text>
          </Stack>

          <Surface className={styles.surface}>
            {items.length === 0 ? (
              <div className={styles.emptyState}>{adminPtBR.lixeira.emptyText}</div>
            ) : (
              <div className={styles.tableScroller}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>{adminPtBR.lixeira.tableHeaders.title}</th>
                      <th>{adminPtBR.lixeira.tableHeaders.type}</th>
                      <th>{adminPtBR.lixeira.tableHeaders.deletedBy}</th>
                      <th>{adminPtBR.lixeira.tableHeaders.deletedAt}</th>
                      <th>{adminPtBR.lixeira.tableHeaders.retention}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className={styles.titleCell}>{item.title}</td>
                        <td className={styles.typeCell}>{item.entityType}</td>
                        <td className={styles.mutedCell}>{item.deletedBy}</td>
                        <td className={styles.mutedCell}>{item.deletedAt}</td>
                        <td className={styles.retentionCell}>{item.daysRemaining} dias restantes</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Surface>
        </Stack>
      </SectionContainer>
    </div>
  );
};
