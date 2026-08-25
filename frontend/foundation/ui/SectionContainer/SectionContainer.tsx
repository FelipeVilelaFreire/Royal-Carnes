import React from "react";

export interface SectionContainerProps {
  id?: string;
  atmosphere?: "solid" | "glass" | "image";
  usefulColumns?: 17 | 14 | 20;
  heightRecipe?: "heroPeek" | "auto" | "fullScreen";
  headerSafety?: boolean;
  backgroundImage?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const SectionContainer: React.FC<SectionContainerProps> = ({
  id,
  atmosphere = "solid",
  usefulColumns = 17,
  heightRecipe = "auto",
  headerSafety = false,
  backgroundImage,
  children,
  style
}) => {
  // Calculadora de Offset de Colunas (Matriz de 20 Colunas)
  let gridColumn = "1 / span 20";
  if (usefulColumns === 14) {
    gridColumn = "2 / span 18"; // Leitura contida
  }

  const isFullWidth = usefulColumns === 20;

  // Estilo do Container Externo (Dono da Física, Backgrounds Transparentes/Tokenizados e Alturas)
  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    minHeight: heightRecipe === "heroPeek" ? "calc(88vh - 70px)" : heightRecipe === "fullScreen" ? "100vh" : "auto",
    paddingTop: headerSafety ? "20px" : "48px",
    paddingBottom: "48px",
    background:
      atmosphere === "glass"
        ? "rgba(255, 255, 255, 0.03)"
        : atmosphere === "image" && backgroundImage
        ? `linear-gradient(180deg, rgba(18,18,18,0.85) 0%, rgba(12,12,12,0.95) 100%), url(${backgroundImage})`
        : "transparent",
    backdropFilter: atmosphere === "glass" ? "blur(16px)" : "none",
    borderBottom: "1px solid var(--theme--color-border, transparent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    boxSizing: "border-box",
    ...style
  };

  return (
    <section id={id} style={containerStyle}>
      <div
        style={{
          maxWidth: isFullWidth ? "100%" : "1440px",
          width: "100%",
          margin: "0 auto",
          padding: isFullWidth ? "0 40px" : "0 32px",
          display: "grid",
          gridTemplateColumns: "repeat(20, 1fr)", // Matriz Master de 20 Colunas do Theme
          gap: "24px",
          alignItems: "center",
          boxSizing: "border-box"
        }}
      >
        <div style={{ gridColumn, width: "100%" }}>{children}</div>
      </div>
    </section>
  );
};
