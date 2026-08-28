# Fase 3 - Plans And Subscriptions

Status: `planned`

Objetivo:

```text
modelar planos, assinaturas e ciclos recorrentes
conectando usuarios/clientes da Fase 1 com catalogo vendavel da Fase 2
sem prender o codigo a Royal Carnes
```

RoyalPrime/Royal Carnes sera a primeira seed real. O codigo deve continuar
multiempresa por `organizationId`.

## Regra Central

```text
Plan define a promessa comercial.
PlanPrice define quanto custa essa promessa.
PlanEntitlement define o que o cliente tem direito a receber.
Subscription liga um Customer a um Plan.
SubscriptionCycle representa um periodo da assinatura.
SubscriptionCycleItem representa o que precisa ser entregue/usado no ciclo.
```

Nada deve depender de nome de plano, nome de produto ou texto de UI.

```text
seed/importacao usa key/sku
banco relaciona por id/FK
UI mostra name/copy
```

## Conexao Com Fase 1

Fase 1 criou:

```text
Organization
User
Role
Permission
OrganizationMember
Customer
```

Fase 3 usa isso assim:

```text
Organization 1 -> N Plan
Organization 1 -> N Subscription
Customer 1 -> N Subscription
User pode acessar assinatura via Customer
Admin/Operator gerencia planos com permissao da organization
```

Exemplo:

```text
User
  id: 5
  email: cliente@royalprime.local

Customer
  id: 10
  userId: 5
  organizationId: royalprime

Subscription
  id: 80
  organizationId: royalprime
  customerId: 10
  planId: 3
  status: active
```

Regra:

```text
assinatura nunca fica solta
assinatura sempre pertence a uma organization e a um customer
```

## Conexao Com Fase 2

Fase 2 criou:

```text
Collection
Category
Product
ProductVariant
MeasurementUnit
ProductPrice
CommercialMode
CatalogAvailability
```

Fase 3 nao copia catalogo. Ela referencia catalogo por entitlement.

```text
PlanEntitlement pode apontar para:
  Product
  ProductVariant
  Category
  Collection
```

Exemplo por collection:

```text
Plan: Churrasco Familia

PlanEntitlement
  targetType: collection
  collectionId: churrasco-premium
  quantity: 2
  measurementUnitId: kg
```

Exemplo por variant:

```text
PlanEntitlement
  targetType: variant
  variantId: PICANHA-1KG
  quantity: 1
  measurementUnitId: unit
```

Exemplo por category:

```text
PlanEntitlement
  targetType: category
  categoryId: bovinos
  quantity: 3
  measurementUnitId: kg
```

Regra:

```text
Catalog define o que existe para vender.
PlanEntitlement define o que o plano permite receber.
SubscriptionCycleItem congela o que sera separado/entregue naquele ciclo.
```

## MER Planejado

### Plan

Campos:

```text
id
organizationId
key
name
description
status
billingInterval
sortOrder
```

Regras:

```text
Plan e generico.
Royal Pro, Churrasco Familia e Box Premium sao seeds da organization.
```

### PlanPrice

Campos:

```text
id
organizationId
planId
currency
amountCents
billingInterval
priceType
startsAt opcional
endsAt opcional
```

Regras:

```text
preco da assinatura fica separado do preco do produto
gateway real fica para fase futura
```

### PlanEntitlement

Campos:

```text
id
organizationId
planId
targetType
productId opcional
variantId opcional
categoryId opcional
collectionId opcional
quantity
measurementUnitId opcional
sortOrder
```

`targetType` inicial:

```text
product
variant
category
collection
```

Regras:

```text
exatamente um target deve estar preenchido conforme targetType
measurementUnitId define a unidade do direito quando houver quantidade
entitlement nao calcula estoque
entitlement nao baixa pedido
entitlement nao cria pagamento sozinho
```

### Subscription

Campos:

```text
id
organizationId
customerId
planId
status
startedAt
endedAt opcional
currentCycleStartsAt
currentCycleEndsAt
cancelledAt opcional
cancelReason
```

Status inicial:

```text
active
paused
cancelled
past_due
```

Regras:

```text
Subscription liga Customer a Plan.
Subscription nao pertence diretamente ao User; User chega por Customer.
```

### SubscriptionCycle

Campos:

```text
id
organizationId
subscriptionId
cycleNumber
status
startsAt
endsAt
closedAt opcional
```

Status inicial:

```text
open
locked
fulfilled
skipped
cancelled
```

Regras:

```text
Cycle representa o periodo.
No RoyalPrime inicial, o periodo mais provavel e mensal.
```

### SubscriptionCycleItem

Campos:

```text
id
organizationId
cycleId
entitlementId
productId opcional
variantId opcional
quantity
measurementUnitId opcional
status
```

Status inicial:

```text
pending
selected
reserved
fulfilled
cancelled
```

Regras:

```text
CycleItem representa o item real do ciclo.
Quando o cliente escolhe uma variant, o item pode apontar para ProductVariant.
Quando ainda e promessa aberta, pode apontar apenas para entitlement.
```

## Exemplo Royal Carnes

```text
Plan
  key: churrasco-familia
  name: Churrasco Familia
  billingInterval: monthly

PlanPrice
  plan: churrasco-familia
  amountCents: 19990
  currency: BRL

PlanEntitlement
  targetType: collection
  collection: churrasco-premium
  quantity: 2
  measurementUnit: kg

PlanEntitlement
  targetType: variant
  variant: CARVAO-5KG
  quantity: 1
  measurementUnit: bag

Subscription
  customer: cliente-royal
  plan: churrasco-familia
  status: active

SubscriptionCycle
  subscription: cliente-royal/churrasco-familia
  cycleNumber: 1
  startsAt: 2026-09-01
  endsAt: 2026-09-30
  status: open
```

## Exemplo Multiempresa

BikeClub:

```text
Plan: Urbano
Entitlement: 1 Bike urbana aro 26 enquanto assinatura estiver ativa
Entitlement: 1 Revisao mensal por ciclo
```

CamisaClub:

```text
Plan: Box Basico
Entitlement: 2 itens da collection basicos por mes
Entitlement: 1 item da collection streetwear por trimestre
```

Regra:

```text
o codigo nao muda
quem muda e o seed/config da organization
```

## Seeds Planejados

Arquivos:

```text
backend/seeds/royalprime/kits/subscriptions.seed.json
backend/seeds/examples/bikeclub/kits/subscriptions.seed.json
backend/seeds/examples/camisaclub/kits/subscriptions.seed.json
backend/seeds/tests/kits/subscriptions.seed.json
```

Seed RoyalPrime deve conter:

```text
planos: Churrasco Familia, Royal Premium, Dia a Dia
precos mensais
entitlements por collection/category/variant
ao menos uma subscription ativa de cliente
ao menos um ciclo aberto
```

## API Planejada

Publico/cliente:

```text
GET  /api/v1/subscriptions/plans/
GET  /api/v1/subscriptions/me/
GET  /api/v1/subscriptions/me/cycles/current/
```

Admin:

```text
GET  /api/v1/subscriptions/admin/plans/
POST /api/v1/subscriptions/admin/plans/
GET  /api/v1/subscriptions/admin/subscriptions/
POST /api/v1/subscriptions/admin/subscriptions/
GET  /api/v1/subscriptions/admin/cycles/
```

Permissoes provaveis:

```text
plans.read
plans.manage
subscriptions.read
subscriptions.manage
```

## Fora Da Fase 3

Nao implementar ainda:

```text
gateway real
cobranca automatica
webhooks de pagamento
estoque/reserva real
baixa de estoque
pedido completo
delivery completo
troca complexa de itens
pause/cancelamento financeiro avancado
```

Esses pontos pertencem a fases futuras.

## Criterio De Fechamento

Fase 3 fecha quando:

```text
models/migrations existem
seed royalprime aplica planos, entitlements, subscriptions e ciclo
seeds exemplo provam multiempresa
API publica lista planos
API do cliente retorna assinatura atual
API admin lista/cria planos e assinaturas
testes cobrem tenant, permissao e relacao com catalog/customer
docs e kits atualizados
```

## Ordem Recomendada Para Amanha

```text
1. revisar este documento
2. atualizar MER.md com entidades finais de subscriptions
3. criar apps/subscriptions
4. criar models e migrations
5. ligar seed_loader ao kit subscriptions
6. criar seed RoyalPrime forte
7. criar seeds exemplo BikeClub/CamisaClub
8. criar selectors/services
9. criar serializers/views/urls
10. criar testes
11. atualizar API_CONTRACTS.md e kits/
```
