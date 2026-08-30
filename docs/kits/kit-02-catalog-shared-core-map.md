# Kit 02 - Catalog Shared-Core Map

Data: 2026-08-30

## Objetivo

Fechar o Catalog no shared-core com a mesma organizacao do Kit 01:

```text
frontend/shared-core
frontend/client/shared-core
frontend/admin/shared-core
```

O Catalog deve funcionar para Royal Carnes por seed/config, mas permanecer
generico para ecommerce, assinatura, servicos, bicicleta, camisa ou outro
produto.

## Regra Principal

```text
global recebe tipos base realmente comuns
client recebe catalogo publico
admin recebe catalogo operacional
backend continua autoridade de preco, disponibilidade e permissao
```

Nunca fazer:

```text
if business == "royalprime"
if productName == "Picanha"
if commercialMode == "Royal Delivery"
```

Esses nomes pertencem a seed/config/copy, nao ao motor.

## Visao Vertical Do Kit

```text
backend
  -> Collection, Category, CommercialMode, MeasurementUnit
  -> Product, ProductVariant, ProductMedia, ProductPrice
  -> CatalogAvailability
  -> endpoints publicos e admin por organization

frontend/shared-core
  -> ids, keys, status, money, media e contratos base puros

frontend/client/shared-core
  -> listagem publica, detalhe publico, mapper e view-model de vitrine

frontend/admin/shared-core
  -> listagem admin, criacao de produto, form model, mapper e view-model operacional

frontend/client/web e frontend/admin/web
  -> render-only no proximo marco
```

## O Que Vai Para Global Shared-Core

Local:

```text
frontend/shared-core/types/catalog.types.ts
frontend/shared-core/contracts/catalog.contract.ts
```

Pode morar no global:

```text
CatalogEntityId
ProductId
ProductVariantId
CategoryId
CollectionId
CommercialModeId
MeasurementUnitId
ProductKey
ProductVariantSku
CategoryKey
CollectionKey
CommercialModeKey
MeasurementUnitKey
CatalogStatus
MeasurementUnitKind
ProductPriceType
MoneyAmount
MediaAssetBase
CategoryBase
CollectionBase
CommercialModeBase
MeasurementUnitBase
ProductVariantBase
ProductPriceBase
ProductBase
CatalogErrorCode
```

Global nao deve ter:

```text
useClientCatalog
useAdminCatalog
admin product form
fetch direto
copy Royal Carnes
preco calculado localmente
regra de estoque ou disponibilidade real
```

## O Que Vai Para Client Shared-Core

Local:

```text
frontend/client/shared-core/contracts/catalog.contract.ts
frontend/client/shared-core/api/catalog.api.ts
frontend/client/shared-core/hooks/useClientCatalog.ts
frontend/client/shared-core/hooks/useClientProductDetail.ts
frontend/client/shared-core/mappers/catalog.mapper.ts
frontend/client/shared-core/view-models/catalog.view-model.ts
frontend/client/shared-core/kits/catalog/
```

Responsabilidades:

```text
listar colecoes publicas
listar modos comerciais publicos
listar produtos publicos
detalhar produto publico
preparar card/lista/detalhe para render
```

Nao deve conter:

```text
criar produto
editar preco
permissao products.manage
controle de estoque
regra de assinatura
```

## O Que Vai Para Admin Shared-Core

Local:

```text
frontend/admin/shared-core/contracts/catalog.contract.ts
frontend/admin/shared-core/api/catalog.api.ts
frontend/admin/shared-core/hooks/useAdminCatalog.ts
frontend/admin/shared-core/hooks/useAdminProductDetail.ts
frontend/admin/shared-core/hooks/useAdminProductForm.ts
frontend/admin/shared-core/mappers/catalog.mapper.ts
frontend/admin/shared-core/view-models/catalog.view-model.ts
frontend/admin/shared-core/kits/catalog/
```

Responsabilidades:

```text
listar produtos admin
criar produto
montar payload do ProductCreateSerializer
preparar rows de tabela
preparar form model
detalhar produto para leitura
```

Nao deve conter:

```text
checkout do cliente
carrinho
assinatura do cliente
estoque auditavel
orders
```

## Endpoints Backend Cobertos

```text
GET  /api/v1/catalog/collections/
GET  /api/v1/catalog/commercial-modes/
GET  /api/v1/catalog/products/
GET  /api/v1/catalog/products/:id/
GET  /api/v1/catalog/admin/products/
POST /api/v1/catalog/admin/products/
```

Nao coberto por escolha tecnica:

```text
PATCH /api/v1/catalog/admin/products/:id/
DELETE /api/v1/catalog/admin/products/:id/
GET /api/v1/catalog/categories/
GET /api/v1/catalog/measurement-units/
```

Motivo:

```text
backend/apps/catalog/urls.py ainda nao publica esses endpoints.
Quando existirem, ampliar o API client e este mapa.
```

## Tree Exata Do Kit 02

```text
frontend/shared-core/
  types/
    catalog.types.ts
  contracts/
    catalog.contract.ts

frontend/client/shared-core/
  contracts/
    catalog.contract.ts
  api/
    catalog.api.ts
  hooks/
    useClientCatalog.ts
    useClientProductDetail.ts
  mappers/
    catalog.mapper.ts
  view-models/
    catalog.view-model.ts
  kits/
    catalog/
      README.md
      contract.md
      flow.md

frontend/admin/shared-core/
  contracts/
    catalog.contract.ts
  api/
    catalog.api.ts
  hooks/
    useAdminCatalog.ts
    useAdminProductDetail.ts
    useAdminProductForm.ts
  mappers/
    catalog.mapper.ts
  view-models/
    catalog.view-model.ts
  kits/
    catalog/
      README.md
      contract.md
      flow.md
```

## Criterio De Pronto Do Kit 02 Shared-Core

```text
global contem apenas tipos/contratos puros
client catalog nao conhece admin
admin catalog nao conhece checkout/portal
hooks chamam API clients
API clients batem nos endpoints reais
mappers normalizam DTO do Django
view-models entregam formato pronto para render
precos/modos/collections continuam seed/config
sem if por nome de empresa, produto ou modo comercial
client/admin builds passam
backend check passa
```
