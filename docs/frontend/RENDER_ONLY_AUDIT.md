# Frontend Render-Only Audit

Data: 2026-08-28

Objetivo:

```text
identificar o que ainda prende client web/admin web a copy, regra ou fluxo local
e definir uma ordem incremental para mover isso para shared-core, manifest,
locales e screen types sem quebrar o produto.
```

## Regra Base

```text
backend
  -> regra real

shared-core do escopo correto
  -> contrato, API, hook, mapper, view-model, manifest e mock temporario

web/mobile/admin-web
  -> render-only

foundation
  -> visual-only
```

## Status Geral

O frontend ainda tem hardcode esperado de MVP. Isso nao e um erro por si so.

O problema a corrigir aos poucos e:

```text
copy comercial em JSX
arrays de configuracao dentro de telas
status workflow decidido em componente
calculo de checkout dentro de screen
alert/comando fake em tela
screen types ainda com status/copy local
```

## Audit Pos-Handoff Orders/Deliveries

Data: 2026-08-28

Depois do pacote inicial de shared-core/render-only, o build passou, mas a
integracao ainda nao pode ser considerada completa.

Validacao feita:

```text
git diff --check: OK, com avisos LF/CRLF
frontend/admin/web npm run build: OK
frontend/client/web npm run build: OK
walkthrough.md citado no resumo externo: nao encontrado no repo
```

Achados bloqueantes:

```text
frontend/client/shared-core/contracts/order.contract.ts
  -> usa subscriptionCycle, royalDelivery, sentToStore, preparing e outForDelivery
  -> backend usa delivery, subscription-cycle, received, separating, ready e completed

frontend/client/shared-core/api/orders.api.ts
  -> createOrder envia input legado sem mapper para kind_key/product_key
  -> catch retorna mock silenciosamente

frontend/client/shared-core/hooks/useMyOrders.ts
  -> pode marcar source=api mesmo quando o API client caiu em mock

frontend/client/shared-core/contracts/delivery.contract.ts
  -> usa outForDelivery, mas backend usa out-for-delivery e tambem possui failed

frontend/admin/shared-core/api/adminOrders.api.ts
  -> chama /api/v1/admin/orders/ em vez de /api/v1/orders/admin/orders/

frontend/admin/shared-core/api/adminDeliveries.api.ts
  -> chama /api/v1/admin/deliveries/ em vez de /api/v1/deliveries/admin/deliveries/

frontend/admin/shared-core/view-models/adminOrders.view-model.ts
  -> statusConfig ainda hardcoded

frontend/admin/web/src/engines/rendering/screen-types/dashboard/DashboardPage.tsx
  -> chama prepareAdminOrderViewModel({ status } as any)
```

Proximo documento obrigatorio para continuar:

```text
docs/handoff/06-frontend-orders-deliveries-contract-alignment.md
```

## Audit De Copy/Locale

O proximo corte recomendado antes de criar mais funcionalidade e reduzir copy
hardcoded nas telas principais.

Documento:

```text
docs/frontend/COPY_LOCALE_AUDIT.md
```

Regra:

```text
texto de UI vai para locales
estrutura configuravel repetida vai para manifest
dado comercial de exemplo fica em mock/seed
regra real continua no backend
```

## Achados Prioritarios

### P0 - PedidoView Ainda E Fluxo, Nao Render-Only

Arquivo:

```text
frontend/client/web/src/screens/portal/tabs/PedidoView.tsx
```

Achados:

```text
modeOrder hardcoded
stepOrder hardcoded
selectedDeliveryDay hardcoded
newAddressFields dentro da screen
freight/payment montados localmente
calculo de selectedProductEntries, totals, limites e uso de plano na screen
dias de recorrencia [5, 10, 15, 20, 25] dentro do JSX
```

Destino:

```text
frontend/client/shared-core/kits/checkout
frontend/client/shared-core/kits/orders
frontend/client/shared-core/contracts/order.contract.ts
frontend/client/shared-core/api/orders.api.ts
frontend/client/shared-core/hooks/useMyOrders.ts
frontend/client/shared-core/view-models/orders.view-model.ts
frontend/client/shared-core/manifest/checkout.manifest.ts
```

Acao recomendada:

```text
primeiro criar contrato/API/hook de Orders
depois extrair checkout manifest com steps, modes, labels e campos
por ultimo deixar PedidoView apenas renderizando o view-model e disparando acoes
```

### P0 - MeusPedidos/MinhaConta Duplicam Status E Copy De Pedidos

Arquivos:

```text
frontend/client/web/src/screens/portal/tabs/MeusPedidosView.tsx
frontend/client/web/src/screens/portal/tabs/MinhaContaView.tsx
frontend/client/web/src/product-components/ecommerce/OrderDetailModal.tsx
```

Achados:

```text
status visual decidido por if status === delivered/cancelled/sentToStore
labels como Codigo, Pendente, Validado e Nao aplicado dentro do componente
copy Royal Delivery/Royal Carnes dentro da screen
pedido atual, historico e detalhes ainda lidos de mocks diretos
```

Destino:

```text
frontend/client/shared-core/kits/orders
frontend/client/shared-core/kits/deliveries
frontend/client/shared-core/contracts/order.contract.ts
frontend/client/shared-core/contracts/delivery.contract.ts
frontend/client/shared-core/hooks/useMyOrders.ts
frontend/client/shared-core/hooks/useMyDeliveries.ts
frontend/client/shared-core/view-models/orders.view-model.ts
frontend/client/shared-core/view-models/deliveries.view-model.ts
frontend/client/shared-core/locales/pt-BR.ts
```

Acao recomendada:

```text
centralizar status labels/tokens em view-model/manifest
MeusPedidosView passa a consumir useMyOrders/useMyDeliveries
OrderDetailModal recebe props prontas, sem decidir workflow
```

### P1 - Landing Tem Copy Comercial Forte Em JSX

Arquivos:

```text
frontend/client/web/src/screens/landing/HeroMarketplaceView.tsx
frontend/client/web/src/screens/landing/LandingView.tsx
frontend/client/web/src/screens/landing/sections/*.tsx
```

Achados:

```text
VAGAS LIMITADAS PARA NOVOS SOCIOS
A Experiencia Suprema do Churrasco em sua Casa
showcaseCuts dentro da tela
faqItems dentro da tela
cards/steps/facts criados como arrays locais
```

Destino:

```text
frontend/client/shared-core/kits/catalog
frontend/client/shared-core/manifest/landing
frontend/client/shared-core/locales/pt-BR.ts
```

Acao recomendada:

```text
nao trocar visual agora
mover hero copy, CTAs, showcase e FAQ para manifest/locale
screen continua igual visualmente, mas passa a ler config
```

### P1 - MinhaCaixa Ainda Mistura Produto, Carrinho E Comandos Fake

Arquivo:

```text
frontend/client/web/src/screens/portal/tabs/MinhaCaixaView.tsx
```

Achados:

```text
catalogProducts dentro da screen
Caixa de Agosto hardcoded
alert() como comando operacional
boxMode e carrinho local ainda carregam regra de fluxo
copy de assinatura/Royal Pro dentro da tela
```

Destino:

```text
frontend/client/shared-core/kits/subscriptions
frontend/client/shared-core/kits/checkout
frontend/client/shared-core/kits/orders
frontend/client/shared-core/manifest/box.manifest.ts
```

Acao recomendada:

```text
manter Royal Box recorrente fora do backend por enquanto
extrair o que e apenas copy/config
deixar comandos reais para depois de Orders/Subscriptions hooks
```

### P1 - Admin Dashboard Ainda Decide Status Localmente

Arquivo:

```text
frontend/admin/web/src/engines/rendering/screen-types/dashboard/DashboardPage.tsx
```

Achados:

```text
renderStatusBadge usa if status === packing/outForDelivery/approved/delivered/pending
labels Em Embalagem, Em Transito, Entregue, Aprovado e Pendente dentro do render
icones de widget decididos por index
```

Destino:

```text
frontend/admin/shared-core/kits/dashboard
frontend/admin/shared-core/kits/orders
frontend/admin/shared-core/kits/deliveries
frontend/admin/shared-core/manifest/pages/dashboard.config.jsx
frontend/admin/shared-core/view-models/adminDashboard.view-model.ts
```

Acao recomendada:

```text
status label/tone/icon devem vir de manifest/view-model
DashboardPage deve apenas renderizar widget e status ja resolvidos
```

### P2 - App Shell Client Tem Navegacao Local

Arquivos:

```text
frontend/client/web/src/legacy/app-shell/Header.tsx
frontend/client/web/src/legacy/app-shell/PublicHeader.tsx
frontend/client/web/src/legacy/app-shell/BottomTabBar.tsx
```

Achados:

```text
navItems/tabs dentro de componentes legacy
copy e rotas ainda misturadas ao render
```

Destino:

```text
frontend/client/shared-core/navigation
frontend/client/shared-core/manifest
frontend/client/shared-core/locales
```

Acao recomendada:

```text
usar navegacao declarativa ja existente em shared-core
componentes legacy continuam render-only ate serem substituidos por foundation
```

## Ordem De Execucao Recomendada

```text
1. Corrigir Client Orders contracts/API/hooks/view-models contra o backend real.
2. Corrigir Client Deliveries contracts/API/hooks/view-models contra o backend real.
3. Corrigir Admin Orders/Deliveries API clients para endpoints reais e headers.
4. Separar fallback dev sem mascarar erro como source=api.
5. MeusPedidosView/MinhaContaView/OrderDetailModal continuam render-only.
6. PedidoView cria pedido via hook; checkout manifest fica para o segundo corte.
7. Landing hero/showcase/FAQ migram copy para manifest/locale sem mudar visual.
8. Admin Dashboard/ListPage/DetailPage passam a receber status/copy/columns por manifest/view-model.
```

## Nao Fazer Agora

```text
nao mover tudo para frontend/shared-core global
nao reescrever visual/foundation
nao tentar resolver Royal Box recorrente/scheduling agora
nao trocar todas as screens de uma vez
nao apagar mocks antes dos hooks terem fallback
```

## Criterio De Sucesso Do Primeiro Corte

```text
MeusPedidosView nao importa mock de orders diretamente
MeusPedidosView nao decide labels/tokens de status
OrderDetailModal nao contem if de status comercial
Pedidos e entregas do cliente passam por hooks do client/shared-core
visual permanece equivalente
build do client passa
```
