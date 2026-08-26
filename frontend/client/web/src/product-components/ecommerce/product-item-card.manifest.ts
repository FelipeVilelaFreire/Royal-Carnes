import type { ProductItemCardProps } from "./ProductItemCard";

type ProductItemCardOptionKey =
  | "badge"
  | "badgeTone"
  | "selected"
  | "quantity"
  | "favorite"
  | "showPrice"
  | "showAction"
  | "showImage"
  | "showName"
  | "showDescription"
  | "showMeta"
  | "showBadge"
  | "showFavorite"
  | "showOriginalPrice"
  | "originalPrice";

type ProductItemCardExample = {
  id:
    | "catalog-default"
    | "checkout-selected"
    | "favorite-disabled"
    | "favorite-enabled"
    | "price-hidden"
    | "discount-reference";
  productIndex: number;
  options: Pick<ProductItemCardProps, ProductItemCardOptionKey>;
  handlers: {
    favoriteToggle: boolean;
    action: boolean;
    decrease: boolean;
  };
};

type ProductItemCardOptionDefinition = {
  key: keyof ProductItemCardProps;
  control: "boolean" | "number" | "text" | "select";
  values?: string[];
  defaultValue?: string | number | boolean;
  owner: "product-component" | "consumer-state" | "foundation";
};

type ProductItemCardComposition = Pick<ProductItemCardProps,
  | "showImage"
  | "showName"
  | "showDescription"
  | "showMeta"
  | "showBadge"
  | "showFavorite"
  | "showPrice"
  | "showOriginalPrice"
  | "showAction"
>;

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
      "example states",
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
      visibleProps: ["showName", "showDescription", "showMeta"]
    },
    commerce: {
      slots: ["price", "originalPrice", "priceLabel"],
      visibleProps: ["showPrice", "showOriginalPrice"]
    },
    actions: {
      slots: ["primaryAction", "quantityStepper"],
      visibleProps: ["showAction"],
      rule: "Quantity stepper appears when selected and quantity is greater than zero."
    }
  },
  optionGroups: [
    {
      id: "composition",
      options: [
        {
          key: "showImage",
          control: "boolean",
          defaultValue: true,
          owner: "product-component"
        },
        {
          key: "showName",
          control: "boolean",
          defaultValue: true,
          owner: "product-component"
        },
        {
          key: "showDescription",
          control: "boolean",
          defaultValue: true,
          owner: "product-component"
        },
        {
          key: "showMeta",
          control: "boolean",
          defaultValue: true,
          owner: "product-component"
        },
        {
          key: "showBadge",
          control: "boolean",
          defaultValue: true,
          owner: "product-component"
        },
        {
          key: "badge",
          control: "text",
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
          key: "showPrice",
          control: "boolean",
          defaultValue: true,
          owner: "product-component"
        },
        {
          key: "showOriginalPrice",
          control: "boolean",
          defaultValue: false,
          owner: "product-component"
        },
        {
          key: "showAction",
          control: "boolean",
          defaultValue: false,
          owner: "product-component"
        },
        {
          key: "showFavorite",
          control: "boolean",
          defaultValue: true,
          owner: "product-component"
        }
      ]
    },
    {
      id: "actions",
      options: [
        {
          key: "actionLabel",
          control: "text",
          owner: "product-component"
        },
        {
          key: "selectedActionLabel",
          control: "text",
          owner: "product-component"
        },
        {
          key: "onAction",
          control: "boolean",
          owner: "consumer-state"
        },
        {
          key: "onDecrease",
          control: "boolean",
          owner: "consumer-state"
        },
        {
          key: "onFavoriteToggle",
          control: "boolean",
          owner: "consumer-state"
        }
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
      showAction: true
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
      showAction: true
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
      showAction: false
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
      showAction: false
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
      showAction: true
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
    category: true,
    hideCategory: true,
    details: true,
    hideDetails: true,
    price: true,
    hidePrice: true,
    originalPrice: true,
    badge: true,
    hideBadge: true,
    selectionState: true,
    quantityStepper: true,
    favoriteState: true,
    hideFavorite: true,
    primaryAction: true
  },
  examples: [
    {
      id: "catalog-default",
      productIndex: 0,
      options: {
        badge: "component",
        badgeTone: "offer",
        showImage: false,
        showName: true,
        showDescription: true,
        showMeta: true,
        showBadge: true,
        showFavorite: true,
        showOriginalPrice: false,
        selected: false,
        quantity: 0,
        favorite: false,
        showPrice: true,
        showAction: true
      },
      handlers: {
        favoriteToggle: false,
        action: true,
        decrease: false
      }
    },
    {
      id: "checkout-selected",
      productIndex: 1,
      options: {
        badge: "category",
        badgeTone: "offer",
        showImage: true,
        showName: true,
        showDescription: true,
        showMeta: true,
        showBadge: true,
        showFavorite: false,
        showOriginalPrice: false,
        selected: true,
        quantity: 2,
        favorite: false,
        showPrice: true,
        showAction: true
      },
      handlers: {
        favoriteToggle: false,
        action: true,
        decrease: true
      }
    },
    {
      id: "favorite-disabled",
      productIndex: 2,
      options: {
        badge: "category",
        badgeTone: "limited",
        showImage: true,
        showName: true,
        showDescription: true,
        showMeta: true,
        showBadge: true,
        showFavorite: true,
        showOriginalPrice: false,
        selected: false,
        quantity: 0,
        favorite: false,
        showPrice: true,
        showAction: false
      },
      handlers: {
        favoriteToggle: true,
        action: false,
        decrease: false
      }
    },
    {
      id: "favorite-enabled",
      productIndex: 3,
      options: {
        badge: "category",
        badgeTone: "limited",
        showImage: true,
        showName: true,
        showDescription: true,
        showMeta: true,
        showBadge: true,
        showFavorite: true,
        showOriginalPrice: false,
        selected: false,
        quantity: 0,
        favorite: true,
        showPrice: true,
        showAction: false
      },
      handlers: {
        favoriteToggle: true,
        action: false,
        decrease: false
      }
    },
    {
      id: "price-hidden",
      productIndex: 4,
      options: {
        badge: "category",
        badgeTone: "offer",
        showImage: false,
        showName: true,
        showDescription: true,
        showMeta: true,
        showBadge: true,
        showFavorite: false,
        showOriginalPrice: false,
        selected: false,
        quantity: 0,
        favorite: false,
        showPrice: false,
        showAction: true
      },
      handlers: {
        favoriteToggle: false,
        action: true,
        decrease: false
      }
    },
    {
      id: "discount-reference",
      productIndex: 5,
      options: {
        badge: "category",
        badgeTone: "offer",
        showImage: true,
        showName: true,
        showDescription: false,
        showMeta: true,
        showBadge: true,
        showFavorite: true,
        showOriginalPrice: true,
        selected: false,
        quantity: 0,
        favorite: false,
        showPrice: true,
        showAction: false,
        originalPrice: 129.9
      },
      handlers: {
        favoriteToggle: true,
        action: false,
        decrease: false
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
