import { mockAdminCustomers } from "../../mocks/customers.mock";

export const usuariosConfig = {
  screenKey: "usuarios",
  titleKey: "usuarios.title",
  subtitleKey: "usuarios.subtitle",
  entityName: "Usuário / Cliente",
  actionLabelKey: "usuarios.ctaAdd",
  columns: [
    { key: "name", labelKey: "usuarios.tableHeaders.customerName" },
    { key: "email", labelKey: "usuarios.tableHeaders.email" },
    { key: "phone", labelKey: "Telefone" },
    { key: "activePlan", labelKey: "usuarios.tableHeaders.planName" },
    { key: "statusLabel", labelKey: "usuarios.tableHeaders.status" },
    { key: "memberSince", labelKey: "usuarios.tableHeaders.joinedDate" }
  ],
  filters: [
    {
      key: "status",
      labelKey: "Status",
      options: [
        { value: "ativo", labelKey: "Ativo" },
        { value: "pausado", labelKey: "Pausado" }
      ]
    }
  ],
  form: {
    fields: [
      { key: "name", labelKey: "Nome do Cliente", required: true },
      { key: "email", labelKey: "E-mail de Contato", required: true },
      { key: "phone", labelKey: "Telefone" },
      { key: "activePlan", labelKey: "Plano Ativo" }
    ]
  },
  rows: mockAdminCustomers.map((cust) => ({
    ...cust,
    statusLabel: cust.status === "ativo" ? "Ativo" : "Pausado"
  }))
};
