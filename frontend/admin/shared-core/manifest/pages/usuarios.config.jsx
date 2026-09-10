export const usuariosConfig = {
  screenKey: "usuarios",
  titleKey: "usuarios.title",
  subtitleKey: "usuarios.subtitle",
  entityNameKey: "entities.userCustomer",
  actionLabelKey: "usuarios.ctaAdd",
  dataSource: { key: "usuarios", fallbackOnError: false },
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
  form: {
    fields: [
      { key: "name", labelKey: "usuarios.form.name", required: true },
      { key: "email", labelKey: "usuarios.form.email", required: true },
      { key: "phone", labelKey: "usuarios.form.phone" },
      { key: "activePlan", labelKey: "usuarios.form.activePlan" },
    ],
  },
};
