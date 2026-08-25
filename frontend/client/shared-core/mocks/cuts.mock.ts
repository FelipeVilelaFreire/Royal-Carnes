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
  { id: "wagyu", name: "Wagyu A5" },
  { id: "dryaged", name: "Dry Aged 45D/60D" },
  { id: "churrasco", name: "Churrasco Master" },
  { id: "suinos", name: "Suínos & Aves" },
  { id: "especiais", name: "Edições Especiais" }
];

export const mockCutsCatalog: CutProduct[] = [
  {
    id: "cut-1",
    name: "Picanha Angus Prime",
    subtitle: "Capa de gordura uniforme, marmoreio grau 4+",
    weight: "500g",
    originalPrice: 189.90,
    price: 149.90,
    badge: "OFERTA 20% OFF",
    badgeType: "offer",
    category: "angus",
    line: "Linha Prime Angus",
    origin: "Uruguai",
    preparation: "Grelha / Parrilla",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcIYkSLuoAhmFaLnVtCJoRTddK9Z4EBMDLCPdqJRHbNwtLhzMkXFp9-2vZ1Tk3DfBAHdR0QO-BX6aJKeXMI1nid9qyw1NYhPhBaNMz9PAJXzHyTAUFrR0CZLfrFSXExOvULtOV_3vQhtjTpje9s-LSHSyiR06_3FQ3eBr6lIa8LXjuruh4wofmGvMUJYe8lku283pxYLCFy1QqN8yU8ctfJ7GtihvPTNV9khDz9jNtH_HDIUZbXCN-"
  },
  {
    id: "cut-2",
    name: "Tomahawk Dry Aged 45D",
    subtitle: "Maturado a seco por 45 dias em câmara de sal rosa",
    weight: "900g",
    price: 295.00,
    originalPrice: 340.00,
    badge: "MATURAÇÃO 45D",
    badgeType: "limited",
    category: "dryaged",
    line: "Linha Dry Aged 45D/60D",
    origin: "Argentina",
    preparation: "Parrilla / Forno",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdp3Iwy2fkq0V6cR6R5gyeRsjMMhyL9t_Z0qFFSqzOBpH3Kfdz3eIXPk9QsLokmlz4Sd3azwsgW90AmbNJWqQSBfj4pgNEx0cLL12m8AzUAYFsVr1w_E9yo7p9OHBunKEA4wOFLp9T6Xe13ClSi1JhoQ0iFtABkodZkVI5PvVrhW6mblSXQmGpG4opIfNVlE7FQET1BDy_e1aN5m93ogx6guc2qqC0dqQGMh3RWAFlWhJ0HVWus2QX"
  },
  {
    id: "cut-3",
    name: "Wagyu A5 Striploin (Contrafilé)",
    subtitle: "Marmoreio extremo certificado BMS 10+",
    weight: "300g",
    price: 450.00,
    badge: "EDIÇÃO LIMITADA",
    badgeType: "limited",
    category: "wagyu",
    line: "Linha Wagyu A5",
    origin: "Kagoshima, Japão",
    preparation: "Frigideira de Ferro / Teppan",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDY-t-x03DqVcLpZ-qMOihJSJnL_D3lbP1AOPO3RSRB90BASXQvXzTACKEbprFpHtgO-zcx586dkS73XAxhH6TAa9bjUjjdvPvh0RKbtjI4ZPpAcj9tR6zBKWY7M-jFak3OcWEp3uKR0KA_dIZ6VgQh7lvYbMsrt4_WE1jUMFO80m94U_Au0Ihn-mRhn3Rm3yjlM5cRlXJI3uarEl37oP0ZyDHsPpSkmfTFkqqiMdu1K1ON929VoX3W"
  },
  {
    id: "cut-4",
    name: "Medalhão de Filet Mignon Prime",
    subtitle: "Corte extra limpo, maciez absoluta",
    weight: "400g (2 unid.)",
    price: 115.90,
    originalPrice: 135.00,
    badge: "OFERTA",
    badgeType: "offer",
    category: "angus",
    line: "Cortes Bovinos Especiais",
    origin: "Brasil (Nelore Mocho)",
    preparation: "Frigideira / Grelha",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdgTKMTCBBfpL1oLipF3IN5S1pcA7Nnln5novGwsiPdQ088NrXZGQTE7iyhH6284GXgNGUy9zhWY6DmMsRUMJtpI3m0CsrUNZIaliw8uzeKHg0kNJI66SFuxhpSpZyVlu9llPHIFnNreaU7ErRckNBVJBwXcDVR6uDUso570r-UWIFEt1fO4ATGyW4OAl69DoUYSEA9NM_tZKLGqifszN0P24CFoj3W4XMRWJGZ58E9mqv-daOAjLU"
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
    subtitle: "Maturação especial de 60 dias em controle de umidade",
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
    name: "Galeto Gourmet ao Alho Social",
    subtitle: "Frango caipira marinado em ervas de Provence e azeite extra virgem",
    weight: "800g",
    price: 54.90,
    category: "suinos",
    line: "Aves Selecionadas",
    origin: "Brasil",
    preparation: "Forno / Grelha",
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "cut-11",
    name: "Bife de Chorizo Wagyu A5",
    subtitle: "Corte nobre de lombo com sabor amanteigado indescritível",
    weight: "250g",
    price: 390.00,
    badge: "EDIÇÃO LIMITADA",
    badgeType: "limited",
    category: "especiais",
    line: "Edições Especiais do Chef",
    origin: "Miyazaki, Japão",
    preparation: "Frigideira de Ferro",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "cut-12",
    name: "Kit Sal de Parrilla & Flor de Sal Defumada",
    subtitle: "Tempero artesanal exclusivo para finalizar carnes nobres",
    weight: "500g (3 potes)",
    price: 49.90,
    category: "especiais",
    line: "Edições Especiais do Chef",
    origin: "Brasil",
    preparation: "Finalização",
    image: "https://images.unsplash.com/photo-1514944288352-fffac99f0bdf?auto=format&fit=crop&w=800&q=80"
  }
];
