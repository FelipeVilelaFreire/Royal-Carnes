import { ProductCategory } from "./types";

export const productCategoriesMock: ProductCategory[] = [
  {
    id: "category-basic-cuts",
    name: "Cortes do dia a dia",
    kind: "meat",
    description: "Produtos de melhor custo-beneficio para assinaturas de entrada.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
    order: 10
  },
  {
    id: "category-premium-cuts",
    name: "Cortes premium",
    kind: "meat",
    description: "Produtos nobres para churrascos completos e presentes.",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=80",
    order: 20
  },
  {
    id: "category-pro-cuts",
    name: "Cortes especiais",
    kind: "meat",
    description: "Produtos de maior valor agregado para experiencias especiais.",
    image: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=1200&q=80",
    order: 30
  },
  {
    id: "category-poultry-pork",
    name: "Frango e suinos",
    kind: "meat",
    description: "Produtos tradicionais para churrascos brasileiros completos.",
    image: "https://images.unsplash.com/photo-1606728035253-49e8a23146de?auto=format&fit=crop&w=1200&q=80",
    order: 35
  },
  {
    id: "category-skewers",
    name: "Espetinhos",
    kind: "kit",
    description: "Opcoes montadas para preparo rapido e eventos.",
    image: "https://images.unsplash.com/photo-1529563021893-cc83c992d75d?auto=format&fit=crop&w=1200&q=80",
    order: 38
  },
  {
    id: "category-seasonings",
    name: "Temperos",
    kind: "seasoning",
    description: "Complementos para finalizar ou marinar os produtos.",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80",
    order: 40
  },
  {
    id: "category-charcoal",
    name: "Carvao",
    kind: "charcoal",
    description: "Insumos para preparo em churrasqueira.",
    image: "https://images.unsplash.com/photo-1517260739337-6799d239ce83?auto=format&fit=crop&w=1200&q=80",
    order: 50
  },
  {
    id: "category-utensils",
    name: "Utensilios",
    kind: "utensil",
    description: "Itens de apoio para preparo, servico e churrasco.",
    image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=1200&q=80",
    order: 60
  },
  {
    id: "category-kits",
    name: "Kits",
    kind: "kit",
    description: "Combos fechados para facilitar a compra.",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80",
    order: 70
  }
];
