# Client Orders Flow

## Config

```text
screen render-only
  -> useClientOrders.loadConfig()
  -> clientOrdersApi.config()
  -> GET /api/v1/orders/config/
  -> mapper
```

## Listar Meus Pedidos

```text
screen render-only
  -> useClientOrders.load()
  -> GET /api/v1/orders/config/
  -> GET /api/v1/orders/me/
  -> mapper
  -> view-model rows
```

## Criar Pedido

```text
screen render-only
  -> useClientOrders.create(input)
  -> POST /api/v1/orders/me/
  -> backend create_order
  -> backend reserva estoque se kind.requires_inventory
  -> backend cria delivery se kind.creates_delivery
  -> mapper
  -> lista local atualizada
```

## Detalhe

```text
screen render-only
  -> useClientOrderDetail(orderId).load()
  -> GET /api/v1/orders/config/
  -> GET /api/v1/orders/me/:id/
  -> mapper
  -> detail view-model
```

## Limite

Client nao calcula preco, nao muda status e nao decide fluxo operacional.
