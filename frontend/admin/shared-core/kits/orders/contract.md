# Admin Orders Contract

## Backend Real

```text
GET  /api/v1/orders/config/
GET  /api/v1/orders/admin/orders/
POST /api/v1/orders/admin/orders/
GET  /api/v1/orders/admin/orders/:id/
POST /api/v1/orders/admin/orders/:id/transition/
```

## DTOs

```text
AdminOrderConfigDto
AdminOrderKindDto
AdminOrderStatusDto
AdminOrderDto
AdminOrderItemDto
AdminOrderStatusHistoryDto
AdminOrderCreateDto
AdminOrderTransitionDto
```

## Views

```text
AdminOrderConfigView -> OrderConfigBase
AdminOrderView -> OrderBase
AdminOrderItemView -> OrderItemBase
AdminOrderStatusHistoryView -> OrderStatusHistoryBase
```

## Inputs

```text
AdminOrderCreateInput
AdminOrderTransitionInput
```

## Regras Que Nao Moram Aqui

```text
orders.read/manage
transicao permitida
status terminal
status inicial
preco e total
reserva de estoque
criacao de delivery
```

Essas regras continuam no backend.
