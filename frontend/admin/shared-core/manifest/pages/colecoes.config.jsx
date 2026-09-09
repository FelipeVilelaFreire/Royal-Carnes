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
      { key: "statusLabelKey", labelKey: "colecoes.tableHeaders.status", valueType: "translationKey" }
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
        fields: [
          { key: "name", labelKey: "colecoes.fields.name" },
          { key: "key", labelKey: "colecoes.fields.key" },
          { key: "image", labelKey: "colecoes.fields.image" },
          { key: "description", labelKey: "colecoes.fields.description" },
          { key: "productCount", labelKey: "colecoes.fields.productCount" },
          { key: "sortOrder", labelKey: "colecoes.fields.sortOrder" },
          { key: "statusLabelKey", labelKey: "colecoes.fields.status", valueType: "translationKey" }
        ]
      }
    ]
  }
};
