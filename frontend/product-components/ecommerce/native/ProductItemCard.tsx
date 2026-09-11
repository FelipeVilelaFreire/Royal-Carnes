import React from "react";
import { Button } from "@foundation/native/client-ui/Button";
import { Stack } from "@foundation/native/client-ui/Layout";
import { Surface } from "@foundation/native/client-ui/Surface";
import { Text } from "@foundation/native/client-ui/Text";

export interface ProductItemCardProps {
  actionLabel?: string;
  description?: string;
  formattedPrice?: string;
  image?: string;
  name: string;
  onAction?: () => void;
}

export const ProductItemCard: React.FC<ProductItemCardProps> = ({
  actionLabel,
  description,
  formattedPrice,
  name,
  onAction,
}) => (
  <Surface>
    <Stack>
      <Text variant="h3">{name}</Text>
      {description ? <Text tone="muted">{description}</Text> : null}
      {formattedPrice ? <Text weight="bold">{formattedPrice}</Text> : null}
      {actionLabel ? <Button onAction={onAction}>{actionLabel}</Button> : null}
    </Stack>
  </Surface>
);
