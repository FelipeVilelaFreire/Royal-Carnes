import React from "react";
import { Button } from "@foundation/ui/web/Button";
import type { CatalogoContentModel } from "@royalprime/client/features/catalogo";
import styles from "./CatalogoCategoryRail.module.css";

interface CatalogoCategoryRailProps {
  catalogo: CatalogoContentModel;
  navigationLabel: string;
}

export const CatalogoCategoryRail: React.FC<CatalogoCategoryRailProps> = ({
  catalogo,
  navigationLabel,
}) => (
  <nav aria-label={navigationLabel} className={styles.categoryRail}>
      <div className={styles.categoryViewport}>
        <ul className={styles.categoryList}>
          {catalogo.categories.map((category) => {
            const isActive = catalogo.activeCategoryId === category.id;
            return (
              <li key={category.id}>
                <Button
                  appearance={isActive ? "solid" : "soft"}
                  className={styles.categoryButton}
                  data-active={isActive || undefined}
                  onClick={() => catalogo.setActiveCategoryId(category.id)}
                  size="sm"
                  tone={isActive ? "primary" : "neutral"}
                  type="button"
                >
                  {category.name}
                </Button>
              </li>
            );
          })}
        </ul>
      </div>
  </nav>
);
