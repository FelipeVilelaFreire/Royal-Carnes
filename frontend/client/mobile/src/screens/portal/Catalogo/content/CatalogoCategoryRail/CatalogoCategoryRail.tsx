import React from "react";
import { Button } from "@foundation/ui/native/Button";
import { Inline } from "@foundation/ui/native/Layout";
import { useUi } from "@foundation/ui/native/context";
import type { CatalogoContentModel } from "@royalprime/client/features/catalogo";
import { catalogoCategoryRailStyles, catalogoCategoryRailTokens } from "./styles";

interface CatalogoCategoryRailProps {
  catalogo: CatalogoContentModel;
}

export const CatalogoCategoryRail: React.FC<CatalogoCategoryRailProps> = ({
  catalogo,
}) => {
  const { hosts } = useUi();
  const RailContainer = hosts.ScrollView || hosts.View;

  return (
    <RailContainer
      horizontal={Boolean(hosts.ScrollView)}
      showsHorizontalScrollIndicator={false}
      style={catalogoCategoryRailStyles.rail}
    >
      <Inline gap={catalogoCategoryRailTokens.pillGap}>
          {catalogo.categories.map((category) => (
            <Button
              appearance={category.id === catalogo.activeCategoryId ? "solid" : "soft"}
              key={category.id}
              onAction={() => catalogo.setActiveCategoryId(category.id)}
              size="sm"
              tone={category.id === catalogo.activeCategoryId ? "primary" : "neutral"}
            >
              {category.name}
            </Button>
          ))}
      </Inline>
    </RailContainer>
  );
};
