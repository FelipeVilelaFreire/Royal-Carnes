# Admin Subscriptions Kit

Gestao operacional de planos, assinaturas e ciclos.

Inclui:

```text
planos
plan prices
plan entitlements
assinaturas
ciclos
```

Regra de plano, entitlement e permissao continua no backend.

Mapa vertical:

```text
docs/kits/kit-03-subscriptions-shared-core-map.md
contract.md
flow.md
```

Arquivos runtime:

```text
contracts/subscriptions.contract.ts
api/subscriptions.api.ts
hooks/useAdminSubscriptions.ts
hooks/useAdminPlans.ts
hooks/useAdminSubscriptionCycles.ts
hooks/useAdminPlanForm.ts
hooks/useAdminSubscriptionForm.ts
mappers/subscriptions.mapper.ts
view-models/subscriptions.view-model.ts
```

Escopo fechado no backend atual:

```text
GET  /api/v1/subscriptions/admin/plans/
POST /api/v1/subscriptions/admin/plans/
GET  /api/v1/subscriptions/admin/subscriptions/
POST /api/v1/subscriptions/admin/subscriptions/
GET  /api/v1/subscriptions/admin/cycles/
```

Nao prometer update/cancel/pause/detail enquanto o backend nao publicar esses endpoints.
