export interface MarketplaceProduct {
  id: string;
  name: string;
  weight: string;
  originalPrice: number;
  price: number;
  badge?: string;
  image: string;
}

export interface MarketplaceCombo {
  id: string;
  title: string;
  description: string;
  price: number;
  items: string[];
  image: string;
}

export const mockCategories = [
  { id: "mais-pedidos", name: "Mais pedidos", icon: "StoreIcon" },
  { id: "premium", name: "Premium", icon: "StarIcon" },
  { id: "nobre", name: "Linha nobre", icon: "FlameIcon" },
  { id: "familia", name: "Churrasco familia", icon: "BoxIcon" },
  { id: "suinos-frango", name: "Frango e suinos", icon: "StoreIcon" }
];

export const mockOfferProducts: MarketplaceProduct[] = [
  {
    id: "offer-picanha",
    name: "Picanha",
    weight: "Aprox. 1kg",
    originalPrice: 129.9,
    price: 114.9,
    badge: "MAIS PEDIDO",
    image: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "offer-fraldinha",
    name: "Fraldinha",
    weight: "Aprox. 1kg",
    originalPrice: 78.9,
    price: 67.9,
    badge: "OFERTA",
    image: "https://images.unsplash.com/photo-1613454320437-0c228c8b1723?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "offer-baby-beef",
    name: "Baby beef",
    weight: "Aprox. 1kg",
    originalPrice: 109.9,
    price: 96.9,
    badge: "PREMIUM",
    image: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "offer-maminha",
    name: "Maminha",
    weight: "Aprox. 1kg",
    originalPrice: 81.9,
    price: 70.9,
    badge: "TRADICIONAL",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "offer-linguica",
    name: "Linguica toscana",
    weight: "Aprox. 1kg",
    originalPrice: 39.9,
    price: 34.9,
    badge: "CHURRASCO",
    image: "https://images.unsplash.com/photo-1606728035253-49e8a23146de?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "offer-pao-alho",
    name: "Pao de alho",
    weight: "Pacote com 6 unidades",
    originalPrice: 27.9,
    price: 22.9,
    badge: "ACOMPANHAMENTO",
    image: "https://images.unsplash.com/photo-1598373182133-52452f7691ef?auto=format&fit=crop&w=800&q=80"
  }
];

export const mockCombos: MarketplaceCombo[] = [
  {
    id: "combo-familia",
    title: "Combo churrasco familia",
    description: "Produtos tradicionais, acompanhamento e carvao para uma compra completa.",
    price: 249.9,
    items: [
      "1kg Fraldinha",
      "1kg Linguica toscana",
      "1kg Frango temperado",
      "1 pacote Pao de alho",
      "1 pacote Carvao premium 5 kg"
    ],
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "combo-linha-nobre",
    title: "Combo linha nobre",
    description: "Selecao premium com cortes de maior valor para momentos especiais.",
    price: 329.9,
    items: [
      "1kg Picanha",
      "1kg Baby beef",
      "1kg Chorizo",
      "1 Sal de parrilla",
      "1 Chimichurri"
    ],
    image: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=900&q=80"
  }
];
