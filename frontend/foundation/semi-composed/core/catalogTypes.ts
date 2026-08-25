export type SemiComposedCatalogItem<Key extends string, Recipe extends string = string> = Readonly<{
  key: Key;
  owner: "semi-composed";
  recipes: readonly Recipe[];
}>;

export const defineSemiComposedCatalog = <Key extends string, Recipe extends string>(key: Key, recipes: readonly Recipe[]): SemiComposedCatalogItem<Key, Recipe> => ({
  key,
  owner: "semi-composed",
  recipes,
});
