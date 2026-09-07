# Admin Inventory Kit

Status:

```text
local foundation
```

## O Que Este Kit Faz

Organiza o controle admin de estoque simples, ajustes e movimentos auditaveis.

## Backend

```text
backend/apps/inventory/
backend/API_CONTRACTS.md
```

Endpoints principais:

```text
GET /api/v1/inventory/admin/items/
POST /api/v1/inventory/admin/items/
GET /api/v1/inventory/admin/items/:id/
POST /api/v1/inventory/admin/items/:id/adjust/
GET /api/v1/inventory/admin/items/:id/movements/
```

## Admin Shared-Core

```text
frontend/admin/shared-core/contracts/inventory.contract.ts
frontend/admin/shared-core/api/inventory.api.ts
frontend/admin/shared-core/hooks/useAdminInventory.ts
frontend/admin/shared-core/hooks/useAdminInventoryItemDetail.ts
frontend/admin/shared-core/hooks/useAdminInventoryAdjustment.ts
frontend/admin/shared-core/mappers/inventory.mapper.ts
frontend/admin/shared-core/view-models/inventory.view-model.ts
frontend/admin/shared-core/manifest/pages/cortes.config.jsx
frontend/admin/shared-core/kits/inventory/
```

## Render Admin

```text
ListPage -> estoque
DetailPage -> item e movimentos
AddPage/modal -> ajuste manual
```

## Proximo Passo

```text
garantir que status de estoque, tons e acoes venham de view-model/manifest
```

