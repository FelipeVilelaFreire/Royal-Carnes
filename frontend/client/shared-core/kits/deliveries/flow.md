# Client Deliveries Flow

## Config

```text
screen render-only
  -> useClientDeliveries.loadConfig()
  -> clientDeliveriesApi.config()
  -> GET /api/v1/deliveries/config/
  -> mapper
```

## Listar Minhas Entregas

```text
screen render-only
  -> useClientDeliveries.load()
  -> GET /api/v1/deliveries/config/
  -> GET /api/v1/deliveries/me/
  -> mapper
  -> view-model rows
```

## Detalhe

```text
screen render-only
  -> useClientDeliveryDetail(deliveryId).load()
  -> GET /api/v1/deliveries/config/
  -> GET /api/v1/deliveries/me/:id/
  -> mapper
  -> detail view-model
```

## Limite

Cliente acompanha entrega criada pelo backend. Nao cria, transiciona ou confirma
Delivery neste kit.
