import { mockAdminCustomers } from "../../mocks/customers.mock";

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
    { key: "statusLabel", labelKey: "usuarios.tableHeaders.status" },
    { key: "memberSince", labelKey: "usuarios.tableHeaders.joinedDate" },
  ],
  filters: [
    {
      key: "status",
      labelKey: "common.status",
      options: [
        { value: "ativo", labelKey: "common.statusActive" },
        { value: "pausado", labelKey: "common.statusPaused" },
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
  rows: mockAdminCustomers.map((customer) => ({
    ...customer,
    statusLabel: customer.status === "ativo" ? "Ativo" : "Pausado",
  })),
};
