# Kits Runtime Ledger

Data: 2026-09-09

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

Regra tela por tela:

```text
web/native/admin-web
  -> render-only

shared-core do escopo correto
  -> contracts
  -> api client
  -> hook
  -> mapper/view-model

backend
  -> dados e regras reais
```

Ao migrar uma tela, registrar neste ledger qual kit ela consome, qual hook
entrega o view-model e qual endpoint/fallback ainda sustenta o dado.

## Ledger Geral

| Kit | Estado atual | Shared-core ativo | Render ja conectado | Gap principal |
| --- | --- | --- | --- | --- |
| 01 Auth & Users | local foundation | client auth/session, admin auth/users | Portal auth gate, AuthModal legado | reduzir app-shell/auth legado |
| 02 Catalog | local foundation | catalog API/hooks/view-models, mocks temporarios | Cortes/Pedido parcialmente | eliminar regra de catalogo em TSX antigo |
| 03 Subscriptions | local foundation + corte render-only | plans, subscription, current cycle, fallback, view-model | `MinhaCaixaView` web/mobile | backend real e fallbackOnError de producao |
| 04 Inventory | local foundation | admin inventory API/hooks/view-models | admin ainda parcial | conectar telas admin render-only |
| 05 Orders | local foundation + admin base real | config/me/detail/create, fallback, view-model, admin standard | `MeusPedidosView` web/mobile; Admin Pedidos com detalhe 360 | validar Pedidos no browser e expor acoes de status |
| 06 Fulfillment & Delivery | local foundation | deliveries API/hooks/view-models | usado indiretamente em pedidos | tela delivery/admin operacional |
| 07 Payments | local foundation + admin 360 real | admin payments API/mapper/view-model/contexto | Admin Pagamentos, Pedido e Assinaturas | validacao browser e acoes Pix/gateway futuras |

## Kit 01 - Auth & Users

Ja existe:

```text
frontend/shared-core/types/identity.types.ts
frontend/shared-core/contracts/auth.contract.ts
frontend/client/shared-core/hooks/useClientAuthSession.ts
frontend/client/shared-core/hooks/useClientLogin.ts
frontend/client/shared-core/hooks/useClientRegister.ts
frontend/client/shared-core/hooks/useClientLogout.ts
frontend/admin/shared-core/api/auth.api.ts
frontend/admin/shared-core/api/users.api.ts
frontend/admin/shared-core/api/permissions.api.ts
frontend/admin/shared-core/api/dev-auth-bypass.api.ts
frontend/admin/shared-core/hooks/useAdminAuthSession.ts
frontend/admin/shared-core/hooks/useAdminDevAuthBypassToken.ts
frontend/admin/shared-core/view-models/auth.view-model.ts
frontend/admin/shared-core/view-models/users.view-model.ts
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
ProductCard e telas de catalogo nao podem montar nome, descricao, origem,
unidade, preco ou categoria por hardcode local
```

Exemplo de dado que deve atravessar backend -> shared-core -> render:

```text
Produto:
  nome: Acem
  descricao: Produto de melhor custo-beneficio para churrasco simples e preparos variados.
  categoria: Cortes do dia a dia
  unidade/variante: 1 kg
  origem: Brasil
  preco: R$ 39,90

backend:
  Product + ProductVariant + MeasurementUnit + ProductPrice + origin/category

client shared-core:
  useClientCatalog()
  catalog mapper
  ClientCatalogProductCardViewModel

render:
  Card/Badge/Text/Button Foundation
  nenhum calculo de preco/disponibilidade
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
frontend/admin/shared-core/api/subscriptions.api.ts
frontend/admin/shared-core/hooks/useAdminSubscriptions.ts
frontend/admin/shared-core/hooks/useAdminPlans.ts
frontend/admin/shared-core/mappers/subscriptions.mapper.ts
frontend/admin/shared-core/view-models/subscriptions.view-model.ts
frontend/admin/shared-core/manifest/pages/assinaturas.config.jsx
frontend/admin/shared-core/manifest/pages/planos.config.jsx
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
admin assinaturas ja usa backend real para list/detail/add/patch no standard
```

## Kit 04 - Inventory

Ja existe:

```text
frontend/shared-core/types/inventory.types.ts
frontend/shared-core/contracts/inventory.contract.ts
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
frontend/admin/shared-core/api/orders.api.ts
frontend/admin/shared-core/hooks/useAdminOrders.ts
frontend/admin/shared-core/hooks/useAdminOrderDetail.ts
frontend/admin/shared-core/hooks/useAdminOrderTransition.ts
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
client ainda precisa revisar fallbackOnError antes de producao
admin Pedidos ja usa backend/shared-core/standard, mas falta validacao real em browser
acao de transition ainda precisa ser exposta/validada na tela
pagamentos e entregas vinculados ao pedido precisam aparecer no detalhe
configs inativos caixas/socios ainda usam mocks e nao fazem parte do mapa atual
```

Atualizacao 2026-09-10:

```text
backend orders valida subscription-cycle com subscription e cycle coerentes
seed royalprime vincula pedido-assinatura-pro-setembro ao ciclo 2026-09
OrderSerializer expoe contexto de assinatura/ciclo
admin pedidos.config.jsx saiu de mock direto e declara List/Detail/Add reais
standard.data-source cria pedidos reais via adminOrdersApi
ListPage admin ficou enxuta; DetailPage admin relaciona entregas e pagamentos
por orderId sem misturar as entidades no backend
evidencias: seed, shell readback, apps.orders/apps.subscriptions tests,
build:admin, verify:rules e git diff --check
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
frontend/admin/shared-core/api/deliveries.api.ts
frontend/admin/shared-core/hooks/useAdminDeliveries.ts
frontend/admin/shared-core/hooks/useAdminDeliveryDetail.ts
frontend/admin/shared-core/hooks/useAdminDeliveryTransition.ts
```

Gap:

```text
criar tela de acompanhamento ou admin delivery por hook/view-model
transicao e confirmacao continuam no backend/admin
cliente apenas acompanha entrega
```

## Kit 07 - Payments

Ja existe:

```text
backend/apps/payments/
backend/seeds/royalprime/kits/payments.seed.json
frontend/admin/shared-core/contracts/payments.contract.ts
frontend/admin/shared-core/api/payments.api.ts
frontend/admin/shared-core/mappers/payments.mapper.ts
frontend/admin/shared-core/view-models/payments.view-model.ts
frontend/admin/shared-core/manifest/pages/pagamentos.config.jsx
docs/kits/payments-kit.md
docs/kits/admin/payments-kit.md
```

Render conectado:

```text
frontend/admin/web/src/engines/rendering/screen-types/standard/pages/ListPage/ListPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/pages/DetailPage/DetailPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/pages/AddPage/AddPage.tsx
```

Contrato:

```text
Pagamentos
  -> standard.data-source carrega paymentsApi + ordersApi + subscriptionsApi
  -> payments mapper normaliza DTO
  -> payments view-model formata valor/data/status e relaciona pedido/assinatura
  -> manifest define List curta, Detail 360 e Add com pedido/assinatura
  -> Assinaturas recebe pagamentos relacionados na aba Pagamentos
  -> Pedidos recebe pagamentos relacionados na aba Pagamento
```

Gap:

```text
validar create/edit/refresh no browser
gateway, Pix, invoice, recibo e conciliacao ficam depois
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

## Kit 07 - Landing Public Experience

Ja existe:

```text
frontend/client/shared-core/manifest/landing/appshell.config.jsx
frontend/client/shared-core/navigation/landing.navigation.ts
frontend/client/web/src/screens/landing/LandingView.tsx
frontend/client/web/src/screens/landing/sections/
frontend/foundation/ui/SectionContainer/SectionContainer.tsx
frontend/foundation/shells/app-shell/
```

Contrato:

```text
LandingView
  -> SectionContainer
  -> sections modulares render-only
  -> AppShell Foundation por config
```

Estado atual:

```text
sections sem prefixo Home
landing sem style={{ ... }} local
/hero reaproveita a mesma LandingView
legacy transitional removido
assets da landing centralizados no sharedAssets
hero com painel visual de produto e fluxo do cliente
```

Gap:

```text
assets da landing ainda precisam virar catalogo central no manifest
conteudo comercial definitivo deve vir do backend/shared-core quando deixar de ser copy institucional
validacao visual desktop/mobile ainda precisa browser real
```

## Proximo Corte Recomendado

```text
1. escolher uma tela oficial de client
2. mapear quais kits ela consome
3. garantir backend/shared-core/render-only antes de polir visual
4. validar visual light/dark de Badge em MeusPedidos e MinhaCaixa
5. continuar MeuClubeView render-only com Kit 01 + Kit 03
6. depois iniciar Admin Dashboard/ListPage por kits admin
```
