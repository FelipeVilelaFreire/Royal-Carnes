export const pedidosConfig = {
  screenKey: "pedidos",
  screenType: "standard",
  entityNameKey: "entities.order",
  dataSource: { key: "pedidos", fallbackOnError: false },
  listPage: {
    titleKey: "pedidos.title",
    subtitleKey: "pedidos.subtitle",
    actionLabelKey: "pedidos.ctaAdd",
    searchPlaceholderKey: "pedidos.searchPlaceholder",
    columns: [
      { key: "code", labelKey: "pedidos.tableHeaders.code" },
      { key: "customerName", labelKey: "pedidos.tableHeaders.customerName", showAvatar: true },
      { key: "kindLabel", labelKey: "pedidos.tableHeaders.kindLabel" },
      { key: "statusLabel", labelKey: "pedidos.tableHeaders.status", valueType: "status", statusColorKey: "statusColor", statusToneKey: "statusTone" },
      { key: "totalFormatted", labelKey: "pedidos.tableHeaders.total" },
    ],
    filters: [
      {
        key: "status",
        labelKey: "common.status",
        options: [
          { value: "received", labelKey: "common.statusReceived" },
          { value: "approved", labelKey: "common.statusApproved" },
          { value: "separating", labelKey: "common.statusSeparating" },
          { value: "ready", labelKey: "common.statusReady" },
          { value: "completed", labelKey: "common.statusCompleted" },
          { value: "cancelled", labelKey: "common.statusCancelled" },
        ],
      },
    ],
  },
  detailPage: {
    titleKey: "pedidos.detail.title",
    displayNameKey: "code",
    tabs: [
      {
        id: "dados",
        labelKey: "pedidos.detail.tabs.data",
        emptyKey: "pedidos.detail.emptyData",
        sections: [
          {
            key: "items",
            type: "lineItems",
            titleKey: "pedidos.detail.tabs.items",
            iconIntent: "box",
            grid: { desktop: 1, tablet: 1, mobile: 1 },
            itemsKey: "items",
            labelKey: "pedidos.fields.items",
            columns: [
              { key: "nameSnapshot", labelKey: "pedidos.items.name", type: "text" },
              { key: "quantityLabel", labelKey: "pedidos.items.quantity", type: "text" },
              { key: "unitPriceFormatted", labelKey: "pedidos.items.unitPrice", type: "text" },
              { key: "totalFormatted", labelKey: "pedidos.items.total", type: "text" },
            ],
          },
          {
            key: "summary",
            type: "fields",
            titleKey: "pedidos.detail.tabs.data",
            iconIntent: "identity",
            grid: { desktop: 3, tablet: 2, mobile: 1 },
            fields: [
              { key: "code", labelKey: "pedidos.fields.code" },
              { key: "customerName", labelKey: "pedidos.fields.customer" },
              { key: "kindLabel", labelKey: "pedidos.fields.kind" },
              {
                key: "statusKey",
                labelKey: "pedidos.fields.status",
                display: { key: "statusLabel", type: "text", valueType: "optionLabel" },
                edit: { type: "select", source: "orderStatuses", transitionOnly: true },
              },
              { key: "totalFormatted", labelKey: "pedidos.fields.total" },
              { key: "createdAt", labelKey: "pedidos.fields.createdAt" },
              { key: "notes", labelKey: "pedidos.fields.notes", type: "textarea", layout: "full" },
            ],
          },
        ],
      },
      {
        id: "assinatura",
        labelKey: "pedidos.detail.tabs.subscription",
        emptyKey: "pedidos.detail.emptySubscription",
        sections: [{ key: "subscription", type: "fields", titleKey: "pedidos.detail.tabs.subscription", iconIntent: "commerce", grid: { desktop: 3, tablet: 2, mobile: 1 }, fields: [
          { key: "recurrenceLabel", labelKey: "pedidos.fields.recurrence" },
          { key: "subscriptionCycleLabel", labelKey: "pedidos.fields.subscriptionCycle" },
          { key: "subscriptionCycleStatus", labelKey: "pedidos.fields.subscriptionCycleStatus" },
        ] }],
      },
    ],
  },
  addPage: {
    titleKey: "pedidos.add.title",
    submitLabelKey: "pedidos.add.submit",
    sections: [
      {
        key: "data",
        titleKey: "pedidos.add.sections.data",
        fields: [
          { key: "customerId", labelKey: "pedidos.fields.customer", type: "select", source: "clientes", required: true },
          { key: "kindKey", labelKey: "pedidos.fields.kind", type: "select", source: "tiposPedido", required: true },
          { key: "subscriptionId", labelKey: "pedidos.fields.subscription", type: "select", source: "assinaturas" },
          { key: "subscriptionCycleId", labelKey: "pedidos.fields.subscriptionCycle", type: "select", source: "ciclosAssinatura" },
          { key: "addressId", labelKey: "pedidos.fields.address", type: "select", source: "enderecos" },
          { key: "notes", labelKey: "pedidos.fields.notes", type: "textarea" },
        ],
      },
      {
        key: "items",
        titleKey: "pedidos.add.sections.items",
        fields: [
          {
            key: "items",
            labelKey: "pedidos.fields.items",
            type: "lineItems",
            required: true,
            addLabelKey: "pedidos.items.add",
            columns: [
              { key: "productKey", labelKey: "pedidos.items.product", type: "select", presentation: "media", source: "produtos", required: true },
              { key: "variantSku", labelKey: "pedidos.items.variant", type: "select", source: "variantes" },
              { key: "quantity", labelKey: "pedidos.items.quantity", type: "number", required: true },
              { key: "sourceType", labelKey: "pedidos.items.source", type: "text" },
              { key: "sourceKey", labelKey: "pedidos.items.sourceKey", type: "text" },
            ],
          },
        ],
      },
    ],
  },
};
