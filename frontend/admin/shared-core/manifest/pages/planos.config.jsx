const planEntitlementColumns = [
  { key: "capacityLabel", labelKey: "planos.fields.capacityGroup", type: "text", required: true },
  {
    key: "targetType",
    labelKey: "planos.fields.capacityScope",
    type: "select",
    required: true,
    options: [
      { value: "collection", labelKey: "planos.capacityScopes.collection" },
      { value: "category", labelKey: "planos.capacityScopes.category" },
      { value: "product", labelKey: "planos.capacityScopes.product" },
      { value: "variant", labelKey: "planos.capacityScopes.variant" },
    ],
  },
  {
    key: "targetKey",
    labelKey: "planos.fields.allowedItems",
    type: "select",
    required: true,
    sourceBy: "targetType",
    sources: { collection: "colecoes", category: "categorias", product: "produtos", variant: "variantes" },
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
  },
  { key: "maxSelections", labelKey: "planos.fields.maxSelections", type: "number" },
];

const planItemLimitColumns = [
  { key: "capacityKey", labelKey: "planos.fields.capacityGroupKey", type: "text", required: true },
  { key: "targetKey", labelKey: "planos.fields.product", type: "select", required: true, source: "produtos", writeOptionMeta: { measurementUnitKey: "measurementUnitKey" } },
  { key: "maxQuantity", labelKey: "planos.fields.itemMaximum", type: "number", format: "decimalBR", required: true, suffixKey: "measurementUnitKey" },
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
            type: "fields",
            titleKey: "planos.detail.sections.identity",
            iconIntent: "identity",
            grid: { desktop: 2, tablet: 2, mobile: 1 },
            fields: [
              { key: "name", labelKey: "planos.fields.name", editable: true },
              { key: "key", labelKey: "planos.fields.key" },
              { key: "description", labelKey: "planos.fields.description", type: "textarea", editable: true }
            ]
          },
          {
            key: "commercial",
            type: "fields",
            titleKey: "planos.detail.sections.commercial",
            iconIntent: "commerce",
            grid: { desktop: 3, tablet: 2, mobile: 1 },
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
        sections: [{
          key: "includedItems",
          type: "lineItems",
          titleKey: "planos.detail.tabs.includedItems",
          iconIntent: "box",
          grid: { desktop: 1, tablet: 1, mobile: 1 },
          itemsKey: "entitlements",
          labelKey: "planos.fields.includedItems",
          editable: true,
          addLabelKey: "planos.fields.addIncludedItem",
          columns: planEntitlementColumns
        }, {
          key: "itemLimits",
          type: "lineItems",
          titleKey: "planos.detail.sections.itemLimits",
          iconIntent: "inventory",
          grid: { desktop: 1, tablet: 1, mobile: 1 },
          itemsKey: "itemLimits",
          labelKey: "planos.fields.itemLimits",
          editable: true,
          addLabelKey: "planos.fields.addItemLimit",
          columns: planItemLimitColumns
        }]
      },
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
      },
      {
        key: "itemLimits",
        titleKey: "planos.add.sections.itemLimits",
        fields: [{ key: "itemLimits", labelKey: "planos.fields.itemLimits", type: "lineItems", addLabelKey: "planos.fields.addItemLimit", columns: planItemLimitColumns }]
      }
    ]
  }
};
