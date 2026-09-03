import { sharedAssets } from "../../assets";

export const landingPageConfig = {
  screenKey: "landing",
  screenType: "landing_page",

  // 1. CAPA HERO (17 Colunas Úteis, 90vh Fold-Peeking)
  hero: {
    layout: {
      usefulColumns: 17,             // 17 colunas de 20 no Desktop (1.5 de sobra nas pontas)
      outerOffset: 1.5,
      leftColSpan: 10.5,             // 10.5 colunas para Título, Frase e Botões
      rightColSpan: 6.5,             // 6.5 colunas para o showcase de catalogos Royal
      minHeightRecipe: "heroPeek",   // calc(90vh - headerOffset)
      paddingYToken: "3XL"
    },
    content: {
      badgeKey: "landing.hero.badge",
      titleKey: "landing.hero.title",
      subtitleKey: "landing.hero.subtitle",
      primaryCta: {
        labelKey: "landing.hero.ctaPlans",
        targetRouteKey: "plans",    // 👈 Conecta com routes.ts (zero fricção)
        appearance: "solid",
        toneToken: "primary"
      },
      secondaryCta: {
        labelKey: "landing.hero.ctaPortal",
        targetRouteKey: "mySubscription", // 👈 Conecta com o Portal do Assinante
        appearance: "glass",
        toneToken: "primary"
      }
    },
    media: {
      showcaseImage: sharedAssets.client.heroBackground,
      backgroundImage: sharedAssets.client.heroBackground
    }
  },

  // 2. SEÇÃO DE BENEFÍCIOS (17 Colunas Úteis - 3 Pilares Gourmet)
  benefits: {
    layout: {
      usefulColumns: 17,
      outerOffset: 1.5,
      columnsCount: 3,
      paddingYToken: "2XL"
    },
    titleKey: "landing.benefits.title",
    items: [
      {
        id: "dryaged",
        iconKey: "badgeDryAged",
        titleKey: "landing.benefits.dryAged.title",
        descriptionKey: "landing.benefits.dryAged.description"
      },
      {
        id: "vacuum",
        iconKey: "badgeVacuum",
        titleKey: "landing.benefits.vacuum.title",
        descriptionKey: "landing.benefits.vacuum.description"
      },
      {
        id: "refrigerated",
        iconKey: "logisticsBoxIcon",
        titleKey: "landing.benefits.shipping.title",
        descriptionKey: "landing.benefits.shipping.description"
      }
    ]
  },

  // 3. SEÇÃO DE FAQ (14 Colunas Úteis de Leitura)
  faq: {
    layout: {
      usefulColumns: 14,             // 14 colunas de 20 (3.0 de sobra nas pontas para leitura)
      outerOffset: 3.0,
      paddingYToken: "2XL"
    },
    titleKey: "landing.faq.title",
    items: [
      {
        questionKey: "landing.faq.q1.question",
        answerKey: "landing.faq.q1.answer"
      },
      {
        questionKey: "landing.faq.q2.question",
        answerKey: "landing.faq.q2.answer"
      }
    ]
  }
};
