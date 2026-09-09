const planEntitlementColumns = [
  {
    key: "targetKey",
    labelKey: "planos.fields.product",
    type: "select",
    required: true,
    source: "produtos",
    writeValues: {
      targetType: "product"
    },
    writeOptionMeta: {
      measurementUnitKey: "measurementUnitKey"
    }
  },
  {
    key: "quantity",
    labelKey: "planos.fields.limit",
    type: "number",
    required: true,
    suffixKey: "measurementUnitKey"
  }
];

export const planosConfig = {
  screenKey: "planos",
  screenType: "standard",
  entityNameKey: "entities.plan",
  dataSource: { key: "planos", fallbackOnError: false },
  listPage: {
    titleKey: "planos.title",
    subtitleKey: "planos.subtitle",
    actionLabelKey: "planos.ctaAdd",
    searchPlaceholderKey: "planos.searchPlaceholder",
    columns: [
      { key: "name", labelKey: "planos.tableHeaders.name" },
      { key: "priceCents", labelKey: "planos.tableHeaders.price", valueType: "currency", currency: "BRL", locale: "pt-BR" },
      { key: "billingIntervalLabelKey", labelKey: "planos.tableHeaders.billingInterval", valueType: "translationKey" },
      { key: "entitlementCount", labelKey: "planos.tableHeaders.includedItems" },
      { key: "activeSubscriberCount", labelKey: "planos.tableHeaders.activeSubscribers" },
      { key: "statusLabelKey", labelKey: "planos.tableHeaders.status", valueType: "translationKey" }
    ],
    filters: [
      {
        key: "status",
        labelKey: "planos.filters.status",
        options: [
          { value: "active", labelKey: "common.statusActive" },
          { value: "draft", labelKey: "common.statusDraft" },
          { value: "archived", labelKey: "common.statusArchived" }
        ]
      }
    ]
  },
  detailPage: {
    titleKey: "planos.detail.title",
    displayNameKey: "name",
    tabs: [
      {
        id: "dados",
        labelKey: "planos.detail.tabs.data",
        emptyKey: "planos.detail.emptyData",
        sections: [
          {
            key: "identity",
            titleKey: "planos.detail.sections.identity",
            fields: [
              { key: "name", labelKey: "planos.fields.name", editable: true },
              { key: "key", labelKey: "planos.fields.key" },
              { key: "description", labelKey: "planos.fields.description", type: "textarea", editable: true }
            ]
          },
          {
            key: "commercial",
            titleKey: "planos.detail.sections.commercial",
            fields: [
              {
                key: "status",
                displayKey: "statusLabelKey",
                labelKey: "planos.fields.status",
                type: "select",
                valueType: "translationKey",
                editable: true,
                options: [
                  { value: "active", labelKey: "common.statusActive" },
                  { value: "draft", labelKey: "common.statusDraft" },
                  { value: "archived", labelKey: "common.statusArchived" }
                ]
              },
              {
                key: "billingInterval",
                displayKey: "billingIntervalLabelKey",
                labelKey: "planos.fields.billingInterval",
                type: "select",
                valueType: "translationKey",
                editable: true,
                options: [
                  { value: "day", labelKey: "planos.billingIntervals.day" },
                  { value: "week", labelKey: "planos.billingIntervals.week" },
                  { value: "month", labelKey: "planos.billingIntervals.month" },
                  { value: "year", labelKey: "planos.billingIntervals.year" }
                ]
              },
              { key: "priceCents", displayKey: "priceLabel", labelKey: "planos.fields.price", type: "currency", currency: "BRL", locale: "pt-BR", editable: true },
              { key: "trialDays", labelKey: "planos.fields.trialDays", type: "number", editable: true },
              { key: "sortOrder", labelKey: "planos.fields.sortOrder", type: "number", editable: true }
            ]
          }
        ]
      },
      {
        id: "itens",
        labelKey: "planos.detail.tabs.includedItems",
        emptyKey: "planos.detail.emptyIncludedItems",
        fields: [
          {
            key: "entitlements",
            labelKey: "planos.fields.includedItems",
            type: "lineItems",
            editable: true,
            addLabelKey: "planos.fields.addIncludedItem",
            columns: planEntitlementColumns
          }
        ]
      },
      {
        id: "assinantes",
        labelKey: "planos.detail.tabs.subscribers",
        emptyKey: "planos.detail.emptySubscribers",
        fields: [
          {
            key: "subscribers",
            labelKey: "planos.fields.subscribers",
            type: "relatedList",
            layout: "full",
            columns: [
              { key: "customerName", labelKey: "planos.subscribers.customer", showAvatar: true },
              { key: "statusLabelKey", labelKey: "planos.subscribers.status", valueType: "translationKey" },
              { key: "startedAt", labelKey: "planos.subscribers.startedAt" },
              { key: "currentCycleEndsAt", labelKey: "planos.subscribers.currentCycleEndsAt" }
            ]
          }
        ]
      }
    ]
  },
  addPage: {
    titleKey: "planos.add.title",
    submitLabelKey: "planos.add.submit",
    sections: [
      {
        key: "identity",
        titleKey: "planos.add.sections.identity",
        fields: [
          { key: "key", labelKey: "planos.fields.key", required: true },
          { key: "name", labelKey: "planos.fields.name", required: true },
          { key: "description", labelKey: "planos.fields.description", type: "textarea" }
        ]
      },
      {
        key: "commercial",
        titleKey: "planos.add.sections.commercial",
        fields: [
          {
            key: "status",
            labelKey: "planos.fields.status",
            type: "select",
            defaultValue: "active",
            required: true,
            options: [
              { value: "active", labelKey: "common.statusActive" },
              { value: "draft", labelKey: "common.statusDraft" },
              { value: "archived", labelKey: "common.statusArchived" }
            ]
          },
          {
            key: "billingInterval",
            labelKey: "planos.fields.billingInterval",
            type: "select",
            defaultValue: "month",
            required: true,
            options: [
              { value: "day", labelKey: "planos.billingIntervals.day" },
              { value: "week", labelKey: "planos.billingIntervals.week" },
              { value: "month", labelKey: "planos.billingIntervals.month" },
              { value: "year", labelKey: "planos.billingIntervals.year" }
            ]
          },
          { key: "priceCents", labelKey: "planos.fields.price", type: "currency", currency: "BRL", locale: "pt-BR", required: true },
          { key: "trialDays", labelKey: "planos.fields.trialDays", type: "number", defaultValue: 0 },
          { key: "sortOrder", labelKey: "planos.fields.sortOrder", type: "number", defaultValue: 0 }
        ]
      },
      {
        key: "includedItems",
        titleKey: "planos.add.sections.includedItems",
        fields: [
          {
            key: "entitlements",
            labelKey: "planos.fields.includedItems",
            type: "lineItems",
            addLabelKey: "planos.fields.addIncludedItem",
            columns: planEntitlementColumns
          }
        ]
      }
    ]
  }
};
