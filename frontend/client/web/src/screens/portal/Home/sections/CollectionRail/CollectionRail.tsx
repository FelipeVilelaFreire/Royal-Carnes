"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@foundation/ui/web/Button";
import { SectionContainer } from "@foundation/ui/web/SectionContainer";
import { sharedAssets } from "@royalprime/client/manifest/assets";
import type { HomeHeroCollectionViewModel } from "@royalprime/client/view-models/home-vitrine.view-model";
import styles from "./CollectionRail.module.css";

export interface CollectionRailProps {
  featuredCollection: HomeHeroCollectionViewModel | null;
  onExplore: () => void;
  secondaryCollections: HomeHeroCollectionViewModel[];
  strings: { title: string };
}

interface CollectionRailCardProps {
  appearance: "featured" | "secondary";
  collection: HomeHeroCollectionViewModel;
  onExplore: () => void;
}

const CollectionRailCard: React.FC<CollectionRailCardProps> = ({ appearance, collection, onExplore }) => {
  const fallbackImage = collection.fallbackImageUrl || sharedAssets.client.home.churrasqueiraHeroFallback;
  const [imageUrl, setImageUrl] = useState(collection.imageUrl || fallbackImage);

  useEffect(() => {
    setImageUrl(collection.imageUrl || fallbackImage);
  }, [collection.imageUrl, fallbackImage]);

  return (
    <Button appearance="transparent" className={`${styles.card} ${styles[appearance]}`} onClick={onExplore} tone="primary">
      <img
        alt=""
        aria-hidden="true"
        className={styles.image}
        onError={() => setImageUrl(fallbackImage)}
        src={imageUrl}
      />
      <span className={styles.scrim} />
      <span className={styles.cardContent}>
        <span className={styles.name}>{collection.name}</span>
        {collection.description ? <span className={styles.description}>{collection.description}</span> : null}
      </span>
    </Button>
  );
};

export const CollectionRail: React.FC<CollectionRailProps> = ({ featuredCollection, onExplore, secondaryCollections, strings }) => (
  <SectionContainer atmosphere="transparent" usefulColumns={20}>
    <section aria-label={strings.title} className={`${styles.root} appear-on-scroll`}>
      <div className={styles.cards}>
        {featuredCollection ? (
          <CollectionRailCard appearance="featured" collection={featuredCollection} onExplore={onExplore} />
        ) : null}
        {secondaryCollections.length ? (
          <div className={styles.secondaryCards}>
            {secondaryCollections.map((collection) => (
              <CollectionRailCard appearance="secondary" collection={collection} key={collection.key} onExplore={onExplore} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  </SectionContainer>
);
