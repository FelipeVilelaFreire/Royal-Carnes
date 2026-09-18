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
    header: {
      meta: [
        { key: "document", labelKey: "clientes.fields.document", format: "taxIdBR" },
        { key: "email", labelKey: "clientes.fields.email" }
      ],
      status: {
        key: "status",
        displayKey: "statusLabelKey",
        labelKey: "clientes.fields.status",
        valueType: "translationKey"
      }
    },
    tabs: [
      {
        id: "dados",
        labelKey: "clientes.detail.tabs.data",
        emptyKey: "clientes.detail.emptyData",
        sections: [{
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
            options: [
              { value: "active", labelKey: "common.statusActive" },
              { value: "paused", labelKey: "common.statusPaused" },
              { value: "blocked", labelKey: "common.statusBlocked" },
              { value: "archived", labelKey: "common.statusArchived" }
            ]
          },
          { key: "memberSince", labelKey: "clientes.fields.memberSince" }
          ]
        }]
      },
      {
        id: "enderecos",
        labelKey: "clientes.detail.tabs.addresses",
        emptyKey: "clientes.detail.emptyAddresses",
        sections: [{
          key: "address",
          type: "fields",
          titleKey: "clientes.detail.tabs.addresses",
          iconIntent: "delivery",
          grid: { desktop: 2, tablet: 2, mobile: 1 },
          fields: [
          { key: "defaultAddress", labelKey: "clientes.fields.defaultAddress" }
          ]
        }]
      },
      {
        id: "historico",
        labelKey: "clientes.detail.tabs.history",
        emptyKey: "clientes.detail.emptyHistory",
        sections: [{
          key: "history",
          type: "fields",
          titleKey: "clientes.detail.tabs.history",
          iconIntent: "settings",
          grid: { desktop: 2, tablet: 2, mobile: 1 },
          fields: [
          { key: "createdAt", labelKey: "clientes.fields.createdAt" },
          { key: "updatedAt", labelKey: "clientes.fields.updatedAt" }
          ]
        }]
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
