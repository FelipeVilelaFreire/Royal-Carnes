"use client";

import React from "react";
import { Button } from "@foundation/ui/web/Button";
import { Text } from "@foundation/ui/web/Text";
import { useHomeVitrine } from "@royalprime/client/features/home";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import { useClientApiConfig } from "@royalprime/client/runtime/ClientApiProvider";
import { clientRoutes } from "@royalprime/client/manifest/routes";
import { HomeHero } from "./sections/HomeHero/HomeHero";
import { CollectionRail } from "./sections/CollectionRail/CollectionRail";
import styles from "./HomeView.module.css";

export interface HomeViewProps {
  isAuthenticated?: boolean;
  onNavigate?: (path: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const apiConfig = useClientApiConfig();
  const strings = useClientStrings().home.vitrine.home;
  const home = useHomeVitrine({ apiConfig });

  return (
    <main className={styles.root}>
      <HomeHero
        collection={home.viewModel.heroCollection}
        onExplore={() => onNavigate?.("/catalogo")}
        onSubscribe={() => onNavigate?.(clientRoutes.produtos)}
        strings={strings.hero}
      />
      {home.viewModel.featuredCollection || home.viewModel.secondaryCollections.length ? (
        <CollectionRail
          featuredCollection={home.viewModel.featuredCollection}
          onExplore={() => onNavigate?.(clientRoutes.catalogo)}
          secondaryCollections={home.viewModel.secondaryCollections}
          strings={strings.collectionRail}
        />
      ) : null}
      {!home.isLoading && home.error ? (
        <section className={styles.feedback}>
          <Text as="h2" variant="h2">{strings.states.errorTitle}</Text>
          <Text tone="textMuted">{strings.states.errorDescription}</Text>
          <Button appearance="solid" onClick={() => void home.reload()} size="md" tone="neutral">
            {strings.states.retry}
          </Button>
        </section>
      ) : null}
      {!home.isLoading && !home.error && !home.viewModel.heroCollection ? (
        <section className={styles.feedback}>
          <Text as="h2" variant="h2">{strings.states.emptyTitle}</Text>
          <Text tone="textMuted">{strings.states.emptyDescription}</Text>
        </section>
      ) : null}
    </main>
  );
};
