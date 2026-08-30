# Admin Deliveries Flow

## Lista

```text
screen render-only
  -> useAdminDeliveries.load()
  -> GET /api/v1/deliveries/config/
  -> GET /api/v1/deliveries/admin/deliveries/
  -> mapper
  -> view-model rows/totals
```

## Criacao Manual

```text
screen render-only
  -> useAdminDeliveries.create(input)
  -> POST /api/v1/deliveries/admin/deliveries/
  -> backend create_delivery_for_order
  -> mapper
  -> lista local atualizada
```

## Detalhe

```text
screen render-only
  -> useAdminDeliveryDetail(deliveryId).load()
  -> GET /api/v1/deliveries/config/
  -> GET /api/v1/deliveries/admin/deliveries/:id/
  -> mapper
  -> detail view-model
```

## Transicao

```text
screen render-only
  -> useAdminDeliveryTransition(deliveryId, input).submit()
  -> POST /api/v1/deliveries/admin/deliveries/:id/transition/
  -> backend transition_delivery_status
  -> mapper
  -> delivery atualizado
```

## Confirmacao

```text
screen render-only
  -> useAdminDeliveryConfirm(deliveryId, input).submit()
  -> POST /api/v1/deliveries/admin/deliveries/:id/confirm/
  -> backend confirm_delivery
  -> mapper
  -> delivery atualizado
```

## Limite

Admin solicita transicao/confirmacao, mas o backend decide workflow e efeitos.
