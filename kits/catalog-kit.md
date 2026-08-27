# Catalog Kit

Status inicial: `planned`

Fase principal: Fase 1 - Backend Base Real

## Objetivo

Documentar a capacidade de catalogo vendavel: colecoes, categorias, produtos,
variantes, precos, modos comerciais e disponibilidade.

Este kit precisa provar que o catalogo serve para Royal Carnes sem ficar preso a
carnes.

## Produtos Que Podem Reutilizar

- RoyalPrime / Royal Carnes;
- ecommerce simples;
- restaurante;
- clube de vinho;
- assinatura de bicicleta;
- barbearia com produtos e servicos;
- qualquer produto com vitrine e itens vendaveis.

## Regra Central

```text
Collection organiza campanha/vitrine/sazonalidade.
Category organiza taxonomia.
Product e item vendavel.
Product pode pertencer a varias Collections.
```

## Escopo Backend

Responsabilidades:

- criar e listar colecoes;
- criar e listar categorias;
- criar produtos e variantes;
- manter preco por produto/variante e modo comercial;
- controlar disponibilidade comercial;
- permitir que um produto apareca em multiplas colecoes;
- manter organizationId em tudo.

Arquivos fonte planejados:

```text
backend/apps/catalog/
backend/api/v1/catalog/
backend/seeds/royalprime/catalog/
backend/seeds/examples/bikeclub/catalog/
backend/seeds/examples/camisaclub/catalog/
```

Entidades esperadas:

- `Collection`;
- `CollectionProduct`;
- `Category`;
- `Product`;
- `ProductVariant`;
- `ProductMedia`;
- `ProductPrice`;
- `CommercialMode`;
- `CatalogAvailability`.

Services/use-cases esperados:

- `create_collection`;
- `add_product_to_collection`;
- `create_product`;
- `set_product_price`;
- `list_public_catalog`;
- `list_admin_catalog`;

Endpoints esperados:

- `GET /catalog/collections`;
- `GET /catalog/products`;
- `GET /admin/catalog/products`;
- `POST /admin/catalog/products`;
- `PATCH /admin/catalog/products/{id}`;

Regras reais:

- frontend nao calcula preco final;
- frontend nao decide disponibilidade real;
- `CommercialMode` e configuracao/seed, nao enum preso em Royal Carnes;
- `Royal Delivery` e `Royal Box` sao nomes comerciais de seed/copy.

## Escopo Shared-Core

Local inicial:

```text
frontend/client/shared-core
frontend/admin/shared-core
frontend/shared-core
```

Contratos:

- `Collection`;
- `Category`;
- `Product`;
- `ProductVariant`;
- `ProductPrice`;
- `CommercialMode`;
- `CatalogAvailability`;
- `CatalogErrorCode`.

API clients:

- `catalogApi.listCollections()`;
- `catalogApi.listProducts(input)`;
- `adminCatalogApi.listProducts(input)`;
- `adminCatalogApi.updateProduct(input)`;

Hooks:

- `useCatalog`;
- `useProductDetail`;
- `useAdminCatalog`;
- `useAdminProductMutation`;

Mappers:

- API catalog DTO -> view model do cliente;
- API admin catalog DTO -> view model do admin;
- error code -> chave de locale.

## Escopo Render

Responsabilidades:

- grid de produtos;
- detalhe de produto;
- filtros visuais;
- admin table/lista;
- formulario visual de produto;
- estados de loading/erro/empty.

Proibido na tela:

- calcular preco;
- decidir estoque real;
- decidir regra de colecao;
- hardcodar Royal Carnes como condicional de codigo;
- buscar endpoint direto quando houver hook compartilhavel.

## Arquivos Fonte No RoyalPrime

Planejado:

```text
backend/apps/catalog/
backend/api/v1/catalog/
```

Mocks atuais para converter:

```text
frontend/client/shared-core/mocks/catalog/
frontend/admin/shared-core/mocks/
```

Docs relacionados:

```text
backend/MER.md
backend/TREE.md
backend/seeds/royalprime/seed.manifest.json
backend/seeds/examples/bikeclub/seed.manifest.json
backend/seeds/examples/camisaclub/seed.manifest.json
kits/seed-strategy.md
kits/royal-carnes-seed-kit.md
```

## Generico vs Especifico

Generico:

- colecao;
- categoria;
- produto;
- variante;
- preco;
- modo comercial;
- disponibilidade.

Especifico do RoyalPrime:

- Picanha, Ancho, Fraldinha;
- Royal Delivery;
- Royal Box;
- Colecao Familia;
- Churrasco Premium;
- imagens e copy gourmet.

## Como Copiar/Adaptar Para Outro Produto

1. Copiar/adaptar entidades backend de catalogo.
2. Trocar seed/config da organization.
3. Copiar/adaptar contratos compartilhados.
4. Copiar/adaptar API clients e hooks.
5. Recriar render na surface do novo produto.
6. Trocar copy, categorias, imagens e nomes comerciais.
7. Validar que produto pode entrar em multiplas colecoes.
8. Rodar builds/testes.

## Seeds Esperados

### Seed principal: Royal Carnes

Collections:

```text
colecao-inverno
colecao-verao
colecao-familia
churrasco-premium
dia-a-dia
```

Categories:

```text
carnes
carvao
temperos
utensilios
combos
```

Products:

```text
Picanha
Ancho
Fraldinha
Maminha
Tomahawk
Carvao Premium
Tempero seco
Kit churrasco
```

Commercial modes:

```text
subscription
delivery
box
```

### Seed exemplo: BikeClub

Collections:

```text
urbano
performance
manutencao
```

Categories:

```text
bicicletas
acessorios
manutencao
```

Products:

```text
Bike urbana
Capacete
Kit reparo
Revisao mensal
```

Commercial modes:

```text
subscription
delivery
pickup
```

Objetivo:

```text
provar que Collection, Category, Product e CommercialMode nao dependem de Royal Carnes
```

### Seed exemplo: CamisaClub

Collections:

```text
basicos
verao
streetwear
```

Categories:

```text
camisetas
moletons
acessorios
```

Products:

```text
Camiseta branca
Camiseta street
Moletom basic
Bone classic
```

Commercial modes:

```text
subscription
delivery
box
```

Objetivo:

```text
provar catalogo de produto nao perecivel e assinatura por quantidade de itens
```

### Seed dev

Deve conter poucos produtos de cada categoria e ao menos um produto em mais de
uma collection.

### Seed test

Deve conter:

```text
1 organization
2 collections
2 categories
3 products
1 product em 2 collections
2 commercial modes
```

## Criterio Para Kit-Ready

Este kit vira `kit-ready` quando:

- backend real de catalogo existir;
- endpoint publico de catalogo existir;
- endpoint admin de catalogo existir;
- cliente e admin consumirem por hooks;
- seed Royal Carnes criar catalogo inicial;
- seed exemplo provar dominio alternativo;
- os arquivos fonte estiverem listados aqui.

## Criterio Para ServiceOS Candidate

Este kit vira `serviceos-candidate` somente quando:

- for reutilizado fora do RoyalPrime;
- `Product`, `Collection` e `CommercialMode` nao dependerem de carnes;
- a extracao reduzir complexidade real.
