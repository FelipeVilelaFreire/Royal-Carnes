import { mockAdminDeliveries } from "../../mocks/deliveries.mock";

export const deliveriesConfig = {
  screenKey: "deliveries",
  titleKey: "deliveries.title",
  subtitleKey: "deliveries.subtitle",
  entityNameKey: "entities.delivery",
  actionLabelKey: "deliveries.ctaBatchDispatch",
  dataSource: { key: "deliveries", fallbackOnError: false },
  columns: [
    { key: "id", labelKey: "deliveries.tableHeaders.id" },
    { key: "customerName", labelKey: "deliveries.tableHeaders.customerName" },
    { key: "planName", labelKey: "deliveries.tableHeaders.planName" },
    { key: "status", labelKey: "deliveries.tableHeaders.status" },
    { key: "scheduledDate", labelKey: "deliveries.tableHeaders.scheduledDate" },
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
