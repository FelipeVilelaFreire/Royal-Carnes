export const landingNavigation = [
  {
    key: "home",
    labelKey: "landing.navigation.home",
    screenKey: "home",
    routeKey: "/",
    order: 0,
    placements: { header: true, sidebar: false, drawer: true, bottomBar: false, footer: true }
  },
  {
    key: "plans",
    labelKey: "landing.navigation.plans",
    screenKey: "plans",
    routeKey: "/planos",
    order: 1,
    placements: { header: true, sidebar: false, drawer: true, bottomBar: false, footer: true }
  },
  {
    key: "howItWorks",
    labelKey: "landing.navigation.howItWorks",
    screenKey: "howItWorks",
    routeKey: "/#como-funciona",
    order: 2,
    placements: { header: true, sidebar: false, drawer: true, bottomBar: false, footer: true }
  }
];
