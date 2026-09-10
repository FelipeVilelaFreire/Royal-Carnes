export const settingsConfig = {
  screenKey: "configuracoes",
  titleKey: "configuracoes.title",
  subtitleKey: "configuracoes.subtitle",
  actions: [
    {
      key: "saveDraft",
      labelKey: "configuracoes.actions.saveDraft",
      disabled: true,
      variant: "primary"
    },
    {
      key: "previewManifest",
      labelKey: "configuracoes.actions.previewManifest",
      disabled: true,
      variant: "secondary"
    }
  ],
  tabs: [
    {
      id: "identity",
      labelKey: "configuracoes.tabs.identity",
      sections: [
        {
          key: "brand",
          titleKey: "configuracoes.sections.brand",
          descriptionKey: "configuracoes.sections.brandDescription",
          fields: [
            {
              key: "appName",
              labelKey: "configuracoes.fields.appName",
              value: "RoyalPrime",
              statusKey: "configuracoes.status.active"
            },
            {
              key: "businessName",
              labelKey: "configuracoes.fields.businessName",
              value: "Royal Carnes",
              statusKey: "configuracoes.status.pendingManifestSync"
            },
            {
              key: "adminTitle",
              labelKey: "configuracoes.fields.adminTitle",
              value: "PRIME CUT ADMIN",
              statusKey: "configuracoes.status.active"
            },
            {
              key: "adminTagline",
              labelKey: "configuracoes.fields.adminTagline",
              value: "Painel de Gestao e Operacao do Clube",
              statusKey: "configuracoes.status.active"
            }
          ]
        }
      ]
    },
    {
      id: "appShell",
      labelKey: "configuracoes.tabs.appShell",
      sections: [
        {
          key: "navigation",
          titleKey: "configuracoes.sections.navigation",
          descriptionKey: "configuracoes.sections.navigationDescription",
          fields: [
            {
              key: "sidebarMode",
              labelKey: "configuracoes.fields.sidebarMode",
              valueKey: "configuracoes.values.sidebarOperational",
              statusKey: "configuracoes.status.active"
            },
            {
              key: "mobileNavigation",
              labelKey: "configuracoes.fields.mobileNavigation",
              valueKey: "configuracoes.values.mobileBottomTabs",
              statusKey: "configuracoes.status.active"
            },
            {
              key: "hiddenRoutes",
              labelKey: "configuracoes.fields.hiddenRoutes",
              valueKey: "configuracoes.values.hiddenRoutes",
              statusKey: "configuracoes.status.review"
            }
          ]
        }
      ]
    },
    {
      id: "operation",
      labelKey: "configuracoes.tabs.operation",
      sections: [
        {
          key: "fulfillment",
          titleKey: "configuracoes.sections.fulfillment",
          descriptionKey: "configuracoes.sections.fulfillmentDescription",
          fields: [
            {
              key: "fulfillmentWarehouse",
              labelKey: "configuracoes.fields.fulfillmentWarehouse",
              value: "Central Gastronomica SP-01",
              statusKey: "configuracoes.status.active"
            },
            {
              key: "coldChainSensor",
              labelKey: "configuracoes.fields.coldChainSensor",
              value: "Sensor IoT -2C",
              statusKey: "configuracoes.status.monitoring"
            },
            {
              key: "defaultDeliveryWindow",
              labelKey: "configuracoes.fields.defaultDeliveryWindow",
              valueKey: "configuracoes.values.businessHours",
              statusKey: "configuracoes.status.active"
            }
          ]
        }
      ]
    },
    {
      id: "commerce",
      labelKey: "configuracoes.tabs.commerce",
      sections: [
        {
          key: "payments",
          titleKey: "configuracoes.sections.payments",
          descriptionKey: "configuracoes.sections.paymentsDescription",
          fields: [
            {
              key: "paymentProvider",
              labelKey: "configuracoes.fields.paymentProvider",
              value: "Stripe Subscriptions",
              statusKey: "configuracoes.status.connected"
            },
            {
              key: "currency",
              labelKey: "configuracoes.fields.currency",
              value: "BRL",
              statusKey: "configuracoes.status.active"
            },
            {
              key: "billingCyclePolicy",
              labelKey: "configuracoes.fields.billingCyclePolicy",
              valueKey: "configuracoes.values.monthlyCycle",
              statusKey: "configuracoes.status.active"
            }
          ]
        }
      ]
    }
  ]
};
