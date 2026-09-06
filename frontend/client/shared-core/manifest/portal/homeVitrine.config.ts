export interface HomeVitrineActionConfig {
  key: string;
  labelKey: string;
  descriptionKey: string;
  routeKey: string;
  iconIntent: string;
  auth?: "public" | "required";
}

export interface HomeVitrineProductConfig {
  key: string;
  titleKey: string;
  descriptionKey: string;
  imageUrl: string;
  routeKey: string;
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
  products: [
    {
      key: "brasa-classica",
      titleKey: "home.vitrine.products.brasaClassica.title",
      descriptionKey: "home.vitrine.products.brasaClassica.description",
      imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=82",
      routeKey: "cortes",
    },
    {
      key: "box-familia",
      titleKey: "home.vitrine.products.boxFamilia.title",
      descriptionKey: "home.vitrine.products.boxFamilia.description",
      imageUrl: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=900&q=82",
      routeKey: "produtos",
    },
    {
      key: "linha-nobre",
      titleKey: "home.vitrine.products.linhaNobre.title",
      descriptionKey: "home.vitrine.products.linhaNobre.description",
      imageUrl: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=900&q=82",
      routeKey: "cortes",
    },
  ] satisfies HomeVitrineProductConfig[],
  guestNotice: {
    key: "guest",
    titleKey: "home.vitrine.guestNotice.title",
    descriptionKey: "home.vitrine.guestNotice.description",
    routeKey: "minhaConta",
    tone: "neutral",
  } satisfies HomeVitrineNoticeConfig,
  customerNotices: [
    {
      key: "next-box",
      titleKey: "home.vitrine.customerNotices.nextBox.title",
      descriptionKey: "home.vitrine.customerNotices.nextBox.description",
      routeKey: "minhaCaixa",
      tone: "primary",
    },
    {
      key: "current-order",
      titleKey: "home.vitrine.customerNotices.currentOrder.title",
      descriptionKey: "home.vitrine.customerNotices.currentOrder.description",
      routeKey: "meusPedidos",
      tone: "accent",
    },
  ] satisfies HomeVitrineNoticeConfig[],
};
