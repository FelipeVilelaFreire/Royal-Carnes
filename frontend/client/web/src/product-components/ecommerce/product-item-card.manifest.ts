import type { ProductItemCardProps } from "./ProductItemCard";

type ProductItemCardOptionDefinition = {
  key: string;
  control: "boolean" | "number" | "text" | "select";
  values?: string[];
  defaultValue?: string | number | boolean;
  owner: "product-component" | "consumer-state" | "foundation";
};

type ProductItemCardComposition = Partial<Pick<ProductItemCardProps,
  | "showImage"
  | "showName"
  | "showDescription"
  | "showMeta"
  | "showBadge"
  | "showFavorite"
  | "showPrice"
  | "showOriginalPrice"
  | "showAction"
  | "metaMode"
  | "priceMode"
  | "actionMode"
  | "favoriteMode"
  | "quantityMode"
>>;

type ProductItemCardExample = {
  id: string;
  productIndex: number;
  options: Partial<ProductItemCardProps> & {
    badgeMode?: "none" | "component" | "category" | "offer" | "stock" | "custom";
    selectionMode?: "none" | "single" | "multi";
  };
  handlers: {
    favoriteToggle: boolean;
    action: boolean;
    decrease: boolean;
  };
};

export const productItemCardManifest = {
  id: "product-item-card",
  name: "ProductItemCard",
  service: "ecommerce",
  componentLevel: "level-1",
  targetPath: "frontend/client/web/src/product-components/ecommerce/ProductItemCard.tsx",
  manifestPath: "frontend/client/web/src/product-components/ecommerce/product-item-card.manifest.ts",
  owner: "RoyalPrime ecommerce",
  status: "mapped",
  manifestScope: {
    owns: [
      "data contract",
      "composition slots",
      "commerce capabilities",
      "mode presets",
      "enabled interactions"
    ],
    doesNotOwn: [
      "border radius",
      "font scale",
      "button styling",
      "surface recipe",
      "icon drawing",
      "color palette"
    ]
  },
  designSystemBoundary: {
    futureOwner: "ServiceOS Foundation/AppShell",
    rule: "Visual primitives and recipes decide shape, typography, icon style, spacing and button presentation.",
    currentAdapter: "RoyalPrime legacy design-system supplies Button and local visual tokens until the ServiceOS Foundation path exists."
  },
  composition: {
    media: {
      slot: "image",
      visibleProp: "showImage",
      required: true
    },
    header: {
      slots: ["badge", "favoriteAction", "selectedIndicator"],
      visibleProps: ["showBadge", "showFavorite"]
    },
    body: {
      slots: ["name", "description", "categoryLabel", "detailLabel"],
      visibleProps: ["showName", "showDescription", "showMeta"],
      modes: ["category-detail", "category-only", "detail-only"]
    },
    commerce: {
      slots: ["price", "originalPrice", "priceLabel"],
      visibleProps: ["showPrice", "showOriginalPrice"],
      modes: ["unit", "from", "estimate", "included", "hidden"]
    },
    actions: {
      slots: ["primaryAction", "quantityStepper"],
      visibleProps: ["showAction"],
      modes: ["none", "select", "add", "quantity", "view-details", "configure"],
      rule: "The consumer flow owns state and handlers; the product card only exposes available slots."
    }
  },
  optionGroups: [
    {
      id: "composition",
      options: [
        { key: "showImage", control: "boolean", defaultValue: true, owner: "product-component" },
        { key: "showName", control: "boolean", defaultValue: true, owner: "product-component" },
        { key: "showDescription", control: "boolean", defaultValue: true, owner: "product-component" },
        { key: "showMeta", control: "boolean", defaultValue: true, owner: "product-component" },
        { key: "showBadge", control: "boolean", defaultValue: false, owner: "product-component" },
        { key: "showFavorite", control: "boolean", defaultValue: true, owner: "product-component" },
        { key: "showPrice", control: "boolean", defaultValue: true, owner: "product-component" },
        { key: "showOriginalPrice", control: "boolean", defaultValue: false, owner: "product-component" },
        { key: "showAction", control: "boolean", defaultValue: true, owner: "product-component" }
      ]
    },
    {
      id: "presentationModes",
      options: [
        {
          key: "metaMode",
          control: "select",
          values: ["category-detail", "category-only", "detail-only"],
          defaultValue: "category-detail",
          owner: "product-component"
        },
        {
          key: "badgeMode",
          control: "select",
          values: ["none", "component", "category", "offer", "stock", "custom"],
          defaultValue: "none",
          owner: "product-component"
        },
        {
          key: "badgeTone",
          control: "select",
          values: ["offer", "limited"],
          defaultValue: "offer",
          owner: "product-component"
        },
        {
          key: "priceMode",
          control: "select",
          values: ["unit", "from", "estimate", "included", "hidden"],
          defaultValue: "unit",
          owner: "product-component"
        }
      ]
    },
    {
      id: "interactionModes",
      options: [
        {
          key: "actionMode",
          control: "select",
          values: ["none", "select", "add", "quantity", "view-details", "configure"],
          defaultValue: "add",
          owner: "product-component"
        },
        {
          key: "favoriteMode",
          control: "select",
          values: ["none", "toggle"],
          defaultValue: "toggle",
          owner: "product-component"
        },
        {
          key: "quantityMode",
          control: "select",
          values: ["none", "stepper", "readonly"],
          defaultValue: "stepper",
          owner: "product-component"
        },
        {
          key: "selectionMode",
          control: "select",
          values: ["none", "single", "multi"],
          defaultValue: "multi",
          owner: "consumer-state"
        }
      ]
    },
    {
      id: "actions",
      options: [
        { key: "actionLabel", control: "text", owner: "product-component" },
        { key: "selectedActionLabel", control: "text", owner: "product-component" },
        { key: "onAction", control: "boolean", owner: "consumer-state" },
        { key: "onDecrease", control: "boolean", owner: "consumer-state" },
        { key: "onFavoriteToggle", control: "boolean", owner: "consumer-state" }
      ]
    }
  ],
  compositions: {
    catalog: {
      showImage: false,
      showName: true,
      showDescription: true,
      showMeta: true,
      showBadge: false,
      showFavorite: true,
      showPrice: true,
      showOriginalPrice: false,
      showAction: true,
      metaMode: "category-detail",
      priceMode: "unit",
      actionMode: "add",
      favoriteMode: "toggle",
      quantityMode: "stepper"
    },
    checkout: {
      showImage: true,
      showName: true,
      showDescription: true,
      showMeta: true,
      showBadge: false,
      showFavorite: false,
      showPrice: true,
      showOriginalPrice: false,
      showAction: true,
      metaMode: "category-detail",
      priceMode: "unit",
      actionMode: "quantity",
      favoriteMode: "none",
      quantityMode: "stepper"
    },
    compact: {
      showImage: false,
      showName: true,
      showDescription: false,
      showMeta: true,
      showBadge: false,
      showFavorite: false,
      showPrice: true,
      showOriginalPrice: false,
      showAction: false,
      metaMode: "category-detail",
      priceMode: "unit",
      actionMode: "none",
      favoriteMode: "none",
      quantityMode: "none"
    },
    readonly: {
      showImage: true,
      showName: true,
      showDescription: true,
      showMeta: true,
      showBadge: false,
      showFavorite: false,
      showPrice: true,
      showOriginalPrice: false,
      showAction: false,
      metaMode: "category-detail",
      priceMode: "unit",
      actionMode: "none",
      favoriteMode: "none",
      quantityMode: "readonly"
    },
    includedInPlan: {
      showImage: false,
      showName: true,
      showDescription: true,
      showMeta: true,
      showBadge: false,
      showFavorite: false,
      showPrice: false,
      showOriginalPrice: false,
      showAction: true,
      metaMode: "category-detail",
      priceMode: "included",
      actionMode: "select",
      favoriteMode: "none",
      quantityMode: "stepper"
    }
  },
  dataContract: {
    required: ["name", "description", "image", "categoryLabel", "isDark", "tokens"],
    optional: [
      "detailLabel",
      "price",
      "originalPrice",
      "priceLabel",
      "badge",
      "badgeTone",
      "showImage",
      "showName",
      "showDescription",
      "showMeta",
      "showBadge",
      "showFavorite",
      "showOriginalPrice",
      "metaMode",
      "priceMode",
      "actionMode",
      "favoriteMode",
      "quantityMode",
      "selected",
      "quantity",
      "quantitySuffix",
      "favorite",
      "showPrice",
      "showAction",
      "actionLabel",
      "selectedActionLabel"
    ]
  },
  capabilities: {
    media: true,
    hideMedia: true,
    combinedMeta: true,
    metaMode: true,
    price: true,
    hidePrice: true,
    priceMode: true,
    originalPrice: true,
    badge: true,
    hideBadge: true,
    badgeMode: true,
    selectionState: true,
    selectionMode: true,
    quantityStepper: true,
    quantityMode: true,
    favoriteState: true,
    favoriteMode: true,
    hideFavorite: true,
    primaryAction: true,
    actionMode: true
  },
  examples: [
    {
      id: "catalog-default",
      productIndex: 0,
      options: {
        badgeMode: "none",
        badgeTone: "offer",
        showImage: false,
        showName: true,
        showDescription: true,
        showMeta: true,
        showBadge: false,
        showFavorite: true,
        showPrice: true,
        showOriginalPrice: false,
        showAction: true,
        metaMode: "category-detail",
        priceMode: "unit",
        actionMode: "add",
        favoriteMode: "toggle",
        quantityMode: "stepper",
        selected: false,
        quantity: 0,
        favorite: false
      },
      handlers: {
        favoriteToggle: true,
        action: true,
        decrease: true
      }
    },
    {
      id: "checkout-selected",
      productIndex: 1,
      options: {
        badgeMode: "category",
        badgeTone: "offer",
        showImage: true,
        showName: true,
        showDescription: true,
        showMeta: true,
        showBadge: false,
        showFavorite: false,
        showPrice: true,
        showOriginalPrice: false,
        showAction: true,
        metaMode: "category-detail",
        priceMode: "unit",
        actionMode: "quantity",
        favoriteMode: "none",
        quantityMode: "stepper",
        selected: true,
        quantity: 2,
        favorite: false
      },
      handlers: {
        favoriteToggle: false,
        action: true,
        decrease: true
      }
    }
  ]
} as const satisfies {
  id: string;
  name: string;
  service: "ecommerce";
  componentLevel: "level-1";
  targetPath: string;
  manifestPath: string;
  owner: string;
  status: "mapped" | "needs-manifest" | "needs-contract";
  manifestScope: {
    owns: string[];
    doesNotOwn: string[];
  };
  designSystemBoundary: {
    futureOwner: string;
    rule: string;
    currentAdapter: string;
  };
  composition: Record<string, {
    slot?: string;
    slots?: string[];
    visibleProp?: string;
    visibleProps?: string[];
    required?: boolean;
    modes?: string[];
    rule?: string;
  }>;
  optionGroups: Array<{
    id: string;
    options: ProductItemCardOptionDefinition[];
  }>;
  compositions: Record<string, ProductItemCardComposition>;
  dataContract: {
    required: string[];
    optional: string[];
  };
  capabilities: Record<string, boolean>;
  examples: ProductItemCardExample[];
};
