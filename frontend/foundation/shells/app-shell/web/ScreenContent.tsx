"use client";

import React from "react";
import { Container, type ContainerProps } from "../../../ui/Layout";
import styles from "../AppShell.module.css";
import type { AppShellLayoutRegion } from "../foundation";

export interface ScreenContentProps {
  children: React.ReactNode;
  layout?: AppShellLayoutRegion;
  offsetBottom: string;
  offsetTop: string;
}

export const ScreenContent: React.FC<ScreenContentProps> = ({ children, layout, offsetBottom, offsetTop }) => (
  <main className={styles.content} style={{ paddingTop: offsetTop, paddingBottom: offsetBottom }}>
    <Container gutter={layout?.gutter as ContainerProps["gutter"]} width={layout?.width as ContainerProps["width"]}>
      {children}
    </Container>
  </main>
);
