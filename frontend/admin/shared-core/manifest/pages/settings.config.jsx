export const settingsConfig = {
  screenKey: "configuracoes",
  titleKey: "configuracoes.title",
  subtitleKey: "configuracoes.subtitle",
  navigationLabelKey: "configuracoes.navigationLabel",
  layout: {
    navigation: "compact",
    usefulColumns: 14,
  },
  tabs: [
    {
      id: "frontend",
      iconIntent: "frontend",
      labelKey: "configuracoes.tabs.frontend",
      descriptionKey: "configuracoes.tabDescriptions.frontend",
      sections: [
        {
          key: "brand",
          grid: { columns: 2, density: "comfortable", gap: "lg" },
          titleKey: "configuracoes.sections.brand",
          descriptionKey: "configuracoes.sections.brandDescription",
          fields: [
            {
              key: "appName",
              labelKey: "configuracoes.fields.appName",
              valueKey: "configuracoes.values.appName",
            },
            {
              key: "businessName",
              labelKey: "configuracoes.fields.businessName",
              statusTone: "warning",
              valueKey: "configuracoes.values.businessName",
              statusKey: "configuracoes.status.pendingManifestSync"
            },
            {
              key: "adminTitle",
              labelKey: "configuracoes.fields.adminTitle",
              valueKey: "configuracoes.values.adminTitle",
            },
            {
              key: "adminTagline",
              layout: "full",
              labelKey: "configuracoes.fields.adminTagline",
              valueKey: "configuracoes.values.adminTagline",
            }
          ]
        },
        {
          key: "appearance",
          grid: { columns: 2, density: "comfortable", gap: "lg" },
          titleKey: "configuracoes.sections.appearance",
          descriptionKey: "configuracoes.sections.appearanceDescription",
          fields: [
            {
              key: "themeMode",
              labelKey: "configuracoes.fields.themeMode",
              valueKey: "configuracoes.values.adminTheme"
            },
            {
              key: "primaryColor",
              labelKey: "configuracoes.fields.primaryColor",
              valueKey: "configuracoes.values.primaryColor"
            },
            {
              key: "surfaceStyle",
              layout: "full",
              labelKey: "configuracoes.fields.surfaceStyle",
              valueKey: "configuracoes.values.surfaceStyle"
            }
          ]
        }
      ]
    },
    {
      id: "operation",
      iconIntent: "operation",
      labelKey: "configuracoes.tabs.operation",
      descriptionKey: "configuracoes.tabDescriptions.operation",
      sections: [
        {
          key: "fulfillment",
          grid: { columns: 2, density: "comfortable", gap: "lg" },
          titleKey: "configuracoes.sections.fulfillment",
          descriptionKey: "configuracoes.sections.fulfillmentDescription",
          fields: [
            {
              key: "fulfillmentWarehouse",
              labelKey: "configuracoes.fields.fulfillmentWarehouse",
              valueKey: "configuracoes.values.fulfillmentWarehouse"
            },
            {
              key: "coldChainSensor",
              labelKey: "configuracoes.fields.coldChainSensor",
              statusTone: "primary",
              valueKey: "configuracoes.values.coldChainSensor",
              statusKey: "configuracoes.status.monitoring"
            },
            {
              key: "defaultDeliveryWindow",
              labelKey: "configuracoes.fields.defaultDeliveryWindow",
              valueKey: "configuracoes.values.businessHours"
            }
          ]
        }
      ]
    },
    {
      id: "commerce",
      iconIntent: "commerce",
      labelKey: "configuracoes.tabs.commerce",
      descriptionKey: "configuracoes.tabDescriptions.commerce",
      sections: [
        {
          key: "payments",
          grid: { columns: 2, density: "comfortable", gap: "lg" },
          titleKey: "configuracoes.sections.payments",
          descriptionKey: "configuracoes.sections.paymentsDescription",
          fields: [
            {
              key: "paymentProvider",
              labelKey: "configuracoes.fields.paymentProvider",
              statusTone: "primary",
              valueKey: "configuracoes.values.paymentProvider",
              statusKey: "configuracoes.status.connected"
            },
            {
              key: "currency",
              labelKey: "configuracoes.fields.currency",
              valueKey: "configuracoes.values.currency"
            },
            {
              key: "billingCyclePolicy",
              labelKey: "configuracoes.fields.billingCyclePolicy",
              valueKey: "configuracoes.values.monthlyCycle"
            }
          ]
        }
      ]
    }
  ]
};
