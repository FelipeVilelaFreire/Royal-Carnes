import React, { useEffect, useState } from "react";
import { Button } from "@foundation/ui/native/Button";
import { Text, useUi } from "@foundation/ui/native";
import { sharedAssets } from "@royalprime/client/manifest/assets";
import type { HomeHeroCollectionViewModel } from "@royalprime/client/view-models/home-vitrine.view-model";
import { createHomeHeroStyles } from "./HomeHero.styles";

export interface HomeHeroStrings {
  action: string;
  defaultDescription: string;
  defaultTitle: string;
  eyebrow: string;
  membership: string;
  subscriptionAction: string;
}

export interface HomeHeroProps {
  collection: HomeHeroCollectionViewModel | null;
  onExplore: () => void;
  onSubscribe: () => void;
  strings: HomeHeroStrings;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ collection, onExplore, onSubscribe, strings }) => {
  const { designSystem, hosts } = useUi();
  const Image = hosts.Image;
  const View = hosts.View;
  const styles = createHomeHeroStyles(designSystem.theme);
  const fallbackImage = sharedAssets.client.home.churrasqueiraHeroFallback;
  const requestedImage = collection?.imageUrl || fallbackImage;
  const description = collection?.description || strings.defaultDescription;
  const title = collection?.name || strings.defaultTitle;
  const [imageUrl, setImageUrl] = useState(requestedImage);

  useEffect(() => {
    setImageUrl(requestedImage);
  }, [requestedImage]);

  return (
    <View style={styles.root}>
      {Image ? <Image accessibilityLabel={collection?.imageAlt || collection?.name} onError={() => setImageUrl(fallbackImage)} resizeMode="cover" source={{ uri: imageUrl }} style={styles.image} /> : null}
      <View pointerEvents="none" style={styles.overlay} />
      <View style={styles.content}>
        <Text style={styles.eyebrow} variant="caption" weight="bold">{strings.eyebrow}</Text>
        <Text style={styles.title} variant="h1" weight="bold">{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.membership}>{strings.membership}</Text>
        <View style={styles.actions}>
          <Button appearance="solid" onPress={onExplore} style={styles.action} tone="primary">
            {strings.action}
          </Button>
          <Button appearance="outline" onPress={onSubscribe} style={styles.action} tone="primary">
            {strings.subscriptionAction}
          </Button>
        </View>
      </View>
    </View>
  );
};
