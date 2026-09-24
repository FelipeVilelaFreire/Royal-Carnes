export const colecoesConfig = {
  screenKey: "colecoes",
  screenType: "standard",
  entityNameKey: "entities.collection",
  dataSource: {
    key: "colecoes",
    fallbackOnError: false
  },
  listPage: {
    titleKey: "colecoes.title",
    subtitleKey: "colecoes.subtitle",
    searchPlaceholderKey: "colecoes.searchPlaceholder",
    columns: [
      { key: "name", labelKey: "colecoes.tableHeaders.name", showMedia: true },
      { key: "key", labelKey: "colecoes.tableHeaders.key" },
      { key: "productCount", labelKey: "colecoes.tableHeaders.productCount" },
      { key: "sortOrder", labelKey: "colecoes.tableHeaders.sortOrder" },
      { key: "statusLabelKey", labelKey: "colecoes.tableHeaders.status", valueType: "translationKey", statusToneKey: "statusTone" }
    ],
    filters: [
      {
        key: "status",
        labelKey: "colecoes.filters.status",
        options: [
          { value: "active", labelKey: "common.statusActive" },
          { value: "draft", labelKey: "common.statusDraft" },
          { value: "archived", labelKey: "common.statusArchived" }
        ]
      }
    ]
  },
  detailPage: {
    titleKey: "colecoes.detail.title",
    displayNameKey: "name",
    tabs: [
      {
        id: "dados",
        labelKey: "colecoes.detail.tabs.data",
        emptyKey: "colecoes.detail.emptyData",
        sections: [{
          key: "identity",
          type: "fields",
          titleKey: "colecoes.detail.tabs.data",
          iconIntent: "catalog",
          grid: { desktop: 3, tablet: 2, mobile: 1 },
          fields: [
          { key: "name", labelKey: "colecoes.fields.name" },
          { key: "key", labelKey: "colecoes.fields.key" },
          { key: "image", labelKey: "colecoes.fields.image" },
          { key: "description", labelKey: "colecoes.fields.description" },
          { key: "sortOrder", labelKey: "colecoes.fields.sortOrder" },
          { key: "statusLabelKey", labelKey: "colecoes.fields.status", valueType: "translationKey" }
          ]
        }]
      },
      {
        id: "produtos",
        labelKey: "colecoes.detail.tabs.products",
        emptyKey: "colecoes.detail.emptyProducts",
        sections: [{
          key: "products",
          type: "fields",
          titleKey: "colecoes.detail.tabs.products",
          iconIntent: "catalog",
          grid: { desktop: 1, tablet: 1, mobile: 1 },
          fields: [{
            key: "collectionProductKeys",
            labelKey: "colecoes.detail.tabs.products",
            display: { key: "products", type: "lineItems" },
            edit: {
              type: "multiSelect",
              source: "produtos",
              searchable: true,
              optionPresentation: "media",
              searchPlaceholderKey: "colecoes.detail.searchProductsPlaceholder",
              searchEmptyKey: "colecoes.detail.emptyProductSearch"
            },
            columns: [
              { key: "name", labelKey: "produtos.tableHeaders.name", type: "text", presentation: "media" },
              { key: "categoryLabel", labelKey: "produtos.tableHeaders.category", type: "text" },
              { key: "unit", labelKey: "produtos.tableHeaders.unit", type: "text" },
              { key: "priceFormatted", labelKey: "produtos.tableHeaders.price", type: "text", align: "end" }
            ]
          }]
        }]
      }
    ]
  }
};
