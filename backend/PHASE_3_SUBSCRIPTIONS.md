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

## Decisao Para Continuar Deste Chat

Amanha, ao retomar a Fase 3, continuar a partir desta decisao:

```text
Plan/Subscription precisa ser multiempresa e seed-driven.
Royal Carnes e apenas a primeira seed real.
O motor de planos nao pode ter regra hardcoded para Royal Pro, Picanha,
Churrasco Premium, BikeClub, CamisaClub ou qualquer negocio especifico.
```

O desenho correto e tratar plano como motor generico de beneficios:

```text
Plan
  -> pacote comercial

PlanPrice
  -> preco do pacote

PlanEntitlement
  -> direito que o pacote libera

PlanEntitlement.constraints
  -> limites e condicoes configuraveis desse direito
```

O backend deve validar contratos genericos:

```text
targetType
targetId
quantity
measurementUnit
constraints
```

O seed/config define o negocio:

```text
Royal Pro
Linha Nobre
Picanha
5kg
1 saco de carvao
2 camisetas
1 revisao mensal
```

Regra anti-hardcode:

```text
Nao criar if plan == "Royal Pro".
Nao criar if product == "Picanha".
Nao criar if category == "Carnes".
Nao criar regra de negocio por name/copy.
Seed/importacao usa key/sku.
Banco relaciona por id/FK.
UI mostra name/copy.
```

## PlanEntitlement Generico

`PlanEntitlement` deve responder duas perguntas:

```text
1. O que o plano libera?
2. Quais limites/condicoes existem para esse direito?
```

Campos planejados:

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
constraints
sortOrder
```

`targetType` define o alvo:

```text
collection -> libera itens de uma colecao
category   -> libera itens de uma categoria
product    -> libera um produto e suas variants validas
variant    -> libera uma variant exata
```

`quantity + measurementUnitId` define limite principal:

```text
5 kg
3 unit
1 bag
1 service
```

`constraints` guarda limites adicionais sem prender o schema cedo demais:

```json
{
  "minQuantity": 1,
  "maxQuantity": 5,
  "minVariantWeightGrams": 500,
  "maxSelections": 3,
  "allowedCommercialModes": ["subscription"],
  "requiresAvailability": true,
  "allowedAttributes": {
    "size": ["P", "M", "G"],
    "wheelSize": ["aro 26", "aro 29"]
  }
}
```

Uso esperado de cada parte:

```text
quer agrupar produtos nobres -> Collection
quer agrupar tipo de produto -> Category
quer liberar um produto -> Product
quer liberar SKU exato -> ProductVariant
quer limitar quantidade/peso -> quantity + MeasurementUnit
quer restringir tamanho/cor/aro/corte -> constraints.allowedAttributes
quer regra muito especifica -> constraints, com cuidado
```

## Exemplos De PlanEntitlement

### Royal Carnes - Plano Pro Por Linha Nobre

Seed:

```text
Collection: linha-nobre
Products:
  Picanha
  Ancho
  Tomahawk
  Contra-file
```

Entitlement:

```text
Plan
  key: royal-pro
  name: Royal Pro

PlanEntitlement
  targetType: collection
  collectionId: linha-nobre
  quantity: 5
  measurementUnit: kg
  constraints:
    maxSelections: 4
    allowedCommercialModes: ["subscription"]
    requiresAvailability: true
```

Significado:

```text
Royal Pro libera ate 5kg por ciclo da colecao Linha Nobre.
Cliente pode escolher no maximo 4 produtos/variants dentro dessa regra.
```

Validacao generica:

```text
Cliente escolheu PICANHA-1KG x 2kg.
Backend ve que PICANHA-1KG pertence ao Product Picanha.
Product Picanha pertence a Collection linha-nobre.
Plan tem entitlement para linha-nobre.
2kg <= 5kg.
Variant esta disponivel para subscription.
Resultado: permitido.
```

### Royal Carnes - Picanha Com Limite Especifico

Entitlement:

```text
PlanEntitlement
  targetType: product
  productId: picanha
  quantity: 5
  measurementUnit: kg
  constraints:
    minVariantWeightGrams: 500
    maxSelections: 5
    requiresAvailability: true
```

Significado:

```text
Plano libera ate 5kg de Picanha por ciclo.
Cliente pode compor com Picanha 500g, Picanha 1kg ou peca maior,
desde que respeite o limite total e as constraints.
```

### Royal Carnes - Variant Exata

Entitlement:

```text
PlanEntitlement
  targetType: variant
  variantId: CARVAO-5KG
  quantity: 1
  measurementUnit: bag
  constraints:
    maxQuantity: 1
```

Significado:

```text
Plano inclui 1 saco de carvao por ciclo.
```

### Loja Feminina - Roupas

Entitlement:

```text
Plan
  key: style-pro
  name: Style Pro

PlanEntitlement
  targetType: collection
  collectionId: verao-premium
  quantity: 3
  measurementUnit: unit
  constraints:
    maxSelections: 3
    allowedAttributes:
      size: ["P", "M", "G"]
```

Significado:

```text
Plano libera 3 pecas por ciclo da colecao Verao Premium,
somente nas variants com tamanho P, M ou G.
```

### Loja Feminina - Sapatos

Entitlement:

```text
PlanEntitlement
  targetType: category
  categoryId: calcados
  quantity: 1
  measurementUnit: unit
  constraints:
    maxSelections: 1
    allowedAttributes:
      size: ["36", "37", "38", "39"]
```

Significado:

```text
Plano libera 1 calcado por ciclo, limitado aos tamanhos configurados.
```

### BikeClub

Entitlement de bike:

```text
Plan
  key: urbano
  name: Urbano

PlanEntitlement
  targetType: product
  productId: bike-urbana
  quantity: 1
  measurementUnit: unit
  constraints:
    maxSelections: 1
    allowedAttributes:
      wheelSize: ["aro 26", "aro 29"]
```

Entitlement de servico:

```text
PlanEntitlement
  targetType: product
  productId: revisao-mensal
  quantity: 1
  measurementUnit: service
  constraints:
    maxQuantity: 1
```

Significado:

```text
Mesmo motor: bike, roupa, sapato, carne e servico mudam por seed/config.
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
constraints
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
constraints define limites configuraveis sem regra hardcoded
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
