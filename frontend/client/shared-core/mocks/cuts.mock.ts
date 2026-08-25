import { productsMock } from "./catalog/products.mock";

export interface CutProduct {
  id: string;
  name: string;
  subtitle: string;
  weight: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  badgeType?: "offer" | "limited";
  category: string;
  line: string;
  image: string;
  origin?: string;
  preparation?: string;
}

export const mockCutCategories = [
  { id: "all", name: "Todos os produtos" },
  { id: "category-basic-cuts", name: "Dia a dia" },
  { id: "category-premium-cuts", name: "Premium" },
  { id: "category-pro-cuts", name: "Nobre" },
  { id: "category-poultry-pork", name: "Frango e suinos" },
  { id: "category-skewers", name: "Espetinhos" },
  { id: "category-kits", name: "Combos" }
];

const lineByCategory: Record<string, string> = {
  "category-basic-cuts": "Cortes do dia a dia",
  "category-premium-cuts": "Cortes premium",
  "category-pro-cuts": "Linha nobre",
  "category-poultry-pork": "Frango e suinos",
  "category-skewers": "Espetinhos e acompanhamentos",
  "category-kits": "Combos Royal"
};

const preparationByCategory: Record<string, string> = {
  "category-basic-cuts": "Grelha / Espeto / Peca",
  "category-premium-cuts": "Grelha / Parrilla",
  "category-pro-cuts": "Parrilla / Grelha alta",
  "category-poultry-pork": "Grelha / Espeto / Assado",
  "category-skewers": "Espeto / Grelha",
  "category-kits": "Churrasqueira"
};

export const mockCutsCatalog: CutProduct[] = productsMock
  .filter((product) => product.kind === "meat" || product.categoryId === "category-skewers" || product.categoryId === "category-kits")
  .map((product) => ({
    id: product.id,
    name: product.name,
    subtitle: product.description,
    weight: product.weightLabel || product.unit,
    price: product.deliveryPrice,
    originalPrice: product.featured ? Math.round(product.deliveryPrice * 1.16 * 100) / 100 : undefined,
    badge: product.featured ? "MAIS PEDIDO" : product.stockStatus === "limited" ? "DISPONIBILIDADE LIMITADA" : undefined,
    badgeType: product.stockStatus === "limited" ? "limited" : product.featured ? "offer" : undefined,
    category: product.categoryId,
    line: lineByCategory[product.categoryId] || "Catalogo Royal",
    origin: product.tags.includes("argentina") ? "Argentina" : "Brasil",
    preparation: preparationByCategory[product.categoryId] || "Churrasqueira",
    image: product.image
  }));
