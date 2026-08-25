import { productsMock } from "./products.mock";
import { ProductCatalog } from "./types";

export const productCatalogsMock: ProductCatalog[] = [
  {
    id: "catalog-mais-pedidos-2026",
    name: "Mais pedidos 2026",
    subtitle: "Os produtos com maior apelo para a vitrine principal.",
    description: "Selecao pensada para abrir a experiencia do cliente com escolhas conhecidas e faceis de vender.",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1400&q=80",
    productIds: [
      "product-picanha",
      "product-fraldinha",
      "product-baby-beef",
      "product-maminha",
      "product-pao-de-alho",
      "product-linguica-toscana"
    ],
    tags: ["vitrine", "mais pedido", "2026"],
    featured: true,
    order: 10
  },
  {
    id: "catalog-churrasco-familia",
    name: "Churrasco para familia",
    subtitle: "Produtos e acompanhamentos para uma compra completa.",
    description: "Catalogo para montar uma experiencia simples: carne, frango, suino, pao de alho, queijo e carvao.",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1400&q=80",
    productIds: [
      "product-fraldinha",
      "product-maminha",
      "product-frango",
      "product-linguica-toscana",
      "product-pao-de-alho",
      "product-queijo-coalho",
      "product-carvao-5kg",
      "product-kit-churrasco-familia"
    ],
    tags: ["familia", "combo", "fim de semana"],
    featured: true,
    order: 20
  },
  {
    id: "catalog-linha-nobre",
    name: "Linha nobre",
    subtitle: "Produtos de maior valor para Box, Delivery e plano Pro.",
    description: "Vitrine para destacar produtos especiais sem depender de itens muito distantes da realidade brasileira.",
    image: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=1400&q=80",
    productIds: [
      "product-picanha",
      "product-baby-beef",
      "product-ancho",
      "product-chorizo",
      "product-prime-rib",
      "product-nobre-da-casa"
    ],
    tags: ["nobre", "premium", "pro"],
    order: 30
  },
  {
    id: "catalog-linha-argentina",
    name: "Linha argentina",
    subtitle: "Parrilla, cortes marcantes e temperos de apoio.",
    description: "Catalogo para vender uma experiencia tematica com ancho, chorizo, chimichurri e combo dedicado.",
    image: "https://images.unsplash.com/photo-1504973960431-1c467e159aa4?auto=format&fit=crop&w=1400&q=80",
    productIds: [
      "product-ancho",
      "product-chorizo",
      "product-chimichurri",
      "product-sal-parrilla",
      "product-carvao-5kg",
      "product-combo-argentina"
    ],
    tags: ["argentina", "parrilla", "premium"],
    order: 40
  },
  {
    id: "catalog-espetinhos",
    name: "Espetinhos",
    subtitle: "Itens prontos e produtos bons para montagem no espeto.",
    description: "Vitrine rapida para pedidos avulsos, eventos pequenos e compras praticas.",
    image: "https://images.unsplash.com/photo-1529563021893-cc83c992d75d?auto=format&fit=crop&w=1400&q=80",
    productIds: [
      "product-espetinho-misto",
      "product-espetinho-frango",
      "product-alcatra",
      "product-frango",
      "product-queijo-coalho",
      "product-espeto-inox"
    ],
    tags: ["espetinho", "delivery", "evento"],
    order: 50
  },
  {
    id: "catalog-utensilios",
    name: "Utensilios e preparo",
    subtitle: "Itens que complementam Box e Delivery.",
    description: "Catalogo para faca, espeto, tabua, afiador e carvao ficarem em uma area propria da experiencia.",
    image: "https://images.unsplash.com/photo-1528712306091-ed0763094c98?auto=format&fit=crop&w=1400&q=80",
    productIds: [
      "product-faca-royal",
      "product-espeto-inox",
      "product-tabua-madeira",
      "product-afiador",
      "product-carvao-5kg"
    ],
    tags: ["utensilio", "preparo", "box"],
    order: 60
  }
];

export const getCatalogById = (catalogId: string) =>
  productCatalogsMock.find((catalog) => catalog.id === catalogId);

export const getCatalogProducts = (catalogId: string) => {
  const catalog = getCatalogById(catalogId);

  if (!catalog) {
    return [];
  }

  return catalog.productIds
    .map((productId) => productsMock.find((product) => product.id === productId))
    .filter(Boolean);
};
