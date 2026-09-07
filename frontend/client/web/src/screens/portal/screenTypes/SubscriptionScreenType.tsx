import React from "react";
import { Badge } from "@foundation/ui/Badge";
import { Button } from "@foundation/ui/Button";
import { Text } from "@foundation/ui/Text";
import { Surface } from "@foundation/ui/Surface";
import { CheckIcon } from "@foundation/ui/Icon/AppIcons";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import styles from "./PortalScreenTypes.module.css";

export const SubscriptionScreenType: React.FC = () => {
  const strings = useClientStrings().portal.subscriptionScreen;

  return (
    <div className={styles.root}>
      <Surface appearance="glass" className={`${styles.panel} ${styles.heroPanel}`} tone="primary">
        <div className={styles.header}>
          <div className={styles.row}>
            <Badge appearance="soft" tone="success">
              {strings.badge}
            </Badge>
            <Text as="span" tone="muted" variant="caption">
              {strings.boxWeight}
            </Text>
          </div>

          <Text variant="h1" weight="bold">
            {strings.activePlanTitle}
          </Text>

          <Text tone="primary" variant="body" weight="bold">
            {strings.nextDispatch}
          </Text>
        </div>

        <div className={styles.actions}>
          <Button appearance="solid" tone="primary" size="md">
            {strings.actions.changePlan}
          </Button>
          <Button appearance="outline" tone="neutral" size="md">
            {strings.actions.pause}
          </Button>
        </div>
      </Surface>

      <div>
        <Text as="h2" className={styles.sectionHeader} variant="h2" weight="bold">
          {strings.boxItemsTitle}
        </Text>

        <div className={styles.grid}>
          {strings.items.map((item, index) => (
            <Surface appearance="soft" className={`${styles.card} ${styles.cardCompact}`} key={index}>
              <div className={styles.rowBetween}>
                <CheckIcon size={28} color="currentColor" />
                <Badge appearance="soft" tone="primary">
                  {item.weight}
                </Badge>
              </div>
              <Text variant="h3" weight="bold">
                {item.name}
              </Text>
              <Text tone="muted" variant="caption">
                {item.detail}
              </Text>
            </Surface>
          ))}
        </div>
      </div>
    </div>
  );
};
