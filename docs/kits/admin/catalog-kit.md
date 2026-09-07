# Admin Catalog Kit

Status:

```text
local foundation
```

## O Que Este Kit Faz

Organiza a operacao admin de produtos, categorias, variants, precos, midias e
disponibilidade.

## Backend

```text
backend/apps/catalog/
backend/API_CONTRACTS.md
```

Endpoints principais:

```text
GET /api/v1/catalog/admin/products/
POST /api/v1/catalog/admin/products/
GET /api/v1/catalog/admin/products/:id/
PATCH /api/v1/catalog/admin/products/:id/
```

## Admin Shared-Core

```text
frontend/admin/shared-core/contracts/catalog.contract.ts
frontend/admin/shared-core/api/catalog.api.ts
frontend/admin/shared-core/hooks/useAdminCatalog.ts
frontend/admin/shared-core/hooks/useAdminProductDetail.ts
frontend/admin/shared-core/mappers/catalog.mapper.ts
frontend/admin/shared-core/view-models/catalog.view-model.ts
frontend/admin/shared-core/manifest/pages/produtos.config.jsx
frontend/admin/shared-core/kits/catalog/
```

## Render Admin

```text
ListPage -> produtos
DetailPage -> detalhe do produto
AddPage -> criar produto
```

## Proximo Passo

```text
fazer colunas, filtros, campos e acoes virem de manifest/view-model
```

