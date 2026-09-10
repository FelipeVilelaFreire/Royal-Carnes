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
      { key: "statusLabel", labelKey: "pedidos.tableHeaders.status" },
      { key: "deliveryStatusLabel", labelKey: "pedidos.tableHeaders.deliveryStatus" },
      { key: "paymentStatusLabelKey", labelKey: "pedidos.tableHeaders.paymentStatus", valueType: "translationKey" },
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
        fields: [
          { key: "code", labelKey: "pedidos.fields.code" },
          { key: "customerName", labelKey: "pedidos.fields.customer" },
          { key: "kindLabel", labelKey: "pedidos.fields.kind" },
          { key: "statusLabel", labelKey: "pedidos.fields.status" },
          { key: "totalFormatted", labelKey: "pedidos.fields.total" },
          { key: "createdAt", labelKey: "pedidos.fields.createdAt" },
          { key: "notes", labelKey: "pedidos.fields.notes", type: "textarea", layout: "full" },
        ],
      },
      {
        id: "assinatura",
        labelKey: "pedidos.detail.tabs.subscription",
        emptyKey: "pedidos.detail.emptySubscription",
        fields: [
          { key: "recurrenceLabel", labelKey: "pedidos.fields.recurrence" },
          { key: "subscriptionCycleLabel", labelKey: "pedidos.fields.subscriptionCycle" },
          { key: "subscriptionCycleStatus", labelKey: "pedidos.fields.subscriptionCycleStatus" },
        ],
      },
      {
        id: "itens",
        labelKey: "pedidos.detail.tabs.items",
        emptyKey: "pedidos.detail.emptyItems",
        fields: [
          {
            key: "items",
            labelKey: "pedidos.fields.items",
            type: "relatedList",
            layout: "full",
            columns: [
              { key: "nameSnapshot", labelKey: "pedidos.items.name" },
              { key: "quantity", labelKey: "pedidos.items.quantity" },
              { key: "measurementUnitKey", labelKey: "pedidos.items.unit" },
              { key: "sourceType", labelKey: "pedidos.items.source" },
            ],
          },
        ],
      },
      {
        id: "entrega",
        labelKey: "pedidos.detail.tabs.delivery",
        emptyKey: "pedidos.detail.emptyDelivery",
        fields: [
          {
            key: "deliveries",
            labelKey: "pedidos.fields.deliveries",
            type: "relatedList",
            layout: "full",
            columns: [
              { key: "code", labelKey: "pedidos.deliveries.code" },
              { key: "statusLabel", labelKey: "pedidos.deliveries.status" },
              { key: "address", labelKey: "pedidos.deliveries.address" },
              { key: "confirmationCode", labelKey: "pedidos.deliveries.confirmationCode" },
              { key: "notes", labelKey: "pedidos.deliveries.notes" },
            ],
          },
        ],
      },
      {
        id: "pagamento",
        labelKey: "pedidos.detail.tabs.payment",
        emptyKey: "pedidos.detail.emptyPayment",
        fields: [
          {
            key: "payments",
            labelKey: "pedidos.fields.payments",
            type: "relatedList",
            layout: "full",
            columns: [
              { key: "reference", labelKey: "pedidos.payments.reference" },
              { key: "statusLabelKey", labelKey: "pedidos.payments.status", valueType: "translationKey" },
              { key: "amountLabel", labelKey: "pedidos.payments.amount" },
              { key: "dueAt", labelKey: "pedidos.payments.dueAt" },
              { key: "paidAt", labelKey: "pedidos.payments.paidAt" },
            ],
          },
        ],
      },
      {
        id: "historico",
        labelKey: "pedidos.detail.tabs.history",
        emptyKey: "pedidos.detail.emptyHistory",
        fields: [
          {
            key: "statusHistory",
            labelKey: "pedidos.fields.history",
            type: "relatedList",
            layout: "full",
            columns: [
              { key: "fromStatusKey", labelKey: "pedidos.history.from" },
              { key: "toStatusKey", labelKey: "pedidos.history.to" },
              { key: "note", labelKey: "pedidos.history.note" },
              { key: "createdAt", labelKey: "pedidos.history.createdAt" },
            ],
          },
        ],
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
              { key: "productKey", labelKey: "pedidos.items.product", type: "select", source: "produtos", required: true },
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
