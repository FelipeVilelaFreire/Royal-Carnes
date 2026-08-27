# RoyalPrime MER

Este documento define o MER inicial do backend RoyalPrime.

Objetivo:

```text
modelar produto real
  -> ecommerce
  -> assinatura/mensalidade
  -> pedidos
  -> entrega
  -> pagamento
  -> admin operacional
  -> tenant-ready desde o inicio
```

RoyalPrime/Royal Carnes e a primeira organization, nao uma regra fixa no codigo.

## Principios

```text
Organization existe desde o inicio.
Entidades de negocio carregam organizationId.
Seeds vestem o negocio.
Codigo core continua generico.
```

Exemplo:

```text
Organization: royalprime
Plan seed: Royal Pro
Product seed: Picanha, Ancho, Carvao

Organization futura: bikeclub
Plan seed: Urbano, Performance
Product seed: Bike, Capacete, Revisao
```

## Entidades Por Dominio

```text
organizations
  Organization
  OrganizationSettings
  OrganizationDomain
  OrganizationFeatureFlag

accounts
  User
  UserIdentity
  Session
  Role
  Permission
  OrganizationMember
  PasswordResetToken

customers
  Customer
  CustomerProfile
  Address
  CustomerNote
  PaymentMethodRef

catalog
  Collection
  CollectionProduct
  Category
  ProductCategory
  Product
  ProductVariant
  ProductMedia
  ProductPrice
  CommercialMode
  CatalogAvailability

subscriptions
  Plan
  PlanLimit
  PlanPrice
  Subscription
  SubscriptionCycle
  SubscriptionCycleUsage
  SubscriptionCycleItem

orders
  Order
  OrderItem
  OrderStatusHistory
  OrderTimelineEvent
  OrderAdjustment

deliveries
  Delivery
  DeliveryWindow
  DeliveryPackage
  DeliveryStatusHistory
  DeliveryConfirmation

payments
  PaymentMethod
  Payment
  Invoice
  PaymentAttempt
  PaymentAllocation
  PaymentReceipt

wallets
  Wallet
  WalletTransaction
  CreditAdjustment

vouchers
  Voucher
  VoucherRedemption

inventory
  InventoryItem
  InventoryMovement
  StockReservation

audit
  AuditLog
```

## Relacionamento Geral

```text
Organization 1 -> N User
Organization 1 -> N Customer
Organization 1 -> N Product
Organization 1 -> N Plan
Organization 1 -> N Subscription
Organization 1 -> N Order
Organization 1 -> N Delivery
Organization 1 -> N Payment
Organization 1 -> N Wallet
Organization 1 -> N Voucher
Organization 1 -> N InventoryItem

User N -> N Organization via OrganizationMember
User 1 -> N Customer
Customer N -> 1 Organization

Customer 1 -> N Address
Customer 1 -> N Subscription
Customer 1 -> N Order
Customer 1 -> 1 Wallet

Plan 1 -> N PlanLimit
Plan 1 -> N PlanPrice
Plan 1 -> N Subscription

Subscription 1 -> N SubscriptionCycle
SubscriptionCycle 1 -> N SubscriptionCycleUsage
SubscriptionCycle 1 -> N Order

Order 1 -> N OrderItem
Order 1 -> 0..N Delivery
Order 1 -> 0..N PaymentAllocation

Delivery N -> 1 Order
Payment N -> 1 Customer
PaymentAllocation N -> 1 Payment
PaymentAllocation N -> 1 Order
```

## Base Fields Obrigatorios

Entidades de negocio devem ter:

```text
id
organizationId
createdAt
updatedAt
deletedAt opcional
createdByUserId opcional
updatedByUserId opcional
```

Regra:

```text
queries filtram por organizationId
endpoint valida permissao na organization
frontend nao escolhe organizationId sem backend validar contexto
```

## Organizations

### Organization

Representa uma empresa/tenant.

Campos:

```text
id
slug
name
legalName
document
status
defaultLocale
timezone
currency
createdAt
updatedAt
```

Exemplo seed:

```text
slug: royalprime
name: RoyalPrime
legalName: Royal Carnes
currency: BRL
```

### OrganizationSettings

Configuracoes comerciais e operacionais da organization.

Campos:

```text
id
organizationId
key
valueJson
```

Uso:

- metodo de pagamento ativo;
- regioes de entrega;
- politica de recorrencia;
- parametros de exibicao publicados para frontend.

### OrganizationDomain

Dominios/hosts ligados a organization.

### OrganizationFeatureFlag

Flags por organization.

Exemplos:

- `subscriptions.enabled`;
- `wallet.enabled`;
- `manualPayments.enabled`;
- `deliveryScheduling.enabled`.

## Accounts

### User

Identidade humana ou operacional.

Campos:

```text
id
organizationId
name
email
phone
status
lastLoginAt
```

Observacao:

Cliente e admin podem compartilhar `User`; perfil e permissao separam o papel.

### OrganizationMember

Liga usuario a organization e papel.

Campos:

```text
id
organizationId
userId
roleId
status
```

Regra:

```text
User representa identidade de login.
OrganizationMember representa acesso/papel em uma organization.
Customer representa a pessoa como cliente dentro de uma organization.
```

Isso permite um sistema unido no futuro.

Exemplo:

```text
User: felipe@email.com
  -> OrganizationMember royalprime como admin
  -> Customer royalprime como cliente
  -> Customer bikeclub como cliente futuro
```

O mesmo `User` pode participar de multiplas organizations, mas cada
relacionamento operacional precisa ser validado por `organizationId`.

### Role / Permission

Permissoes devem ser genericas:

```text
orders.read
orders.approve
orders.updateStatus
products.manage
customers.read
deliveries.manage
payments.markPaid
```

## Customers

### Customer

Pessoa cliente dentro da organization.

Campos:

```text
id
organizationId
userId opcional
name
email
phone
document opcional
status
memberSince
```

Regra:

```text
Customer sempre pertence a uma organization.
User pode existir sem Customer.
User pode ter Customer em mais de uma organization.
Admin tambem pode ser Customer se comprar como cliente.
```

Nao assumir que todo `User` e cliente. Nao assumir que todo cliente tem login no
inicio.

### Address

Endereco do cliente.

Campos:

```text
id
organizationId
customerId
label
recipientName
postalCode
street
number
complement
district
city
state
country
isDefault
deliveryInstructions
```

Regra:

```text
pedido referencia addressId
pedido nao duplica endereco completo como regra primaria
delivery pode guardar snapshot se necessario para auditoria
```

## Catalog

### Collection

Agrupamento editorial/comercial de produtos.

Campos:

```text
id
organizationId
key
name
description
status
sortOrder
startsAt opcional
endsAt opcional
```

Exemplos RoyalPrime:

```text
colecao-inverno
colecao-verao
colecao-familia
churrasco-premium
dia-a-dia
```

Exemplos outro produto:

```text
colecao-urbana
colecao-performance
manutencao-basica
```

Regra:

```text
Collection organiza campanha, vitrine, sazonalidade ou agrupamento comercial.
Category organiza taxonomia.
Product e o item vendavel.
Product pode pertencer a varias Categories.
```

### CollectionProduct

Relacionamento N:N entre colecao e produto.

Campos:

```text
id
organizationId
collectionId
productId
sortOrder
isFeatured
startsAt opcional
endsAt opcional
```

Regra:

```text
um produto pode estar em varias colecoes
uma colecao pode ter varios produtos
```

Exemplo:

```text
Produto: Picanha
  -> Colecao Inverno
  -> Colecao Familia
  -> Churrasco Premium
```

### Category

Organiza produtos.

Campos:

```text
id
organizationId
name
slug
parentId opcional
sortOrder
isActive
```

### Product

Item vendavel generico.

Campos:

```text
id
organizationId
name
slug
description
unit
status
isPerishable
sortOrder
```

Exemplo RoyalPrime:

```text
Picanha
Ancho
Carvao Premium
```

Exemplo outro produto:

```text
Bike urbana
Capacete
Kit reparo
```

### ProductCategory

Relacionamento N:N entre produto e categoria.

Campos:

```text
id
organizationId
productId
categoryId
isPrimary
sortOrder
```

Regra:

```text
um produto pode estar em varias categorias
uma categoria pode ter varios produtos
isPrimary define a categoria principal para UI/SEO quando necessario
```

Exemplo:

```text
Produto: Bike X
  -> Infantil
  -> Adulto
```

### ProductVariant

Varia peso, embalagem, tamanho, SKU.

Campos:

```text
id
organizationId
productId
sku
name
unit
unitQuantity
weightGrams opcional
isActive
```

### ProductPrice

Preco por produto/variante e modo comercial.

Campos:

```text
id
organizationId
productId
variantId opcional
commercialModeKey
collectionId opcional
priceType
currency
amountCents
startsAt
endsAt opcional
```

Tipos iniciais:

```text
base
promotional
subscription
campaign
manual
```

Regra:

```text
ProductPrice representa preco publicado/contratado.
Motor de desconto/promocao complexo fica para app futuro.
```

### CommercialMode

Modalidade comercial configuravel.

Exemplos:

```text
subscription
royalBox
delivery
```

Nao deve ser hardcoded para sempre no core. E seed/config.

## Subscriptions e Mensalidade

### Plan

Plano generico de assinatura.

Campos:

```text
id
organizationId
key
name
description
status
billingInterval
trialDays
sortOrder
```

Exemplo RoyalPrime:

```text
basic
premium
pro
```

Regra:

```text
codigo trabalha com Plan
Royal Pro e dado seed/config
```

### PlanPrice

Preco de mensalidade/recorrencia.

Campos:

```text
id
organizationId
planId
currency
amountCents
billingInterval
billingIntervalCount
startsAt
endsAt opcional
```

Exemplos:

```text
mensal: R$ 299,00 / mes
anual: R$ 249,00 por mes no anual
```

### PlanLimit

Limites configuraveis do plano.

Campos:

```text
id
organizationId
planId
limitKey
limitValue
unit
```

Exemplos RoyalPrime:

```text
proteinKgLimit = 8
charcoalKgLimit = 5
maxCuts = 6
```

Exemplos outro produto:

```text
maxItemsPerCycle = 3
monthlyMaintenanceHours = 2
```

### Subscription

Contrato recorrente do cliente.

Campos:

```text
id
organizationId
customerId
planId
status
startedAt
pausedAt opcional
cancelledAt opcional
currentCycleId opcional
nextBillingAt
paymentMethodRefId opcional
```

Status inicial:

```text
active
paused
pastDue
cancelled
expired
```

### SubscriptionCycle

Ciclo mensal/periodico da assinatura.

Campos:

```text
id
organizationId
subscriptionId
cycleNumber
startsAt
endsAt
status
```

Status:

```text
open
locked
ordered
fulfilled
closed
skipped
```

### SubscriptionCycleUsage

Uso acumulado do ciclo.

Campos:

```text
id
organizationId
subscriptionCycleId
limitKey
usedValue
unit
```

Regra:

```text
backend calcula usage
tela apenas exibe usage recebido
```

### SubscriptionCycleItem

Selecao planejada do ciclo antes/depois de virar pedido.

Campos:

```text
id
organizationId
subscriptionCycleId
productId
variantId opcional
quantity
unit
weightGrams opcional
source
```

## Orders

### Order

Compra.

Campos:

```text
id
organizationId
customerId
subscriptionId opcional
subscriptionCycleId opcional
addressId opcional
code
kind
source
status
currency
subtotalCents
discountCents
freightCents
totalCents
createdAt
approvedAt opcional
cancelledAt opcional
```

Kinds iniciais:

```text
delivery
subscriptionCycle
box
manual
```

Observacao:

`royalDelivery` e nome comercial do RoyalPrime. O core pode usar `delivery` e
o seed/config/copy apresenta como Royal Delivery.

Status comercial inicial:

```text
draft
sentToStore
approved
preparing
outForDelivery
delivered
cancelled
```

### OrderItem

Item comprado.

Campos:

```text
id
organizationId
orderId
productId
variantId opcional
nameSnapshot
quantity
unit
unitPriceCents
totalCents
weightGrams opcional
isIncludedInSubscription
```

Regra:

```text
backend calcula preco, peso e limites
frontend nao recalcula regra comercial
```

### OrderStatusHistory

Historico imutavel de status.

### OrderTimelineEvent

Eventos exibiveis para cliente/admin.

Pode derivar de status, delivery e pagamento.

## Deliveries

### Delivery

Execucao da entrega.

Campos:

```text
id
organizationId
orderId
customerId
addressId
status
scheduledDate
deliveryWindowId opcional
deliveryCode
addressSnapshotJson
notes
```

Status logistico inicial:

```text
pending
packing
readyToDispatch
outForDelivery
delivered
failed
cancelled
```

Regra:

```text
pedido responde o que foi comprado
delivery responde quando, onde e como sera entregue
```

### DeliveryWindow

Janela de entrega.

### DeliveryPackage

Caixa/pacote fisico.

### DeliveryConfirmation

Confirmacao por codigo, foto ou operador.

## Payments

### PaymentMethod

Metodo aceito por organization.

Exemplos:

```text
pixManual
cashOnDelivery
cardManual
whatsapp
gatewayCard
```

### Invoice

Cobranca/fatura.

Campos:

```text
id
organizationId
customerId
subscriptionId opcional
orderId opcional
status
currency
amountCents
dueAt
paidAt opcional
```

### Payment

Pagamento recebido/tentado.

Campos:

```text
id
organizationId
customerId
paymentMethodKey
status
currency
amountCents
provider
providerPaymentId opcional
receivedAt opcional
```

Status:

```text
pending
authorized
paid
failed
cancelled
refunded
```

### PaymentAllocation

Liga pagamento a pedido, invoice ou assinatura.

Regra:

```text
um pagamento pode quitar uma invoice
uma invoice pode representar pedido avulso ou mensalidade
```

## Wallets e Vouchers

### Wallet

Carteira do cliente na organization.

Campos:

```text
id
organizationId
customerId
currency
balanceCents
status
```

### WalletTransaction

Movimento auditavel.

Tipos:

```text
credit
debit
refund
adjustment
voucherRedemption
payment
```

### Voucher

Credito/cupom configuravel.

### VoucherRedemption

Uso do voucher.

## Inventory

### InventoryItem

Estoque simples por produto/variante.

Campos:

```text
id
organizationId
productId
variantId opcional
availableQuantity
reservedQuantity
unit
status
```

Status:

```text
available
limited
unavailable
disabled
```

### InventoryMovement

Movimento de estoque.

Tipos:

```text
manualAdjustment
orderReservation
orderApprovalDebit
orderCancellationRelease
```

## Audit

### AuditLog

Registro de acoes sensiveis.

Campos:

```text
id
organizationId
actorUserId opcional
entityType
entityId
action
beforeJson opcional
afterJson opcional
metadataJson opcional
createdAt
```

## Mocks Atuais Para MER

Classificacao inicial:

```text
client/shared-core/mocks/catalog
  -> Collection, Category, Product, ProductVariant, ProductPrice, Plan,
     PlanLimit, seed

client/shared-core/mocks/customer.mock.ts
  -> Customer, Address, PaymentMethodRef, Subscription

client/shared-core/mocks/orders
  -> Order, OrderItem, Delivery, Payment, SubscriptionCycle, Timeline

client/shared-core/mocks/freight.mock.ts
  -> DeliveryWindow ou OrganizationSettings de frete

client/shared-core/mocks/payment.mock.ts
  -> PaymentMethod seed/config

admin/shared-core/mocks/customers.mock.ts
  -> Customer admin DTO/view-model

admin/shared-core/mocks/subscriptions.mock.ts
  -> Subscription admin DTO/view-model

admin/shared-core/mocks/orders.mock.ts
  -> Order admin DTO/view-model

admin/shared-core/mocks/deliveries.mock.ts
  -> Delivery admin DTO/view-model

admin/shared-core/mocks/dashboard.mock.ts
  -> Admin aggregate read model, nao entidade primaria
```

## Kits Relacionados

```text
Auth & Users
  -> organizations, accounts, customers

Organizations
  -> Organization, OrganizationSettings, organizationId

Catalog
  -> Category, Product, ProductVariant, ProductPrice, CommercialMode

Orders
  -> Order, OrderItem, OrderStatusHistory, Timeline

Admin Operations
  -> dashboard, filtros, status, consultas operacionais

Scheduling
  -> DeliveryWindow, agenda simples

Inventory
  -> InventoryItem, InventoryMovement, StockReservation

Fulfillment & Delivery
  -> Delivery, Package, Confirmation

Payments
  -> Invoice, Payment, PaymentMethod, Allocation

Wallet & Vouchers
  -> Wallet, WalletTransaction, Voucher
```

## Ordem Recomendada Para Implementar

```text
1. Organization + seed royalprime
2. User/Auth + OrganizationMember
3. Customer + Address
4. Catalog + Plans
5. Subscription + Cycle + Usage
6. Order + OrderItem + status
7. Delivery + timeline
8. Payment manual + Invoice
9. Inventory simples
10. Wallet/Voucher modelados, implementacao depois
```

## Perguntas Abertas

1. Auth: JWT, session cookie ou hibrido.
2. ID: UUID em todas entidades ou BigAutoField.
3. Postgres local obrigatorio agora ou SQLite permitido no primeiro scaffold.
4. Gateway futuro: Mercado Pago, Stripe, Pagar.me ou manter manual primeiro.
5. Se `box` continua como modalidade propria ou fica apenas como copy/config
   sobre subscription/delivery.

Essas perguntas nao bloqueiam o MER conceitual, mas bloqueiam implementacao de
runtime.

## Decisoes Fechadas

```text
Backend: Django + Django REST Framework
Banco alvo: PostgreSQL
Banco local inicial: SQLite permitido para boot simples
Configuracao: backend/.env + backend/.env.example
Deploy alvo: Vercel + Render + Supabase Postgres
```

Mesmo com SQLite local no primeiro passo, o desenho dos models, indexes,
constraints e transacoes deve mirar PostgreSQL.

Supabase entra como banco PostgreSQL gerenciado. A regra de negocio, permissao,
organizationId e auditoria continuam no Django.
