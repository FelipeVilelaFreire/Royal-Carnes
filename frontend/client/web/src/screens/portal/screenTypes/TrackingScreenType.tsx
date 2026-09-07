import React from "react";
import { Text } from "@foundation/ui/Text";
import { Surface } from "@foundation/ui/Surface";
import { CheckIcon } from "@foundation/ui/Icon/AppIcons";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import styles from "./PortalScreenTypes.module.css";

export const TrackingScreenType: React.FC = () => {
  const strings = useClientStrings().portal.trackingScreen;

  return (
    <div className={styles.root}>
      <Surface appearance="soft" className={styles.panel}>
        <div className={styles.rowBetween}>
          <div className={styles.header}>
            <Text variant="h2" weight="bold">
              {strings.title}
            </Text>
            <Text tone="muted" variant="body">
              {strings.carrier}
            </Text>
          </div>
          <Surface appearance="soft" className={styles.trackingCode}>
            <Text as="span" tone="muted" variant="caption">
              {strings.trackingCodeLabel}{" "}
            </Text>
            <Text as="strong" tone="primary" variant="caption" weight="bold">
              {strings.trackingCode}
            </Text>
          </Surface>
        </div>

        <div className={styles.timeline}>
          {strings.steps.map((step, index) => {
            const state = step.status === "completed" ? "done" : step.status === "active" ? "current" : "pending";
            return (
              <div className={styles.timelineStep} key={index}>
                <span className={styles.timelineDot} data-state={state}>
                  {state === "done" ? <CheckIcon size={16} color="currentColor" /> : index + 1}
                </span>
                <div className={styles.header}>
                  <Text tone={state === "current" ? "primary" : "inherit"} variant="h3" weight="bold">
                    {step.label}
                  </Text>
                  <Text tone="muted" variant="caption">
                    {step.date}
                  </Text>
                </div>
              </div>
            );
          })}
        </div>
      </Surface>
    </div>
  );
};
