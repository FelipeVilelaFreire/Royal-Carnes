import { mockAdminOrders } from "../../mocks/orders.mock";

export const pedidosConfig = {
  screenKey: "pedidos",
  titleKey: "pedidos.title",
  subtitleKey: "pedidos.subtitle",
  entityNameKey: "entities.order",
  actionLabelKey: "pedidos.ctaAdd",
  dataSource: { key: "pedidos", fallbackOnError: false },
  columns: [
    { key: "code", labelKey: "pedidos.tableHeaders.code" },
    { key: "customerName", labelKey: "pedidos.tableHeaders.customerName" },
    { key: "kindLabel", labelKey: "pedidos.tableHeaders.kindLabel" },
    { key: "summary", labelKey: "pedidos.tableHeaders.summary" },
    { key: "totalFormatted", labelKey: "pedidos.tableHeaders.total" },
    { key: "statusLabel", labelKey: "pedidos.tableHeaders.status" },
    { key: "createdAt", labelKey: "pedidos.tableHeaders.createdAt" },
  ],
  filters: [
    {
      key: "status",
      labelKey: "common.status",
      options: [
        { value: "outForDelivery", labelKey: "common.statusOutForDelivery" },
        { value: "preparing", labelKey: "common.statusPreparing" },
        { value: "approved", labelKey: "common.statusApproved" },
        { value: "delivered", labelKey: "common.statusDelivered" },
      ],
    },
  ],
  form: {
    fields: [
      { key: "code", labelKey: "pedidos.form.code", required: true },
      { key: "customerName", labelKey: "pedidos.form.customerName", required: true },
      { key: "summary", labelKey: "pedidos.form.summary", type: "textarea" },
      { key: "totalFormatted", labelKey: "pedidos.form.totalFormatted" },
    ],
  },
  rows: mockAdminOrders,
};
