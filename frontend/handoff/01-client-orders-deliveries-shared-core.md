# 01 - Client Orders/Deliveries Shared-Core

Objetivo:

```text
criar a camada client/shared-core para pedidos e entregas antes de tocar forte
nas telas.
```

## Arquivos A Criar

```text
frontend/client/shared-core/contracts/order.contract.ts
frontend/client/shared-core/contracts/delivery.contract.ts
frontend/client/shared-core/api/orders.api.ts
frontend/client/shared-core/api/deliveries.api.ts
frontend/client/shared-core/hooks/useOrderConfig.ts
frontend/client/shared-core/hooks/useMyOrders.ts
frontend/client/shared-core/hooks/useDeliveryConfig.ts
frontend/client/shared-core/hooks/useMyDeliveries.ts
frontend/client/shared-core/view-models/orders.view-model.ts
frontend/client/shared-core/view-models/deliveries.view-model.ts
```

## Backend Disponivel

```text
GET  /api/v1/orders/config/
GET  /api/v1/orders/me/
POST /api/v1/orders/me/
GET  /api/v1/orders/me/:id/
GET  /api/v1/deliveries/config/
GET  /api/v1/deliveries/me/
GET  /api/v1/deliveries/me/:id/
```

## Regras

```text
status, labels e tipos de pedido vem da API/config
tela nao decide workflow
tela nao calcula preco final
hook pode usar fallback para mocks atuais durante a transicao
```

## Contratos Minimos

Order:

```text
id
code
kindKey
statusKey
customerId
customerName
addressId
currency
subtotalCents
discountCents
freightCents
totalCents
notes
items
statusHistory
createdAt
updatedAt
```

OrderItem:

```text
id
productKey
variantSku
measurementUnitKey
nameSnapshot
quantity
unitPriceCents
totalCents
weightGrams
sourceType
sourceKey
metadata
```

Delivery:

```text
id
code
orderId
orderCode
customerId
customerName
addressId
statusKey
confirmationCode
addressSnapshot
notes
packages
statusHistory
confirmation
createdAt
updatedAt
```

Config:

```text
OrderKindDefinition[]
OrderStatusDefinition[]
DeliveryStatusDefinition[]
```

## View-Models

O view-model deve preparar:

```text
statusLabel
statusTone
statusDescription
primaryAction
timelineSteps
deliveryCodeLabel
moneyLabel
```

Sem regra real. Se a transicao e permitida ou nao, quem decide e o backend.

## Prompt Para Outra IA

```text
Leia os documentos de entrada do RoyalPrime e implemente o corte
01-client-orders-deliveries-shared-core.md.

Crie contracts, API clients, hooks e view-models para Orders/Deliveries do
cliente. Preserve mocks como fallback temporario. Nao altere telas ainda, exceto
se precisar exportar tipos. Nao mova nada para frontend/shared-core global.

Depois rode o build do client se tocar em frontend/client/web; se tocar apenas
client/shared-core e o build do client for barato, rode tambem para validar.
```
