export const landingNavigation = [
  {
    key: "home",
    labelKey: "navigation.home",
    order: 0,
    targetId: "top",
    type: "scroll",
    placements: { header: true, sidebar: false, drawer: true, bottomBar: true, footer: true }
  },
  {
    key: "productOptions",
    labelKey: "navigation.productOptions",
    order: 1,
    targetId: "product-options",
    type: "scroll",
    placements: { header: true, sidebar: false, drawer: true, bottomBar: true, footer: true }
  },
  {
    key: "howItWorks",
    labelKey: "navigation.howItWorks",
    order: 2,
    targetId: "how-it-works",
    type: "scroll",
    placements: { header: true, sidebar: false, drawer: true, bottomBar: true, footer: true }
  },
  {
    key: "plans",
    labelKey: "navigation.products",
    order: 3,
    targetId: "assinaturas",
    type: "scroll",
    placements: { header: true, sidebar: false, drawer: true, bottomBar: true, footer: true }
  },
  {
    key: "cortes",
    labelKey: "navigation.cortes",
    order: 4,
    path: "/cortes",
    type: "route",
    placements: { header: true, sidebar: false, drawer: true, bottomBar: true, footer: true }
  }
];
