import React from "react";
import { Badge } from "@foundation/ui/Badge";
import { Button } from "@foundation/ui/Button";
import { Text } from "@foundation/ui/Text";
import { Surface } from "@foundation/ui/Surface";
import { StoreIcon } from "@foundation/ui/Icon/AppIcons";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import styles from "./PortalScreenTypes.module.css";

export const CatalogScreenType: React.FC = () => {
  const strings = useClientStrings().portal.catalogScreen;

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Badge appearance="soft" tone="primary">
          {strings.badge}
        </Badge>
        <Text variant="h2" weight="bold">
          {strings.title}
        </Text>
      </div>

      <div className={styles.grid}>
        {strings.items.map((item, index) => (
          <Surface appearance="soft" className={styles.card} key={index}>
            <div className={styles.cardBody}>
              <div className={styles.rowBetween}>
                <StoreIcon size={32} color="currentColor" />
                <Badge appearance="soft" tone="neutral">
                  {item.weight}
                </Badge>
              </div>
              <Text variant="h3" weight="bold">
                {item.name}
              </Text>
              <div className={styles.priceLine}>
                <Text as="strong" tone="primary" variant="h3">
                  {item.price}
                </Text>
                <Text as="span" className={styles.oldPrice} tone="muted" variant="caption">
                  {item.oldPrice}
                </Text>
              </div>
            </div>
            <Button appearance="solid" tone="primary" size="sm">
              {strings.ctaAdd}
            </Button>
          </Surface>
        ))}
      </div>
    </div>
  );
};
