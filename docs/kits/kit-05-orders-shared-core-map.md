# Kit 05 - Orders Shared-Core Map

## Objetivo

Fechar o shared-core de Orders para o contrato backend real de pedidos:

```text
GET  /api/v1/orders/config/
GET  /api/v1/orders/me/
POST /api/v1/orders/me/
GET  /api/v1/orders/me/:id/
GET  /api/v1/orders/admin/orders/
POST /api/v1/orders/admin/orders/
GET  /api/v1/orders/admin/orders/:id/
POST /api/v1/orders/admin/orders/:id/transition/
```

Orders conecta Customer, Address, Catalog, Inventory, Subscriptions e futuro
Fulfillment/Delivery, mas regras continuam no backend.

## Arvore De Propriedade

```text
backend/apps/orders/
  models.py
  services.py
  selectors.py
  serializers.py
  views.py
  urls.py

frontend/shared-core/
  types/orders.types.ts
  contracts/orders.contract.ts

frontend/client/shared-core/
  contracts/orders.contract.ts
  api/orders.api.ts
  mappers/orders.mapper.ts
  view-models/orders.view-model.ts
  hooks/useClientOrders.ts
  hooks/useClientOrderDetail.ts
  hooks/useClientOrderForm.ts
  kits/orders/README.md
  kits/orders/contract.md
  kits/orders/flow.md

frontend/admin/shared-core/
  contracts/orders.contract.ts
  api/orders.api.ts
  mappers/orders.mapper.ts
  view-models/orders.view-model.ts
  hooks/useAdminOrders.ts
  hooks/useAdminOrderDetail.ts
  hooks/useAdminOrderTransition.ts
  hooks/useAdminOrderForm.ts
  kits/orders/README.md
  kits/orders/contract.md
  kits/orders/flow.md
```

## Fronteira Global

`frontend/shared-core` contem apenas tipos e contratos puros:

```text
OrderKindBase
OrderStatusBase
OrderBase
OrderItemBase
OrderStatusHistoryBase
OrderCreateInputBase
OrderTransitionInputBase
OrderConfigBase
```

Nao ha fetch, hook, regra de workflow, preco, reserva de estoque ou criacao de
delivery no global.

## Fronteira Client

`frontend/client/shared-core` cobre:

```text
order config publica
listar meus pedidos
criar pedido do cliente
abrir detalhe do meu pedido
form readiness minimo
```

O client nao muda status e nao chama endpoint admin.

## Fronteira Admin

`frontend/admin/shared-core` cobre:

```text
order config publica
listar pedidos da organization
criar pedido operacional
abrir detalhe admin
transicionar status
form readiness minimo
```

Permissoes continuam no backend:

```text
orders.read
orders.manage
```

## Limites Intencionais

Nao foram implementados:

```text
PATCH order
DELETE order
cancel shortcut
refund/payment behavior
delivery update
inventory release
calculo frontend de subtotal/total/preco
workflow hardcoded por nome de status
```

Status, tipos, transicoes e efeitos vem de seed/config e backend.

## Criterio De Pronto

```text
contrato global minimo criado
runtime client alinhado ao backend atual
runtime admin alinhado ao backend atual
docs do kit atualizadas
build client OK
build admin OK
backend check OK
```
