import type { ClientCatalogSnapshot, ClientCollectionView } from "../contracts/catalog.contract";
import { sharedAssets } from "../manifest/assets";

export interface HomeHeroCollectionViewModel {
  description: string | null;
  fallbackImageUrl: string;
  imageAlt: string | null;
  imageUrl: string | null;
  key: string;
  name: string;
}

export interface HomeVitrineViewModel {
  featuredCollection: HomeHeroCollectionViewModel | null;
  heroCollection: HomeHeroCollectionViewModel | null;
  secondaryCollections: HomeHeroCollectionViewModel[];
}

function toHomeHeroCollectionViewModel(collection: ClientCollectionView): HomeHeroCollectionViewModel {
  const fallbackImageUrl =
    sharedAssets.client.home.collectionFallbacks[collection.key] ||
    sharedAssets.client.home.churrasqueiraHeroFallback;

  return {
    description: collection.description ?? null,
    fallbackImageUrl,
    imageAlt: collection.imageAlt ?? null,
    imageUrl: collection.imageUrl || fallbackImageUrl,
    key: collection.key,
    name: collection.name,
  };
}

export function createHomeVitrineViewModel(
  snapshot: ClientCatalogSnapshot,
): HomeVitrineViewModel {
  const activeCollections = snapshot.collections
    .filter((collection) => collection.status === "active")
    .sort((first, second) => first.sortOrder - second.sortOrder);
  const [heroCollection, featuredCollection, ...secondaryCollections] = activeCollections;

  return {
    featuredCollection: featuredCollection ? toHomeHeroCollectionViewModel(featuredCollection) : null,
    heroCollection: heroCollection ? toHomeHeroCollectionViewModel(heroCollection) : null,
    secondaryCollections: secondaryCollections.slice(0, 3).map(toHomeHeroCollectionViewModel),
  };
}
