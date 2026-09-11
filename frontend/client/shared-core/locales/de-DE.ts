import type { ClientStringsOverrides } from "./types";

export const clientDeDE = {
  home: {
    vitrine: {
      products: {
        action: "Gesamten Katalog ansehen",
        cardAction: "Produkt ansehen",
        empty: "Derzeit sind keine Produkte verfügbar.",
        error: "Der Katalog ist momentan nicht verfügbar. Bitte versuche es erneut.",
        loading: "Verfügbare Produkte werden geladen.",
        title: "Produkte entdecken",
      },
    },
  },
} satisfies ClientStringsOverrides;
