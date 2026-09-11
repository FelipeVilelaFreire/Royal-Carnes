import React from "react";
import { Inline, Stack } from "@foundation/ui/web/Layout";
import { SectionContainer } from "@foundation/ui/web/SectionContainer";
import { Surface } from "@foundation/ui/web/Surface";
import { Text } from "@foundation/ui/web/Text";
import { CheckIcon } from "@foundation/ui/web/Icon/AppIcons";
import { adminPtBR } from "@/locales/pt-BR";
import { historyConfig } from "@/manifest/pages/history.config";
import styles from "./HistoryPage.module.css";

export interface HistoryPageProps {
  config?: typeof historyConfig;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ config = historyConfig }) => {
  const events = config?.events || [];

  return (
    <div className={styles.page}>
      <SectionContainer atmosphere="transparent" usefulColumns={20} heightRecipe="auto">
        <Stack className={styles.content} gap="lg">
          <Stack gap="xs">
            <Text as="h1" variant="h1">
              {adminPtBR.historico.title}
            </Text>
            <Text tone="muted" variant="body">
              {adminPtBR.historico.subtitle}
            </Text>
          </Stack>

          <Surface className={styles.surface}>
            <div className={styles.tableScroller}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{adminPtBR.historico.tableHeaders.event}</th>
                    <th>{adminPtBR.historico.tableHeaders.description}</th>
                    <th>{adminPtBR.historico.tableHeaders.actor}</th>
                    <th>{adminPtBR.historico.tableHeaders.date}</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td className={styles.eventCell}>
                        <Inline align="center" gap="sm" wrap={false}>
                          <CheckIcon aria-hidden="true" size={16} />
                          {event.title}
                        </Inline>
                      </td>
                      <td>{event.description}</td>
                      <td className={styles.mutedCell}>{event.actor}</td>
                      <td className={styles.mutedCell}>{event.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Surface>
        </Stack>
      </SectionContainer>
    </div>
  );
};
