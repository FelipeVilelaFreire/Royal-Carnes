# Client Catalog Contract

Runtime real:

```text
frontend/client/shared-core/contracts/catalog.contract.ts
frontend/client/shared-core/api/catalog.api.ts
frontend/client/shared-core/mappers/catalog.mapper.ts
frontend/client/shared-core/view-models/catalog.view-model.ts
frontend/client/shared-core/hooks/useClientCatalog.ts
frontend/client/shared-core/hooks/useClientProductDetail.ts
```

Endpoints backend consumidos:

```text
GET /api/v1/catalog/collections/
GET /api/v1/catalog/commercial-modes/
GET /api/v1/catalog/products/
GET /api/v1/catalog/products/:id/
```

Contrato fechado neste kit:

```text
ClientCategoryDto
ClientCollectionDto
ClientCommercialModeDto
ClientProductDto
ClientProductVariantDto
ClientProductPriceDto
ClientCatalogSnapshot
ClientCatalogViewModel
ClientProductCardViewModel
```

Garantias:

```text
catalogo client nao conhece admin
preco vem do backend como amount_cents/currency
commercial mode vem de seed/config, nao enum RoyalPrime
variant attributes aceita dominios diferentes sem if de negocio
tela futura apenas renderiza card/lista/detalhe e chama hook
```
