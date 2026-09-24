import type { ClientStringsOverrides } from "./types";

export const clientDeDE = {
  appShell: {
    appearanceEditor: {
      experiments: {
        title: "Visuelle Prototypen",
        description: "Oeffne eine statische Richtung, ohne die offizielle Home oder den Katalog zu aendern.",
        groups: {
          home: { title: "Home", description: "Vergleiche den Einstieg in die Storefront." },
          orders: { title: "Meine Bestellungen", description: "Vergleiche fuenf vollstaendige Bestellverfolgungsseiten." },
          landing: { title: "Landing", description: "Vergleiche Richtungen fuer die Unternehmensseite." },
          catalog: { title: "Katalog", description: "Vergleiche eine Richtung fuer die Produktentdeckung." },
        },
        items: {
          meusPedidosTeste1: "Ansicht 1 - Begleitung",
          meusPedidosTeste2: "Ansicht 2 - Zeitachse",
          meusPedidosTeste3: "Ansicht 3 - Bestellung im Fokus",
          meusPedidosTeste4: "Ansicht 4 - Schrittpanel",
          meusPedidosTeste5: "Ansicht 5 - Bestellzentrale",
          homeTeste1: "Home-Test 1 · Kollektion",
          homeTeste2: "Home-Test 2 · Anlass",
          homeTeste3: "Home-Test 3 · Produkte",
          homeTeste4: "Home-Test 4 · Zubereitung",
          homeTeste5: "Home-Test 5 · Module",
          homeTeste6: "Home-Test 6 · Kunde",
          homeTeste7: "Home-Test 7 · mobiler Besucher",
          homeTeste8: "Home-Test 8 · mobiler Kunde",
          landingTeste1: "Landing-Test 1 · filmisch",
          landingTeste2: "Landing-Test 2 · editorial",
          landingTeste3: "Landing-Test 3 · Kollektionen",
          landingTeste4: "Landing-Test 4 · essenziell",
          landingTeste5: "Landing-Test 5 · direkt",
          catalogoTeste1: "Katalog-Test 1 · Schaufenster",
        },
      },
    },
  },
  home: {
    vitrine: {
      home: {
        hero: {
          defaultDescription: "Ausgewaehlte Cuts und Erlebnisse fuer die Menschen, die wichtig sind.",
          defaultTitle: "Die richtige Auswahl fuer dein naechstes Treffen",
        },
      },
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
