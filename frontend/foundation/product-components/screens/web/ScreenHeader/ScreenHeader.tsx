"use client";

import React, { useEffect, useRef } from "react";
import { Container } from "@foundation/ui/web/Layout";
import { Surface } from "@foundation/ui/web/Surface";
import { Text } from "@foundation/ui/web/Text";
import { useUiConfig } from "@foundation/ui/web/UiProvider";
import {
  resolveScreenHeaderMobileTitle,
  normalizeScreenHeaderScrollProgress,
  type ScreenHeaderContent,
  type ScreenHeaderMobileGutter,
  type ScreenHeaderMobileMode,
} from "../../shared";
import styles from "./ScreenHeader.module.css";

export interface ScreenHeaderProps extends ScreenHeaderContent {
  className?: string;
  mobileGutter?: ScreenHeaderMobileGutter;
  mobileMode?: ScreenHeaderMobileMode;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  className,
  description,
  eyebrow,
  mobileGutter,
  mobileMode,
  mobileTitle,
  title,
}) => {
  const resolvedMobileMode: ScreenHeaderMobileMode = mobileMode ?? "compact";
  const resolvedMobileGutter: ScreenHeaderMobileGutter = mobileGutter ?? (resolvedMobileMode === "collapsible" ? "none" : "page");
  const headerRef = useRef<HTMLElement>(null);
  const [isMobileViewport, setIsMobileViewport] = React.useState(false);
  const ui = useUiConfig();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 48em)");
    const updateViewport = () => setIsMobileViewport(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    if (resolvedMobileMode !== "collapsible") return undefined;

    const updateCollapsedState = () => {
      const progress = normalizeScreenHeaderScrollProgress(window.scrollY / Math.max(window.innerHeight / 4, 1));
      headerRef.current?.style.setProperty("--screen-header-scroll-progress", progress.toFixed(3));
    };
    updateCollapsedState();
    window.addEventListener("scroll", updateCollapsedState, { passive: true });
    return () => window.removeEventListener("scroll", updateCollapsedState);
  }, [resolvedMobileMode]);

  return (
    <header
      className={[styles.root, className].filter(Boolean).join(" ")}
      data-mobile-gutter={resolvedMobileGutter}
      data-mobile-mode={resolvedMobileMode}
      ref={headerRef}
    >
      <Container className={styles.container} gutter="page" width="wide">
        <Surface
          appearance={resolvedMobileMode === "collapsible" && isMobileViewport ? "soft" : "transparent"}
          className={styles.surface}
          geometry={resolvedMobileMode === "collapsible" && isMobileViewport ? { borderWidth: ui.theme.tokens.borders.none } : undefined}
        >
          <div className={styles.desktopContent}>
            {eyebrow ? (
              <Text as="span" className={styles.eyebrow} tone="primary" variant="caption">
                {eyebrow}
              </Text>
            ) : null}
            <Text as="h1" className={styles.title} variant="h1">
              {title}
            </Text>
            {description ? (
              <Text className={styles.description} tone="textMuted">
                {description}
              </Text>
            ) : null}
          </div>

          <div className={styles.mobileContent}>
            <Text as="h1" className={styles.mobileTitle} variant="h2">
              {resolveScreenHeaderMobileTitle({ mobileTitle, title })}
            </Text>
            {resolvedMobileMode === "full" && description ? (
              <Text className={styles.mobileDescription} tone="textMuted">
                {description}
              </Text>
            ) : null}
          </div>
        </Surface>
      </Container>
    </header>
  );
};
