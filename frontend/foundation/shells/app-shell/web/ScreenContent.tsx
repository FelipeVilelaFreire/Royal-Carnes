"use client";

import React from "react";
import styles from "../AppShell.module.css";

export interface ScreenContentProps {
  children: React.ReactNode;
  offsetBottom: string;
  offsetTop: string;
}

export const ScreenContent: React.FC<ScreenContentProps> = ({ children, offsetBottom, offsetTop }) => (
  <main className={styles.content} style={{ paddingTop: offsetTop, paddingBottom: offsetBottom }}>
    {children}
  </main>
);
