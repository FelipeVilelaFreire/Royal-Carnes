import { mockAdminDeliveries } from "../../mocks/deliveries.mock";

export const caixasConfig = {
  screenKey: "caixas",
  titleKey: "caixas.title",
  subtitleKey: "caixas.subtitle",
  entityNameKey: "entities.box",
  actionLabelKey: "caixas.ctaBatchDispatch",
  columns: [
    { key: "id", labelKey: "caixas.tableHeaders.id" },
    { key: "customerName", labelKey: "caixas.tableHeaders.customerName" },
    { key: "planName", labelKey: "caixas.tableHeaders.planName" },
    { key: "status", labelKey: "caixas.tableHeaders.status" },
    { key: "scheduledDate", labelKey: "caixas.tableHeaders.scheduledDate" },
  ],
  filters: [
    {
      key: "status",
      labelKey: "deliveries.filters.status",
      options: [
        { value: "packing", labelKey: "common.statusPacking" },
        { value: "pending", labelKey: "common.statusPending" },
      ],
    },
  ],
  form: {
    fields: [
      { key: "customerName", labelKey: "deliveries.form.customerName", required: true },
      { key: "planName", labelKey: "deliveries.form.planName" },
      { key: "scheduledDate", labelKey: "deliveries.form.scheduledDate" },
      { key: "address", labelKey: "deliveries.form.address", type: "textarea" },
    ],
  },
  rows: mockAdminDeliveries,
};
