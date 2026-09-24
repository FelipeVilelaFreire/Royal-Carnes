"use client";

import React, { useEffect, useRef } from "react";
import { Container, type ContainerProps } from "@foundation/ui/web/Layout";
import { Surface } from "@foundation/ui/web/Surface";
import { Text } from "@foundation/ui/web/Text";
import { useUiConfig } from "@foundation/ui/web/UiProvider";
import {
  resolveScreenHeaderMobileTitle,
  normalizeScreenHeaderScrollProgress,
  shouldRenderScreenHeaderDescription,
  type ScreenHeaderContent,
  type ScreenHeaderAlign,
  type ScreenHeaderMobileGutter,
  type ScreenHeaderMobileMode,
} from "../../shared";
import styles from "./ScreenHeader.module.css";

export interface ScreenHeaderProps extends ScreenHeaderContent {
  align?: ScreenHeaderAlign;
  actions?: React.ReactNode;
  actionsAlign?: "start" | "end";
  className?: string;
  contentWidth?: "full" | "md" | "sm";
  containerInset?: "page" | "sectionFull";
  containerWidth?: ContainerProps["width"];
  descriptionVariant?: "body" | "caption";
  metadata?: React.ReactNode;
  metadataPosition?: "afterDescription" | "title";
  mobileGutter?: ScreenHeaderMobileGutter;
  mobileMode?: ScreenHeaderMobileMode;
  showScrollBorder?: boolean;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  align = "start",
  actions,
  actionsAlign = "start",
  className,
  contentWidth = "sm",
  containerInset = "page",
  containerWidth = "wide",
  description,
  descriptionVariant = "body",
  eyebrow,
  mobileGutter,
  mobileMode,
  mobileTitle,
  metadata,
  metadataPosition = "afterDescription",
  showScrollBorder = true,
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
      data-align={align}
      data-actions-align={actionsAlign}
      data-has-actions={actions ? "true" : undefined}
      data-content-width={contentWidth}
      data-container-inset={containerInset}
      data-metadata-position={metadataPosition}
      data-mobile-gutter={resolvedMobileGutter}
      data-mobile-mode={resolvedMobileMode}
      data-scroll-border={showScrollBorder ? "true" : "false"}
      ref={headerRef}
    >
      <Container className={styles.container} gutter="page" width={containerWidth}>
        <Surface
          appearance={resolvedMobileMode === "collapsible" && isMobileViewport ? "soft" : "transparent"}
          className={styles.surface}
          geometry={resolvedMobileMode === "collapsible" && isMobileViewport ? { borderWidth: ui.theme.tokens.borders.none } : undefined}
        >
          <div className={styles.desktopLayout}>
            <div className={styles.desktopContent}>
              {eyebrow ? (
                <Text as="span" className={styles.eyebrow} tone="primary" variant="caption">
                  {eyebrow}
                </Text>
              ) : null}
              <div className={styles.titleLine}>
                <Text as="h1" className={styles.title} variant="h1">
                  {title}
                </Text>
                {metadataPosition === "title" && metadata ? <div className={styles.metadata}>{metadata}</div> : null}
              </div>
              {description ? (
                <Text className={styles.description} tone="textMuted" variant={descriptionVariant}>
                  {description}
                </Text>
              ) : null}
              {metadataPosition === "afterDescription" && metadata ? <div className={styles.metadata}>{metadata}</div> : null}
            </div>
            {actions ? <div className={styles.desktopActions}>{actions}</div> : null}
          </div>

          <div className={styles.mobileContent}>
            <div className={styles.mobileTitleLine}>
              <Text as="h1" className={styles.mobileTitle} variant="h2">
                {resolveScreenHeaderMobileTitle({ mobileTitle, title })}
              </Text>
              {metadataPosition === "title" && metadata ? <div className={styles.metadata}>{metadata}</div> : null}
            </div>
            {description && shouldRenderScreenHeaderDescription(resolvedMobileMode) ? (
              <Text className={styles.mobileDescription} tone="textMuted" variant={descriptionVariant}>
                {description}
              </Text>
            ) : null}
            {metadataPosition === "afterDescription" && metadata ? <div className={styles.metadata}>{metadata}</div> : null}
            {actions ? <div className={styles.mobileActions}>{actions}</div> : null}
          </div>
        </Surface>
      </Container>
    </header>
  );
};
