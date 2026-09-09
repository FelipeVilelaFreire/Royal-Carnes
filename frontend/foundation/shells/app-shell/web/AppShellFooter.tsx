"use client";

import React from "react";
import { Button } from "../../../ui/Button";
import { Container, Grid, Inline, Stack, type ContainerProps } from "../../../ui/Layout";
import { Text } from "../../../ui/Text";
import { ArrowForwardIcon } from "../../../ui/Icon/AppIcons";
import { Surface } from "../../../ui/Surface";
import { handleAppShellNavigation } from "./navigation";
import styles from "../AppShell.module.css";
import type { AppShellNavigationItem, ResolvedAppShellModel } from "../foundation";

export interface AppShellFooterProps {
  model: ResolvedAppShellModel;
  onNavigate?: (path: string) => void;
}

type AppShellFooterLink = AppShellNavigationItem & {
  labelKey?: string;
};

type AppShellFooterColumn = {
  key: string;
  titleKey?: string;
  links?: AppShellFooterLink[];
};

type AppShellFooterHighlight = {
  key: string;
  labelKey?: string;
  valueKey?: string;
};

const resolveStringPath = (source: Record<string, any>, path: string | undefined) =>
  path?.split(".").reduce<any>((value, segment) => value?.[segment], source);

export const AppShellFooter: React.FC<AppShellFooterProps> = ({ model, onNavigate }) => {
  if (!model.footerEnabled) return null;

  const footerConfig = model.footerConfig || {};
  const columns = (footerConfig.columns || []) as AppShellFooterColumn[];
  const highlights = (footerConfig.highlights || []) as AppShellFooterHighlight[];
  const footerLinks = columns.length > 0
    ? columns
    : [
        {
          key: "navigation",
          titleKey: footerConfig.navigationTitleKey,
          links: model.footerItems,
        },
      ];
  const brandEyebrow = resolveStringPath(model.strings, footerConfig.eyebrowKey);
  const brandDescription = resolveStringPath(model.strings, footerConfig.descriptionKey);
  const legalText = resolveStringPath(model.strings, footerConfig.legalKey);

  return (
    <Surface
      as="footer"
      appearance="solid"
      className={styles.footer}
    >
      <Container
        className={styles.footerInner}
        gutter={model.currentLayout.footer?.gutter as ContainerProps["gutter"]}
        width={model.currentLayout.footer?.width as ContainerProps["width"]}
      >
        <Grid className={styles.footerGrid} columns="theme" gap="grid">
          <Stack className={styles.footerBrand} gap="md">
            <Inline align="center" className={styles.footerBrandHeader} gap="sm" wrap={false}>
              {model.brand.logo ? (
                <span className={styles.footerLogoFrame}>
                  <img alt={model.brand.name} className={styles.footerLogo} src={model.brand.logo} />
                </span>
              ) : null}
              <Stack gap="none">
                {brandEyebrow ? (
                  <Text as="span" className={styles.footerEyebrow} size="size2xs" variant="caption" weight="bold">
                    {brandEyebrow}
                  </Text>
                ) : null}
                <Text as="strong" className={styles.footerBrandName} size="sizeXl" variant="h3" weight="bold">
                  {model.brand.name}
                </Text>
              </Stack>
            </Inline>

            {brandDescription ? (
              <Text as="p" className={styles.footerDescription} lineHeight="lineHeightLg" size="sizeSm" tone="text-muted" variant="body">
                {brandDescription}
              </Text>
            ) : null}

            {highlights.length > 0 ? (
              <Inline className={styles.footerHighlights} gap="sm">
                {highlights.map((highlight) => (
                  <span className={styles.footerHighlight} key={highlight.key}>
                    <Text as="span" className={styles.footerHighlightValue} size="sizeSm" variant="caption" weight="bold">
                      {resolveStringPath(model.strings, highlight.valueKey)}
                    </Text>
                    <Text as="span" className={styles.footerHighlightLabel} size="size2xs" tone="text-muted" variant="caption" weight="semibold">
                      {resolveStringPath(model.strings, highlight.labelKey)}
                    </Text>
                  </span>
                ))}
              </Inline>
            ) : null}
          </Stack>

          {footerLinks.map((column) => (
            <Stack className={styles.footerColumn} gap="sm" key={column.key}>
              {column.titleKey ? (
                <Text as="h2" className={styles.footerColumnTitle} size="sizeXs" variant="caption" weight="bold">
                  {resolveStringPath(model.strings, column.titleKey)}
                </Text>
              ) : null}
              <Stack className={styles.footerColumnLinks} gap="xs">
                {(column.links || []).map((item) => {
                  const label = item.label || resolveStringPath(model.strings, item.labelKey) || item.key;
                  const routePath = item.routePath || item.path || (item.type === "scroll" && item.targetId ? `#${item.targetId}` : `/${item.key}`);
                  const resolvedItem = { ...item, label, routePath };
                  const isActive = model.activePath === routePath;

                  return (
                    <Button
                      appearance="transparent"
                      className={[styles.footerLink, isActive ? styles.footerLinkActive : ""].filter(Boolean).join(" ")}
                      icon={<ArrowForwardIcon />}
                      iconPosition="end"
                      key={item.key}
                      onClick={(event) => handleAppShellNavigation(event, resolvedItem, onNavigate)}
                      size="sm"
                      tone={isActive ? "primary" : "neutral"}
                    >
                      {label}
                    </Button>
                  );
                })}
              </Stack>
            </Stack>
          ))}
        </Grid>

        {legalText ? (
          <Inline align="center" className={styles.footerBottom} justify="between">
            <Text as="p" className={styles.footerLegal} size="sizeXs" tone="text-muted" variant="caption">
              {legalText}
            </Text>
          </Inline>
        ) : null}
      </Container>
    </Surface>
  );
};
