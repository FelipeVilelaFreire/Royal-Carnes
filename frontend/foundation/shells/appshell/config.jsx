export const defaultAppShellConfig = {
  desktop: {
    headerLayout: "floating", // "floating" | "attached"
    headerWidth: "contained", // "contained" | "full"
    headerNavAlignment: "center", // "left" | "center" | "right"
    headerNavGap: 32,
    headerSurfaceStyle: "glassBlur",
    headerRightSlot: "ctaButton",
    logoAsHome: true,
    footerEnabled: true,
    footerShowBrand: true,
    footerShowContact: true,
    footerShowLinks: true,
  },
  navigation: {
    homeScreenKey: "home",
    items: [
      { key: "home", label: "Início", routePath: "/", placements: { header: true, footer: true } },
      { key: "plans", label: "Planos", routePath: "/planos", placements: { header: true, footer: true } },
      { key: "howItWorks", label: "Como Funciona", routePath: "/#como-funciona", placements: { header: true, footer: true } },
      { key: "portal", label: "Minha Assinatura", routePath: "/minha-assinatura", placements: { header: true, footer: true } }
    ]
  },
  brand: {
    name: "Prime Cut Club",
    tagline: "Clube de Assinatura de Carnes Nobres"
  }
};
