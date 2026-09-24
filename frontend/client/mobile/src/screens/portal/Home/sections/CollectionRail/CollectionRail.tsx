import React, { useEffect, useState } from "react";
import { Button } from "@foundation/ui/native/Button";
import { Text, useUi } from "@foundation/ui/native";
import { sharedAssets } from "@royalprime/client/manifest/assets";
import type { HomeHeroCollectionViewModel } from "@royalprime/client/view-models/home-vitrine.view-model";
import { createCollectionRailStyles } from "./CollectionRail.styles";

export interface CollectionRailProps {
  featuredCollection: HomeHeroCollectionViewModel | null;
  onExplore: () => void;
  secondaryCollections: HomeHeroCollectionViewModel[];
  strings: { title: string };
}

interface CollectionRailCardProps {
  appearance: "featured" | "secondary";
  Image: any;
  View: any;
  collection: HomeHeroCollectionViewModel;
  onExplore: () => void;
  styles: any;
}

const CollectionRailCard: React.FC<CollectionRailCardProps> = ({ Image, View, appearance, collection, onExplore, styles }) => {
  const fallbackImage = collection.fallbackImageUrl || sharedAssets.client.home.churrasqueiraHeroFallback;
  const [imageUrl, setImageUrl] = useState(collection.imageUrl || fallbackImage);

  useEffect(() => {
    setImageUrl(collection.imageUrl || fallbackImage);
  }, [collection.imageUrl, fallbackImage]);

  return (
    <Button appearance="transparent" onPress={onExplore} style={[styles.card, styles[`${appearance}Card`]]} tone="primary">
      {Image ? <Image accessibilityLabel={collection.imageAlt || collection.name} onError={() => setImageUrl(fallbackImage)} resizeMode="cover" source={{ uri: imageUrl }} style={styles.image} /> : null}
      <View pointerEvents="none" style={styles.scrim} />
      <View pointerEvents="none" style={styles.cardContent}>
        <Text style={styles.name} variant="h3" weight="bold">{collection.name}</Text>
        {collection.description ? <Text style={styles.description}>{collection.description}</Text> : null}
      </View>
    </Button>
  );
};

export const CollectionRail: React.FC<CollectionRailProps> = ({ featuredCollection, onExplore, secondaryCollections, strings }) => {
  const { designSystem, hosts } = useUi();
  const Image = hosts.Image;
  const View = hosts.View;
  const styles = createCollectionRailStyles(designSystem.theme);

  return (
    <View accessibilityLabel={strings.title} style={styles.root}>
      <View style={styles.cards}>
        {featuredCollection ? (
          <CollectionRailCard Image={Image} View={View} appearance="featured" collection={featuredCollection} onExplore={onExplore} styles={styles} />
        ) : null}
        {secondaryCollections.length ? (
          <View style={styles.secondaryCards}>
            {secondaryCollections.map((collection) => (
              <CollectionRailCard Image={Image} View={View} appearance="secondary" collection={collection} key={collection.key} onExplore={onExplore} styles={styles} />
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
};
