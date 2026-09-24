export const clientesConfig = {
  screenKey: "clientes",
  screenType: "standard",
  entityNameKey: "entities.customer",
  dataSource: { key: "clientes", fallbackOnError: false },
  listPage: {
    titleKey: "clientes.title",
    subtitleKey: "clientes.subtitle",
    actionLabelKey: "clientes.ctaAdd",
    searchPlaceholderKey: "clientes.searchPlaceholder",
    showActions: false,
    columns: [
      { key: "name", labelKey: "clientes.tableHeaders.name", showAvatar: true },
      { key: "email", labelKey: "clientes.tableHeaders.email" },
      { key: "phone", labelKey: "clientes.tableHeaders.phone", format: "phoneBR" },
      {
        key: "statusLabelKey",
        labelKey: "clientes.tableHeaders.status",
        valueType: "translationKey",
        statusToneKey: "statusTone"
      },
      { key: "addressCount", labelKey: "clientes.tableHeaders.addressCount" }
    ],
    filters: [
      {
        key: "status",
        labelKey: "clientes.filters.status",
        options: [
          { value: "active", labelKey: "common.statusActive" },
          { value: "paused", labelKey: "common.statusPaused" },
          { value: "blocked", labelKey: "common.statusBlocked" },
          { value: "archived", labelKey: "common.statusArchived" }
        ]
      }
    ]
  },
  detailPage: {
    titleKey: "clientes.detail.title",
    displayNameKey: "name",
    header: {
      meta: [
        { key: "document", labelKey: "clientes.fields.document", format: "taxIdBR" },
        { key: "email", labelKey: "clientes.fields.email" }
      ]
    },
    tabs: [
      {
        id: "dados",
        labelKey: "clientes.detail.tabs.data",
        emptyKey: "clientes.detail.emptyData",
        sections: [
          {
            key: "identity",
            type: "fields",
            titleKey: "clientes.detail.tabs.data",
            iconIntent: "identity",
            grid: { desktop: 3, tablet: 2, mobile: 1 },
            fields: [
              { key: "name", labelKey: "clientes.fields.name", editable: true },
              { key: "email", labelKey: "clientes.fields.email", editable: true },
              { key: "phone", labelKey: "clientes.fields.phone", editable: true, format: "phoneBR" },
              { key: "document", labelKey: "clientes.fields.document", editable: true, format: "taxIdBR" },
              {
                key: "status",
                labelKey: "clientes.fields.status",
                editable: true,
                type: "select",
                valueType: "optionLabel",
                statusToneKey: "statusTone",
                options: [
                  { value: "active", labelKey: "common.statusActive" },
                  { value: "paused", labelKey: "common.statusPaused" },
                  { value: "blocked", labelKey: "common.statusBlocked" },
                  { value: "archived", labelKey: "common.statusArchived" }
                ]
              },
              { key: "memberSince", labelKey: "clientes.fields.memberSince" },
              { key: "defaultAddress", labelKey: "clientes.fields.defaultAddress", layout: "full" }
            ]
          },
          {
            key: "subscriptionOverview",
            type: "fields",
            titleKey: "clientes.detail.sections.subscriptionOverview",
            iconIntent: "commerce",
            grid: { desktop: 3, tablet: 2, mobile: 1 },
            fields: [
              { key: "activePlanName", labelKey: "clientes.fields.activePlan" },
              { key: "subscriptionStatusLabelKey", labelKey: "clientes.fields.subscriptionStatus", valueType: "translationKey" },
              { key: "currentCycleWindow", labelKey: "clientes.fields.currentCycle" },
              { key: "deliveryWindowLabelKey", labelKey: "clientes.fields.deliveryWindow", valueType: "translationKey" }
            ]
          }
        ]
      },
      {
        id: "subscriptions",
        labelKey: "clientes.detail.tabs.subscriptions",
        emptyKey: "clientes.detail.emptySubscriptions",
        hideWhenEmpty: false,
        sections: [{
          key: "subscriptionsHistory",
          type: "lineItems",
          itemsKey: "subscriptions",
          iconIntent: "commerce",
          grid: { desktop: 1, tablet: 1, mobile: 1 },
          columns: [
            { key: "planName", labelKey: "assinaturas.tableHeaders.plan", type: "text" },
            { key: "statusLabelKey", labelKey: "assinaturas.tableHeaders.status", type: "text", valueType: "translationKey" },
            { key: "currentCycleWindow", labelKey: "assinaturas.tableHeaders.currentCycle", type: "text" },
            { key: "startedAt", labelKey: "clientes.fields.subscriptionSince", type: "text" }
          ]
        }]
      },
      {
        id: "orders",
        labelKey: "clientes.detail.tabs.orders",
        emptyKey: "clientes.detail.emptyOrders",
        hideWhenEmpty: false,
        sections: [{
          key: "ordersHistory",
          type: "lineItems",
          itemsKey: "orders",
          iconIntent: "box",
          grid: { desktop: 1, tablet: 1, mobile: 1 },
          columns: [
            { key: "code", labelKey: "pedidos.fields.code", type: "text", detailScreenKey: "pedidos" },
            { key: "statusLabel", labelKey: "pedidos.fields.status", type: "text" },
            { key: "totalFormatted", labelKey: "pedidos.fields.total", type: "text", align: "end" },
            { key: "createdAt", labelKey: "pedidos.fields.createdAt", type: "text" }
          ]
        }]
      },
      {
        id: "payments",
        labelKey: "clientes.detail.tabs.payments",
        emptyKey: "clientes.detail.emptyPayments",
        hideWhenEmpty: false,
        sections: [{
          key: "paymentsHistory",
          type: "lineItems",
          itemsKey: "payments",
          iconIntent: "commerce",
          grid: { desktop: 1, tablet: 1, mobile: 1 },
          columns: [
            { key: "reference", labelKey: "pagamentos.fields.reference", type: "text", detailScreenKey: "pagamentos" },
            { key: "subscriptionPlanName", labelKey: "pagamentos.fields.subscription", type: "text" },
            { key: "statusLabelKey", labelKey: "pagamentos.fields.status", type: "text", valueType: "translationKey" },
            { key: "amountLabel", labelKey: "pagamentos.fields.amount", type: "text", align: "end" },
            { key: "paidAt", labelKey: "pagamentos.fields.paidAt", type: "text" }
          ]
        }]
      },
    ]
  },
  addPage: {
    titleKey: "clientes.add.title",
    submitLabelKey: "clientes.add.submit",
    sections: [
      {
        key: "identity",
        titleKey: "clientes.add.sections.identity",
        fields: [
          { key: "name", labelKey: "clientes.fields.name", required: true },
          { key: "document", labelKey: "clientes.fields.document", format: "taxIdBR" }
        ]
      },
      {
        key: "contact",
        titleKey: "clientes.add.sections.contact",
        fields: [
          { key: "email", labelKey: "clientes.fields.email" },
          { key: "phone", labelKey: "clientes.fields.phone", format: "phoneBR" }
        ]
      }
    ]
  },
  rows: []
};
