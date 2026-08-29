# Admin Orders Kit

Gestao operacional de pedidos.

Backend disponivel:

```text
GET  /api/v1/orders/config/
GET  /api/v1/orders/admin/orders/
POST /api/v1/orders/admin/orders/
GET  /api/v1/orders/admin/orders/:id/
POST /api/v1/orders/admin/orders/:id/transition/
```

Arquivos futuros esperados quando o runtime renascer:

```text
contracts/admin-order.contract.ts
api/adminOrders.api.ts
hooks/useAdminOrders.ts
view-models/adminOrders.view-model.ts
```

Regra:

```text
admin pode comandar transicao
backend decide se transicao e permitida
status e labels vem da API/config
```

## Audit Atual

Este kit esta resetado na branch `feature/shared-core-kit-reset`.

Os arquivos funcionais antigos foram removidos para evitar contrato prematuro.

Leia junto:

```text
backend/API_CONTRACTS.md
backend/seeds/royalprime/kits/orders.seed.json
frontend/handoff/06-frontend-orders-deliveries-contract-alignment.md
```

Endpoint correto:

```text
/api/v1/orders/admin/orders/
```

Nao usar:

```text
/api/v1/admin/orders/
```

Regras para a proxima IA:

```text
enviar X-Organization-Slug
preparar Authorization Bearer token
nao esconder falha real com mock silencioso
nao chamar prepareAdminOrderViewModel({ status } as any)
status/tone devem vir de config/view-model alinhado ao backend
```
