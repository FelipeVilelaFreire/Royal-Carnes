import React from "react";
import styles from "./SectionContainer.module.css";

export interface SectionContainerProps {
  id?: string;
  atmosphere?: "solid" | "glass" | "image" | "transparent";
  usefulColumns?: 17 | 14 | 20;
  heightRecipe?: "heroPeek" | "auto" | "fullScreen";
  headerSafety?: boolean;
  backgroundImage?: string;
  imageOverlay?: "strong" | "medium" | "soft";
  children: React.ReactNode;
  style?: React.CSSProperties;
}

type SectionContainerStyle = React.CSSProperties & {
  "--ui-section-background-image"?: string;
};

export const SectionContainer: React.FC<SectionContainerProps> = ({
  id,
  atmosphere = "solid",
  usefulColumns = 17,
  heightRecipe = "auto",
  headerSafety = false,
  backgroundImage,
  imageOverlay = "strong",
  children,
  style
}) => {
  const sectionStyle: SectionContainerStyle = {
    "--ui-section-background-image": backgroundImage ? `url(${backgroundImage})` : undefined,
    ...style
  };

  return (
    <section
      className={styles.section}
      data-atmosphere={atmosphere}
      data-header-safety={headerSafety || undefined}
      data-height={heightRecipe}
      data-image-overlay={atmosphere === "image" ? imageOverlay : undefined}
      id={id}
      style={sectionStyle}
    >
      <div className={styles.grid} data-useful-columns={usefulColumns}>
        <div className={styles.content} data-useful-columns={usefulColumns}>{children}</div>
      </div>
    </section>
  );
};
