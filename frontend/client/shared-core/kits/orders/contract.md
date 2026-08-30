# Client Orders Contract

## Backend Real

```text
GET  /api/v1/orders/config/
GET  /api/v1/orders/me/
POST /api/v1/orders/me/
GET  /api/v1/orders/me/:id/
```

## DTOs

```text
ClientOrderConfigDto
ClientOrderKindDto
ClientOrderStatusDto
ClientOrderDto
ClientOrderItemDto
ClientOrderStatusHistoryDto
ClientOrderCreateDto
```

## Views

```text
ClientOrderConfigView -> OrderConfigBase
ClientOrderView -> OrderBase
ClientOrderItemView -> OrderItemBase
ClientOrderStatusHistoryView -> OrderStatusHistoryBase
```

## Inputs

```text
ClientOrderCreateInput
```

## Regras Que Nao Moram Aqui

```text
preco
subtotal
total
status inicial
workflow de status
reserva de inventory
criacao de delivery
validacao de customer/address/subscription
```

Essas regras continuam em `backend/apps/orders/services.py`.
