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
      { key: "key", labelKey: "produtos.tableHeaders.key" },
      { key: "categoryLabel", labelKey: "produtos.tableHeaders.category" },
      { key: "collectionLabel", labelKey: "produtos.tableHeaders.collection" },
      { key: "unit", labelKey: "produtos.tableHeaders.unit" },
      { key: "variantCount", labelKey: "produtos.tableHeaders.variants" },
      { key: "priceFormatted", labelKey: "produtos.tableHeaders.price" },
      { key: "commercialModeLabel", labelKey: "produtos.tableHeaders.commercialModes" },
      { key: "statusLabelKey", labelKey: "produtos.tableHeaders.status", valueType: "translationKey" }
    ],
    filters: [
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
    tabs: [
      {
        id: "dados",
        labelKey: "produtos.detail.tabs.data",
        emptyKey: "produtos.detail.emptyData",
        sections: [
          {
            key: "identity",
            titleKey: "produtos.detail.sections.identity",
            fields: [
              { key: "name", labelKey: "produtos.fields.name", editable: true },
              { key: "key", labelKey: "produtos.fields.key", editable: true },
              { key: "description", labelKey: "produtos.fields.description", type: "textarea", editable: true },
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
              { key: "unit", labelKey: "produtos.fields.unit", type: "select", source: "unidades", editable: true }
            ]
          },
          {
            key: "catalog",
            titleKey: "produtos.detail.sections.catalog",
            fields: [
              {
                key: "categoryKeys",
                displayKey: "allCategoryLabel",
                labelKey: "produtos.fields.categories",
                type: "multiSelect",
                source: "categorias",
                editable: true
              },
              {
                key: "collectionKeys",
                displayKey: "collectionLabel",
                labelKey: "produtos.fields.collections",
                type: "multiSelect",
                source: "colecoes",
                editable: true
              },
              {
                key: "commercialModeKeys",
                displayKey: "commercialModeLabel",
                labelKey: "produtos.fields.commercialModes",
                type: "multiSelect",
                source: "commercialModes",
                editable: true
              }
            ]
          },
          {
            key: "variants",
            titleKey: "produtos.detail.sections.variants",
            fields: [
              { key: "variantCount", labelKey: "produtos.fields.variantCount" }
            ]
          }
        ]
      },
      {
        id: "precos",
        labelKey: "produtos.detail.tabs.prices",
        emptyKey: "produtos.detail.emptyPrices",
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
      {
        id: "midia",
        labelKey: "produtos.detail.tabs.media",
        emptyKey: "produtos.detail.emptyMedia",
        fields: [
          { key: "image", labelKey: "produtos.fields.primaryImage", type: "asset", editable: true }
        ]
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
