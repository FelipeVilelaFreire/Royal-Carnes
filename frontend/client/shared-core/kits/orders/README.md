# Client Orders Kit

Fluxo de pedidos do cliente.

Backend disponivel:

```text
GET  /api/v1/orders/config/
GET  /api/v1/orders/me/
POST /api/v1/orders/me/
GET  /api/v1/orders/me/:id/
```

Arquivos esperados:

```text
contracts/order.contract.ts
api/orders.api.ts
hooks/useOrderConfig.ts
hooks/useMyOrders.ts
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

## Audit Atual

Este kit ainda nao esta completo como integracao real.

Antes de continuar, alinhar com:

```text
backend/API_CONTRACTS.md
backend/seeds/royalprime/kits/orders.seed.json
frontend/handoff/06-frontend-orders-deliveries-contract-alignment.md
```

Backend usa:

```text
kind_key: delivery | subscription-cycle
status_key: received | approved | separating | ready | completed | cancelled
items[].product_key
items[].variant_sku opcional
```

Nao tratar estes valores legados como contrato novo:

```text
subscriptionCycle
royalDelivery
sentToStore
preparing
outForDelivery
```

Proximo passo:

```text
criar DTOs reais do backend, mappers DTO -> view-model e fallback dev explicito
sem marcar mock como source=api.
```
