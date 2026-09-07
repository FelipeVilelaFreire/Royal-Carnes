# Admin Fulfillment & Delivery Kit

Status:

```text
local foundation
```

## O Que Este Kit Faz

Organiza a operacao admin de expedicao, entrega, transicao de status e
confirmacao.

## Backend

```text
backend/apps/deliveries/
backend/API_CONTRACTS.md
```

Endpoints principais:

```text
GET /api/v1/deliveries/admin/deliveries/
POST /api/v1/deliveries/admin/deliveries/
GET /api/v1/deliveries/admin/deliveries/:id/
POST /api/v1/deliveries/admin/deliveries/:id/transition/
POST /api/v1/deliveries/admin/deliveries/:id/confirm/
```

## Admin Shared-Core

```text
frontend/admin/shared-core/contracts/deliveries.contract.ts
frontend/admin/shared-core/api/deliveries.api.ts
frontend/admin/shared-core/hooks/useAdminDeliveries.ts
frontend/admin/shared-core/hooks/useAdminDeliveryTransition.ts
frontend/admin/shared-core/mappers/deliveries.mapper.ts
frontend/admin/shared-core/view-models/deliveries.view-model.ts
frontend/admin/shared-core/manifest/pages/deliveries.config.jsx
frontend/admin/shared-core/kits/deliveries/
```

## Render Admin

```text
ListPage -> expedicao/entregas
DetailPage -> entrega
acoes -> transition/confirm via hook
```

## Proximo Passo

```text
garantir que timeline, status e confirmacao sejam preparados fora do TSX
```
