import { mockAdminCuts } from "../../mocks/cuts.mock";

export const cortesConfig = {
  screenKey: "cortes",
  titleKey: "cortes.title",
  subtitleKey: "cortes.subtitle",
  entityName: "Corte Nobre",
  actionLabelKey: "cortes.ctaAdd",
  columns: [
    { key: "name", labelKey: "cortes.tableHeaders.name" },
    { key: "category", labelKey: "cortes.tableHeaders.category" },
    { key: "aging", labelKey: "cortes.tableHeaders.aging" },
    { key: "stockKg", labelKey: "cortes.tableHeaders.stock" },
    {
      key: "pricePerKg",
      labelKey: "cortes.tableHeaders.price",
      render: (row) => `R$ ${row.pricePerKg?.toFixed(2)}`
    },
    { key: "status", labelKey: "cortes.tableHeaders.status" }
  ],
  filters: [
    {
      key: "category",
      labelKey: "Categoria",
      options: [
        { value: "Wagyu Especial", labelKey: "Wagyu Especial" },
        { value: "Maturação Especial", labelKey: "Maturação Especial" },
        { value: "Churrasco Nobre", labelKey: "Churrasco Nobre" },
        { value: "Cortes Especiais", labelKey: "Cortes Especiais" }
      ]
    }
  ],
  form: {
    fields: [
      { key: "name", labelKey: "Nome do Corte", required: true },
      { key: "category", labelKey: "Categoria", type: "select", options: [
        { value: "Wagyu Especial", labelKey: "Wagyu Especial" },
        { value: "Maturação Especial", labelKey: "Maturação Especial" },
        { value: "Churrasco Nobre", labelKey: "Churrasco Nobre" },
        { value: "Cortes Especiais", labelKey: "Cortes Especiais" }
      ]},
      { key: "aging", labelKey: "Maturação" },
      { key: "stockKg", labelKey: "Estoque (kg)" },
      { key: "pricePerKg", labelKey: "Preço por kg (R$)" }
    ]
  },
  rows: mockAdminCuts
};
