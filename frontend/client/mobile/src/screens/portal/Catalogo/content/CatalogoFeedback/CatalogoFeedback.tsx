import React from "react";
import { Button } from "@foundation/ui/native/Button";
import { Stack } from "@foundation/ui/native/Layout";
import { Surface } from "@foundation/ui/native/Surface";
import { Text } from "@foundation/ui/native/Text";
import type { CatalogoContentModel } from "@royalprime/client/features/catalogo";
import { catalogoFeedbackTokens } from "./styles";

interface CatalogoFeedbackProps {
  catalogo: CatalogoContentModel;
  strings: {
    clearFilters: string;
    emptyDescription: string;
    emptyTitle: string;
    errorDescription: string;
    errorTitle: string;
    loadingDescription: string;
    loadingTitle: string;
    retry: string;
  };
}

export const CatalogoFeedback: React.FC<CatalogoFeedbackProps> = ({ catalogo, strings }) => {
  if (catalogo.isLoading) {
    return (
      <Surface appearance="soft">
        <Stack gap={catalogoFeedbackTokens.gap}>
          <Text variant="h3">{strings.loadingTitle}</Text>
          <Text tone="muted">{strings.loadingDescription}</Text>
        </Stack>
      </Surface>
    );
  }

  if (catalogo.error) {
    return (
      <Surface appearance="soft" tone="danger">
        <Stack gap={catalogoFeedbackTokens.gap}>
          <Text variant="h3">{strings.errorTitle}</Text>
          <Text tone="muted">{strings.errorDescription}</Text>
          <Button onAction={() => void catalogo.reload()}>{strings.retry}</Button>
        </Stack>
      </Surface>
    );
  }

  return (
    <Surface appearance="soft">
      <Stack gap={catalogoFeedbackTokens.gap}>
        <Text variant="h3">{strings.emptyTitle}</Text>
        <Text tone="muted">{strings.emptyDescription}</Text>
        <Button onAction={catalogo.clearFilters}>{strings.clearFilters}</Button>
      </Stack>
    </Surface>
  );
};
