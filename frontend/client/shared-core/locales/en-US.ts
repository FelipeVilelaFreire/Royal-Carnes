import type { ClientStringsOverrides } from "./types";

export const clientEnUS = {
  home: {
    vitrine: {
      products: {
        action: "View full catalog",
        cardAction: "View product",
        empty: "No products are available right now.",
        error: "The catalog is unavailable right now. Please try again.",
        loading: "Loading available products.",
        title: "Products to discover",
      },
    },
  },
} satisfies ClientStringsOverrides;
