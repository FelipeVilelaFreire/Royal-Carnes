import { mockCutsCatalog } from "../../../../client/shared-core/mocks/cuts.mock";

export const produtosConfig = {
  screenKey: "produtos",
  titleKey: "produtos.title",
  subtitleKey: "produtos.subtitle",
  entityNameKey: "entities.product",
  actionLabelKey: "produtos.ctaAdd",
  dataSource: { key: "produtos", fallbackOnError: false },
  columns: [
    { key: "name", labelKey: "produtos.tableHeaders.name", showMedia: true },
    { key: "line", labelKey: "produtos.tableHeaders.line" },
    { key: "weight", labelKey: "produtos.tableHeaders.weight" },
    { key: "priceFormatted", labelKey: "produtos.tableHeaders.price" },
    { key: "origin", labelKey: "produtos.tableHeaders.origin" },
    { key: "preparation", labelKey: "produtos.tableHeaders.preparation" },
  ],
  filters: [
    {
      key: "line",
      labelKey: "produtos.filters.line",
      options: [
        { value: "Cortes do dia a dia", labelKey: "produtos.filterOptions.dailyCuts" },
        { value: "Cortes premium", labelKey: "produtos.filterOptions.premiumCuts" },
        { value: "Linha nobre", labelKey: "produtos.filterOptions.nobleLine" },
        { value: "Combos Royal", labelKey: "produtos.filterOptions.royalCombos" },
      ],
    },
  ],
  form: {
    fields: [
      { key: "name", labelKey: "produtos.form.name", required: true },
      {
        key: "line",
        labelKey: "produtos.form.line",
        type: "select",
        options: [
          { value: "Cortes do dia a dia", labelKey: "produtos.filterOptions.dailyCuts" },
          { value: "Cortes premium", labelKey: "produtos.filterOptions.premiumCuts" },
          { value: "Linha nobre", labelKey: "produtos.filterOptions.nobleLine" },
          { value: "Combos Royal", labelKey: "produtos.filterOptions.royalCombos" },
        ],
      },
      { key: "weight", labelKey: "produtos.form.weight" },
      { key: "price", labelKey: "produtos.form.price" },
    ],
  },
  rows: mockCutsCatalog.map((item) => ({
    id: item.id,
    image: item.image,
    line: item.line,
    name: item.name,
    origin: item.origin || "Brasil",
    preparation: item.preparation || "Churrasqueira",
    priceFormatted: `R$ ${item.price.toFixed(2)}`,
    weight: item.weight,
  })),
};
