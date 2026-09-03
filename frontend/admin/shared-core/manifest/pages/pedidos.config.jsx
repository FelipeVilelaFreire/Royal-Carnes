import { mockAdminOrders } from "../../mocks/orders.mock";

export const pedidosConfig = {
  screenKey: "pedidos",
  titleKey: "pedidos.title",
  subtitleKey: "pedidos.subtitle",
  entityName: "Pedido Comercial",
  actionLabelKey: "pedidos.ctaAdd",
  columns: [
    { key: "code", labelKey: "pedidos.tableHeaders.code" },
    { key: "customerName", labelKey: "pedidos.tableHeaders.customerName" },
    { key: "kindLabel", labelKey: "pedidos.tableHeaders.kindLabel" },
    { key: "summary", labelKey: "pedidos.tableHeaders.summary" },
    { key: "totalFormatted", labelKey: "pedidos.tableHeaders.total" },
    { key: "statusLabel", labelKey: "pedidos.tableHeaders.status" },
    { key: "createdAt", labelKey: "pedidos.tableHeaders.createdAt" }
  ],
  filters: [
    {
      key: "status",
      labelKey: "Status",
      options: [
        { value: "outForDelivery", labelKey: "Saiu para Entrega" },
        { value: "preparing", labelKey: "Em Preparação" },
        { value: "approved", labelKey: "Aprovado" },
        { value: "delivered", labelKey: "Entregue" }
      ]
    }
  ],
  form: {
    fields: [
      { key: "code", labelKey: "Código do Pedido", required: true },
      { key: "customerName", labelKey: "Cliente", required: true },
      { key: "summary", labelKey: "Resumo dos Itens", type: "textarea" },
      { key: "totalFormatted", labelKey: "Total (R$)" }
    ]
  },
  rows: mockAdminOrders
};
