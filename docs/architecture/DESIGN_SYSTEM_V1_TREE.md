# Design System V1 Tree

## Objetivo

Este documento define o corte inicial do Design System V1 do RoyalPrime antes da
migracao das telas render-only.

A intencao e criar uma base simples, menor que o ServiceOS atual, mas ja
alinhada com a mesma disciplina:

```text
tokens e manifest definem
foundation resolve e veste
shared-core organiza dados/fluxos
render-apps apenas apresentam
```

Este corte vem antes de conectar telas como `MeusPedidosView`, porque as telas
devem consumir uma base visual clara em vez de reforcar `legacy/design-system`
ou criar estilos locais novos.

## Status Implementado

Primeiro corte aplicado:

```text
frontend/shared-core/manifest/theme/*
frontend/shared-core/manifest/semi-composed/*
frontend/shared-core/manifest/ui/*
frontend/shared-core/manifest/capabilities/*
frontend/shared-core/manifest/mock.ts
frontend/client/shared-core/manifest/ui.manifest.ts
frontend/admin/shared-core/manifest/ui.manifest.ts
frontend/foundation/tokens/resolver.ts
frontend/foundation/ui/Surface
frontend/foundation/ui/Layout
frontend/foundation/ui/Text
frontend/foundation/ui/Icon
frontend/foundation/ui/Button
frontend/foundation/ui/Card
frontend/foundation/ui/UiProvider
frontend/foundation/shells/app-shell
frontend/foundation/native
frontend/client/shared-core/manifest/theme/colors.ts
frontend/client/shared-core/manifest/theme/tokens.ts
frontend/admin/shared-core/manifest/theme/colors.ts
frontend/admin/shared-core/manifest/theme/tokens.ts
frontend/client/web/src/transitional/app-shell
frontend/client/web/src/transitional/product-components
frontend/admin/web/src/transitional/app-shell
frontend/admin/web/src/transitional/product-components
```

Fora deste corte:

```text
product-components
refresh das telas client/web
refresh das telas admin/web
remocao de legacy
```

AppShell agora possui um primeiro runtime em Foundation, separado em contrato
visual generico, runtime web e modelo native-ready. As pastas
`transitional/app-shell` continuam existindo para compatibilidade e so devem
ser removidas quando nao houver imports.

## Regra Central

```text
backend decide regra
shared-core transporta fluxo e view-model
manifest declara configuracao
foundation veste UI
render-app apresenta
```

## Contrato De Layout

Layout segue a mesma intencao do ServiceOS: nomes simples e genericos em
Foundation, ativacao por manifest e resolucao por viewport.

```text
theme.tokens.layout
  -> matriz fisica global: desktop/tablet/mobile, gutters e containers

ui.layout
  -> defaults semanticos: Container, Grid, GridItem, Stack, Inline, Flex e Box

appShell.layout.viewports
  -> como Header, Content, Footer, Drawer e BottomTabBar usam a matriz

screens.<screenKey>.layout
  -> futuro contrato de como cada tela ocupa a matriz
```

O manifest deve declarar matematica e intencao de layout, nao CSS solto:

```text
width: "wide" | "comfortable" | "compact" | "full"
gutter: "page" | "none"
gridColumns: "theme" | number
align: "start" | "center" | "between" | "end"
```

Significado de `full`:

```text
full ocupa o span completo da matriz do viewport, preservando o gutter quando
gutter: "page" estiver ativo.

desktop -> 20 colunas
tablet  -> 8 colunas
mobile  -> 4 colunas
```

Exemplo pratico: se o desktop tem 20 colunas, gutter externo de pagina e gap
entre colunas, `width: "full"` ocupa as 20 colunas uteis. Ele nao deve virar um
bloco sem delimitacao visual, nem ser limitado por `max-width` local no Header.

Desktop, web mobile e native podem divergir por viewport sem duplicar tudo.
Quando o native seguir o mobile, usar `inheritFrom: "mobile"`.

Regra curta:

```text
Theme define a malha
UI Layout define os nomes
AppShell escolhe a casca por viewport
Telas escolhem ocupacao de conteudo
```

No portal atual, o Header desktop usa:

```text
layout.viewports.desktop.header
  -> width: "full"
  -> gutter: "page"
  -> align: "between"
```

O AppShell deve respeitar esse contrato usando `Container` de Foundation. CSS
de casca pode controlar altura, z-index, posicao e variaveis visuais, mas nao
deve sobrescrever a largura declarada no manifest com `max-width` fixo.

## Hierarquia De Tema

O tema global em `frontend/shared-core/manifest/theme` nao e o design final de
cada app. Ele fornece fallback comum de tokens e modes:

```text
shared-core/manifest/theme/colors.ts
  -> royalPrimeGlobalThemeModes.dark/light

shared-core/manifest/theme/tokens.ts
  -> royalPrimeThemeTokens
  -> resolveRoyalPrimeThemeMode(mode, scopedModes)
```

Cada surface tem seu proprio design system no shared-core correto:

```text
client/shared-core/manifest/theme/colors.ts
  -> clientThemeModes.dark/light

client/shared-core/manifest/theme/tokens.ts
  -> clientThemeTokens
  -> resolveClientThemeMode()

admin/shared-core/manifest/theme/colors.ts
  -> adminThemeModes.dark/light/admin

admin/shared-core/manifest/theme/tokens.ts
  -> adminThemeTokens
  -> resolveAdminThemeMode()
```

Fluxo de resolucao:

```text
global fallback mode
  -> merge com mode especifico da surface
  -> theme.manifest.js exporta o tema final da surface
  -> AppShell/Foundation resolvem CSS variables
```

Assim, se o client/admin nao declarar uma cor, ela vem do global; se declarar,
a surface vence. O portal usa cores dark/light proximas ao header legacy:
fundo escuro `#0B0908`, ivory `#FCFBF7`, copper `#B87333`, header translúcido
e active pill por `activeBg`.

Render-app nao deve ser dono de:

```text
cor
escala de texto
raio
surface
shadow
layout grid global
icone semantico
copy reutilizavel
mock de negocio
regra de negocio
```

## Tree Atual Relevante

Hoje o frontend possui estas camadas principais:

```text
frontend/
  foundation/
    -> tokens, semi-composed e UI primitives oficiais

  shared-core/
    -> contratos globais, tipos base, helpers de API/erro e manifest global

  client/
    shared-core/
      -> contratos, api, mappers, hooks, view-models, manifest, locales,
         navigation e mocks do cliente

    web/
      -> render-app client Next.js
      -> rotas, screens, modules, product-components, legacy visual e transitional

  admin/
    shared-core/
      -> contratos, api, mappers, hooks, view-models, manifest, locales,
         navigation e mocks do admin

    web/
      -> render-app admin
      -> App, builders, screen-types, screens e transitional
```

## Tree Alvo V1

```text
frontend/
  foundation/
    tokens/
      index.ts
      theme.tokens.ts
      resolver.ts
      cssVariables.ts

    semi-composed/
      surface/
      text/
      icon/
      border/
      elevation/
      state/

    ui/
      UiProvider/
      Layout/
        Container
        Grid
        GridItem
        Stack
        Inline
      Surface/
      Text/
      Icon/
        Icon
        AppIcons
      Button/
      Card/
      Badge/
      Field/
      Input/
      Select/
      EmptyState/

  native/
    tokens.ts
    ui.ts
    semi-composed.ts
    types.ts
    index.ts

    shells/
      app-shell/
        foundation/
        web/
        native/

  shared-core/
    manifest/
      assets.ts
      theme.base.ts
      design-system.defaults.ts
      mock.ts

  client/
    shared-core/
      manifest/
        theme.manifest.js
        routes.ts
        screens.ts
        assets.js
        portal/
          appshell.config.jsx
        landing/
          appshell.config.jsx
          pages/
            landing.config.jsx
        pages/
          home.config.jsx
      locales/
      navigation/
      mocks/
      hooks/
      view-models/
      api/
      mappers/
      contracts/

    web/
      src/app/
      src/screens/
      src/transitional/
        app-shell/
        product-components/
      src/product-components/
      src/modules/

  admin/
    shared-core/
      manifest/
        theme.manifest.js
        routes.ts
        screens.ts
        adminAppShell.config.jsx
        pages/
          dashboard.config.jsx
          produtos.config.jsx
          pedidos.config.jsx
          deliveries.config.jsx
          assinaturas.config.jsx
          usuarios.config.jsx
      locales/
      navigation/
      mocks/
      hooks/
      view-models/
      api/
      mappers/
      contracts/

    web/
      src/App.tsx
      src/engines/rendering/screen-types/
      src/screens/
      src/transitional/
        app-shell/
        product-components/
```

## Foundation

`frontend/foundation` e o motor visual generico do RoyalPrime.

Ele pode ter:

```text
tokens fisicos
resolucao de CSS variables
semi-composed recipes
UI primitives
AppShell generico
componentes visuais reutilizaveis sem regra de negocio
```

Ele nao pode ter:

```text
regra RoyalPrime
preco
estoque
assinatura ativa
permissao real
endpoint
fetch
copy de tela
mock de negocio client/admin
if por empresa, plano ou produto
```

## Tokens V1

A V1 deve declarar o minimo necessario para parar de espalhar estilos locais:

```text
theme:
  mode
  colors
  typography
  spacing
  sizing
  radius
  border
  opacity
  shadow/elevation
  blur
  zIndex
  layout
  breakpoints
  motion
```

### Colors

As cores devem nascer como tokens semanticos e/ou fisicos no manifest:

```text
background
surface
surfaceContainer
text
textMuted
border
accent
accentContrast
success
warning
danger
info
```

Render-app nao deve hardcodar `#hex` ou `rgba` para UI nova. Quando precisar de
uma cor recorrente, ela deve entrar no manifest/token.

### Typography

Escala minima:

```text
font.family.body
font.family.display
font.size.xs
font.size.sm
font.size.md
font.size.lg
font.size.xl
font.size.2xl
font.size.3xl
font.weight.regular
font.weight.medium
font.weight.semibold
font.weight.bold
lineHeight.tight
lineHeight.normal
lineHeight.relaxed
```

### Spacing E Sizing

Escala minima:

```text
spacing.0
spacing.1
spacing.2
spacing.3
spacing.4
spacing.5
spacing.6
spacing.8
spacing.10
spacing.12
spacing.16

sizing.icon.sm
sizing.icon.md
sizing.icon.lg
sizing.control.sm
sizing.control.md
sizing.control.lg
```

### Radius, Border E Elevation

Escala minima:

```text
radius.none
radius.sm
radius.md
radius.lg
radius.xl
radius.full

border.width.hairline
border.width.sm
border.style.solid

elevation.none
elevation.sm
elevation.md
elevation.lg
```

### Layout

O layout global deve ser tokenizado:

```text
layout.desktop.columns = 20
layout.tablet.columns = 8
layout.mobile.columns = 4

layout.desktop.gutter
layout.tablet.gutter
layout.mobile.gutter

layout.container.sm
layout.container.md
layout.container.lg
layout.container.xl
```

Nenhuma tela deve inventar matriz global de grid.

## Semi-Composed V1

`semi-composed` traduz tokens fisicos em receitas reutilizaveis.

V1 suficiente:

```text
surface
  solid
  soft
  outline
  glass

text
  body
  heading
  caption
  overline

icon
  default
  muted
  accent
  danger
  success

state
  hover
  pressed
  focus
  disabled

elevation
  flat
  raised
  floating
```

Regra:

```text
Theme tokens -> Semi-composed recipe -> UI primitive
```

UI primitive nao deve consumir diretamente uma cor solta se a receita ja cobre o
caso.

## UI Primitives V1

### Layout

Componentes minimos:

```text
Container
Grid
GridItem
Stack
Inline
```

Responsabilidades:

```text
aplicar largura maxima
aplicar gutters tokenizados
aplicar grid responsivo
organizar gap vertical/horizontal
evitar CSS local repetido em telas
```

Nao deve:

```text
buscar dados
conhecer rota
conhecer plano/produto/pedido
ter copy
```

### Surface

`Surface` e a base visual de containers, cards, modais, painels e blocos.

Props V1:

```text
appearance: solid | soft | outline | glass
tone: neutral | accent | success | warning | danger
radius: sm | md | lg | xl | full
elevation: none | sm | md | lg
padding: none | sm | md | lg | xl
```

### Text

`Text` renderiza texto com escala tipografica.

Props V1:

```text
as
variant: body | heading | caption | overline
size
weight
tone
align
truncate
```

Texto novo de interface vem de locale/strings. `Text` nao e dono de copy.

### Icon

`Icon` resolve intencao semantica para AppIcons.

Intencoes iniciais:

```text
search
edit
delete
settings
user
order
delivery
subscription
catalog
inventory
success
warning
error
close
menu
chevron
```

Proibido usar emoji como icone de UI.

### Button

`Button` deve compor:

```text
Surface + Text + Icon
```

Props V1:

```text
variant: primary | secondary | ghost | outline | danger
size: sm | md | lg
icon
iconPosition
loading
disabled
```

`Button` nao deve definir regra de negocio. Ele apenas dispara `onClick` ou
submete form.

### Card

`Card` deve ser um wrapper de `Surface`.

Props V1:

```text
appearance
tone
radius
elevation
padding
interactive
```

`Card` nao deve calcular preco, status, workflow ou disponibilidade.

### Field, Input, Select E EmptyState

Entram na V1 porque aparecem em portal/admin:

```text
Field
  -> label, hint, error, required visual

Input
  -> controle textual

Select
  -> opcoes vindas de config/view-model

EmptyState
  -> estado visual com icon/title/description/action
```

Copy de `label`, `hint`, `placeholder`, `empty title` e `error` vem de locale ou
config/API.

## Manifests

Os tres shared-cores usam a mesma gramatica de organizacao. A referencia
canonica fica em:

```text
docs/architecture/SHARED_CORE_TREE_STANDARD.md
docs/architecture/MANIFEST_DESIGN_SYSTEM_TREE.md
```

### Global Manifest

`frontend/shared-core/manifest` pode guardar:

```text
assets comuns
theme
semi-composed
ui defaults
capabilities
mock/dev comum
```

Uso pretendido:

```text
frontend/shared-core/manifest/assets.ts
frontend/shared-core/manifest/theme/*
frontend/shared-core/manifest/semi-composed/*
frontend/shared-core/manifest/ui/*
frontend/shared-core/manifest/capabilities/*
frontend/shared-core/manifest/mock.ts
```

`mock.ts` global deve ser pequeno e temporario. Ele serve para dados comuns de
dev/manifest, nao para centralizar regra de negocio client/admin.

Mocks de dominio devem continuar no menor escopo correto:

```text
frontend/client/shared-core/mocks/
frontend/admin/shared-core/mocks/
```

### Client Manifest

`frontend/client/shared-core/manifest` deve ser dono de:

```text
theme client
routes client
screens client
assets client
navigation client
AppShell client
page configs client
```

Exemplos:

```text
frontend/client/shared-core/manifest/theme.manifest.js
frontend/client/shared-core/manifest/ui.manifest.ts
frontend/client/shared-core/manifest/routes.ts
frontend/client/shared-core/manifest/screens.ts
frontend/client/shared-core/manifest/portal/appshell.config.jsx
frontend/client/shared-core/manifest/landing/appshell.config.jsx
```

O render-app pode escolher um alias local proprio, mas a origem oficial fora do
web e `frontend/client/shared-core/manifest/*`.

### Admin Manifest

`frontend/admin/shared-core/manifest` deve ser dono de:

```text
theme admin
routes admin
screens admin
AppShell admin
page configs admin
screen-type configs
```

Exemplos:

```text
frontend/admin/shared-core/manifest/theme.manifest.js
frontend/admin/shared-core/manifest/ui.manifest.ts
frontend/admin/shared-core/manifest/adminAppShell.config.jsx
frontend/admin/shared-core/manifest/pages/dashboard.config.jsx
frontend/admin/shared-core/manifest/pages/pedidos.config.jsx
```

O render-app pode escolher um alias local proprio, mas a origem oficial fora do
web e `frontend/admin/shared-core/manifest/*`.

## Render-Apps

Render-apps:

```text
frontend/client/web
frontend/admin/web
```

Devem consumir:

```text
Foundation UI
Foundation AppShell quando existir
shared-core hooks
shared-core view-models
shared-core manifest
shared-core locales
shared-core navigation
```

Nao devem consumir:

```text
mock direto quando existe hook
api direto
DTO direto
admin shared-core dentro do client
client shared-core dentro do admin
legacy/design-system para UI nova
legacy/app-shell para capacidade nova
```

Fluxo esperado:

```text
page.tsx
  -> screen render-only
    -> hook shared-core
      -> api
        -> backend
    -> viewModel
    -> Foundation components
    -> strings/locales
    -> manifest/navigation
```

## Transitional

A regra atual e que tudo fora de `client/web` e `admin/web` precisa estar limpo
e alinhado com a nova arquitetura. Por isso, o que ainda e hardcoded,
especifico ou antecipado fica dentro do render-app em uma pasta explicita:

```text
frontend/client/web/src/transitional/
frontend/admin/web/src/transitional/
```

Essas pastas podem conter codigo necessario para manter a aplicacao rodando,
mas nao representam arquitetura oficial.

Nao adicionar capacidade nova em `transitional` sem classificar o de/para de
extracao.

## AppShell

AppShell possui um primeiro corte em `foundation/shells/app-shell`. Ele deve
continuar generico, declarativo e guiado por manifest/navigation.

Ownership alvo:

```text
frontend/foundation/shells/app-shell/
  foundation/
    types.ts
    resolver.ts
    index.ts
  web/
    AppShell.tsx
    AppShellRuntime.tsx
    AppShellHeader.tsx
    AppShellDrawer.tsx
    AppShellSidebar.tsx
    AppShellBottomTabBar.tsx
    AppShellFooter.tsx
    ScreenContent.tsx
    navigation.ts
    index.ts
  native/
    types.ts
    resolver.ts
    index.ts
  AppShell.tsx
  AppShellRuntime.tsx
  types.ts
  index.ts
```

Regra:

```text
Foundation AppShell fornece capacidade visual generica
foundation/app-shell/foundation resolve contrato, defaults, itens e CSS vars
foundation/app-shell/web renderiza a casca React web
foundation/app-shell/native resolve o mesmo contrato para runtime native futuro
client/admin manifest decide ativacao, rotas, navegacao e slots
render-app apenas monta o runtime com o manifest correto
```

Native neste corte significa `native-ready`, nao app mobile pronto. Nao existe
ainda `client/native` ou `client/mobile`; o que existe agora e a ponte de
Foundation para que o app native futuro use os mesmos tokens, recipes,
navigation, locales e manifests.

O Design System native-ready resolve estes contratos:

```text
foundation/native/tokens.ts
  -> theme mode da surface
  -> cores e tokens fisicos como objeto nativo

foundation/native/semi-composed.ts
  -> recipes de surface/text/icon/stroke/motion/etc em NativeStyleDescriptor

foundation/native/ui.ts
  -> Button, Input, Select, Field, Card, Surface, Text, Icon, Badge,
     Divider, DropdownPicker, SegmentedControl, EmptyState, Layout

foundation/shells/app-shell/native
  -> regioes Header/Drawer/NativeTabBar
  -> designSystem
  -> navigationStyles active/inactive
```

Regra de estado para navegacao:

```text
inactive -> Button transparent
active -> Button soft
container/regiao -> Surface
```

Nenhuma pagina do portal deve criar uma variacao web-only quando a intencao
tambem precisa existir no native futuro. A diferenca permitida fica no runtime:
web usa CSS/DOM; native usa `NativeStyleDescriptor`.

### Navegacao Compartilhada Entre Web Mobile E Native

O AppShell de Foundation nao deve ter uma navegacao propria para desktop, outra
para web mobile e outra para native. Ele deve renderizar a mesma intencao de
navegacao declarada no shared-core.

Contrato esperado:

```text
navigation item
  -> key
  -> labelKey
  -> groupKey/groupLabelKey quando Sidebar/Drawer precisarem de secoes
  -> iconIntent/iconName semantico
  -> routeKey ou routePath
  -> order
  -> auth/public/protected
  -> placements
```

Placements esperados:

```text
header
sidebar
drawer
bottomTabBar
nativeTabBar
footer
```

Fluxo:

```text
client/shared-core/navigation
  -> declara Home, Catalogo, Pedir, Minha Conta

client/shared-core/locales
  -> resolve strings por labelKey

client/shared-core/manifest/portal/appshell.config.jsx
  -> ativa Header, Drawer, BottomTabBar e placements

foundation/shells/app-shell
  -> Header, Drawer, SidebarMenu, BottomTabBar e Footer renderizam os mesmos itens

client/web
  -> resolve routePath para Next e callback de navegacao

client/mobile futuro
  -> resolve a mesma key/route para native navigation
```

Regra:

```text
webIsMobile deve seguir o mesmo contrato funcional do native
o que muda e a apresentacao, nao a intencao
```

Icones seguem a mesma regra:

```text
manifest/navigation declara iconIntent
web resolve por Foundation/AppIcons
native resolve por biblioteca nativa equivalente
Foundation/ServiceOS controlam tamanho, tom, stroke e receita visual
```

Sidebar e Drawer podem renderizar grupos declarados, sem criar SidebarMenu
paralelo:

```text
shared-core/navigation
  -> groupKey, groupLabelKey, groupOrder por item

shared-core/manifest/*/appshell.config.jsx
  -> navigationGroups com ordem e labels

foundation/shells/app-shell/foundation/resolver.ts
  -> resolve sidebarGroups e drawerGroups

foundation/shells/app-shell/web
  -> AppShellSidebar e AppShellDrawer renderizam os grupos
```

BottomTabBar e NativeTabBar devem permanecer planos e continuar lendo os mesmos
itens por placement.

Nao fazer:

```text
BottomTabBar hardcodar telas
Header hardcodar labels
Drawer escolher itens sem ler placements
native criar outro nome de icone para a mesma acao
web mobile ter navegacao diferente do native por decisao local
```

AppShell nao deve decidir:

```text
rota real
permissao real
copy de produto
navegacao hardcoded
regra de cliente/admin
estado de pedido/assinatura
```

AppShell pode receber:

```text
navigation declarativa
slots
theme, semi-composed e ui manifest
estado visual de layout
callbacks de navegacao ja fornecidos pelo render-app
```

Evolucao em Foundation segue a mesma regra dos product-components:

```text
so criar capacidade de AppShell quando for generica e extraida de uso real
nao recriar Header/Drawer/Sidebar local dentro de tela
nao hardcodar comportamento de RoyalPrime no AppShell
```

## Product Components

Product components atuais ficam em `transitional` ou em `client/web/src/product-components`
enquanto nao tiverem extracao oficial.

Ownership alvo futuro:

```text
frontend/foundation/product-components
```

Quando forem extraidos, ficam em Foundation porque sao composicoes visuais
reutilizaveis, mas nao ficam dentro de `foundation/ui`. `ui` continua reservado
para primitives mudas.

Tree alvo:

```text
frontend/foundation/product-components/
  ecommerce/
    ProductItemCard/
    ProductPriceBlock/
    ProductMediaFrame/

  subscriptions/
    PlanCard/
    PlanBenefitList/

  orders/
    OrderSummaryCard/
    OrderStatusBadge/

  delivery/
    DeliveryTracker/

  metrics/
    MetricKpiCard/
```

Exemplos:

```text
ProductItemCard
PlanBenefitCard
OrderSummaryCard
DeliveryTracker
MetricKpiCard
```

Regra:

```text
primeiro Foundation V1
depois product components
depois telas render-only
```

Product component pode conhecer um contrato visual de produto, mas nao deve
decidir regra real. Ele recebe props/view-model pronto.

Regra de entrada:

```text
so entra em foundation/product-components quando nascer de extracao real
de duas ou mais telas/fluxos, ou quando for claramente reutilizavel por dominio
generico como ecommerce, subscriptions, orders, delivery ou metrics
```

Nao criar product component em Foundation como hardcode antecipado de tela.

Nao permitido:

```text
preco calculado dentro do componente
estoque calculado dentro do componente
workflow de pedido
permissao real
fetch/API
mock de negocio interno
strings hardcoded de interface
if por plano, produto, empresa ou campanha
```

Permitido:

```text
props/view-model pronto
slots visuais
estados visuais declarativos
composicao com Surface/Text/Icon/Button/Card/Layout
tokens e recipes vindos do manifest/foundation
```

Relacao com Kits:

```text
docs/kits
  -> documentam capacidade, contrato, endpoints, view-model e consumidores

frontend/foundation/product-components
  -> guarda apenas runtime visual generico extraido

frontend/client/shared-core/kits
frontend/admin/shared-core/kits
  -> guardam contratos, view-models, hooks e adapters por fluxo
```

Kit nao vira runtime paralelo de UI. Kit aponta qual product-component generico
de Foundation deve ser usado quando existir.

Ordem:

```text
1. tela hardcoded atual mostra duplicacao real
2. shared-core define contrato/view-model
3. Foundation recebe product-component generico extraido
4. render-app passa props prontas
5. legacy para de crescer
```

## Ordem Recomendada

```text
1. Documentar esta tree V1
2. Auditar Foundation atual contra esta V1
3. Auditar manifest client/admin/global contra esta V1
4. Definir quais primitives ja existem e quais faltam
5. Definir quais tokens estao no lugar certo
6. Criar/ajustar apenas a base minima
7. Validar build client/admin
8. So depois voltar para MeusPedidosView + OrderDetailModal
```

## Checklist Antes De Migrar Telas

```text
[x] existe token para cor/spacing/radius usado pela tela
[x] existe Surface para containers/cards/modais
[x] existe Text para escala tipografica
[x] existe Icon para intencoes sem emoji
[x] existe Button usando receita/token
[x] existe Card usando Surface
[x] existe Layout minimo para Container/Grid/Stack/Inline
[x] manifest client/admin declara defaults principais
[ ] locale contem copy nova
[ ] render-app nao precisa criar design system local novo
```

## Decisao Para V1

O RoyalPrime nao precisa copiar toda a profundidade atual do ServiceOS agora.

Mas precisa nascer com estes contratos desde o inicio:

```text
tokens no manifest
foundation como motor visual unico
client/admin manifest como defaults por surface
shared-core como dono de fluxo/dados
render-app como camada render-only
legacy apenas como transicao, sem crescer
```

Esse e o basico que permite migrar as telas sem transformar cada tela em um
novo design system local.
