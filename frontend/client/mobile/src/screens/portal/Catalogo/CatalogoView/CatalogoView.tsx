import React, { useState } from "react";
import { Container } from "@foundation/ui/native/Layout";
import { useUi } from "@foundation/ui/native/context";
import { ScreenHeader } from "@foundation/product-components/screens/native/ScreenHeader";
import { normalizeScreenHeaderScrollProgress } from "@foundation/product-components/screens/shared";
import { useCatalogoContent } from "@royalprime/client/features/catalogo";
import { CatalogoContent } from "../content/CatalogoContent/CatalogoContent";
import { catalogoViewTokens } from "./styles";
import { useClientApiConfig } from "@royalprime/client/runtime/ClientApiProvider";
import type { useClientStrings } from "@royalprime/client/hooks/useClientStrings";

export interface CatalogoViewProps {
  onProductAction?: (productId: string) => void;
  strings: ReturnType<typeof useClientStrings>;
}

type NativeScrollEvent = {
  nativeEvent?: {
    contentOffset?: {
      y?: number;
    };
  };
};

export const CatalogoView: React.FC<CatalogoViewProps> = ({ onProductAction, strings: clientStrings }) => {
  const [headerScrollProgress, setHeaderScrollProgress] = useState(0);
  const { designSystem, hosts } = useUi();
  const ScrollContainer = hosts.ScrollView || hosts.View;
  const screenHeaderScrollRange = Math.max(Number(designSystem.theme.tokens.spacing?.[catalogoViewTokens.scrollRange] || 0), 1);
  const apiConfig = useClientApiConfig();
  const strings = clientStrings.catalogo.catalogPage;
  const catalogo = useCatalogoContent({ apiConfig, strings });

  return (
    <ScrollContainer
      onScroll={hosts.ScrollView ? (event: NativeScrollEvent) => setHeaderScrollProgress(
        normalizeScreenHeaderScrollProgress((event.nativeEvent?.contentOffset?.y || 0) / screenHeaderScrollRange),
      ) : undefined}
      scrollEventThrottle={hosts.ScrollView ? 16 : undefined}
      stickyHeaderIndices={hosts.ScrollView ? [0] : undefined}
    >
      <ScreenHeader
        description={strings.description}
        mobileMode="collapsible"
        mobileTitle={strings.mobileTitle}
        scrollProgress={headerScrollProgress}
        title={strings.title}
      />
      <Container>
        <CatalogoContent
          actionLabel={clientStrings.catalogo.ctaBuy}
          catalogo={catalogo}
          onProductAction={onProductAction}
          productCardStrings={clientStrings.pedido.productCard}
          strings={strings}
        />
      </Container>
    </ScrollContainer>
  );
};
