# Kits Runtime Ledger

Data: 2026-09-07

## Objetivo

Este arquivo registra o que ja foi materializado em cada kit, quais telas reais
ja consomem esses kits e quais gaps nao podem ser esquecidos no proximo corte.

Regra curta:

```text
kit documenta capacidade
shared-core implementa fluxo reutilizavel
render-app consome hook/view-model
backend continua dono da regra real
```

## Ledger Geral

| Kit | Estado atual | Shared-core ativo | Render ja conectado | Gap principal |
| --- | --- | --- | --- | --- |
| 01 Auth & Users | local foundation | client auth/session, admin auth/users | Portal auth gate, AuthModal legado | reduzir app-shell/auth legado |
| 02 Catalog | local foundation | catalog API/hooks/view-models, mocks temporarios | Cortes/Pedido parcialmente | eliminar regra de catalogo em TSX antigo |
| 03 Subscriptions | local foundation + corte render-only | plans, subscription, current cycle, fallback, view-model | `MinhaCaixaView` web/mobile | backend real e fallbackOnError de producao |
| 04 Inventory | local foundation | admin inventory API/hooks/view-models | admin ainda parcial | conectar telas admin render-only |
| 05 Orders | local foundation + corte render-only | config/me/detail/create, fallback, view-model | `MeusPedidosView` web/mobile | revisar fallbackOnError em producao |
| 06 Fulfillment & Delivery | local foundation | deliveries API/hooks/view-models | usado indiretamente em pedidos | tela delivery/admin operacional |

## Kit 01 - Auth & Users

Ja existe:

```text
frontend/shared-core/types/identity.types.ts
frontend/shared-core/contracts/auth.contract.ts
frontend/client/shared-core/hooks/useClientAuthSession.ts
frontend/client/shared-core/hooks/useClientLogin.ts
frontend/client/shared-core/hooks/useClientRegister.ts
frontend/client/shared-core/hooks/useClientLogout.ts
frontend/admin/shared-core/kits/auth/
frontend/admin/shared-core/kits/users/
```

Gap:

```text
transformar AuthModal em render-only com Foundation
garantir locale completo para copy de auth
separar estado visual local de sessao real do backend
```

## Kit 02 - Catalog

Ja existe:

```text
frontend/shared-core/types/catalog.types.ts
frontend/shared-core/contracts/catalog.contract.ts
frontend/client/shared-core/api/catalog.api.ts
frontend/client/shared-core/hooks/useClientCatalog.ts
frontend/client/shared-core/hooks/useClientProductDetail.ts
frontend/client/shared-core/view-models/catalog.view-model.ts
frontend/client/shared-core/view-models/cortes-catalog.view-model.ts
frontend/client/shared-core/mocks/catalog/
```

Gap:

```text
auditar PedidoView para tirar calculo/regra de catalogo do TSX
garantir produto elegivel por API/view-model
manter produtos Royal Carnes em seed/config/fallback, nao na tela
```

## Kit 03 - Subscriptions

Ja existe:

```text
frontend/shared-core/types/subscriptions.types.ts
frontend/shared-core/contracts/subscriptions.contract.ts
frontend/client/shared-core/contracts/subscriptions.contract.ts
frontend/client/shared-core/api/subscriptions.api.ts
frontend/client/shared-core/hooks/useClientPlans.ts
frontend/client/shared-core/hooks/useClientSubscription.ts
frontend/client/shared-core/hooks/useClientCurrentCycle.ts
frontend/client/shared-core/hooks/useClientCycleItems.ts
frontend/client/shared-core/data-sources/subscriptions.fallback.ts
frontend/client/shared-core/mappers/subscriptions.mapper.ts
frontend/client/shared-core/view-models/subscriptions.view-model.ts
frontend/admin/shared-core/kits/subscriptions/
```

Render conectado:

```text
frontend/client/web/src/screens/portal/tabs/MinhaCaixaView.tsx
frontend/client/mobile/src/screens/portal/tabs/MinhaCaixaView.tsx
docs/handoff/10-minha-caixa-render-only-audit.md
```

Contrato:

```text
MinhaCaixaView
  -> useClientSubscription({ fallbackOnError: true })
  -> useClientCurrentCycle({ fallbackOnError: true })
  -> createClientSubscriptionViewModel()
  -> createClientCycleViewModel()
  -> Foundation/mobile UI
```

Gap:

```text
backend precisa responder assinatura/ciclo reais por usuario autenticado
fallbackOnError deve ser revisto antes de producao
limites/entitlements finais devem vir do backend, nao do fallback
```

## Kit 04 - Inventory

Ja existe:

```text
frontend/shared-core/types/inventory.types.ts
frontend/shared-core/contracts/inventory.contract.ts
frontend/admin/shared-core/kits/inventory/
frontend/admin/shared-core/api/inventory.api.ts
frontend/admin/shared-core/hooks/useAdminInventory.ts
frontend/admin/shared-core/hooks/useAdminInventoryAdjustment.ts
```

Gap:

```text
conectar list/detail/adjustment no Admin
status e disponibilidade continuam backend/seed
cliente nao deve calcular estoque vendavel
```

## Kit 05 - Orders

Ja existe:

```text
frontend/shared-core/types/orders.types.ts
frontend/shared-core/contracts/orders.contract.ts
frontend/client/shared-core/contracts/orders.contract.ts
frontend/client/shared-core/api/orders.api.ts
frontend/client/shared-core/hooks/useClientOrders.ts
frontend/client/shared-core/data-sources/orders.fallback.ts
frontend/client/shared-core/mappers/orders.mapper.ts
frontend/client/shared-core/view-models/orders.view-model.ts
frontend/admin/shared-core/kits/orders/
```

Render conectado:

```text
frontend/client/web/src/screens/portal/tabs/MeusPedidosView.tsx
frontend/client/mobile/src/screens/portal/tabs/MeusPedidosView.tsx
docs/handoff/09-meus-pedidos-render-only-audit.md
```

Contrato:

```text
MeusPedidosView
  -> useClientOrders({ fallbackOnError: true })
  -> createClientOrdersViewModel()
  -> Foundation/mobile UI
```

Gap:

```text
backend autenticado deve substituir fallback demonstrativo
status visual deve usar Badge Foundation por tone sem cor local
admin orders ainda precisa tela operacional render-only
```

## Kit 06 - Fulfillment & Delivery

Ja existe:

```text
frontend/shared-core/types/deliveries.types.ts
frontend/shared-core/contracts/deliveries.contract.ts
frontend/client/shared-core/api/deliveries.api.ts
frontend/client/shared-core/hooks/useClientDeliveries.ts
frontend/client/shared-core/hooks/useClientDeliveryDetail.ts
frontend/client/shared-core/view-models/deliveries.view-model.ts
frontend/admin/shared-core/kits/deliveries/
```

Gap:

```text
criar tela de acompanhamento ou admin delivery por hook/view-model
transicao e confirmacao continuam no backend/admin
cliente apenas acompanha entrega
```

## Foundation Consumida Pelos Kits

Badge agora e primitive formal:

```text
frontend/foundation/ui/Badge/Badge.tsx
frontend/foundation/ui/Badge/Badge.module.css
frontend/foundation/ui/Badge/index.ts
```

Uso esperado:

```text
view-model entrega statusTone
render-app chama <Badge tone={statusTone}>
Badge resolve visual por Theme -> Semi-Composed -> UI
```

Nao usar:

```text
span com cor local para status
rgba/#hex em status de tela
emoji em status/icone
```

## Proximo Corte Recomendado

```text
1. validar visual light/dark de Badge em MeusPedidos e MinhaCaixa
2. continuar MeuClubeView render-only com Kit 01 + Kit 03
3. depois iniciar Admin Dashboard/ListPage por kits admin
```
