# Admin Orders Kit

Status:

```text
local foundation
```

## O Que Este Kit Faz

Organiza a operacao admin de pedidos recebidos, detalhe e transicao de status.

## Backend

```text
backend/apps/orders/
backend/API_CONTRACTS.md
```

Endpoints principais:

```text
GET /api/v1/orders/admin/orders/
POST /api/v1/orders/admin/orders/
GET /api/v1/orders/admin/orders/:id/
POST /api/v1/orders/admin/orders/:id/transition/
```

## Admin Shared-Core

```text
frontend/admin/shared-core/contracts/orders.contract.ts
frontend/admin/shared-core/api/orders.api.ts
frontend/admin/shared-core/hooks/useAdminOrders.ts
frontend/admin/shared-core/hooks/useAdminOrderDetail.ts
frontend/admin/shared-core/hooks/useAdminOrderTransition.ts
frontend/admin/shared-core/mappers/orders.mapper.ts
frontend/admin/shared-core/view-models/orders.view-model.ts
frontend/admin/shared-core/manifest/pages/pedidos.config.jsx
frontend/admin/shared-core/kits/orders/
```

## Render Admin

```text
ListPage -> pedidos
DetailPage -> detalhe do pedido
acoes -> transition via hook
```

## Proximo Passo

```text
remover labels/tones/status hardcoded dos screen types e consumir view-model
```

