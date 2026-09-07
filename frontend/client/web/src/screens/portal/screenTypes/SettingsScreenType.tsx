import React from "react";
import { Button } from "@foundation/ui/Button";
import { Text } from "@foundation/ui/Text";
import { Surface } from "@foundation/ui/Surface";
import { SettingsIcon, TruckIcon } from "@foundation/ui/Icon/AppIcons";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import styles from "./PortalScreenTypes.module.css";

export const SettingsScreenType: React.FC = () => {
  const strings = useClientStrings().portal.settingsScreen;

  return (
    <div className={`${styles.root} ${styles.rootNarrow}`}>
      <Text variant="h2" weight="bold">
        {strings.title}
      </Text>

      <Surface appearance="soft" className={`${styles.panel} ${styles.cardCompact}`}>
        <Text className={styles.inlineTitle} tone="primary" variant="h3" weight="bold">
          <TruckIcon size={18} color="currentColor" /> {strings.addressTitle}
        </Text>
        <Text variant="body">
          {strings.address}
        </Text>
      </Surface>

      <Surface appearance="soft" className={`${styles.panel} ${styles.cardCompact}`}>
        <Text className={styles.inlineTitle} tone="primary" variant="h3" weight="bold">
          <SettingsIcon size={18} color="currentColor" /> {strings.paymentTitle}
        </Text>
        <Text variant="body">
          {strings.paymentCard}
        </Text>
      </Surface>

      <div>
        <Button appearance="solid" tone="primary" size="md">
          {strings.ctaSave}
        </Button>
      </div>
    </div>
  );
};
