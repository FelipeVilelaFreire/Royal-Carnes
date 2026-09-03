import { mockCutsCatalog } from "../../../../client/shared-core/mocks/cuts.mock";

export const produtosConfig = {
  screenKey: "produtos",
  titleKey: "produtos.title",
  subtitleKey: "produtos.subtitle",
  entityName: "Produto",
  actionLabelKey: "produtos.ctaAdd",
  columns: [
    { key: "name", labelKey: "produtos.tableHeaders.name", showMedia: true },
    { key: "line", labelKey: "Linha / Categoria" },
    { key: "weight", labelKey: "Peso / Unidade" },
    { key: "priceFormatted", labelKey: "produtos.tableHeaders.price" },
    { key: "origin", labelKey: "Origem" },
    { key: "preparation", labelKey: "Preparo" }
  ],
  filters: [
    {
      key: "line",
      labelKey: "Linha",
      options: [
        { value: "Cortes do dia a dia", labelKey: "Cortes do dia a dia" },
        { value: "Cortes premium", labelKey: "Cortes premium" },
        { value: "Linha nobre", labelKey: "Linha nobre" },
        { value: "Combos Royal", labelKey: "Combos Royal" }
      ]
    }
  ],
  form: {
    fields: [
      { key: "name", labelKey: "Nome do Produto", required: true },
      { key: "line", labelKey: "Linha", type: "select", options: [
        { value: "Cortes do dia a dia", labelKey: "Cortes do dia a dia" },
        { value: "Cortes premium", labelKey: "Cortes premium" },
        { value: "Linha nobre", labelKey: "Linha nobre" },
        { value: "Combos Royal", labelKey: "Combos Royal" }
      ]},
      { key: "weight", labelKey: "Peso / Unidade" },
      { key: "price", labelKey: "Preço (R$)" }
    ]
  },
  rows: mockCutsCatalog.map((item) => ({
    id: item.id,
    name: item.name,
    line: item.line,
    weight: item.weight,
    priceFormatted: `R$ ${item.price.toFixed(2)}`,
    origin: item.origin || "Brasil",
    preparation: item.preparation || "Churrasqueira",
    image: item.image
  }))
};
