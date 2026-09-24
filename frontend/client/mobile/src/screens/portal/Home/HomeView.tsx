import React from "react";
import { Button } from "@foundation/ui/native/Button";
import { Text, useUi } from "@foundation/ui/native";
import { clientRoutes } from "@royalprime/client/manifest/routes";
import { useHomeVitrine } from "@royalprime/client/features/home";
import { useClientApiConfig } from "@royalprime/client/runtime/ClientApiProvider";
import type { useClientStrings } from "../../../../../shared-core/hooks/useClientStrings";
import { CollectionRail } from "./sections/CollectionRail/CollectionRail";
import { HomeHero } from "./sections/HomeHero/HomeHero";

export interface HomeViewProps {
  onNavigate: (path: string) => void;
  strings: ReturnType<typeof useClientStrings>;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, strings: clientStrings }) => {
  const { designSystem, hosts } = useUi();
  const apiConfig = useClientApiConfig();
  const home = useHomeVitrine({ apiConfig });
  const View = hosts.View;
  const ScrollContainer = hosts.ScrollView || hosts.View;
  const strings = clientStrings.home.vitrine.home;
  const spacing = designSystem.theme.tokens.spacing;

  return (
    <ScrollContainer contentContainerStyle={{ flexGrow: 1 }}>
      <HomeHero
        collection={home.viewModel.heroCollection}
        onExplore={() => onNavigate(clientRoutes.catalogo)}
        onSubscribe={() => onNavigate(clientRoutes.produtos)}
        strings={strings.hero}
      />
      {home.viewModel.featuredCollection || home.viewModel.secondaryCollections.length ? (
        <CollectionRail
          featuredCollection={home.viewModel.featuredCollection}
          onExplore={() => onNavigate(clientRoutes.catalogo)}
          secondaryCollections={home.viewModel.secondaryCollections}
          strings={strings.collectionRail}
        />
      ) : null}
      {!home.isLoading && home.error ? (
        <View style={{ gap: spacing.spaceMd, padding: spacing.spaceLg }}>
          <Text variant="h2" weight="bold">{strings.states.errorTitle}</Text>
          <Text tone="muted">{strings.states.errorDescription}</Text>
          <Button appearance="solid" onPress={() => void home.reload()} tone="neutral">
            {strings.states.retry}
          </Button>
        </View>
      ) : null}
      {!home.isLoading && !home.error && !home.viewModel.heroCollection ? (
        <View style={{ gap: spacing.spaceMd, padding: spacing.spaceLg }}>
          <Text variant="h2" weight="bold">{strings.states.emptyTitle}</Text>
          <Text tone="muted">{strings.states.emptyDescription}</Text>
        </View>
      ) : null}
    </ScrollContainer>
  );
};
