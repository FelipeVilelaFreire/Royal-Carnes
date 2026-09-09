export const pagamentosConfig = {
  screenKey: "pagamentos",
  screenType: "standard",
  entityNameKey: "entities.payment",
  dataSource: { key: "pagamentos", fallbackOnError: false },
  listPage: {
    titleKey: "pagamentos.title",
    subtitleKey: "pagamentos.subtitle",
    actionLabelKey: "pagamentos.ctaAdd",
    searchPlaceholderKey: "pagamentos.searchPlaceholder",
    columns: [
      { key: "reference", labelKey: "pagamentos.tableHeaders.reference" },
      { key: "customerName", labelKey: "pagamentos.tableHeaders.customer", showAvatar: true },
      { key: "statusLabelKey", labelKey: "pagamentos.tableHeaders.status", valueType: "translationKey" },
      { key: "amountLabel", labelKey: "pagamentos.tableHeaders.amount" },
      { key: "dueAt", labelKey: "pagamentos.tableHeaders.dueAt" }
    ],
    filters: [
      {
        key: "status",
        labelKey: "pagamentos.filters.status",
        options: [
          { value: "pending", labelKey: "common.statusPending" },
          { value: "paid", labelKey: "common.statusPaid" },
          { value: "failed", labelKey: "common.statusFailed" },
          { value: "cancelled", labelKey: "common.statusCancelled" },
          { value: "refunded", labelKey: "common.statusRefunded" }
        ]
      }
    ]
  },
  detailPage: {
    titleKey: "pagamentos.detail.title",
    displayNameKey: "reference",
    tabs: [
      {
        id: "dados",
        labelKey: "pagamentos.detail.tabs.data",
        emptyKey: "pagamentos.detail.emptyData",
        fields: [
          { key: "reference", labelKey: "pagamentos.fields.reference", editable: true },
          { key: "customerName", labelKey: "pagamentos.fields.customer" },
          { key: "subscriptionPlanName", labelKey: "pagamentos.fields.subscriptionPlan" },
          { key: "orderCode", labelKey: "pagamentos.fields.order" },
          {
            key: "status",
            displayKey: "statusLabelKey",
            labelKey: "pagamentos.fields.status",
            type: "select",
            valueType: "translationKey",
            editable: true,
            options: [
              { value: "pending", labelKey: "common.statusPending" },
              { value: "paid", labelKey: "common.statusPaid" },
              { value: "failed", labelKey: "common.statusFailed" },
              { value: "cancelled", labelKey: "common.statusCancelled" },
              { value: "refunded", labelKey: "common.statusRefunded" }
            ]
          },
          { key: "amountCents", displayKey: "amountLabel", labelKey: "pagamentos.fields.amount", type: "currency", currency: "BRL", locale: "pt-BR", editable: true },
          { key: "dueAtInput", displayKey: "dueAt", labelKey: "pagamentos.fields.dueAt", type: "datetime", editable: true },
          { key: "paidAtInput", displayKey: "paidAt", labelKey: "pagamentos.fields.paidAt", type: "datetime", editable: true },
          { key: "notes", labelKey: "pagamentos.fields.notes", type: "textarea", layout: "full", editable: true }
        ]
      }
    ]
  },
  addPage: {
    titleKey: "pagamentos.add.title",
    submitLabelKey: "pagamentos.add.submit",
    sections: [
      {
        key: "data",
        titleKey: "pagamentos.add.sections.data",
        fields: [
          { key: "reference", labelKey: "pagamentos.fields.reference", required: true },
          { key: "customerId", labelKey: "pagamentos.fields.customer", type: "select", source: "clientes", required: true },
          { key: "subscriptionId", labelKey: "pagamentos.fields.subscription", type: "select", source: "assinaturas" },
          {
            key: "status",
            labelKey: "pagamentos.fields.status",
            type: "select",
            defaultValue: "pending",
            required: true,
            options: [
              { value: "pending", labelKey: "common.statusPending" },
              { value: "paid", labelKey: "common.statusPaid" },
              { value: "failed", labelKey: "common.statusFailed" },
              { value: "cancelled", labelKey: "common.statusCancelled" },
              { value: "refunded", labelKey: "common.statusRefunded" }
            ]
          },
          { key: "amountCents", labelKey: "pagamentos.fields.amount", type: "currency", currency: "BRL", locale: "pt-BR", required: true },
          { key: "dueAt", labelKey: "pagamentos.fields.dueAt", type: "datetime" },
          { key: "notes", labelKey: "pagamentos.fields.notes", type: "textarea" }
        ]
      }
    ]
  }
};
