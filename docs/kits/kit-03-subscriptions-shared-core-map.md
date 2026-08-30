# Kit 03 - Subscriptions Shared-Core Map

Data: 2026-08-30

## Objetivo

Fechar Plans and Subscriptions no shared-core com a mesma organizacao dos Kits
01 e 02:

```text
frontend/shared-core
frontend/client/shared-core
frontend/admin/shared-core
```

Subscriptions conecta Auth/Customers do Kit 01 ao Catalog do Kit 02. O motor
deve servir Royal Carnes por seed/config, mas permanecer generico para outros
negocios.

## Regra Principal

```text
global recebe tipos base realmente comuns
client recebe assinatura vista pelo cliente
admin recebe operacao de planos, assinaturas e ciclos
backend continua autoridade de entitlement, ciclo, limite e permissao
```

Nunca fazer:

```text
if plan == "Royal Pro"
if product == "Picanha"
if business == "Royal Carnes"
```

Planos, produtos, colecoes e unidades pertencem a seed/config. O codigo trabalha
com Plan, PlanEntitlement, Product, ProductVariant, Collection e MeasurementUnit.

## Visao Vertical Do Kit

```text
backend
  -> Plan, PlanPrice, PlanEntitlement
  -> Subscription, SubscriptionCycle, SubscriptionCycleItem
  -> validacao generica de entitlement

frontend/shared-core
  -> ids, status, billing interval, target type e contratos base puros

frontend/client/shared-core
  -> planos publicos, minha assinatura, ciclo atual e selecao de item

frontend/admin/shared-core
  -> planos admin, criacao de plano, assinaturas, criacao de assinatura e ciclos

frontend/client/web e frontend/admin/web
  -> render-only no proximo marco
```

## O Que Vai Para Global Shared-Core

Local:

```text
frontend/shared-core/types/subscriptions.types.ts
frontend/shared-core/contracts/subscriptions.contract.ts
```

Pode morar no global:

```text
PlanId
PlanKey
PlanPriceId
PlanEntitlementId
PlanEntitlementKey
SubscriptionId
SubscriptionCycleId
SubscriptionCycleItemId
BillingInterval
PlanStatus
PlanPriceType
EntitlementTargetType
SubscriptionStatus
SubscriptionCycleStatus
SubscriptionCycleItemStatus
EntitlementConstraints
PlanBase
PlanPriceBase
PlanEntitlementBase
SubscriptionBase
SubscriptionCycleBase
SubscriptionCycleItemBase
CycleItemSelectionInputBase
SubscriptionErrorCode
```

Global nao deve ter:

```text
useClientSubscription
useAdminSubscriptions
admin plan form
fetch direto
copy RoyalPrime
calculo local de entitlement
regra de limite por nome de plano
```

## O Que Vai Para Client Shared-Core

Local:

```text
frontend/client/shared-core/contracts/subscriptions.contract.ts
frontend/client/shared-core/api/subscriptions.api.ts
frontend/client/shared-core/hooks/useClientPlans.ts
frontend/client/shared-core/hooks/useClientSubscription.ts
frontend/client/shared-core/hooks/useClientCurrentCycle.ts
frontend/client/shared-core/hooks/useClientCycleItems.ts
frontend/client/shared-core/mappers/subscriptions.mapper.ts
frontend/client/shared-core/view-models/subscriptions.view-model.ts
frontend/client/shared-core/kits/subscriptions/
```

Responsabilidades:

```text
listar planos publicos
carregar assinatura ativa do cliente
carregar ciclo aberto atual
selecionar item no ciclo atual
preparar view-models para plano, assinatura e ciclo
```

Nao deve conter:

```text
criar plano
listar todas as assinaturas
admin cycles
permissao plans.manage
regra real de entitlement
```

## O Que Vai Para Admin Shared-Core

Local:

```text
frontend/admin/shared-core/contracts/subscriptions.contract.ts
frontend/admin/shared-core/api/subscriptions.api.ts
frontend/admin/shared-core/hooks/useAdminSubscriptions.ts
frontend/admin/shared-core/hooks/useAdminPlans.ts
frontend/admin/shared-core/hooks/useAdminSubscriptionCycles.ts
frontend/admin/shared-core/hooks/useAdminPlanForm.ts
frontend/admin/shared-core/hooks/useAdminSubscriptionForm.ts
frontend/admin/shared-core/mappers/subscriptions.mapper.ts
frontend/admin/shared-core/view-models/subscriptions.view-model.ts
frontend/admin/shared-core/kits/subscriptions/
```

Responsabilidades:

```text
listar planos admin
criar plano basico com entitlements
listar assinaturas
criar assinatura para customer/plan
listar ciclos
preparar rows/forms para admin render-only
```

Nao deve conter:

```text
portal UI
checkout
catalog admin CRUD fora do contrato de entitlement
orders
inventory reservation
```

## Endpoints Backend Cobertos

```text
GET  /api/v1/subscriptions/plans/
GET  /api/v1/subscriptions/me/
GET  /api/v1/subscriptions/me/cycles/current/
POST /api/v1/subscriptions/me/cycles/current/items/
GET  /api/v1/subscriptions/admin/plans/
POST /api/v1/subscriptions/admin/plans/
GET  /api/v1/subscriptions/admin/subscriptions/
POST /api/v1/subscriptions/admin/subscriptions/
GET  /api/v1/subscriptions/admin/cycles/
```

Nao coberto por escolha tecnica:

```text
update plan
delete plan
pause/cancel subscription
subscription detail endpoint
cycle transition endpoint
cycle item update/delete
```

Motivo:

```text
backend/apps/subscriptions/urls.py ainda nao publica esses endpoints.
Quando existirem, ampliar o API client e este mapa.
```

## Tree Exata Do Kit 03

```text
frontend/shared-core/
  types/
    subscriptions.types.ts
  contracts/
    subscriptions.contract.ts

frontend/client/shared-core/
  contracts/
    subscriptions.contract.ts
  api/
    subscriptions.api.ts
  hooks/
    useClientPlans.ts
    useClientSubscription.ts
    useClientCurrentCycle.ts
    useClientCycleItems.ts
  mappers/
    subscriptions.mapper.ts
  view-models/
    subscriptions.view-model.ts
  kits/
    subscriptions/
      README.md
      contract.md
      flow.md

frontend/admin/shared-core/
  contracts/
    subscriptions.contract.ts
  api/
    subscriptions.api.ts
  hooks/
    useAdminSubscriptions.ts
    useAdminPlans.ts
    useAdminSubscriptionCycles.ts
    useAdminPlanForm.ts
    useAdminSubscriptionForm.ts
  mappers/
    subscriptions.mapper.ts
  view-models/
    subscriptions.view-model.ts
  kits/
    subscriptions/
      README.md
      contract.md
      flow.md
```

## Criterio De Pronto Do Kit 03 Shared-Core

```text
global contem apenas tipos/contratos puros
client subscriptions nao conhece admin
admin subscriptions nao conhece portal UI
subscriptions usa catalog por keys/ids genericos
entitlements apontam para collection/category/product/variant
hooks chamam API clients
API clients batem nos endpoints reais
mappers normalizam DTO do Django
view-models entregam formato pronto para render
sem if por nome de empresa, plano, produto ou collection
client/admin builds passam
backend check passa
```
