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
    filters: [{ key: "statusKey", labelKey: "deliveries.filters.status", source: "deliveryStatuses" }],
  },
  detailPage: {
    titleKey: "deliveries.title",
    displayNameKey: "code",
    header: {
      meta: [
        { key: "customerName", labelKey: "deliveries.tableHeaders.customerName" },
        { key: "orderCode", labelKey: "deliveries.tableHeaders.planName" },
      ],
    },
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
          { key: "statusKey", labelKey: "deliveries.tableHeaders.status", display: { key: "statusLabel", type: "text", valueType: "optionLabel" }, statusToneKey: "statusTone" },
          { key: "customerName", labelKey: "deliveries.tableHeaders.customerName" },
          { key: "orderCode", labelKey: "deliveries.tableHeaders.planName" },
          { key: "createdAt", labelKey: "deliveries.tableHeaders.scheduledDate" },
          { key: "promisedDeliveryStartsOn", labelKey: "pedidos.deliveries.promisedDeliveryStartsOn" },
          { key: "promisedDeliveryByOn", labelKey: "pedidos.deliveries.promisedDeliveryByOn" },
          { key: "deliveryPromiseStatusLabelKey", labelKey: "pedidos.tableHeaders.deliveryPromise", valueType: "translationKey", statusToneKey: "deliveryPromiseStatusTone" },
          { key: "deliveryBusinessDays", labelKey: "pedidos.tableHeaders.deliveryBusinessDays" },
        ],
      }],
    }, {
      id: "pedido",
      labelKey: "pedidos.title",
      sections: [{
        key: "pedido",
        type: "lineItems",
        titleKey: "pedidos.title",
        iconIntent: "box",
        grid: { desktop: 1, tablet: 1, mobile: 1 },
        itemsKey: "linkedOrder",
        labelKey: "pedidos.title",
        columns: [
          { key: "code", labelKey: "pedidos.tableHeaders.code", type: "text", detailScreenKey: "pedidos" },
          { key: "statusLabel", labelKey: "pedidos.tableHeaders.status", type: "text" },
        ],
      }],
    }],
  },
};
