"use client";

import React, { useEffect } from "react";
import { Button } from "@foundation/ui/Button";
import { Card } from "@foundation/ui/Card";
import { Icon } from "@foundation/ui/Icon";
import { Box, Grid, GridItem, Inline, Stack } from "@foundation/ui/Layout";
import { Surface } from "@foundation/ui/Surface";
import { Text } from "@foundation/ui/Text";
import {
  BoxIcon,
  CartIcon,
  CheckIcon,
  StoreIcon,
  TruckIcon,
  UserIcon,
} from "@foundation/ui/Icon/AppIcons";
import { useClientCatalog } from "@/hooks/useClientCatalog";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import { sharedAssets } from "@royalprime/client/manifest/assets";
import { homeVitrineConfig } from "@/manifest/portal/homeVitrine.config";
import { clientRoutes } from "@/manifest/routes";
import styles from "./HomeView.module.css";

export interface HomeViewProps {
  isAuthenticated?: boolean;
  onNavigate?: (path: string) => void;
}

const iconByIntent = {
  account: UserIcon,
  box: BoxIcon,
  catalog: StoreIcon,
  delivery: TruckIcon,
  orders: CartIcon,
};

const resolveStringPath = (catalog: Record<string, any>, path: string) =>
  path.split(".").reduce<any>((value, segment) => value?.[segment], catalog) || path;

const resolveRoute = (routeKey: string) =>
  clientRoutes[routeKey as keyof typeof clientRoutes] || clientRoutes.home;

export const HomeView: React.FC<HomeViewProps> = ({
  isAuthenticated = false,
  onNavigate,
}) => {
  const stringsCatalog = useClientStrings();
  const strings = stringsCatalog.home.vitrine;
  const catalog = useClientCatalog();

  useEffect(() => {
    catalog.load().catch(() => undefined);
  }, [catalog.load]);

  const navigateTo = (routeKey: string) => {
    const path = resolveRoute(routeKey);
    if (onNavigate) {
      onNavigate(path);
      return;
    }
    if (typeof window !== "undefined") {
      window.location.href = path;
    }
  };

  const liveProducts = catalog.viewModel.products.slice(0, 3);
  const products = liveProducts.map((product) => ({
        key: product.key,
        title: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        routeKey: "cortes",
        meta: product.priceLabel || strings.products.defaultMeta,
      }));

  const notices = isAuthenticated
    ? homeVitrineConfig.customerNotices
    : [homeVitrineConfig.guestNotice];

  return (
    <Stack className={styles.screen} gap="xl">
      <Grid columns="theme" gap="grid" className={styles.hero}>
        <GridItem span={12}>
          <Card className={styles.heroCopy} size="lg">
            <Stack gap="md">
              <span className={styles.eyebrow}>{strings.hero.badge}</span>
              <Text as="h1" variant="h1">
                {isAuthenticated ? strings.hero.customerTitle : strings.hero.guestTitle}
              </Text>
              <Text tone="textMuted">
                {isAuthenticated ? strings.hero.customerDescription : strings.hero.guestDescription}
              </Text>
            </Stack>
            <Inline className={styles.actions} gap="sm">
              <Button appearance="solid" tone="primary" size="md" onClick={() => navigateTo(homeVitrineConfig.hero.primaryRouteKey)}>
                {strings.hero.primaryAction}
              </Button>
              <Button appearance="outline" tone="neutral" size="md" onClick={() => navigateTo(homeVitrineConfig.hero.secondaryRouteKey)}>
                {strings.hero.secondaryAction}
              </Button>
            </Inline>
          </Card>
        </GridItem>
        <GridItem span={8}>
          <Surface appearance="solid" className={styles.heroMedia}>
            <img src={sharedAssets.client.heroBackground} alt={strings.hero.mediaAlt} />
            <span className={styles.heroMediaOverlay} aria-hidden="true" />
            <div className={styles.heroMediaText}>
              <Text as="h2" variant="h2" tone="inherit">{strings.hero.mediaTitle}</Text>
              <Text tone="inherit">{strings.hero.mediaDescription}</Text>
            </div>
          </Surface>
        </GridItem>
      </Grid>

      <section className={styles.noticeGrid} aria-label={strings.noticesSectionLabel}>
        {notices.map((notice) => (
          <Card className={styles.notice} key={notice.key} size="md">
            <span className={styles.eyebrow}>{resolveStringPath(stringsCatalog, notice.titleKey)}</span>
            <Text tone="textMuted">{resolveStringPath(stringsCatalog, notice.descriptionKey)}</Text>
            <Box>
              <Button appearance="soft" tone={notice.tone} size="sm" onClick={() => navigateTo(notice.routeKey)}>
                {isAuthenticated ? strings.customerNoticeAction : strings.guestNoticeAction}
              </Button>
            </Box>
          </Card>
        ))}
      </section>

      <section>
        <div className={styles.sectionHeader}>
          <Stack gap="xs">
            <span className={styles.eyebrow}>{strings.actions.badge}</span>
            <Text as="h2" variant="h2">{strings.actions.title}</Text>
          </Stack>
          <Text className={styles.statusLine} as="span">
            {isAuthenticated ? strings.actions.customerHint : strings.actions.guestHint}
          </Text>
        </div>
        <div className={styles.actionGrid}>
          {homeVitrineConfig.actions
            .filter((action) => isAuthenticated || action.auth !== "required")
            .map((action) => {
              const ActionIcon = iconByIntent[action.iconIntent as keyof typeof iconByIntent] || CheckIcon;
              return (
                <Card className={styles.actionCard} key={action.key} size="md">
                  <Stack gap="sm">
                    <span className={styles.actionIcon}>
                      <Icon tone="inherit" size="md"><ActionIcon /></Icon>
                    </span>
                    <Text as="h3" variant="h3">{resolveStringPath(stringsCatalog, action.labelKey)}</Text>
                    <Text tone="textMuted">{resolveStringPath(stringsCatalog, action.descriptionKey)}</Text>
                  </Stack>
                  <Button appearance="transparent" tone="primary" size="sm" onClick={() => navigateTo(action.routeKey)}>
                    {strings.actions.openAction}
                  </Button>
                </Card>
              );
            })}
        </div>
      </section>

      <section>
        <div className={styles.sectionHeader}>
          <Stack gap="xs">
            <span className={styles.eyebrow}>{strings.products.badge}</span>
            <Text as="h2" variant="h2">{strings.products.title}</Text>
          </Stack>
          <Button appearance="outline" tone="neutral" size="sm" onClick={() => navigateTo("cortes")}>
            {strings.products.action}
          </Button>
        </div>
        <div className={styles.productGrid}>
          {products.map((product) => (
            <Card className={styles.productCard} key={product.key} size="md">
              {product.imageUrl ? (
                <div className={styles.productMedia}>
                  <img src={product.imageUrl} alt={product.title} />
                  <span className={styles.productMediaOverlay} aria-hidden="true" />
                </div>
              ) : null}
              <div className={styles.productBody}>
                <span className={styles.statusLine}>{product.meta}</span>
                <Text as="h3" variant="h3">{product.title}</Text>
                <Text tone="textMuted">{product.description}</Text>
                <Button appearance="soft" tone="primary" size="sm" onClick={() => navigateTo(product.routeKey)}>
                  {strings.products.cardAction}
                </Button>
              </div>
            </Card>
          ))}
        </div>
        {catalog.isLoading ? <Text className={styles.statusLine} as="p">{strings.products.loading}</Text> : null}
        {catalog.error ? <Text className={styles.statusLine} as="p">{strings.products.error}</Text> : null}
        {!catalog.isLoading && !catalog.error && products.length === 0 ? <Text className={styles.statusLine} as="p">{strings.products.empty}</Text> : null}
      </section>
    </Stack>
  );
};
