import React from "react";
import { SearchIcon } from "@foundation/ui/web/Icon/AppIcons";
import { Button } from "@foundation/ui/web/Button";
import { EmptyState } from "@foundation/ui/web/EmptyState";
import { Stack } from "@foundation/ui/web/Layout";
import { Surface } from "@foundation/ui/web/Surface";
import { Text } from "@foundation/ui/web/Text";
import type { CatalogoContentModel } from "@royalprime/client/features/catalogo";
import styles from "./CatalogoFeedback.module.css";

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
    return <EmptyState className={styles.emptyPanel} description={strings.loadingDescription} framed size="regular" title={strings.loadingTitle} />;
  }

  if (catalogo.error) {
    return (
      <EmptyState
        actions={<Button appearance="solid" onClick={() => void catalogo.reload()} size="sm" tone="primary" type="button">{strings.retry}</Button>}
        className={styles.emptyPanel}
        description={strings.errorDescription}
        framed
        size="regular"
        title={strings.errorTitle}
      />
    );
  }

  if (catalogo.filteredProducts.length) return null;

  return (
    <Surface appearance="solid" className={styles.emptyPanel}>
      <Stack align="center" gap="md">
        <span aria-hidden="true" className={styles.emptyIcon}><SearchIcon size={24} /></span>
        <Stack align="center" gap="xs">
          <Text as="h2" className={styles.emptyTitle} tone="inherit" variant="h3">{strings.emptyTitle}</Text>
          <Text className={styles.emptyDescription} tone="inherit">{strings.emptyDescription}</Text>
        </Stack>
        <Button appearance="solid" onClick={catalogo.clearFilters} size="sm" tone="primary" type="button">{strings.clearFilters}</Button>
      </Stack>
    </Surface>
  );
};
