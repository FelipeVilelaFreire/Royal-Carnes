import { ProductOption } from "./types";

export const productOptionsMock: ProductOption[] = [
  {
    id: "option-piece",
    name: "Peca inteira",
    description: "Produto enviado inteiro para preparo livre.",
    appliesTo: ["meat"]
  },
  {
    id: "option-sliced",
    name: "Fatiado",
    description: "Fatias prontas para grelha, chapa ou porcionamento.",
    appliesTo: ["meat"]
  },
  {
    id: "option-strips",
    name: "Isca",
    description: "Corte em tiras para preparo rapido.",
    appliesTo: ["meat"]
  },
  {
    id: "option-skewer",
    name: "No espeto",
    description: "Produto montado no espeto para churrasco.",
    appliesTo: ["meat"]
  },
  {
    id: "option-steak",
    name: "Bife",
    description: "Corte em bifes padronizados.",
    appliesTo: ["meat"]
  },
  {
    id: "option-cubes",
    name: "Cubos",
    description: "Corte em cubos para espetinhos, panela ou porcoes.",
    appliesTo: ["meat"]
  },
  {
    id: "option-sealed-pack",
    name: "Embalagem selada",
    description: "Produto embalado individualmente para melhor conservacao.",
    appliesTo: ["meat", "seasoning", "charcoal", "utensil", "kit"]
  }
];
