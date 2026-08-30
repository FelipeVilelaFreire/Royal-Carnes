# Admin Orders Flow

## Lista

```text
screen render-only
  -> useAdminOrders.load()
  -> GET /api/v1/orders/config/
  -> GET /api/v1/orders/admin/orders/
  -> mapper
  -> view-model rows/totals
```

## Criacao Operacional

```text
screen render-only
  -> useAdminOrders.create(input)
  -> POST /api/v1/orders/admin/orders/
  -> backend create_order
  -> mapper
  -> lista local atualizada
```

## Detalhe

```text
screen render-only
  -> useAdminOrderDetail(orderId).load()
  -> GET /api/v1/orders/config/
  -> GET /api/v1/orders/admin/orders/:id/
  -> mapper
  -> detail view-model
```

## Transicao

```text
screen render-only
  -> useAdminOrderTransition(orderId, input).submit()
  -> POST /api/v1/orders/admin/orders/:id/transition/
  -> backend transition_order_status
  -> mapper
  -> order atualizado
```

## Limite

Admin pode pedir transicao, mas o backend decide se ela e permitida.
