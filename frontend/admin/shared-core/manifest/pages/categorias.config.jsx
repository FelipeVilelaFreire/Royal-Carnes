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
    columns: [
      { key: "name", labelKey: "categorias.tableHeaders.name" },
      { key: "key", labelKey: "categorias.tableHeaders.key" },
      { key: "parentName", labelKey: "categorias.tableHeaders.parent" },
      { key: "sortOrder", labelKey: "categorias.tableHeaders.sortOrder" },
      { key: "statusLabelKey", labelKey: "categorias.tableHeaders.status", valueType: "translationKey" }
    ],
    filters: [
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
        fields: [
          { key: "name", labelKey: "categorias.fields.name", editable: true },
          { key: "key", labelKey: "categorias.fields.key", editable: true },
          { key: "parentName", labelKey: "categorias.fields.parent" },
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
