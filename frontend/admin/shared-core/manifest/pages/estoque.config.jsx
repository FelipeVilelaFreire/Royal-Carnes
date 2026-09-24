export const estoqueConfig = {
  screenKey: "estoque",
  screenType: "standard",
  entityNameKey: "entities.inventoryMovement",
  dataSource: { key: "estoque", fallbackOnError: false },
  listPage: {
    titleKey: "estoque.title",
    subtitleKey: "estoque.subtitle",
    searchPlaceholderKey: "common.searchPlaceholder",
    columns: [
      { key: "productName", labelKey: "estoque.title" },
      { key: "variantName", labelKey: "estoque.subtitle" },
      { key: "sellableQuantity", labelKey: "estoque.title" },
      { key: "statusLabelKey", labelKey: "common.status", valueType: "translationKey", statusToneKey: "statusTone" },
      { key: "updatedAt", labelKey: "estoque.subtitle" },
    ],
    filters: [{
      key: "status",
      labelKey: "common.status",
      options: [
        { value: "available", labelKey: "common.statusAvailable" },
        { value: "limited", labelKey: "common.statusLimited" },
        { value: "unavailable", labelKey: "common.statusUnavailable" },
        { value: "disabled", labelKey: "common.statusDisabled" }
      ]
    }],
  },
  detailPage: {
    titleKey: "estoque.title",
    displayNameKey: "productName",
    tabs: [{
      id: "data",
      labelKey: "estoque.title",
      sections: [{
        key: "inventory",
        type: "fields",
        titleKey: "estoque.title",
        iconIntent: "catalog",
        grid: { desktop: 3, tablet: 2, mobile: 1 },
        fields: [
          { key: "productName", labelKey: "estoque.title" },
          { key: "variantName", labelKey: "estoque.subtitle" },
          { key: "sku", labelKey: "estoque.title" },
          { key: "availableQuantity", labelKey: "estoque.title" },
          { key: "reservedQuantity", labelKey: "estoque.title" },
          { key: "sellableQuantity", labelKey: "estoque.title" },
          { key: "measurementUnitSymbol", labelKey: "estoque.subtitle" },
          { key: "status", labelKey: "common.status" },
          { key: "updatedAt", labelKey: "estoque.subtitle" },
        ],
      }],
    }],
  },
};
