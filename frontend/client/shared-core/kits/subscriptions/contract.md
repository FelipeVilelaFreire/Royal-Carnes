# Client Subscriptions Contract

Runtime real:

```text
frontend/client/shared-core/contracts/subscriptions.contract.ts
frontend/client/shared-core/api/subscriptions.api.ts
frontend/client/shared-core/mappers/subscriptions.mapper.ts
frontend/client/shared-core/view-models/subscriptions.view-model.ts
frontend/client/shared-core/hooks/useClientPlans.ts
frontend/client/shared-core/hooks/useClientSubscription.ts
frontend/client/shared-core/hooks/useClientCurrentCycle.ts
```

Endpoints backend consumidos:

```text
GET  /api/v1/subscriptions/plans/
GET  /api/v1/subscriptions/me/
GET  /api/v1/subscriptions/me/cycles/current/
POST /api/v1/subscriptions/me/cycles/current/items/
```

Contrato fechado neste kit:

```text
ClientPlanDto
ClientSubscriptionDto
ClientSubscriptionCycleDto
ClientSubscriptionCycleItemDto
ClientCycleItemSelectionInput
ClientPlanCardViewModel
ClientSubscriptionViewModel
ClientCycleViewModel
```

Garantias:

```text
client subscriptions nao conhece admin
entitlements apontam para collection/category/product/variant por contrato generico
preco vem como amount_cents/currency
selecionar item envia entitlement_key/product_key/variant_sku/quantity
backend valida limite, unidade, availability e atributos
tela futura apenas chama hook e renderiza estado
```
