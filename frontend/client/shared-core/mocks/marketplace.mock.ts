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
  { id: "angus", name: "Angus Prime", icon: "FlameIcon" },
  { id: "wagyu", name: "Wagyu A5", icon: "StarIcon" },
  { id: "dryaged", name: "Dry Aged 45D", icon: "SnowflakeIcon" },
  { id: "churrasco", name: "Kits Churrasco", icon: "StoreIcon" },
  { id: "suinos", name: "Suínos Nobres", icon: "BoxIcon" }
];

export const mockOfferProducts: MarketplaceProduct[] = [
  {
    id: "prod-1",
    name: "Picanha Angus Prime",
    weight: "Aprox. 1.2kg • Resfriado",
    originalPrice: 189.90,
    price: 149.90,
    badge: "OFERTA 20% OFF",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBroJrbE3Sp_7XDMtERJ-9z5OJSYK5EODpyLYKQTGEJssWhruw0wjKU1BlG5cV5iVKdQgisdcIYttpwq9gjy0YzlmOOto7AfHMD_0h1I1TZax7X5pQuGFHOAyHTZTDegKL1LxM1e0Grk0QGR8tq9O9XhvcrGRHLy_JygNYR9tar0wcphLhM3Oh7nafgpxGKQj5rKRJKYRuXmYk-BaQschmaZb604XTKLy6jsv83GszKJUbYW0MIkRJ8"
  },
  {
    id: "prod-2",
    name: "Bife Ancho Wagyu A5",
    weight: "Aprox. 400g • Congelado Especial",
    originalPrice: 250.00,
    price: 199.90,
    badge: "BMS 10+",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoaEBVAVqn9ij7ZU82DUcs7G-lOtPXsUgGiQX7VwjZ6RsduGy8hyLzeGFHtLGLDbUlaFORnLmZLaPTgjqg8xa29fAyKV36L7Ph_ESBef-v5BnWXGLrnvxYbPPDvxepFsaMgEPuZDz4-7xSuF8VJaErTNa78_nPxANCQsZ3dyuDsDsMZMMqED21eBrkSOZ6Yanv6_y_k11DR9vgAkdDJu_zaJ3lhrs7ljuk290MwqsWH_Rtf8_8Q1WX"
  },
  {
    id: "prod-3",
    name: "Tomahawk Dry Aged 45D",
    weight: "Aprox. 900g • Maturado 45 Dias",
    originalPrice: 340.00,
    price: 295.00,
    badge: "MATURAÇÃO 45D",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdp3Iwy2fkq0V6cR6R5gyeRsjMMhyL9t_Z0qFFSqzOBpH3Kfdz3eIXPk9QsLokmlz4Sd3azwsgW90AmbNJWqQSBfj4pgNEx0cLL12m8AzUAYFsVr1w_E9yo7p9OHBunKEA4wOFLp9T6Xe13ClSi1JhoQ0iFtABkodZkVI5PvVrhW6mblSXQmGpG4opIfNVlE7FQET1BDy_e1aN5m93ogx6guc2qqC0dqQGMh3RWAFlWhJ0HVWus2QX"
  },
  {
    id: "prod-4",
    name: "Medalhão de Mignon Prime",
    weight: "Aprox. 500g • Resfriado Extra Limpo",
    originalPrice: 110.00,
    price: 89.90,
    badge: "EXCLUSIVO",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB31NCNxXWJ6l_zG3lmBLOOmT8uP-EN-NnrIy28kaloy6EZVetU2WGOkYZjUeYIdWI0pBY-YXdNvFFbl3gHaZzm2T-vp3WDS0iojfsII1G89EryaYK-AxDrP_zvKpqvTkzFphAPOLxp2LxLA0nvwazXHgTlj6oWFSG3r_UYS7tjbZ5W-Z4-p4zAO56tvJ_dfvwLnGO0lEMuFkjMgXCwcC9yLjIHQGz4aQOwAb1ZQDv42A4-KqmpXLPI"
  },
  {
    id: "prod-5",
    name: "Ribeye Prime Angus (Ocho Ancho)",
    weight: "Aprox. 450g • Marmoreio Superior",
    originalPrice: 198.00,
    price: 168.00,
    badge: "SELEÇÃO CHEF",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "prod-6",
    name: "Prime Rib Dry Aged 60D",
    weight: "Aprox. 850g • Maturado 60 Dias",
    originalPrice: 380.00,
    price: 320.00,
    badge: "MATURAÇÃO 60D",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "prod-7",
    name: "Short Rib Angus Black",
    weight: "Aprox. 700g • Costela com Osso",
    originalPrice: 198.00,
    price: 175.00,
    badge: "OFERTA",
    image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "prod-8",
    name: "Wagyu A5 Striploin (Contrafilé)",
    weight: "Aprox. 300g • Corte Nobre Japonês",
    originalPrice: 520.00,
    price: 450.00,
    badge: "EDIÇÃO LIMITADA",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDY-t-x03DqVcLpZ-qMOihJSJnL_D3lbP1AOPO3RSRB90BASXQvXzTACKEbprFpHtgO-zcx586dkS73XAxhH6TAa9bjUjjdvPvh0RKbtjI4ZPpAcj9tR6zBKWY7M-jFak3OcWEp3uKR0KA_dIZ6VgQh7lvYbMsrt4_WE1jUMFO80m94U_Au0Ihn-mRhn3Rm3yjlM5cRlXJI3uarEl37oP0ZyDHsPpSkmfTFkqqiMdu1K1ON929VoX3W"
  }
];

export const mockCombos: MarketplaceCombo[] = [
  {
    id: "combo-1",
    title: "KIT CHURRASCO CLÁSSICO",
    description: "Perfeito para 4 a 6 pessoas. A essência do churrasco brasileiro gourmet.",
    price: 249.00,
    items: [
      "1.2kg Picanha Angus Prime",
      "800g Linguiça Artesanal com Queijo Coalho",
      "500g Pão de Alho de Parrilla",
      "Kit Sal Grosso de Parrilla & Chimichurri"
    ],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8gj2S8eD_rN_YMeXXZDa2mre2zfSFo_y4pLwVWa1Dz1K6jAatYXshF7oiFDvadli4uBy6_aZiHzQ6QWE_1cYKxgGo5HLYtyPO1v0VoSmWvF3-sMjrgW8o_K2qKK9zRIElxG7h80uU8ejGabawWah2IHCtcD81v0kyygTdeiBVV9D4PxOrYysUPYhyh8Bm2vEj7q243qHNKdEyCck34Qe89bUeR9vP4P1VUf9AzhS98tTtgaKy1Xcz"
  },
  {
    id: "combo-2",
    title: "KIT CHURRASCO PREMIUM WAGYU",
    description: "Para os paladares mais exigentes. Cortes nobres e marmoreio intenso certificado.",
    price: 589.00,
    items: [
      "1 Tomahawk Dry Aged 45D",
      "2x Bife Ancho Wagyu A5 BMS 10+",
      "1kg Prime Rib Angus",
      "Flor de Sal Defumada"
    ],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0go_qBK-11s7dT1qlRdppRuGj2tgJpurABjCyW0W630WINI9nDKqXAX98D_m8_TIpLbOK3UfRdaZaidtj-KNVHkkdTlYBalPOVgYKt8YHabo7HdkdGzRE7V--s38lOZRByj4Tz3seGjNGfU7zVYMq_dpzE3R7sZEsqoNyHjvzEOwxDBmnf1CDEGZzVLiQovfNAJoHO_BcUiRea4KroKgLf1kmNsVNE68C6oUUevXB2xcwJCpF0TuZ"
  }
];
