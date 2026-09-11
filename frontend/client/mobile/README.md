# PrimeCutClub Frontend Mobile

Surface Mobile (React Native / Expo) para o aplicativo iOS/Android do cliente.
Consome contratos, manifestos, locales e navigation de `frontend/client/shared-core/`.

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
../../foundation/native/client-ui/
src/screens/portal/PortalView.tsx
src/screens/landing/LandingView.tsx
src/screens/portal/Home/HomeView.tsx
src/screens/portal/Cortes/CortesView.tsx
src/screens/portal/MontarBox/MontarBoxView.tsx
src/screens/portal/MontarBox/pedido/*
src/screens/portal/MeusPedidos/MeusPedidosView.tsx
src/screens/portal/Perfil/PerfilView.tsx
```

`HomeView.tsx` consome o catalogo real via `useClientCatalog`, incluindo os
estados de carregamento, vazio e erro.

`CortesView.tsx` usa o mesmo view-model de catalogo da web:

```text
frontend/client/shared-core/view-models/cortes-catalog.view-model.ts
```

`MontarBoxView.tsx` segue a mesma tree publica da web:

```text
MontarBoxView
  -> pedido/ModeSelector
  -> pedido/CheckoutStepTracker
  -> pedido/ProductCatalogStep
  -> pedido/DeliveryStep
  -> pedido/PaymentStep
  -> pedido/ReviewStep
```

A tela consome `useClientCheckout`, `checkout.config.ts`, strings ativas e
`checkout.view-model.ts`; erros de API permanecem como erro, sem fallback
demonstrativo local.

## Contrato De Nomes

O mobile usa os mesmos nomes publicos do web. A pasta ja diz a plataforma.

```text
web Button -> mobile Button
web Text -> mobile Text
web Surface -> mobile Surface
web Layout -> mobile Layout
web AppShell -> mobile AppShell
ProductItemCard web/native -> product-components/ecommerce
```

Nada de prefixo `Native` em componente de produto ou UI.

## Runtime Visual

Quando o Expo/React Native entrar, os hosts reais `View`, `Text`,
`Pressable`, listas e inputs serao injetados no `App`. As telas continuam
consumindo `Button`, `Text`, `Surface`, `Layout`, `Icon` e AppShell da
Foundation Native.
Trocas de navegacao e intencao de icone continuam vindo de manifest/navigation.
