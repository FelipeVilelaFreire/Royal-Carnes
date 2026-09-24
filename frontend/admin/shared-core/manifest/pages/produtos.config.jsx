export const produtosConfig = {
  screenKey: "produtos",
  screenType: "standard",
  entityNameKey: "entities.product",
  dataSource: {
    key: "produtos",
    fallbackOnError: false
  },
  listPage: {
    titleKey: "produtos.title",
    subtitleKey: "produtos.subtitle",
    actionLabelKey: "produtos.ctaAdd",
    searchPlaceholderKey: "produtos.searchPlaceholder",
    columns: [
      { key: "name", labelKey: "produtos.tableHeaders.name", showMedia: true },
      { key: "categoryLabel", labelKey: "produtos.tableHeaders.category" },
      { key: "unit", labelKey: "produtos.tableHeaders.unit" },
      { key: "priceFormatted", labelKey: "produtos.tableHeaders.price" },
      { key: "statusLabelKey", labelKey: "produtos.tableHeaders.status", valueType: "translationKey", statusToneKey: "statusTone" }
    ],
    filters: [
      { key: "categoryKeys", labelKey: "produtos.filters.category", source: "categorias" },
      { key: "collectionKeys", labelKey: "produtos.filters.collection", source: "colecoes" },
      { key: "unit", labelKey: "produtos.filters.unit", source: "unidades" },
      {
        key: "status",
        labelKey: "produtos.filters.status",
        options: [
          { value: "active", labelKey: "common.statusActive" },
          { value: "draft", labelKey: "common.statusDraft" },
          { value: "archived", labelKey: "common.statusArchived" }
        ]
      }
    ]
  },
  detailPage: {
    titleKey: "produtos.detail.title",
    displayNameKey: "name",
    deleteAction: {
      confirmKey: "produtos.detail.delete.confirm",
      descriptionKey: "produtos.detail.delete.description",
      titleKey: "produtos.detail.delete.title"
    },
    tabs: [
      {
        id: "dados",
        labelKey: "produtos.detail.tabs.data",
        emptyKey: "produtos.detail.emptyData",
        sections: [
          {
            key: "identity",
            type: "fields",
            grid: { desktop: 4, tablet: 2, mobile: 1 },
            iconIntent: "identity",
            titleKey: "produtos.detail.sections.identity",
            fields: [
              { key: "name", labelKey: "produtos.fields.name", editable: true },
              { key: "key", labelKey: "produtos.fields.key", editable: true },
              {
                key: "status",
                displayKey: "statusLabelKey",
                labelKey: "produtos.fields.status",
                type: "select",
                valueType: "translationKey",
                editable: true,
                options: [
                  { value: "active", labelKey: "common.statusActive" },
                  { value: "draft", labelKey: "common.statusDraft" },
                  { value: "archived", labelKey: "common.statusArchived" }
                ]
              },
              { key: "unit", labelKey: "produtos.fields.unit", type: "select", source: "unidades", editable: true },
              { key: "description", labelKey: "produtos.fields.description", type: "textarea", editable: true }
            ]
          },
          {
            key: "catalog",
            type: "fields",
            grid: { desktop: 2, tablet: 2, mobile: 1 },
            iconIntent: "catalog",
            titleKey: "produtos.detail.sections.catalog",
            fields: [
              { key: "parentCategoryName", labelKey: "produtos.fields.parentCategory" },
              {
                key: "categoryKeys",
                display: { key: "primaryCategoryName", type: "text" },
                edit: { type: "select", source: "categorias" },
                labelKey: "produtos.fields.category"
              }
            ]
          },
          {
            key: "commercial",
            type: "fields",
            grid: { desktop: 2, tablet: 2, mobile: 1 },
            iconIntent: "commerce",
            titleKey: "produtos.detail.tabs.prices",
            fields: [
              {
                key: "priceCents",
                displayKey: "priceFormatted",
                labelKey: "produtos.fields.price",
                type: "currency",
                currency: "BRL",
                locale: "pt-BR",
                editable: true
              }
            ]
          },
        ]
      },
      {
        id: "media",
        labelKey: "produtos.detail.tabs.media",
        emptyKey: "produtos.detail.emptyMedia",
        sections: [{
          key: "media",
          type: "fields",
          grid: { desktop: 1, tablet: 1, mobile: 1 },
          iconIntent: "box",
          titleKey: "produtos.detail.tabs.media",
          fields: [
            { key: "image", labelKey: "produtos.fields.primaryImage", type: "asset", editable: true }
          ]
        }]
      },
      {
        id: "subscriptionPlans",
        labelKey: "produtos.detail.tabs.subscriptionPlans",
        emptyKey: "produtos.detail.emptySubscriptionPlans",
        sections: [{
          key: "subscriptionPlans",
          type: "lineItems",
          titleKey: "produtos.detail.sections.subscriptionPlans",
          iconIntent: "commerce",
          grid: { desktop: 1, tablet: 1, mobile: 1 },
          itemsKey: "subscriptionPlans",
          labelKey: "produtos.detail.sections.subscriptionPlans",
          columns: [
            { key: "planName", labelKey: "produtos.subscriptionPlans.plan", type: "text" },
            { key: "capacityLabel", labelKey: "produtos.subscriptionPlans.capacity", type: "text" },
            { key: "limitLabel", labelKey: "produtos.subscriptionPlans.limit", type: "text", align: "end" }
          ]
        }]
      }
    ]
  },
  addPage: {
    titleKey: "produtos.add.title",
    submitLabelKey: "produtos.add.submit",
    sections: [
      {
        key: "identity",
        titleKey: "produtos.add.sections.identity",
        fields: [
          { key: "key", labelKey: "produtos.fields.key", required: true },
          { key: "name", labelKey: "produtos.fields.name", required: true },
          { key: "description", labelKey: "produtos.fields.description", type: "textarea" },
          {
            key: "status",
            labelKey: "produtos.fields.status",
            type: "select",
            defaultValue: "active",
            required: true,
            options: [
              { value: "active", labelKey: "common.statusActive" },
              { value: "draft", labelKey: "common.statusDraft" },
              { value: "archived", labelKey: "common.statusArchived" }
            ]
          },
          { key: "unit", labelKey: "produtos.fields.unit", type: "select", source: "unidades", required: true },
          { key: "categoryKeys", labelKey: "produtos.fields.categoryKeys", type: "multiSelect", source: "categorias", required: true }
        ]
      },
      {
        key: "commercial",
        titleKey: "produtos.add.sections.commercial",
        fields: [
          { key: "priceCents", labelKey: "produtos.fields.price", type: "currency", currency: "BRL", locale: "pt-BR", required: true },
          { key: "commercialModeKeys", labelKey: "produtos.fields.commercialModeKeys", type: "multiSelect", source: "commercialModes", required: true },
          { key: "collectionKeys", labelKey: "produtos.fields.collectionKeys", type: "multiSelect", source: "colecoes" }
        ]
      },
      {
        key: "media",
        titleKey: "produtos.add.sections.media",
        fields: [
          { key: "image", labelKey: "produtos.fields.primaryImage", type: "asset" }
        ]
      }
    ]
  }
};
