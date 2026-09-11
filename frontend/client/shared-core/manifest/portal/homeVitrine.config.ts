export interface HomeVitrineActionConfig {
  key: string;
  labelKey: string;
  descriptionKey: string;
  routeKey: string;
  iconIntent: string;
  auth?: "public" | "required";
}

export interface HomeVitrineNoticeConfig {
  key: string;
  titleKey: string;
  descriptionKey: string;
  routeKey: string;
  tone: "primary" | "neutral" | "accent";
}

export const homeVitrineConfig = {
  hero: {
    primaryRouteKey: "cortes",
    secondaryRouteKey: "produtos",
  },
  actions: [
    {
      key: "catalog",
      labelKey: "home.vitrine.actions.catalog.title",
      descriptionKey: "home.vitrine.actions.catalog.description",
      routeKey: "cortes",
      iconIntent: "catalog",
      auth: "public",
    },
    {
      key: "box",
      labelKey: "home.vitrine.actions.box.title",
      descriptionKey: "home.vitrine.actions.box.description",
      routeKey: "produtos",
      iconIntent: "box",
      auth: "public",
    },
    {
      key: "orders",
      labelKey: "home.vitrine.actions.orders.title",
      descriptionKey: "home.vitrine.actions.orders.description",
      routeKey: "meusPedidos",
      iconIntent: "orders",
      auth: "required",
    },
    {
      key: "account",
      labelKey: "home.vitrine.actions.account.title",
      descriptionKey: "home.vitrine.actions.account.description",
      routeKey: "minhaConta",
      iconIntent: "account",
      auth: "required",
    },
  ] satisfies HomeVitrineActionConfig[],
  guestNotice: {
    key: "guest",
    titleKey: "home.vitrine.guestNotice.title",
    descriptionKey: "home.vitrine.guestNotice.description",
    routeKey: "minhaConta",
    tone: "neutral",
  } satisfies HomeVitrineNoticeConfig,
  customerNotices: [
    {
      key: "current-order",
      titleKey: "home.vitrine.customerNotices.currentOrder.title",
      descriptionKey: "home.vitrine.customerNotices.currentOrder.description",
      routeKey: "meusPedidos",
      tone: "accent",
    },
  ] satisfies HomeVitrineNoticeConfig[],
};
