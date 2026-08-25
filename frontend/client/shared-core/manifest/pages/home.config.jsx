export const homePageConfig = {
  screenKey: "home",
  screenType: "home_page",
  header: {
    titleKey: "home.title",
    subtitleKey: "home.subtitle"
  },
  sections: [
    {
      id: "hero-banner",
      type: "hero",
      titleKey: "home.sections.hero.title",
      descriptionKey: "home.sections.hero.description",
      badge: "Clube VIP"
    },
    {
      id: "highlights",
      type: "grid",
      titleKey: "home.sections.highlights.title",
      items: [
        { id: "wagyu", title: "Cortes Wagyu A5", description: "Marmoreio nobre certificado." },
        { id: "dryaged", title: "Dry-Aged 45 Dias", description: "Maturação a seco de alta precisão." }
      ]
    }
  ]
};
