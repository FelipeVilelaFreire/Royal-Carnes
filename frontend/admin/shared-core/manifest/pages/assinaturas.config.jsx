export const assinaturasConfig = {
  screenKey: "assinaturas",
  screenType: "standard",
  entityNameKey: "entities.subscription",
  dataSource: { key: "assinaturas", fallbackOnError: false },
  listPage: {
    titleKey: "assinaturas.title",
    subtitleKey: "assinaturas.subtitle",
    actionLabelKey: "assinaturas.ctaAdd",
    searchPlaceholderKey: "assinaturas.searchPlaceholder",
    columns: [
      { key: "customerName", labelKey: "assinaturas.tableHeaders.customer", showAvatar: true },
      { key: "planName", labelKey: "assinaturas.tableHeaders.plan" },
      { key: "statusLabelKey", labelKey: "assinaturas.tableHeaders.status", valueType: "translationKey", statusToneKey: "statusTone" },
      { key: "currentCycleEndsAt", labelKey: "assinaturas.tableHeaders.currentCycleEndsAt" }
    ],
    filters: [
      {
        key: "status",
        labelKey: "assinaturas.filters.status",
        options: [
          { value: "active", labelKey: "common.statusActive" },
          { value: "paused", labelKey: "common.statusPaused" },
          { value: "cancelled", labelKey: "common.statusCancelled" },
          { value: "past_due", labelKey: "common.statusPastDue" }
        ]
      }
    ]
  },
  detailPage: {
    titleKey: "assinaturas.detail.title",
    displayNameKey: "customerName",
    tabs: [
      {
        id: "dados",
        labelKey: "assinaturas.detail.tabs.data",
        emptyKey: "assinaturas.detail.emptyData",
        sections: [{ key: "identity", type: "fields", titleKey: "assinaturas.detail.tabs.data", iconIntent: "identity", grid: { desktop: 3, tablet: 2, mobile: 1 }, fields: [
          { key: "customerName", labelKey: "assinaturas.fields.customer" },
          { key: "planKey", displayKey: "planName", labelKey: "assinaturas.fields.plan", type: "select", source: "planos", valueType: "optionLabel", editable: true },
          {
            key: "status",
            displayKey: "statusLabelKey",
            labelKey: "assinaturas.fields.status",
            type: "select",
            valueType: "translationKey",
            editable: true,
            options: [
              { value: "active", labelKey: "common.statusActive" },
              { value: "paused", labelKey: "common.statusPaused" },
              { value: "cancelled", labelKey: "common.statusCancelled" },
              { value: "past_due", labelKey: "common.statusPastDue" }
            ]
          },
          { key: "startedAt", labelKey: "assinaturas.fields.startedAt" },
          { key: "currentCycleEndsAt", labelKey: "assinaturas.fields.currentCycleEndsAt" }
        ] }]
      },
      {
        id: "operacao",
        labelKey: "assinaturas.detail.tabs.operation",
        emptyKey: "assinaturas.detail.emptyOperation",
        sections: [{ key: "operation", type: "fields", titleKey: "assinaturas.detail.tabs.operation", iconIntent: "delivery", grid: { desktop: 3, tablet: 2, mobile: 1 }, fields: [
          { key: "startedAtInput", displayKey: "startedAt", labelKey: "assinaturas.fields.startedAt", type: "datetime", editable: true },
          { key: "endedAtInput", displayKey: "endedAt", labelKey: "assinaturas.fields.endedAt", type: "datetime", editable: true },
          { key: "cancelledAtInput", displayKey: "cancelledAt", labelKey: "assinaturas.fields.cancelledAt", type: "datetime", editable: true },
          { key: "cancelReason", labelKey: "assinaturas.fields.cancelReason", type: "textarea", editable: true },
          { key: "defaultDeliveryAddressId", labelKey: "assinaturas.fields.defaultDeliveryAddress", type: "select", source: "enderecos", valueType: "optionLabel", editable: true },
          {
            key: "preferredDeliveryDay",
            labelKey: "assinaturas.fields.preferredDeliveryDay",
            type: "select",
            editable: true,
            options: [
              { value: "monday", labelKey: "assinaturas.deliveryDays.monday" },
              { value: "tuesday", labelKey: "assinaturas.deliveryDays.tuesday" },
              { value: "wednesday", labelKey: "assinaturas.deliveryDays.wednesday" },
              { value: "thursday", labelKey: "assinaturas.deliveryDays.thursday" },
              { value: "friday", labelKey: "assinaturas.deliveryDays.friday" },
              { value: "saturday", labelKey: "assinaturas.deliveryDays.saturday" }
            ]
          },
          {
            key: "deliveryWindow",
            labelKey: "assinaturas.fields.deliveryWindow",
            type: "select",
            editable: true,
            options: [
              { value: "morning", labelKey: "assinaturas.deliveryWindows.morning" },
              { value: "afternoon", labelKey: "assinaturas.deliveryWindows.afternoon" },
              { value: "evening", labelKey: "assinaturas.deliveryWindows.evening" },
              { value: "business_hours", labelKey: "assinaturas.deliveryWindows.businessHours" }
            ]
          },
          { key: "deliveryPreferences", labelKey: "assinaturas.fields.deliveryPreferences", type: "textarea", layout: "full", editable: true },
          { key: "internalNotes", labelKey: "assinaturas.fields.internalNotes", type: "textarea", layout: "full", editable: true }
        ] }]
      },
      {
        id: "cicloAtual",
        labelKey: "assinaturas.detail.tabs.currentCycle",
        emptyKey: "assinaturas.detail.emptyCurrentCycle",
        sections: [{ key: "currentCycle", type: "fields", titleKey: "assinaturas.detail.tabs.currentCycle", iconIntent: "box", grid: { desktop: 2, tablet: 2, mobile: 1 }, fields: [
          { key: "currentCycleStartsAtInput", displayKey: "currentCycleStartsAt", labelKey: "assinaturas.fields.currentCycleStartsAt", type: "datetime", editable: true },
          { key: "currentCycleEndsAtInput", displayKey: "currentCycleEndsAt", labelKey: "assinaturas.fields.currentCycleEndsAt", type: "datetime", editable: true },
          { key: "currentCycleOrderSummary", labelKey: "assinaturas.fields.currentCycleOrders" },
        ] }]
      },
    ]
  },
  addPage: {
    titleKey: "assinaturas.add.title",
    submitLabelKey: "assinaturas.add.submit",
    sections: [
      {
        key: "data",
        titleKey: "assinaturas.add.sections.data",
        fields: [
          { key: "customerId", labelKey: "assinaturas.fields.customer", type: "select", source: "clientes", required: true },
          { key: "planKey", labelKey: "assinaturas.fields.plan", type: "select", source: "planos", required: true },
          {
            key: "status",
            labelKey: "assinaturas.fields.status",
            type: "select",
            defaultValue: "active",
            required: true,
            options: [
              { value: "active", labelKey: "common.statusActive" },
              { value: "paused", labelKey: "common.statusPaused" },
              { value: "cancelled", labelKey: "common.statusCancelled" },
              { value: "past_due", labelKey: "common.statusPastDue" }
            ]
          },
          { key: "startedAt", labelKey: "assinaturas.fields.startedAt", type: "datetime" },
        ]
      },
      {
        key: "delivery",
        titleKey: "assinaturas.add.sections.delivery",
        fields: [
          { key: "defaultDeliveryAddressId", labelKey: "assinaturas.fields.defaultDeliveryAddress", type: "select", source: "enderecos" },
          {
            key: "preferredDeliveryDay",
            labelKey: "assinaturas.fields.preferredDeliveryDay",
            type: "select",
            options: [
              { value: "monday", labelKey: "assinaturas.deliveryDays.monday" },
              { value: "tuesday", labelKey: "assinaturas.deliveryDays.tuesday" },
              { value: "wednesday", labelKey: "assinaturas.deliveryDays.wednesday" },
              { value: "thursday", labelKey: "assinaturas.deliveryDays.thursday" },
              { value: "friday", labelKey: "assinaturas.deliveryDays.friday" },
              { value: "saturday", labelKey: "assinaturas.deliveryDays.saturday" }
            ]
          },
          {
            key: "deliveryWindow",
            labelKey: "assinaturas.fields.deliveryWindow",
            type: "select",
            options: [
              { value: "morning", labelKey: "assinaturas.deliveryWindows.morning" },
              { value: "afternoon", labelKey: "assinaturas.deliveryWindows.afternoon" },
              { value: "evening", labelKey: "assinaturas.deliveryWindows.evening" },
              { value: "business_hours", labelKey: "assinaturas.deliveryWindows.businessHours" }
            ]
          },
          { key: "deliveryPreferences", labelKey: "assinaturas.fields.deliveryPreferences", type: "textarea" },
          { key: "internalNotes", labelKey: "assinaturas.fields.internalNotes", type: "textarea" }
        ]
      }
    ]
  }
};
