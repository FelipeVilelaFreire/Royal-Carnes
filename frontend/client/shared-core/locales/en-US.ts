import type { ClientStringsOverrides } from "./types";

export const clientEnUS = {
  appShell: {
    appearanceEditor: {
      experiments: {
        title: "Visual prototypes",
        description: "Open a static direction without changing the official Home or Catalog.",
        groups: {
          home: { title: "Home", description: "Compare the storefront opening section." },
          orders: { title: "My Orders", description: "Compare five complete order-tracking screens." },
          landing: { title: "Landing", description: "Compare directions for the institutional page." },
          catalog: { title: "Catalog", description: "Compare a product-discovery direction." },
        },
        items: {
          meusPedidosTeste1: "Screen 1 - tracking",
          meusPedidosTeste2: "Screen 2 - timeline",
          meusPedidosTeste3: "Screen 3 - order in focus",
          meusPedidosTeste4: "Screen 4 - steps panel",
          meusPedidosTeste5: "Screen 5 - order hub",
          homeTeste1: "Home test 1 · collection",
          homeTeste2: "Home test 2 · occasion",
          homeTeste3: "Home test 3 · products",
          homeTeste4: "Home test 4 · preparation",
          homeTeste5: "Home test 5 · modules",
          homeTeste6: "Home test 6 · customer",
          homeTeste7: "Home test 7 · mobile visitor",
          homeTeste8: "Home test 8 · mobile customer",
          landingTeste1: "Landing test 1 · cinematic",
          landingTeste2: "Landing test 2 · editorial",
          landingTeste3: "Landing test 3 · collections",
          landingTeste4: "Landing test 4 · essential",
          landingTeste5: "Landing test 5 · direct",
          catalogoTeste1: "Catalog test 1 · storefront",
        },
      },
    },
  },
  home: {
    vitrine: {
      home: {
        hero: {
          defaultDescription: "Selected cuts and experiences for gathering the people who matter.",
          defaultTitle: "The right selection for your next gathering",
        },
      },
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
