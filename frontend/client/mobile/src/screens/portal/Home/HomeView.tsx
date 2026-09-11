import React, { useEffect } from "react";
import { useClientCatalog } from "../../../../../shared-core/hooks/useClientCatalog";
import type { useClientStrings } from "../../../../../shared-core/hooks/useClientStrings";
import { Button } from "@foundation/native/client-ui/Button";
import { Container, Stack } from "@foundation/native/client-ui/Layout";
import { Surface } from "@foundation/native/client-ui/Surface";
import { Text } from "@foundation/native/client-ui/Text";

export interface HomeViewProps {
  onNavigate: (path: string) => void;
  strings: ReturnType<typeof useClientStrings>;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, strings: allStrings }) => {
  const strings = allStrings.home.vitrine;
  const catalog = useClientCatalog();

  useEffect(() => {
    void catalog.load().catch(() => undefined);
  }, [catalog.load]);

  return (
    <Container>
      <Stack gap="lg">
        <Stack gap="sm">
          <Text variant="h3">{strings.hero.badge}</Text>
          <Text variant="h3">{strings.hero.guestTitle}</Text>
          <Text tone="muted">{strings.hero.guestDescription}</Text>
        </Stack>
        <Button onAction={() => onNavigate("/cortes")}>{strings.hero.primaryAction}</Button>
        <Button appearance="outline" tone="neutral" onAction={() => onNavigate("/montar-box")}>{strings.hero.secondaryAction}</Button>
        <Stack gap="sm">
          <Text variant="h3">{strings.products.title}</Text>
          {catalog.isLoading ? <Text tone="muted">{allStrings.cortes.catalogPage.loadingDescription}</Text> : null}
          {catalog.error ? <Text tone="danger">{allStrings.cortes.catalogPage.errorDescription}</Text> : null}
          {!catalog.isLoading && !catalog.error && catalog.viewModel.products.length === 0 ? (
            <Text tone="muted">{allStrings.cortes.catalogPage.emptyDescription}</Text>
          ) : null}
          {catalog.viewModel.products.slice(0, 3).map((product) => (
            <Surface key={product.id} appearance="soft" padding="md">
              <Stack gap="xs">
                <Text variant="h3">{product.name}</Text>
                {product.description ? <Text tone="muted">{product.description}</Text> : null}
                {product.priceLabel ? <Text tone="primary">{product.priceLabel}</Text> : null}
                <Button appearance="outline" tone="neutral" onAction={() => onNavigate("/cortes")}>
                  {strings.products.cardAction}
                </Button>
              </Stack>
            </Surface>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
};
