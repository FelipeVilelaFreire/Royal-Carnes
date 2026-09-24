"use client";

import React, { useEffect, useState } from "react";
import { Container } from "@foundation/ui/web/Layout";
import { ScreenHeader } from "@foundation/product-components/screens/web/ScreenHeader";
import { useCatalogoContent } from "@royalprime/client/features/catalogo";
import { useClientApiConfig } from "@royalprime/client/runtime/ClientApiProvider";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import { CatalogoContent } from "../content/CatalogoContent/CatalogoContent";
import styles from "./CatalogoView.module.css";

export const CatalogoView: React.FC = () => {
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");
  const clientStrings = useClientStrings();
  const strings = clientStrings.catalogo.catalogPage;
  const apiConfig = useClientApiConfig();
  const catalogo = useCatalogoContent({ apiConfig, strings });

  useEffect(() => {
    const synchronizeTheme = () => {
      const storedTheme = localStorage.getItem("royal_prime_theme");
      if (storedTheme === "dark" || storedTheme === "light") setThemeMode(storedTheme);
    };

    synchronizeTheme();
    window.addEventListener("royal_theme_changed", synchronizeTheme);
    return () => window.removeEventListener("royal_theme_changed", synchronizeTheme);
  }, []);

  return (
    <main className={styles.root}>
      <ScreenHeader
        description={strings.description}
        mobileGutter="none"
        mobileMode="collapsible"
        mobileTitle={strings.mobileTitle}
        title={strings.title}
      />
      <Container className={styles.main} gutter="page" width="wide">
        <CatalogoContent
          catalogo={catalogo}
          isDark={themeMode === "dark"}
          productCardStrings={clientStrings.pedido.productCard}
          strings={strings}
        />
      </Container>
    </main>
  );
};
