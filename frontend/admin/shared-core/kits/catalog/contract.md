# Admin Catalog Contract

Runtime real:

```text
frontend/admin/shared-core/contracts/catalog.contract.ts
frontend/admin/shared-core/api/catalog.api.ts
frontend/admin/shared-core/mappers/catalog.mapper.ts
frontend/admin/shared-core/view-models/catalog.view-model.ts
frontend/admin/shared-core/hooks/useAdminCatalog.ts
frontend/admin/shared-core/hooks/useAdminProductDetail.ts
frontend/admin/shared-core/hooks/useAdminProductForm.ts
```

Endpoints backend consumidos:

```text
GET  /api/v1/catalog/collections/
GET  /api/v1/catalog/commercial-modes/
GET  /api/v1/catalog/admin/products/
GET  /api/v1/catalog/products/:id/
POST /api/v1/catalog/admin/products/
```

Contrato fechado neste kit:

```text
AdminProductDto
AdminProductFormInput
AdminProductCreateDto
AdminCatalogSnapshot
AdminCatalogViewModel
AdminProductRowViewModel
AdminProductFormViewModel
```

Limite intencional:

```text
PATCH /api/v1/catalog/admin/products/:id/ aparece como desejo antigo em docs,
mas backend/apps/catalog/urls.py ainda nao publica esse endpoint.
```

Garantias:

```text
admin catalog fica no admin shared-core
client shared-core nao importa gestao operacional
ProductCreateSerializer recebe category_keys, commercial_mode_keys e collection_keys
variant attributes continua generico para carnes, bicicletas, camisas ou servicos
products.manage continua autoridade no backend
```
