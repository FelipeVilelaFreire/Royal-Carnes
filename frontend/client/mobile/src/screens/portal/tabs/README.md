# Portal Native Tabs

## Home

`HomeView.tsx` e um placeholder funcional vazio. Ele existe para a Home ja
acompanhar a mesma rota, AppShell e locale do portal mobile, mas sem copiar as
secoes visuais da web antes da hora.

## Cortes

`CortesView.tsx` e o primeiro corte mobile da tela de catalogo. Ele consome
`cortes.model.ts`, `ProductItemCard` e primitives locais com os mesmos nomes do
web.

Contrato:

```text
mobile view
  -> ClientCatalogSnapshot vindo do hook/API client mobile
  -> cortes.model.ts
  -> createCortesCatalogViewModel()
  -> AppShell
  -> Button/Text/Surface/Layout/Icon
```

Regra:

```text
webIsMobile == native behavior
```

A tela native deve manter os mesmos filtros, ordenacao, categorias, empty state,
strings e dados da web mobile. A diferenca permitida e apenas o runtime visual:
web usa DOM/CSS; native usa componentes React Native mapeados pela Foundation.

## Montar Box

`PedidoView.tsx` e o corte native-ready da tela de Montar Box. A tela mantem a
mesma divisao publica da web:

```text
PedidoView
  -> pedido/ModeSelector
  -> pedido/CheckoutStepTracker
  -> pedido/ProductCatalogStep
  -> pedido/DeliveryStep
  -> pedido/PaymentStep
  -> pedido/ReviewStep
```

Contrato:

```text
mobile view
  -> useClientCheckout()
  -> checkout.config.ts + checkout.view-model.ts
  -> clientPtBR.pedido
  -> AppShell
  -> Button/Text/Surface/Layout/ProductItemCard
```

Por enquanto, a fonte do hook ainda e o fallback mockado do shared-core. A UI
nao importa mocks diretamente e nao decide permissao de plano, saldo, frete,
pagamento ou payload do pedido.

## Render Native

`View`, `Text`, `Pressable`, listas e inputs entram como hosts do runtime
Expo/React Native. As telas nao usam esses hosts diretamente para UI comum:
elas usam `Button`, `Text`, `Surface`, `Layout`, `Icon` e componentes de produto.
