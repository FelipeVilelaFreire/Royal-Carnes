# Admin Subscriptions Kit

Status:

```text
local foundation
```

## O Que Este Kit Faz

Organiza a operacao admin de planos, assinaturas e ciclos.

## Backend

```text
backend/apps/subscriptions/
backend/API_CONTRACTS.md
```

Endpoints principais:

```text
GET /api/v1/subscriptions/admin/plans/
POST /api/v1/subscriptions/admin/plans/
GET /api/v1/subscriptions/admin/subscriptions/
POST /api/v1/subscriptions/admin/subscriptions/
GET /api/v1/subscriptions/admin/cycles/
```

## Admin Shared-Core

```text
frontend/admin/shared-core/contracts/subscriptions.contract.ts
frontend/admin/shared-core/api/subscriptions.api.ts
frontend/admin/shared-core/hooks/useAdminSubscriptions.ts
frontend/admin/shared-core/hooks/useAdminPlans.ts
frontend/admin/shared-core/hooks/useAdminSubscriptionCycles.ts
frontend/admin/shared-core/mappers/subscriptions.mapper.ts
frontend/admin/shared-core/view-models/subscriptions.view-model.ts
frontend/admin/shared-core/manifest/pages/assinaturas.config.jsx
frontend/admin/shared-core/kits/subscriptions/
```

## Render Admin

```text
ListPage -> assinaturas e ciclos
DetailPage -> detalhe operacional
AddPage -> plano ou assinatura quando aplicavel
```

## Proximo Passo

```text
separar copy, status e cards de assinatura em manifest/view-model
```

