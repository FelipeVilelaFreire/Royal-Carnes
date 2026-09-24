export const categoriasConfig = {
  screenKey: "categorias",
  screenType: "standard",
  entityNameKey: "entities.category",
  dataSource: {
    key: "categorias",
    fallbackOnError: false
  },
  listPage: {
    titleKey: "categorias.title",
    subtitleKey: "categorias.subtitle",
    actionLabelKey: "categorias.ctaAdd",
    searchPlaceholderKey: "categorias.searchPlaceholder",
    tree: { nodeKey: "key", parentKey: "parentKey" },
    columns: [
      { key: "name", labelKey: "categorias.tableHeaders.name", presentation: "tree", sortable: false },
      { key: "sortOrder", labelKey: "categorias.tableHeaders.sortOrder", sortable: false },
      { key: "statusLabelKey", labelKey: "categorias.tableHeaders.status", sortable: false, valueType: "translationKey", statusToneKey: "statusTone" }
    ],
    filters: [
      { key: "parentKey", labelKey: "categorias.fields.parent", source: "categorias" },
      {
        key: "isActive",
        labelKey: "categorias.filters.status",
        options: [
          { value: "true", labelKey: "common.statusActive" },
          { value: "false", labelKey: "common.statusInactive" }
        ]
      }
    ]
  },
  detailPage: {
    titleKey: "categorias.detail.title",
    displayNameKey: "name",
    tabs: [
      {
        id: "data",
        labelKey: "categorias.detail.tabs.data",
        emptyKey: "categorias.detail.emptyData",
        sections: [{
          key: "identity",
          type: "fields",
          titleKey: "categorias.detail.sections.identity",
          iconIntent: "catalog",
          grid: { desktop: 3, tablet: 2, mobile: 1 },
          fields: [
          { key: "name", labelKey: "categorias.fields.name", editable: true },
          { key: "key", labelKey: "categorias.fields.key", editable: true },
          { key: "parentKey", labelKey: "categorias.fields.parent", type: "select", source: "categorias", editable: true },
          { key: "sortOrder", labelKey: "categorias.fields.sortOrder", type: "number", editable: true },
          {
            key: "isActive",
            displayKey: "statusLabelKey",
            labelKey: "categorias.fields.status",
            type: "select",
            valueType: "translationKey",
            editable: true,
            options: [
              { value: "true", labelKey: "common.statusActive" },
              { value: "false", labelKey: "common.statusInactive" }
            ]
          }
          ]
        }, {
          key: "relations",
          type: "fields",
          titleKey: "categorias.detail.sections.relations",
          iconIntent: "catalog",
          grid: { desktop: 2, tablet: 2, mobile: 1 },
          fields: [
            { key: "parentName", labelKey: "categorias.fields.parent" },
            { key: "childCategoriesSummary", labelKey: "categorias.fields.children" }
          ]
        }]
      },
      {
        id: "products",
        labelKey: "categorias.detail.tabs.products",
        emptyKey: "categorias.detail.emptyProducts",
        sections: [{
          key: "products",
          type: "fields",
          iconIntent: "catalog",
          grid: { desktop: 1, tablet: 1, mobile: 1 },
          fields: [{
            key: "categoryProductKeys",
            labelKey: "categorias.detail.tabs.products",
            display: { key: "products", type: "lineItems" },
            edit: {
              type: "multiSelect",
              source: "produtos",
              searchable: true,
              optionPresentation: "media",
              searchPlaceholderKey: "categorias.detail.searchProductsPlaceholder",
              searchEmptyKey: "categorias.detail.emptyProductSearch",
            },
            columns: [
              { key: "name", labelKey: "produtos.tableHeaders.name", type: "text", presentation: "media" },
              { key: "categoryLabel", labelKey: "produtos.tableHeaders.category", type: "text" },
              { key: "unit", labelKey: "produtos.tableHeaders.unit", type: "text" },
              { key: "priceFormatted", labelKey: "produtos.tableHeaders.price", type: "text", align: "end" },
            ],
          }],
        }],
      }
    ]
  },
  addPage: {
    titleKey: "categorias.add.title",
    submitLabelKey: "categorias.add.submit",
    sections: [
      {
        key: "data",
        titleKey: "categorias.add.sections.data",
        fields: [
          { key: "name", labelKey: "categorias.fields.name", required: true },
          { key: "key", labelKey: "categorias.fields.key", required: true },
          {
            key: "parentKey",
            helperKey: "categorias.add.helpers.parent",
            labelKey: "categorias.fields.parent",
            type: "select",
            source: "categorias"
          },
          { key: "sortOrder", labelKey: "categorias.fields.sortOrder", type: "number" },
          {
            key: "isActive",
            labelKey: "categorias.fields.status",
            type: "select",
            options: [
              { value: "true", labelKey: "common.statusActive" },
              { value: "false", labelKey: "common.statusInactive" }
            ]
          }
        ]
      }
    ]
  }
};
