export const usuariosConfig = {
  screenKey: "usuarios",
  screenType: "standard",
  entityNameKey: "entities.userCustomer",
  dataSource: { key: "usuarios", fallbackOnError: false },
  listPage: {
    titleKey: "usuarios.title",
    subtitleKey: "usuarios.subtitle",
    searchPlaceholderKey: "common.searchPlaceholder",
    columns: [
    { key: "name", labelKey: "usuarios.tableHeaders.customerName", showAvatar: true },
    { key: "email", labelKey: "usuarios.tableHeaders.email" },
    { key: "phone", labelKey: "usuarios.tableHeaders.phone" },
    { key: "activePlan", labelKey: "usuarios.tableHeaders.planName" },
    { key: "statusLabelKey", labelKey: "usuarios.tableHeaders.status", valueType: "translationKey" },
    { key: "memberSince", labelKey: "usuarios.tableHeaders.joinedDate" },
    ],
    filters: [
    {
      key: "status",
      labelKey: "common.status",
      options: [
        { value: "active", labelKey: "common.statusActive" },
        { value: "inactive", labelKey: "common.statusInactive" },
      ],
    },
    ],
  },
  detailPage: {
    titleKey: "usuarios.title",
    displayNameKey: "name",
    tabs: [{
      id: "data",
      labelKey: "usuarios.title",
      sections: [{
        key: "identity",
        type: "fields",
        titleKey: "usuarios.title",
        iconIntent: "identity",
        grid: { desktop: 3, tablet: 2, mobile: 1 },
        fields: [
          { key: "name", labelKey: "usuarios.form.name" },
          { key: "email", labelKey: "usuarios.form.email" },
          { key: "phone", labelKey: "usuarios.form.phone" },
          { key: "activePlan", labelKey: "usuarios.form.activePlan" },
          { key: "statusLabelKey", labelKey: "usuarios.tableHeaders.status", valueType: "translationKey" },
          { key: "memberSince", labelKey: "usuarios.tableHeaders.joinedDate" },
        ],
      }],
    }],
  },
};
