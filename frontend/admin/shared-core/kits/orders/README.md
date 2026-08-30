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
hooks/useAdminOrders.ts
hooks/useAdminOrderDetail.ts
hooks/useAdminOrderTransition.ts
hooks/useAdminOrderForm.ts
mappers/orders.mapper.ts
view-models/orders.view-model.ts
```

Regra:

```text
admin pode comandar transicao
backend decide se transicao e permitida
status e labels vem da API/config
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
