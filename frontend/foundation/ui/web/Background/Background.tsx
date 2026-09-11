"use client";

import React, { lazy, useMemo } from "react";
import { useUiConfig } from "../UiProvider";
import type { UiBackgroundConfig, UiBackgroundCursorConfig } from "../../shared/core";
import styles from "./Background.module.css";

const GlassCursor = lazy(() => import("./GlassCursor/GlassCursor").then((module) => ({ default: module.GlassCursor })));

export interface BackgroundProps {
  background?: UiBackgroundConfig;
  className?: string;
  cursor?: UiBackgroundCursorConfig;
}

export const Background: React.FC<BackgroundProps> = ({ background, className, cursor }) => {
  const ui = useUiConfig();
  const resolvedBackground = useMemo(
    () => ({
      ...ui.background,
      ...background,
      cursor: {
        ...ui.background.cursor,
        ...background?.cursor,
        ...cursor,
      },
    }),
    [background, cursor, ui.background],
  );

  const pattern = resolvedBackground.enabled === false ? "none" : resolvedBackground.pattern || "none";
  const resolvedCursor = resolvedBackground.cursor;
  const cursorIntensity = resolvedCursor?.intensity || "soft";
  const cursorMode = resolvedCursor?.enabled === false ? "none" : resolvedCursor?.mode || "none";

  if (pattern === "none") return null;

  return (
    <div
      aria-hidden="true"
      className={[styles.background, className].filter(Boolean).join(" ")}
      data-pattern={pattern}
    >
      <div className={styles.atmosphere} />
      {cursorMode === "glass" ? <React.Suspense fallback={null}><GlassCursor disabledBelow={resolvedCursor?.disabledBelow} intensity={cursorIntensity} /></React.Suspense> : null}
    </div>
  );
};
