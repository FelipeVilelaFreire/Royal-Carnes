"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@foundation/ui/web/Button";
import { Inline } from "@foundation/ui/web/Layout";
import { SectionContainer } from "@foundation/ui/web/SectionContainer";
import { Surface } from "@foundation/ui/web/Surface";
import { Text } from "@foundation/ui/web/Text";
import { sharedAssets } from "@royalprime/client/manifest/assets";
import type { HomeHeroCollectionViewModel } from "@royalprime/client/view-models/home-vitrine.view-model";
import styles from "./HomeHero.module.css";

export interface HomeHeroStrings {
  action: string;
  defaultDescription: string;
  defaultTitle: string;
  eyebrow: string;
  fallbackImageAlt: string;
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
  const fallbackImage = sharedAssets.client.home.churrasqueiraHeroFallback;
  const requestedImage = collection?.imageUrl || fallbackImage;
  const description = collection?.description || strings.defaultDescription;
  const title = collection?.name || strings.defaultTitle;
  const [backgroundImage, setBackgroundImage] = useState(requestedImage);

  useEffect(() => {
    setBackgroundImage(requestedImage);
    if (requestedImage === fallbackImage) return;

    const image = new Image();
    image.onerror = () => setBackgroundImage(fallbackImage);
    image.src = requestedImage;

    return () => {
      image.onerror = null;
    };
  }, [fallbackImage, requestedImage]);

  return (
    <SectionContainer
      atmosphere="image"
      backgroundImage={backgroundImage}
      headerSafety
      heightRecipe="heroPeek"
      imageOverlay="medium"
      usefulColumns={20}
      >
      <div className={styles.content}>
        <Surface appearance="transparent" className={styles.copy}>
          <Text as="span" className={styles.eyebrow} tone="primary" variant="caption">
            {strings.eyebrow}
          </Text>
          <Text as="h1" className={styles.title} id="home-hero-title" tone="ivory" variant="h1">
            {title}
          </Text>
          <Text className={styles.description} tone="ivory">
            {description}
          </Text>
          <Text className={styles.membership} tone="ivory">
            {strings.membership}
          </Text>
          <Inline className={styles.actions} gap="sm" wrap>
            <Button appearance="solid" onClick={onExplore} size="md" tone="primary">
              {strings.action}
            </Button>
            <Button appearance="outline" onClick={onSubscribe} size="md" tone="primary">
              {strings.subscriptionAction}
            </Button>
          </Inline>
        </Surface>
      </div>
    </SectionContainer>
  );
};
