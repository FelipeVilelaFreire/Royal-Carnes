# Next Steps

Este documento e a sequencia oficial antes de continuar nas telas dos
render-apps.

## Estado Fechado

```text
frontend/foundation
  -> tokens
  -> semi-composed
  -> ui
  -> native bridge
  -> shells/app-shell primeiro corte web + native-ready

frontend/shared-core/manifest
  -> theme
  -> semi-composed
  -> ui
  -> capabilities

frontend/client/shared-core/manifest
  -> theme
  -> semi-composed
  -> ui
  -> capabilities
  -> landing, portal, pages, routes, screens

frontend/admin/shared-core/manifest
  -> theme
  -> semi-composed
  -> ui
  -> capabilities
  -> pages, routes, screens, admin shell config
```

## Regra Antes Das Telas

Fora de `client/web` e `admin/web`, a arquitetura deve permanecer limpa.

```text
nao criar pasta paralela pluralizada para manifest
nao criar quarta pasta agregada de design system dentro do manifest
nao criar shell paralela fora de Foundation
nao recolocar product-components em Foundation sem contrato provado
nao criar novo hardcode fora do render-app
```

## Regra De Pressao E Config

Mesmo com pressao de prazo, cada mudanca de tela deve passar primeiro por uma
pergunta simples:

```text
isso pode nascer em manifest, config.jsx, locale, navigation ou view-model sem
atrasar demais o corte?
```

Se sim, colocar no `shared-core` correto antes de renderizar.

Se nao, a tela pode receber um hardcode temporario somente dentro de
`client/web` ou `admin/web`, desde que:

```text
o fluxo continue funcionando
a regra real nao saia do backend
o hardcode nao entre em foundation nem shared-core global
o trecho fique facil de extrair no proximo corte
nao seja criado novo design system local
```

Regra curta:

```text
pressionado nao significa sujar a arquitetura
configurar quando for barato
hardcodar so no render-app quando for transicao consciente
extrair no primeiro corte em que a tela repetir comportamento
```

## Regra De Navegacao V1

A navegacao V1 do client deve ser pensada como uma intencao unica:

```text
Home
Catalogo
Pedir
Minha Conta
```

Essa intencao nasce em `client/shared-core/navigation`, usa strings de
`client/shared-core/locales` e e ativada por placements no manifest/AppShell.

```text
Header desktop
Drawer
BottomTabBar do web mobile
NativeTabBar native-ready
```

Todos devem ler a mesma key, labelKey, iconIntent, order e regra de auth.

Regra curta:

```text
nao criar uma navegacao para desktop e outra para mobile/native
criar uma navegacao semantica e mudar apenas a apresentacao por placement
```

## Proximo Corte

```text
1. escolher uma tela pequena do client/web ou admin/web
2. ler hook, manifest, locale, navigation e mock usados por ela
3. mover copy/config repetida para o shared-core correto
4. manter JSX como render-only
5. validar build client/admin
```

## Ordem Recomendada

```text
1. client/web: MeusPedidosView + OrderDetailModal
2. client/web: MinhaCaixaView
3. client/web: MeuClubeView
4. admin/web: DashboardPage
5. admin/web: ListPage/DetailPage/AddPage por screen type
```

## Criterio De Pronto

Um corte so esta pronto quando:

```text
imports resolvem para manifest singular
copy nova vem de locale/config
icons usam contrato de Foundation ou AppIcons
screen nao calcula regra de negocio
build client passa
build admin passa
git diff --check passa
```
