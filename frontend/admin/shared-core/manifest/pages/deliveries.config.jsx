export const deliveriesConfig = {
  screenKey: "deliveries",
  screenType: "standard",
  titleKey: "deliveries.title",
  subtitleKey: "deliveries.subtitle",
  entityNameKey: "entities.delivery",
  dataSource: { key: "deliveries", fallbackOnError: false },
  listPage: {
    titleKey: "deliveries.title",
    subtitleKey: "deliveries.subtitle",
    searchPlaceholderKey: "common.searchPlaceholder",
    columns: [
      { key: "code", labelKey: "deliveries.tableHeaders.id" },
      { key: "customerName", labelKey: "deliveries.tableHeaders.customerName", showAvatar: true },
      { key: "orderCode", labelKey: "deliveries.tableHeaders.planName" },
      { key: "statusLabel", labelKey: "deliveries.tableHeaders.status", valueType: "status", statusColorKey: "statusColor", statusToneKey: "statusTone" },
      { key: "createdAt", labelKey: "deliveries.tableHeaders.scheduledDate" },
    ],
    filters: [{
      key: "statusKey",
      labelKey: "deliveries.filters.status",
      options: [
        { value: "packing", labelKey: "common.statusPacking" },
        { value: "pending", labelKey: "common.statusPending" },
      ],
    }],
  },
  detailPage: {
    titleKey: "deliveries.title",
    displayNameKey: "code",
    tabs: [{
      id: "data",
      labelKey: "deliveries.title",
      sections: [{
        key: "delivery",
        type: "fields",
        titleKey: "deliveries.title",
        iconIntent: "delivery",
        grid: { desktop: 3, tablet: 2, mobile: 1 },
        fields: [
          { key: "code", labelKey: "deliveries.tableHeaders.id" },
          {
            key: "statusKey",
            labelKey: "deliveries.tableHeaders.status",
            display: { key: "statusLabel", type: "text", valueType: "optionLabel" },
            edit: { type: "select", source: "deliveryStatuses", transitionOnly: true },
          },
          { key: "customerName", labelKey: "deliveries.tableHeaders.customerName" },
          { key: "orderCode", labelKey: "deliveries.tableHeaders.planName" },
          { key: "createdAt", labelKey: "deliveries.tableHeaders.scheduledDate" },
        ],
      }],
    }],
  },
};
