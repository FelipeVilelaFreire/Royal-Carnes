"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useUiConfig } from "../UiProvider";
import type { UiBackgroundConfig, UiBackgroundCursorConfig } from "../core";
import styles from "./Background.module.css";

export interface BackgroundProps {
  background?: UiBackgroundConfig;
  className?: string;
  cursor?: UiBackgroundCursorConfig;
}

export const Background: React.FC<BackgroundProps> = ({ background, className, cursor }) => {
  const ui = useUiConfig();
  const rootRef = useRef<HTMLDivElement>(null);
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
  const cursorMode = resolvedCursor?.enabled === false ? "none" : resolvedCursor?.mode || "none";

  useEffect(() => {
    const root = rootRef.current;
    if (!root || cursorMode !== "glass") return;

    const disabledBelow = Number(resolvedCursor?.disabledBelow || 0);
    const canRun = () => window.innerWidth >= disabledBelow && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const handlePointerMove = (event: PointerEvent) => {
      if (!canRun()) {
        root.dataset.cursorActive = "false";
        return;
      }

      root.style.setProperty("--ui-background-cursor-x", `${event.clientX}px`);
      root.style.setProperty("--ui-background-cursor-y", `${event.clientY}px`);
      root.dataset.cursorActive = "true";
    };

    const handlePointerLeave = () => {
      root.dataset.cursorActive = "false";
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [cursorMode, resolvedCursor?.disabledBelow]);

  if (pattern === "none") return null;

  return (
    <div
      aria-hidden="true"
      className={[styles.background, className].filter(Boolean).join(" ")}
      data-cursor={cursorMode}
      data-cursor-active="false"
      data-pattern={pattern}
      ref={rootRef}
    >
      <div className={styles.atmosphere} />
      <div className={styles.cursor} />
    </div>
  );
};
