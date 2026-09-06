# 07 - MontarBox/PedidoView Phase 1 Map

Este documento registra os Passos 1-4 do Roadmap Padrao Por Tela para
`MontarBox/PedidoView`.

Objetivo:

```text
fechar Fase 1 funcional antes de polir design fino
```

Regra operacional:

```text
nao extrair componente reutilizavel sem aprovacao do usuario
nao criar UI nova antes de provar necessidade repetivel
nao trocar comportamento visual como objetivo principal deste corte
```

## Estado Atual

Rota:

```text
frontend/client/web/src/app/(portal)/montar-box/page.tsx
  -> <PortalView initialTab="produtos" />

frontend/client/web/src/screens/portal/PortalView.tsx
  -> activeScreenKey "produtos"
  -> <PedidoView onNavigate={handleNavigate} showHeader={false} />
```

Tela atual:

```text
frontend/client/web/src/screens/portal/tabs/PedidoView.tsx
```

Problema principal:

```text
PedidoView ainda e screen + fluxo + calculo + mock + layout + mini design-system.
Ela funciona visualmente, mas nao esta render-only.
```

## Passo 1 - Layout/Config

Achados originais:

```text
PedidoView ainda importa legacy app-shell quando showHeader=true.
Layout ainda usa divs, style inline, className solto e <style> local.
Responsivo ainda mora dentro da propria screen.
AppShell ja vem do PortalView quando showHeader=false, mas a tela ainda sabe demais.
```

Estado apos corte de UI/Layout:

```text
PedidoView nao importa mais Button/Input de legacy/design-system.
Acoes simples usam Foundation Button.
Busca e formulario de novo endereco usam Foundation Input.
Root de pagina usa Foundation Container.
Container de MontarBox usa width="wide" e gutter="page", igual ao Catalogo.
Toolbar, grid de produtos, formulario e step tracker usam Foundation Grid.
Resumo e botoes de acao agrupados usam Foundation Inline/Stack onde coube.
Cards/superficies extraidos usam Foundation Surface.
Selector de modo foi compactado para agir como controle de fluxo, nao como hero card.
Resumo lateral foi extraido para StickyOrderSummary com Surface, Stack, Text, SummaryRow e Button.
Botoes comuns do resumo e filtro nao usam mais tone primary amarelo; usam contraste neutro por tokens.
Filtro de produtos usa Foundation Modal; desktop renderiza modal central e web mobile renderiza BottomModal por variant auto. `Modal` e `BottomModal` ficam em arquivos publicos separados na Foundation, com `ModalFrame` apenas como implementacao interna compartilhada.
Etapa montagem foi separada em `ActivePlanPanel` e `ProductCatalogStep`.
`PedidoView` nao mapeia mais `availableProducts` nem monta `ProductItemCard`
diretamente; ela recebe o view-model do `useClientCheckout` e passa dados/acoes
para componentes render-only.
Etapas de entrega, pagamento e resumo tambem foram separadas em componentes
locais render-only: `DeliveryStep`, `PaymentStep` e `ReviewStep`.
`PedidoView` ficou como orquestrador de tela: AppShell/auth, hook,
tokens, hero, seletor de modo, step tracker, etapa atual e resumo lateral.
Componentes locais de `tabs/pedido/` nao importam mais tipos de `@/mocks/*`;
eles consomem aliases exportados pelo contrato de checkout view-model.
Regra do catalogo: produto aparece pelo resultado de `availableProducts`, que
hoje vem de mocks/seed via shared-core e depois deve vir da API/backend/admin
com as mesmas chaves de disponibilidade, plano, categoria, preco e estoque.
Campos longos usam Foundation `TextArea`; modal de filtro usa Foundation
`Modal`/`BottomModal`; botoes compostos continuam Foundation `Button` com CSS
local tokenizado para preservar layout dos children.
```

Evidencias:

```text
PedidoView.tsx:17
  -> ProductItemCard ja vem da fachada de product-components

PedidoView.tsx:371 em diante
  -> root/layout inline

PedidoView.tsx:391 em diante
  -> <style> local com animacoes e media queries

PedidoView.tsx:507, 568, 720, 814, 882, 1102, 1349, 1595, 1652
  -> className pedido-* dirigindo layout/responsivo local
```

Destino Fase 1:

```text
screen deve usar Foundation Layout:
  Container
  Grid
  Inline
  Stack
  Surface
  Text
  Button
  Input
  DropdownPicker quando fizer sentido

config de layout repetida deve ir para manifest quando deixar de ser detalhe
local da tela.
```

Nao fazer agora:

```text
nao perseguir pixel-perfect
nao redesenhar visual inteiro
nao criar UI primitive nova antes do Passo 6
```

## Passo 2 - Locales/Strings

Estado:

```text
clientPtBR.pedido ja cobre grande parte da copy.
```

Ainda pendente:

```text
placeholders do novo endereco ainda estao hardcoded na screen
gridColumn dos campos ainda esta junto da copy
alguns valores compostos ainda nascem direto na screen
formatos como "kg", "un.", "x" e datas/dias ainda precisam de contrato claro
```

Evidencias:

```text
PedidoView.tsx:167-172
  -> placeholders e gridColumn de endereco dentro da screen

PedidoView.tsx:45-46
  -> modeOrder e stepOrder hardcoded

PedidoView.tsx:1165
  -> dias [5, 10, 15, 20, 25] hardcoded
```

Destino Fase 1:

```text
frontend/client/shared-core/locales/pt-BR.ts
  -> copy/labels/placeholders/aria/empty states

frontend/client/shared-core/manifest/portal ou manifest/checkout
  -> ordem de modes, steps, campos e dias permitidos

dados comerciais
  -> backend, seed ou mocks compartilhados temporarios
```

## Passo 3 - Mapa De Componentes

Componentes/blocos atuais candidatos:

```text
ModeSelector
  -> escolhe subscription, royalBox ou royalDelivery
  -> pode ser screen component primeiro

CheckoutStepTracker
  -> montagem, entrega, pagamento, resumo
  -> pode ser product-component se repetir em pedido/admin/acompanhamento

PlanSelector
  -> escolhe Basic/Premium/Pro dentro de assinatura
  -> pode virar product-component de ecommerce/subscription

ProductSelectionGrid
  -> usa ProductItemCard e filtros
  -> deve ser screen component ou shared view-model, nao UI primitive

DeliveryAddressSelector
  -> lista enderecos e seleciona addressId
  -> candidato a product-component/customer quando repetir em conta/checkout

DeliveryDaySelector
  -> dias permitidos de Royal Box
  -> por enquanto screen component com config do manifest

FreightSelector
  -> fretes disponiveis
  -> candidato a product-component checkout/delivery

PaymentMethodSelector
  -> pagamento mockado neste MVP
  -> manter local/checkout, sem gateway real

OrderReviewPanel
  -> resumo final
  -> product-component provavel, mas depende do shape do view-model

StickyOrderSummary
  -> resumo lateral da montagem
  -> product-component provavel se tambem for usado em delivery/admin

SummaryRow
  -> componente pequeno demais; pode ficar local ate repetir
```

Componentes que ja existem e devem ser reutilizados:

```text
frontend/product-components/ecommerce/ProductItemCard.tsx
frontend/foundation/ui/Button
frontend/foundation/ui/Input
frontend/foundation/ui/DropdownPicker
frontend/foundation/ui/Layout
frontend/foundation/ui/Surface
frontend/foundation/ui/Text
frontend/foundation/ui/Icon/AppIcons
```

Provavelmente nao precisa de UI nova no primeiro corte:

```text
Cards e listas podem usar Surface/Card/Layout.
Select/dropdown pode usar DropdownPicker.
Inputs podem usar Input.
Stepper pode comecar como screen component usando Button.
```

## Passo 4 - Proposta De Extracao

Extracao funcional antes da visual:

```text
frontend/client/shared-core/manifest/checkout.config.ts
  -> modeOrder
  -> stepOrder
  -> deliveryDays
  -> address field descriptors
  -> allowed transitions basicas de UI

frontend/client/shared-core/view-models/checkout.view-model.ts
  -> availableProducts
  -> selectedProductEntries
  -> selected counts
  -> estimated totals de UI
  -> current step status
  -> summary rows
  -> product card props

frontend/client/shared-core/hooks/useClientCheckout.ts
  -> estado de montagem
  -> actions: selectMode, setQuery, selectCategory, addProduct, removeProduct
  -> actions: selectAddress, selectFreight, selectPayment, goToStep
  -> createOrder via useClientOrders/create quando finalizar
  -> fallback mockado explicito enquanto backend/admin nao cobrem tudo

frontend/client/web/src/screens/portal/tabs/PedidoView.module.css
  -> mover CSS inline e media queries locais da screen
  -> usar tokens/vars e Foundation classes

frontend/client/web/src/screens/portal/tabs/pedido/
  -> componentes locais de tela aprovados
  -> ModeSelector
  -> CheckoutStepTracker
  -> ProductSelectionSection
  -> DeliverySection
  -> PaymentSection
  -> ReviewSection
  -> StickyOrderSummary
```

Extracoes para `frontend/product-components/ecommerce` somente depois de prova:

```text
OrderSummaryCard
  -> se StickyOrderSummary/ReviewPanel tambem forem usados em MinhaCaixa,
     MeusPedidos, Delivery ou Admin

PlanBenefitCard/PlanSelectorCard
  -> se assinatura e landing/admin usarem o mesmo padrao

FreightOptionCard
  -> se Delivery e checkout usarem a mesma selecao
```

Nao extrair agora:

```text
nao criar Foundation UI nova
nao mover tudo para product-components de uma vez
nao criar checkout engine global
nao implementar pagamento real
nao implementar scheduling completo
nao remover mocks antes do fallback explicito estar no hook
```

## Implementacao Executada

Corte inicial aplicado:

```text
1. checkout.config.ts criado com modes, steps, deliveryDays, address fields e mode -> kind_key
2. checkout.view-model.ts criado com filtros, selecao, limites, totais e resumo de ciclo
3. useClientCheckout.ts criado com estado/actions, fallback mockado explicito e createOrder
4. PedidoView passou a consumir hook/view-model/config para dados, calculos e acoes
5. placeholders de novo endereco foram movidos para locale
6. finalizar pedido chama useClientOrders.create usando kind_key seedado
7. backend seed ganhou OrderKindDefinition royal-box apontando para commercialMode box
8. CSS responsivo local saiu de <style> inline e foi para PedidoView.module.css
9. Hero, selector de modo, step tracker, modal de filtro e SummaryRow viraram componentes locais em tabs/pedido/
10. label de step concluido saiu de hardcode e foi para locale
11. Button/Input simples da tela migraram para Foundation UI
12. Container, Grid, Inline, Stack, Surface e Text comecaram a substituir wrappers locais onde nao muda comportamento
13. MontarBox alinhado ao padrao de colunas uteis do Catalogo com Container wide + gutter page
14. ModeSelector deixou o estado compacto de Royal Pro/Royal Box/Royal Delivery mais horizontal e escaneavel
15. StickyOrderSummary extraido da screen para reduzir JSX inline e deixar o resumo mais render-only
16. cores hardcoded #FCFBF7 removidas da PedidoView e trocadas por token ivory
17. Foundation Modal/BottomModal criados e ProductFilterModal deixou de montar overlay proprio
18. Foundation TextArea criado para notas do pedido, evitando textarea direto na tela
19. DeliveryStep, PaymentStep e ReviewStep extraidos; `PedidoView` deixou de montar os passos internos
20. CSS da PedidoView foi retokenizado: sem rgba/hex/px soltos no corte da tela, exceto breakpoints
21. Botoes compostos receberam wrappers tokenizados para funcionar corretamente com o span interno do Foundation Button
22. Tipos consumidos pelos componentes locais passaram a vir de `checkout.view-model`, nao de `@/mocks/*`
23. Cards selecionaveis deixaram de usar `appearance="transparent"` porque essa aparencia zera a borda no `Surface`; agora usam `soft` com bg/border tokenizados
24. CTAs de fluxo deixaram de usar `tone="primary"` para nao herdar amarelo/gold; agora usam helper local com contraste neutro baseado em tokens
25. Formulario de novo endereco ficou vinculado ao `useClientCheckout`: inputs controlados por draft, salvar adiciona endereco local, seleciona o novo endereco e o `buildOrderInput` envia o `addressId`
26. `usePedidoRuntime.ts` criado para isolar estado web de tema, auth demo, modal de login e protecao de etapas; `PedidoView.tsx` nao acessa mais `window`, `document` ou `localStorage` diretamente
27. `checkout.contract.ts` criado com tipos estruturais de checkout; `checkout.config.ts` e `checkout.view-model.ts` dependem do contrato, nao de tipos de mocks
28. `checkout.fallback.ts` centraliza a fonte mockada/seed atual; `useClientCheckout.ts` consome uma fonte unica que depois pode ser trocada por API/backend sem mudar a UI
29. formatadores `formatClientCheckoutMoney` e `formatClientCheckoutMeasure` foram movidos para `utils/checkout.formatters.ts` e reutilizados por web/mobile
30. `PedidoView.module.css` ganhou `pageRoot` tokenizado e transicoes consistentes de painel, opcao, step e resumo
```

Validacao executada:

```text
npm run build:client
npm run build:admin
npm run verify:foundation
node node_modules/typescript/bin/tsc -p frontend/client/mobile/tsconfig.json
git diff --check
```

## Pendencias Do Proximo Corte

```text
1. continuar reduzindo styles inline dos cards e secoes internas
2. criar ou aprovar um contrato de card selecionavel antes de trocar todos os <button> de plano/endereco/dia/frete/pagamento
3. extrair ProductSelectionSection, DeliverySection, PaymentSection, ReviewSection e StickyOrderSummary se isso reduzir complexidade real
4. avaliar depois quais blocos merecem frontend/product-components/ecommerce
5. adicionar script formal para validar frontend/client/mobile/tsconfig.json sem comando manual
```

Observacao:

```text
Royal Box agora usa OrderKindDefinition royal-box no seed de Orders e commercial
mode box no seed de Catalog. A regra continua vindo de seed/config, nao da tela.
```

## Audit Render-Only Final

Estado apos auditoria:

```text
PedidoView.tsx
  -> orquestra runtime, hook, strings, tokens, etapa atual e componentes
  -> nao importa mocks
  -> nao acessa browser API diretamente
  -> nao calcula regras de plano/frete/pagamento
  -> nao monta ProductItemCard diretamente

tabs/pedido/*
  -> componentes render-only de tela
  -> recebem props, strings, tokens e callbacks
  -> nao importam mocks
  -> nao criam estado de negocio
  -> usam Foundation UI, Layout, Surface, Text, Button, Input, TextArea, Modal

useClientCheckout.ts
  -> dono do estado funcional da montagem
  -> dono das actions da tela
  -> monta payload de create order
  -> consome checkoutFallbackDataSource enquanto backend/admin ainda nao cobrem 100%

checkout.view-model.ts
  -> dono de filtros, disponibilidade, limites, contadores e totais de exibicao
  -> depende de checkout.contract.ts

checkout.fallback.ts
  -> unico ponto do corte atual que importa mocks/seeds do cliente
```

Limite consciente:

```text
O fluxo ainda usa fallback local porque a API final de checkout/catalogo/admin
nao foi conectada end-to-end. Isso esta isolado em `checkout.fallback.ts`, nao
espalhado pela UI.
```
