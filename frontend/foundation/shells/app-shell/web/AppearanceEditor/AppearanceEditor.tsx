"use client";

import React from "react";
import { Button, Modal } from "../../../../ui/web";
import styles from "./AppearanceEditor.module.css";

export interface AppearanceEditorProps {
  config: any;
  experiments?: Array<{ group?: string; id: string; path: string }>;
  onChange: (next: Record<string, string>) => void;
  onClose: () => void;
  onNavigate?: (path: string) => void;
  open: boolean;
  strings: any;
  value: Record<string, string>;
}

export const AppearanceEditor: React.FC<AppearanceEditorProps> = ({ experiments = [], onClose, onNavigate, open, strings }) => {
  const groupedExperiments = experiments.reduce<Array<{ group: string; items: Array<{ id: string; path: string }> }>>(
    (groups, experiment) => {
      const group = experiment.group || "other";
      const currentGroup = groups.find((entry) => entry.group === group);
      const item = { id: experiment.id, path: experiment.path };

      if (currentGroup) {
        currentGroup.items.push(item);
      } else {
        groups.push({ group, items: [item] });
      }

      return groups;
    },
    [],
  );

  return (
    <Modal closeLabel={strings.close} description={strings.description} onClose={onClose} open={open} size="full" title={strings.title} variant="center">
      <div className={styles.layout}>
        {experiments.length ? (
          <section className={styles.experiments}>
            {groupedExperiments.map(({ group, items }) => {
              const groupStrings = strings.experiments.groups?.[group];

              return (
                <section className={styles.experimentGroup} key={group}>
                  <div className={styles.experimentGroupHeader}>
                    <h2>{groupStrings?.title || group}</h2>
                    {groupStrings?.description ? <p>{groupStrings.description}</p> : null}
                  </div>
                  <div className={styles.experimentGrid}>
                    {items.map((experiment) => (
                      <Button
                        appearance="soft"
                        className={styles.experimentButton}
                        key={experiment.id}
                        onClick={() => {
                          onClose();
                          onNavigate?.(experiment.path);
                        }}
                        tone="neutral"
                        type="button"
                      >
                        {strings.experiments.items[experiment.id] || experiment.id}
                      </Button>
                    ))}
                  </div>
                </section>
              );
            })}
          </section>
        ) : null}
      </div>
    </Modal>
  );
};
