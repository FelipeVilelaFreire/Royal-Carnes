# PrimeCutClub Frontend Mobile

Surface Mobile (React Native / Expo) para o aplicativo iOS/Android do cliente.
Consome contratos, manifestos, locales, navigation e mocks de `frontend/client/shared-core/`.

## Status

Este app ainda nao possui runtime Expo/React Native instalado. O corte atual e
native-ready: as telas nascem como modelos nativos consumindo os mesmos
contratos do web mobile.

## Regra

```text
webIsMobile == native behavior
```

Depois que uma tela funcional fecha o primeiro responsivo web, a proxima etapa
da mesma tela e criar seu contrato native em `src/screens`.

## Telas Iniciais

```text
src/app/App.tsx
src/shell/AppShell/AppShell.tsx
src/ui/Button/Button.tsx
src/ui/Text/Text.tsx
src/ui/Surface/Surface.tsx
src/ui/Layout/Layout.tsx
src/ui/Icon/Icon.tsx
src/screens/portal/PortalView.tsx
src/screens/portal/tabs/HomeView.tsx
src/screens/portal/tabs/CortesView.tsx
src/screens/portal/tabs/PedidoView.tsx
src/screens/portal/tabs/pedido/*
src/screens/portal/tabs/home.model.ts
src/screens/portal/tabs/cortes.model.ts
```

`HomeView.tsx` nasce vazio por enquanto: resolve AppShell, rota ativa e strings,
mas ainda nao declara secoes visuais.

`CortesView.tsx` usa o mesmo view-model de catalogo da web via `cortes.model.ts`:

```text
frontend/client/shared-core/view-models/cortes-catalog.view-model.ts
```

`PedidoView.tsx` segue a mesma tree publica da web para Montar Box:

```text
PedidoView
  -> pedido/ModeSelector
  -> pedido/CheckoutStepTracker
  -> pedido/ProductCatalogStep
  -> pedido/DeliveryStep
  -> pedido/PaymentStep
  -> pedido/ReviewStep
```

A tela consome `useClientCheckout`, `checkout.config.ts`, `clientPtBR.pedido`
e `checkout.view-model.ts`; dados atuais ainda entram pelo fallback mockado do
shared-core ate a API mobile real substituir essa fonte.

## Contrato De Nomes

O mobile usa os mesmos nomes publicos do web. A pasta ja diz a plataforma.

```text
web Button -> mobile Button
web Text -> mobile Text
web Surface -> mobile Surface
web Layout -> mobile Layout
web AppShell -> mobile AppShell
web ProductItemCard -> mobile ProductItemCard
```

Nada de prefixo `Native` em componente de produto ou UI.

## Runtime Visual

Quando o Expo/React Native entrar, os hosts reais `View`, `Text`,
`Pressable`, listas e inputs serao injetados no `App`. As telas continuam
consumindo `Button`, `Text`, `Surface`, `Layout`, `Icon` e `AppShell` locais.
Trocas de navegacao e intencao de icone continuam vindo de manifest/navigation.
