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
  { id: "all", name: "Todos os Cortes" },
  { id: "angus", name: "Angus Prime" },
  { id: "wagyu", name: "Wagyu A5 Japão" },
  { id: "dryaged", name: "Dry Aged 45D/60D" },
  { id: "churrasco", name: "Churrasco Master" },
  { id: "suinos", name: "Suínos & Cordeiro" },
  { id: "especiais", name: "Kits & Especiais" }
];

export const mockCutsCatalog: CutProduct[] = [
  {
    id: "cut-1",
    name: "Picanha Angus Prime",
    subtitle: "Capa de gordura uniforme, marmoreio grau BMB 6+",
    weight: "1.2kg",
    originalPrice: 189.90,
    price: 149.90,
    badge: "OFERTA 20% OFF",
    badgeType: "offer",
    category: "angus",
    line: "Linha Prime Angus",
    origin: "Uruguai",
    preparation: "Grelha / Parrilla",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBroJrbE3Sp_7XDMtERJ-9z5OJSYK5EODpyLYKQTGEJssWhruw0wjKU1BlG5cV5iVKdQgisdcIYttpwq9gjy0YzlmOOto7AfHMD_0h1I1TZax7X5pQuGFHOAyHTZTDegKL1LxM1e0Grk0QGR8tq9O9XhvcrGRHLy_JygNYR9tar0wcphLhM3Oh7nafgpxGKQj5rKRJKYRuXmYk-BaQschmaZb604XTKLy6jsv83GszKJUbYW0MIkRJ8"
  },
  {
    id: "cut-2",
    name: "Tomahawk Dry Aged 45D",
    subtitle: "Maturado a seco por 45 dias em câmara de sal rosa",
    weight: "950g",
    price: 295.00,
    originalPrice: 340.00,
    badge: "MATURAÇÃO 45D",
    badgeType: "limited",
    category: "dryaged",
    line: "Linha Dry Aged 45D/60D",
    origin: "Argentina",
    preparation: "Parrilla / Forno",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "cut-3",
    name: "Wagyu A5 Striploin (Contrafilé)",
    subtitle: "Marmoreio extremo certificado BMS 11+",
    weight: "350g",
    price: 450.00,
    badge: "EDIÇÃO LIMITADA",
    badgeType: "limited",
    category: "wagyu",
    line: "Linha Wagyu A5",
    origin: "Kagoshima, Japão",
    preparation: "Frigideira de Ferro / Teppan",
    image: "https://images.unsplash.com/photo-1546964124-0cce460f38ef?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "cut-4",
    name: "Medalhão de Filet Mignon Prime",
    subtitle: "Corte extra limpo, maciez absoluta e zero gordura",
    weight: "500g (2 unid.)",
    price: 89.90,
    originalPrice: 110.00,
    badge: "OFERTA",
    badgeType: "offer",
    category: "angus",
    line: "Cortes Bovinos Especiais",
    origin: "Brasil",
    preparation: "Frigideira / Grelha",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB31NCNxXWJ6l_zG3lmBLOOmT8uP-EN-NnrIy28kaloy6EZVetU2WGOkYZjUeYIdWI0pBY-YXdNvFFbl3gHaZzm2T-vp3WDS0iojfsII1G89EryaYK-AxDrP_zvKpqvTkzFphAPOLxp2LxLA0nvwazXHgTlj6oWFSG3r_UYS7tjbZ5W-Z4-p4zAO56tvJ_dfvwLnGO0lEMuFkjMgXCwcC9yLjIHQGz4aQOwAb1ZQDv42A4-KqmpXLPI"
  },
  {
    id: "cut-5",
    name: "Ribeye Prime Angus (Bife Ancho)",
    subtitle: "Miolo de alcatra com maciez e suculência superior",
    weight: "450g",
    price: 168.00,
    category: "angus",
    line: "Linha Prime Angus",
    origin: "Uruguai",
    preparation: "Grelha / Frigideira",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "cut-6",
    name: "Prime Rib Dry Aged 60D",
    subtitle: "Maturação especial de 60 dias em umidade controlada",
    weight: "850g",
    price: 320.00,
    badge: "MATURAÇÃO 60D",
    badgeType: "limited",
    category: "dryaged",
    line: "Linha Dry Aged 45D/60D",
    origin: "Argentina",
    preparation: "Parrilla",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "cut-7",
    name: "Short Rib Angus Black",
    subtitle: "Costela de dianteiro com osso e marmoreio denso",
    weight: "700g",
    price: 175.00,
    originalPrice: 198.00,
    badge: "OFERTA",
    badgeType: "offer",
    category: "churrasco",
    line: "Cortes para Churrasco Master",
    origin: "Brasil",
    preparation: "Parrilla / Pit Smoker",
    image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "cut-8",
    name: "Prime Pork Chop Duroc",
    subtitle: "Ancho suíno de raça Duroc, suculência e sabor sem igual",
    weight: "400g",
    price: 68.90,
    category: "suinos",
    line: "Linha Suínos Nobres",
    origin: "Brasil",
    preparation: "Grelha / Frigideira",
    image: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "cut-9",
    name: "Flat Iron Steak Prime",
    subtitle: "Segundo corte mais macio do boi, ideal para grelhar rápido",
    weight: "350g",
    price: 129.00,
    category: "angus",
    line: "Cortes Bovinos Especiais",
    origin: "Uruguai",
    preparation: "Grelha / Frigideira",
    image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "cut-10",
    name: "Carré de Cordeiro Francês",
    subtitle: "Rack de cordeiro limpo (frenched) de textura aveludada",
    weight: "800g",
    price: 119.90,
    originalPrice: 145.00,
    badge: "OFERTA",
    badgeType: "offer",
    category: "suinos",
    line: "Cordeiro Selecionado",
    origin: "Uruguai",
    preparation: "Forno / Grelha",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIoB6uhSQ_mV9SWgU0p50xpbVwIOEV230_9UaEB9L0Q82pNKakb4GPREMpXOzFdNMp_-4-YiQ0U5QuUOTgKb9oXGsymnsDlldp3qljhPb6SwSM6cHkjDL0NnPM35nTGVXefUhD7H86Y6aWIesrJuc7QG1hl3j-W8g8PV5Lnj3GZBHRELNm_DJVQwGpPqE3gOojpye63rGSdRLB1-MBruc-UYBI-ilp7qHGT-GxWKWTgIBgPyLwv7kz"
  },
  {
    id: "cut-11",
    name: "Bife Ancho Wagyu A5 BMS 10+",
    subtitle: "Maciez incomparável com sabor amanteigado umami profundo",
    weight: "400g",
    price: 389.00,
    badge: "MARMOREIO X",
    badgeType: "limited",
    category: "wagyu",
    line: "Linha Wagyu A5",
    origin: "Miyazaki, Japão",
    preparation: "Frigideira de Ferro",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoaEBVAVqn9ij7ZU82DUcs7G-lOtPXsUgGiQX7VwjZ6RsduGy8hyLzeGFHtLGLDbUlaFORnLmZLaPTgjqg8xa29fAyKV36L7Ph_ESBef-v5BnWXGLrnvxYbPPDvxepFsaMgEPuZDz4-7xSuF8VJaErTNa78_nPxANCQsZ3dyuDsDsMZMMqED21eBrkSOZ6Yanv6_y_k11DR9vgAkdDJu_zaJ3lhrs7ljuk290MwqsWH_Rtf8_8Q1WX"
  },
  {
    id: "cut-12",
    name: "Bife de Chorizo Prime Angus",
    subtitle: "Corte tradicional com capa de gordura lateral rica",
    weight: "800g",
    price: 109.90,
    originalPrice: 140.00,
    badge: "PROMOÇÃO",
    badgeType: "offer",
    category: "angus",
    line: "Linha Prime Angus",
    origin: "Argentina",
    preparation: "Parrilla / Frigideira",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "cut-13",
    name: "Fraldinha Red Angus",
    subtitle: "Fibras longas de extrema suculência e sabor forte",
    weight: "1.0kg",
    price: 98.90,
    originalPrice: 125.00,
    badge: "OFERTA",
    badgeType: "offer",
    category: "churrasco",
    line: "Churrasco Master",
    origin: "Brasil",
    preparation: "Grelha",
    image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "cut-14",
    name: "T-Bone Dry Aged 45D",
    subtitle: "Dupla experiência: Striploin de um lado e Filet Mignon do outro",
    weight: "900g",
    price: 229.00,
    badge: "MATURAÇÃO 45D",
    badgeType: "limited",
    category: "dryaged",
    line: "Linha Dry Aged 45D/60D",
    origin: "Argentina",
    preparation: "Parrilla",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "cut-15",
    name: "Ribeye Cap Wagyu (Spinalis)",
    subtitle: "O 'Filé das Nações'. O corte mais macio e saboroso de todo o boi Wagyu",
    weight: "300g",
    price: 460.00,
    badge: "EDIÇÃO LIMITADA",
    badgeType: "limited",
    category: "wagyu",
    line: "Linha Wagyu A5",
    origin: "Miyazaki, Japão",
    preparation: "Teppan / Frigideira",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "cut-16",
    name: "NY Strip Dry Aged 30D",
    subtitle: "Sabor de carne concentrado, maciez aveludada e aroma de nozes",
    weight: "500g",
    price: 179.00,
    category: "dryaged",
    line: "Linha Dry Aged 45D/60D",
    origin: "Brasil",
    preparation: "Parrilla / Frigideira",
    image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "cut-17",
    name: "Kit Churrasco Clássico",
    subtitle: "Picanha Angus 1.2kg, Linguiça Artesanal 800g, Pão de Alho & Sal",
    weight: "2.5kg total",
    price: 249.00,
    badge: "COMBO MESTRE",
    badgeType: "offer",
    category: "especiais",
    line: "Kits & Combos",
    origin: "Seleção Royal Prime",
    preparation: "Churrasqueira",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8gj2S8eD_rN_YMeXXZDa2mre2zfSFo_y4pLwVWa1Dz1K6jAatYXshF7oiFDvadli4uBy6_aZiHzQ6QWE_1cYKxgGo5HLYtyPO1v0VoSmWvF3-sMjrgW8o_K2qKK9zRIElxG7h80uU8ejGabawWah2IHCtcD81v0kyygTdeiBVV9D4PxOrYysUPYhyh8Bm2vEj7q243qHNKdEyCck34Qe89bUeR9vP4P1VUf9AzhS98tTtgaKy1Xcz"
  },
  {
    id: "cut-18",
    name: "Kit Churrasco Premium Wagyu",
    subtitle: "Tomahawk Duroc, 2x Bife Ancho Wagyu, 1kg Prime Rib Angus & Flor de Sal",
    weight: "3.2kg total",
    price: 589.00,
    badge: "ULTRA PREMIUM",
    badgeType: "limited",
    category: "especiais",
    line: "Kits & Combos",
    origin: "Seleção Royal Prime",
    preparation: "Churrasqueira",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0go_qBK-11s7dT1qlRdppRuGj2tgJpurABjCyW0W630WINI9nDKqXAX98D_m8_TIpLbOK3UfRdaZaidtj-KNVHkkdTlYBalPOVgYKt8YHabo7HdkdGzRE7V--s38lOZRByj4Tz3seGjNGfU7zVYMq_dpzE3R7sZEsqoNyHjvzEOwxDBmnf1CDEGZzVLiQovfNAJoHO_BcUiRea4KroKgLf1kmNsVNE68C6oUUevXB2xcwJCpF0TuZ"
  },
  {
    id: "cut-19",
    name: "Linguiça Artesanal de Costela",
    subtitle: "Recheada com queijo coalho e tempero especial",
    weight: "500g",
    price: 48.00,
    category: "churrasco",
    line: "Churrasco Master",
    origin: "Brasil",
    preparation: "Grelha",
    image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "cut-20",
    name: "Prime Rib Angus Black 30D",
    subtitle: "Costela prime maturada 30 dias com sabor intenso",
    weight: "900g",
    price: 215.00,
    category: "dryaged",
    line: "Linha Dry Aged 45D/60D",
    origin: "Uruguai",
    preparation: "Parrilla",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
  }
];
