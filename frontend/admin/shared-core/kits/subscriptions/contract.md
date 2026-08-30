# Admin Subscriptions Contract

Runtime real:

```text
frontend/admin/shared-core/contracts/subscriptions.contract.ts
frontend/admin/shared-core/api/subscriptions.api.ts
frontend/admin/shared-core/mappers/subscriptions.mapper.ts
frontend/admin/shared-core/view-models/subscriptions.view-model.ts
frontend/admin/shared-core/hooks/useAdminSubscriptions.ts
frontend/admin/shared-core/hooks/useAdminPlans.ts
frontend/admin/shared-core/hooks/useAdminSubscriptionCycles.ts
frontend/admin/shared-core/hooks/useAdminPlanForm.ts
frontend/admin/shared-core/hooks/useAdminSubscriptionForm.ts
```

Endpoints backend consumidos:

```text
GET  /api/v1/subscriptions/admin/plans/
POST /api/v1/subscriptions/admin/plans/
GET  /api/v1/subscriptions/admin/subscriptions/
POST /api/v1/subscriptions/admin/subscriptions/
GET  /api/v1/subscriptions/admin/cycles/
```

Contrato fechado neste kit:

```text
AdminPlanDto
AdminPlanFormInput
AdminPlanCreateDto
AdminSubscriptionDto
AdminSubscriptionFormInput
AdminSubscriptionCreateDto
AdminSubscriptionsViewModel
AdminPlanFormViewModel
AdminSubscriptionFormViewModel
```

Limite intencional:

```text
update/cancel/pause/detail nao entram neste corte porque backend/apps/subscriptions/urls.py
ainda nao publica esses endpoints.
```

Garantias:

```text
admin subscriptions fica no admin shared-core
client shared-core nao importa operacao admin
PlanCreateSerializer recebe key, name, billing_interval, price_cents e entitlements
entitlement target permanece generico: collection, category, product ou variant
plans.read, plans.manage, subscriptions.read e subscriptions.manage continuam no backend
```
