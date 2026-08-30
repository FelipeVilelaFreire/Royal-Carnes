# Client Orders Kit

Fluxo de pedidos do cliente.

Backend disponivel:

```text
GET  /api/v1/orders/config/
GET  /api/v1/orders/me/
POST /api/v1/orders/me/
GET  /api/v1/orders/me/:id/
```

Mapa vertical:

```text
docs/kits/kit-05-orders-shared-core-map.md
contract.md
flow.md
```

Arquivos runtime:

```text
contracts/orders.contract.ts
api/orders.api.ts
hooks/useClientOrders.ts
hooks/useClientOrderDetail.ts
hooks/useClientOrderForm.ts
mappers/orders.mapper.ts
view-models/orders.view-model.ts
```

Screens consumidoras:

```text
frontend/client/web/src/screens/portal/tabs/PedidoView.tsx
frontend/client/web/src/screens/portal/tabs/MeusPedidosView.tsx
frontend/client/web/src/screens/portal/tabs/MinhaContaView.tsx
```

Regra:

```text
status, labels e tipos de pedido vem da API/config
tela nao decide workflow
tela nao calcula preco final
```

Backend aceita:

```text
kind_key: delivery | subscription-cycle
status_key: received | approved | separating | ready | completed | cancelled
items[].product_key
items[].variant_sku opcional
```

Esses valores sao seed/config do RoyalPrime, nao branches de codigo.

Nao usar legado:

```text
subscriptionCycle
royalDelivery
sentToStore
preparing
outForDelivery
```
