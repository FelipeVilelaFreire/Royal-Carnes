export const dashboardConfig = {
  screenKey: "dashboard",
  screenType: "dashboard",
  titleKey: "dashboard.title",
  subtitleKey: "dashboard.subtitle",
  dataSource: {
    fallbackOnError: false,
    key: "dashboard",
  },
  widgets: [
    {
      iconKey: "revenue",
      key: "mrr",
      titleKey: "dashboard.kpis.mrr",
    },
    {
      iconKey: "subscribers",
      key: "subscribers",
      titleKey: "dashboard.kpis.activeSubscribers",
    },
    {
      iconKey: "deliveries",
      key: "deliveries",
      titleKey: "dashboard.kpis.pendingDeliveries",
    },
    {
      iconKey: "retention",
      key: "retention",
      titleKey: "dashboard.kpis.retentionRate",
    },
  ],
};
