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
      { key: "phone", labelKey: "clientes.tableHeaders.phone" },
      { key: "statusLabelKey", labelKey: "clientes.tableHeaders.status", valueType: "translationKey" },
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
    tabs: [
      {
        id: "dados",
        labelKey: "clientes.detail.tabs.data",
        emptyKey: "clientes.detail.emptyData",
        fields: [
          { key: "name", labelKey: "clientes.fields.name", editable: true },
          { key: "email", labelKey: "clientes.fields.email", editable: true },
          { key: "phone", labelKey: "clientes.fields.phone", editable: true },
          { key: "document", labelKey: "clientes.fields.document", editable: true },
          {
            key: "status",
            labelKey: "clientes.fields.status",
            editable: true,
            type: "select",
            valueType: "optionLabel",
            options: [
              { value: "active", labelKey: "common.statusActive" },
              { value: "paused", labelKey: "common.statusPaused" },
              { value: "blocked", labelKey: "common.statusBlocked" },
              { value: "archived", labelKey: "common.statusArchived" }
            ]
          },
          { key: "memberSince", labelKey: "clientes.fields.memberSince" }
        ]
      },
      {
        id: "enderecos",
        labelKey: "clientes.detail.tabs.addresses",
        emptyKey: "clientes.detail.emptyAddresses",
        fields: [
          { key: "defaultAddress", labelKey: "clientes.fields.defaultAddress" },
          { key: "addressCount", labelKey: "clientes.fields.addressCount" }
        ]
      },
      {
        id: "historico",
        labelKey: "clientes.detail.tabs.history",
        emptyKey: "clientes.detail.emptyHistory",
        fields: [
          { key: "createdAt", labelKey: "clientes.fields.createdAt" },
          { key: "updatedAt", labelKey: "clientes.fields.updatedAt" }
        ]
      }
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
          { key: "document", labelKey: "clientes.fields.document" }
        ]
      },
      {
        key: "contact",
        titleKey: "clientes.add.sections.contact",
        fields: [
          { key: "email", labelKey: "clientes.fields.email" },
          { key: "phone", labelKey: "clientes.fields.phone" }
        ]
      }
    ]
  },
  rows: []
};
