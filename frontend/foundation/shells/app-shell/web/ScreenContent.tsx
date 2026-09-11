"use client";

import React from "react";
import { Container, type ContainerProps } from "../../../ui/web/Layout";
import styles from "../AppShell.module.css";
import type { AppShellLayoutRegion } from "../foundation";

export interface ScreenContentProps {
  children: React.ReactNode;
  layout?: AppShellLayoutRegion;
}

export const ScreenContent: React.FC<ScreenContentProps> = ({ children, layout }) => (
  <main className={styles.content}>
    <Container gutter={layout?.gutter as ContainerProps["gutter"]} width={layout?.width as ContainerProps["width"]}>
      {children}
    </Container>
  </main>
);
