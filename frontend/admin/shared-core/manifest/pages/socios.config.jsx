import { mockAdminSubscribers } from "../../mocks/subscribers.mock";

export const sociosConfig = {
  screenKey: "socios",
  titleKey: "socios.title",
  subtitleKey: "socios.subtitle",
  entityNameKey: "entities.member",
  actionLabelKey: "socios.ctaAdd",
  columns: [
    { key: "customerName", labelKey: "socios.tableHeaders.customerName" },
    { key: "planName", labelKey: "socios.tableHeaders.planName" },
    {
      key: "priceMonthly",
      labelKey: "socios.tableHeaders.priceMonthly",
      render: (row) => `R$ ${row.priceMonthly?.toFixed(2)}`,
    },
    { key: "status", labelKey: "socios.tableHeaders.status" },
    { key: "joinedDate", labelKey: "socios.tableHeaders.joinedDate" },
  ],
  filters: [
    {
      key: "status",
      labelKey: "socios.filters.status",
      options: [
        { value: "active", labelKey: "common.statusActive" },
        { value: "paused", labelKey: "common.statusPaused" },
      ],
    },
  ],
  form: {
    fields: [
      { key: "customerName", labelKey: "socios.form.customerName", required: true },
      { key: "email", labelKey: "socios.form.email" },
      { key: "planName", labelKey: "socios.form.planName" },
      { key: "priceMonthly", labelKey: "socios.form.priceMonthly" },
    ],
  },
  rows: mockAdminSubscribers,
};
