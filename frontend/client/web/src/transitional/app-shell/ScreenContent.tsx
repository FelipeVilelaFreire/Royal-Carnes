import React from "react";

export interface ScreenContentProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const ScreenContent: React.FC<ScreenContentProps> = ({ children, style }) => {
  return (
    <main
      style={{
        flex: 1,
        width: "100%",
        minHeight: "calc(100vh - 140px)",
        background: "transparent",
        color: "inherit",
        boxSizing: "border-box",
        ...style
      }}
    >
      {children}
    </main>
  );
};
