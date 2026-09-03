# Frontend Target Tree Roadmap

## Objetivo

Este documento define a tree alvo do frontend RoyalPrime antes de continuar a
migracao das telas.

A prioridade agora nao e conectar telas ainda. A prioridade e alinhar:

```text
foundation
shared-core global
client shared-core
admin shared-core
render-apps client/admin
manifest/theme/tokens
locales/navigation/mocks
```

As telas atuais em `client/web` e `admin/web` continuam vivas para o produto
renderizar, mas nao representam a arquitetura final.

Tudo que esta fora das render-apps deve ser tratado como arquitetura oficial e
refatorado agora para ficar limpo:

```text
frontend/foundation
frontend/shared-core
frontend/client/shared-core
frontend/admin/shared-core
docs/kits
docs/architecture
```

Ou seja: as render-apps podem continuar hardcoded temporariamente, mas os
fundamentos externos a elas nao devem continuar como transicao indefinida.

## Decisao Principal

`frontend/shared-core/manifest` sera a base declarativa padrao da aplicacao.

Ele deve conter os contratos visuais e configuracoes comuns que podem ser
consumidos por client e admin:

```text
tokens
theme base
semi-composed recipes
ui defaults
capabilities
assets globais
mocks/dev comuns quando fizer sentido
contratos de manifest comuns
```

Client deve respeitar essa base por padrao.

Admin tambem deve respeitar essa base por padrao, mas pode ter um manifest
proprio para sobrescrever o que realmente muda no admin.

Fluxo:

```text
frontend/shared-core/manifest
  -> base global

frontend/client/shared-core/manifest
  -> consome base global
  -> declara somente configuracao client

frontend/admin/shared-core/manifest
  -> consome base global
  -> sobrescreve somente o que for diferente no admin
```

## Regra De Heranca De Manifest

```text
global manifest
  -> client manifest
  -> client render-app

global manifest
  -> admin manifest override
  -> admin render-app
```

Em outras palavras:

```text
base comum mora em frontend/shared-core/manifest
diferenca do client mora em frontend/client/shared-core/manifest
diferenca do admin mora em frontend/admin/shared-core/manifest
```

Nao duplicar no admin algo que ja pode vir da base global.

Nao duplicar no client algo que ja pode vir da base global.

## Contrato Unico De Navegacao

A navegacao do produto deve nascer uma vez no shared-core/manifest, nao dentro
de cada runtime.

Regra:

```text
intencao de navegacao e unica
web desktop, web mobile e native mudam apenas a forma de apresentar
```

O item de navegacao deve declarar dados semanticos:

```text
key
routeKey ou routePath
labelKey
iconIntent ou iconName semantico
order
auth
placements
```

Exemplo de placements:

```text
header
sidebar
drawer
bottomTabBar
nativeTabBar
footer
```

Assim, o mesmo item pode aparecer no Header desktop, BottomTabBar do web
mobile, Drawer e TabBar nativo sem criar tres navegacoes diferentes.

```text
client/shared-core/navigation
  -> quais itens existem e em que ordem

client/shared-core/locales
  -> labels por labelKey

client/shared-core/manifest/*/appshell.config.jsx
  -> quais regioes da shell existem e quais placements estao ativos

foundation/shells/app-shell
  -> renderiza header/sidebar/drawer/bottomTabbar/footer usando placements

client/web e futuro client/mobile
  -> resolvem rota/callback local e renderizam a mesma intencao
```

Nao fazer:

```text
web desktop ter label diferente do mobile para a mesma acao
web mobile esconder item por regra local quando o manifest diz que ele aparece
native criar outro icone semantico para a mesma key
BottomTabBar decidir sozinho quais telas existem
Header hardcodar rotas que ja existem no navigation
```

Regra curta:

```text
navigation define a intencao
manifest define a ativacao/placement
locale define a copy
Foundation/AppShell define a casca visual
web/native so apresentam
```

## Tree Alvo

```text
frontend/
  foundation/
    -> Design System puro
    -> codigo, componentes, resolvers, runtime visual web e bridges native-ready

  shared-core/
    -> contratos globais
    -> tipos globais
    -> helpers comuns
    -> manifest base da aplicacao

  client/
    shared-core/
      -> fluxo reutilizavel do cliente
      -> manifest client

    web/
      -> render-app client atual
      -> sera mantida agora e revisada depois

    mobile/
      -> nascera depois
      -> deve nascer ja consumindo foundation + client shared-core

  admin/
    shared-core/
      -> fluxo reutilizavel do admin
      -> manifest admin como override da base

    web/
      -> render-app admin atual
      -> sera mantida agora e revisada depois
```

## Foundation

Pasta:

```text
frontend/foundation
```

Responsabilidade:

```text
Design System
tokens resolver
CSS variables
semi-composed recipes
UI primitives
AppShell generico
bridges native-ready
```

Foundation e codigo visual reutilizavel. Ela nao deve carregar manifest de
produto como fonte final de verdade.

Foundation pode receber manifest/tokens para resolver visual, mas nao deve ser
dona de:

```text
copy
rota
navegacao de produto
mock de negocio
regra de negocio
pedido
assinatura
cliente
admin
```

Componentes V1 importantes:

```text
Layout
  Container
  Grid
  GridItem
  Stack
  Inline

Surface
Text
Icon
AppIcons
Button
Card
Badge
Field
Input
Select
EmptyState
```

Regra:

```text
Button usa Surface/Text/Icon
Card usa Surface
Text usa tokens de tipografia
Icon usa intencao semantica
Layout usa tokens de layout/spacing
```

## Shared-Core Global

Pasta:

```text
frontend/shared-core
```

Os tres shared-cores devem seguir a mesma gramatica de pasta:

```text
api/
contracts/
hooks/
kits/
locales/
manifest/
mappers/
mocks/
navigation/
types/
view-models/
```

Referencia detalhada: `docs/architecture/SHARED_CORE_TREE_STANDARD.md` e
`docs/architecture/MANIFEST_DESIGN_SYSTEM_TREE.md`.

Responsabilidade atual/alvo:

```text
contracts/
types/
api/
mappers/
manifest/
```

Tree alvo do manifest global:

```text
frontend/shared-core/manifest/
  index.ts
  assets.ts
  mock.ts

  theme/
    index.ts
    tokens.ts
    colors.ts
    typography.ts
    spacing.ts
    sizing.ts
    radius.ts
    border.ts
    elevation.ts
    blur.ts
    layout.ts
    breakpoints.ts
    motion.ts

  design-system/
    index.ts
    defaults.ts
    surface.ts
    text.ts
    icon.ts
    button.ts
    card.ts
    field.ts
    input.ts
    select.ts
    empty-state.ts
```

O manifest global nao deve virar uma pasta de regra de negocio.

Permitido:

```text
tokens base
tema base
assets comuns
defaults visuais comuns
mock/dev comum e explicito
contratos de manifest
```

Nao permitido:

```text
endpoint client/admin
hook React
view-model de fluxo
regra de preco
regra de estoque
workflow de pedido
permissao real
copy especifica de tela
```

## Client Shared-Core

Pasta:

```text
frontend/client/shared-core
```

Responsabilidade:

```text
contratos client
api client
mappers client
hooks client
view-models client
kits client
manifest client
```

Tree alvo:

```text
frontend/client/shared-core/
  contracts/
  api/
  mappers/
  hooks/
  view-models/
  kits/

  manifest/
    index.ts
    theme.ts
    routes.ts
    navigation.ts
    app-shell.config.ts

    locales/
      pt-BR.ts
      en-US.ts
      de-DE.ts

    mocks/
      index.ts
      catalog/
      customer/
      orders/
      subscriptions/
      deliveries/

    screens/
      index.ts

    pages/
      home.config.ts
      landing.config.ts
      portal.config.ts
```

Regra:

```text
client manifest importa/herda frontend/shared-core/manifest
client manifest declara apenas o que e especifico do cliente
client render-app consome client manifest
```

Client nao deve sobrescrever tema global sem motivo real.

## Admin Shared-Core

Pasta:

```text
frontend/admin/shared-core
```

Responsabilidade:

```text
contratos admin
api admin
mappers admin
hooks admin
view-models admin
kits admin
manifest admin
```

Tree alvo:

```text
frontend/admin/shared-core/
  contracts/
  api/
  mappers/
  hooks/
  view-models/
  kits/

  manifest/
    index.ts
    theme.override.ts
    routes.ts
    navigation.ts
    app-shell.config.ts

    locales/
      pt-BR.ts
      en-US.ts
      de-DE.ts

    mocks/
      index.ts
      dashboard/
      users/
      catalog/
      orders/
      subscriptions/
      inventory/
      deliveries/

    screens/
      index.ts

    pages/
      dashboard.config.ts
      produtos.config.ts
      pedidos.config.ts
      deliveries.config.ts
      assinaturas.config.ts
      usuarios.config.ts
      settings.config.ts
```

Admin deve herdar a base global e sobrescrever somente o necessario:

```text
cores operacionais especificas
density de dashboard/tabela
rotas admin
navegacao admin
screen configs admin
labels/admin locales
mocks admin
```

Admin nao deve criar um design system paralelo.

## Render-Apps

Render-apps atuais:

```text
frontend/client/web
frontend/admin/web
```

Regra:

```text
render-app usa foundation
render-app usa manifest do seu shared-core
render-app usa hooks/view-models do seu shared-core
render-app usa locales do seu manifest
render-app nao decide regra
```

Client web pode continuar como esta por enquanto, mas sera classificado como
render-app hardcoded em transicao.

Admin web tambem pode continuar como esta por enquanto, mas sera classificado
como render-app hardcoded em transicao.

Essa permissao vale somente para:

```text
frontend/client/web
frontend/admin/web
```

Nao vale para:

```text
frontend/foundation
frontend/shared-core
frontend/client/shared-core
frontend/admin/shared-core
```

Essas camadas externas devem evoluir com a mesma disciplina dos Kits 01-06:

```text
contrato claro
ownership claro
manifest claro
sem regra duplicada
sem UI hardcoded
sem mock direto em tela futura
```

## Legacy

Pastas atuais:

```text
frontend/client/web/src/legacy/app-shell
frontend/client/web/src/legacy/design-system
```

Decisao:

```text
legacy pode ser excluido no futuro
legacy nao deve crescer
legacy nao deve receber capacidade nova
legacy existe apenas para manter telas antigas renderizando
```

Nao apagar agora sem mapa de imports.

Fluxo correto:

```text
1. congelar legacy
2. criar/alinhar Foundation V1
3. migrar tela por tela para Foundation
4. quando nao houver imports, excluir legacy
```

## Rotas E Telas Atuais

As rotas e telas atuais do client web ainda estao misturadas com a arquitetura
antiga.

Rotas atuais importantes:

```text
frontend/client/web/src/app/page.tsx
frontend/client/web/src/app/hero/page.tsx
frontend/client/web/src/app/library/page.tsx

frontend/client/web/src/app/(portal)/home/page.tsx
frontend/client/web/src/app/(portal)/cortes/page.tsx
frontend/client/web/src/app/(portal)/produtos/page.tsx
frontend/client/web/src/app/(portal)/royal-delivery/page.tsx
frontend/client/web/src/app/(portal)/meus-pedidos/page.tsx
frontend/client/web/src/app/(portal)/minha-conta/page.tsx
frontend/client/web/src/app/(portal)/minha-caixa/page.tsx
frontend/client/web/src/app/(portal)/minha-assinatura/page.tsx
frontend/client/web/src/app/(portal)/meu-clube/page.tsx

frontend/client/web/src/app/(portal)/portal-home/page.tsx
frontend/client/web/src/app/(portal)/portal-cortes/page.tsx
frontend/client/web/src/app/(portal)/portal-minha-caixa/page.tsx
frontend/client/web/src/app/(portal)/portal-minha-conta/page.tsx
```

Telas atuais importantes:

```text
frontend/client/web/src/screens/portal/PortalView.tsx
frontend/client/web/src/screens/portal/NovoPortalHomeView.tsx
frontend/client/web/src/screens/portal/screenTypes/*
frontend/client/web/src/screens/portal/tabs/CortesView.tsx
frontend/client/web/src/screens/portal/tabs/HomeView.tsx
frontend/client/web/src/screens/portal/tabs/HomeOrientationView.tsx
frontend/client/web/src/screens/portal/tabs/PedidoView.tsx
frontend/client/web/src/screens/portal/tabs/MeuClubeView.tsx
frontend/client/web/src/screens/portal/tabs/MeusPedidosView.tsx
frontend/client/web/src/screens/portal/tabs/MinhaCaixaView.tsx
frontend/client/web/src/screens/portal/tabs/MinhaContaView.tsx
```

Decisao:

```text
manter por enquanto
nao tratar como arquitetura final
nao adicionar regra nova nelas
nao adicionar novo design system local nelas
fazer refresh futuro com Foundation + manifest + shared-core
```

## Admin Screens Atuais

Admin atual:

```text
frontend/admin/web/src/App.tsx
frontend/admin/web/src/engines/rendering/screen-types/dashboard/DashboardPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/history/HistoryPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/settings/SettingsPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/pages/ListPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/pages/DetailPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/pages/AddPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/trash/TrashPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/config/types.ts
```

Decisao:

```text
manter por enquanto
usar como base transitoria
revisar hardcoded depois
fazer admin herdar manifest global + overrides admin
nao criar design system admin paralelo
```

## Ordem Do Roadmap

### Marco 1 - Documentar Tree

```text
1. registrar tree atual
2. registrar tree alvo
3. registrar heranca global/client/admin de manifest
4. registrar legacy como congelado
5. registrar render-apps atuais como transicao
```

### Marco 2 - Preparar Manifest Global

Status: implementado no primeiro corte.

```text
frontend/shared-core/manifest/theme/*
frontend/shared-core/manifest/semi-composed/*
frontend/shared-core/manifest/ui/*
frontend/shared-core/manifest/capabilities/*
frontend/shared-core/manifest/assets.ts
frontend/shared-core/manifest/mock.ts
```

Objetivo:

```text
tokens e defaults globais existem antes da Foundation depender deles
```

Este marco faz parte da refatoracao oficial fora das render-apps. Nao deve ser
tratado como remendo temporario de `client/web` ou `admin/web`.

### Marco 3 - Preparar Overrides Client/Admin

Status: implementado no primeiro corte para tema e defaults visuais.

Client:

```text
frontend/client/shared-core/manifest/theme.manifest.js
frontend/client/shared-core/manifest/ui.manifest.ts
```

Fora do render-app, o caminho oficial e `frontend/client/shared-core/manifest`.

Admin:

```text
frontend/admin/shared-core/manifest/theme.manifest.js
frontend/admin/shared-core/manifest/ui.manifest.ts
```

Fora do render-app, o caminho oficial e `frontend/admin/shared-core/manifest`.

Objetivo:

```text
client herda global e declara diferencas client
admin herda global e declara overrides admin
```

Assim como os Kits 01-06, os manifest de client/admin devem ficar limpos antes
do refresh das telas.

### Marco 4 - Foundation V1

Status: primeiro corte implementado.

```text
Layout
Surface
Text
Icon
Button
Card
UiProvider
AppShell
```

Ainda ficam para outro corte:

```text
AppIcons formal
Badge
Field/Input/Select
EmptyState
product-components
```

AppShell, quando entrar, fica em:

```text
frontend/foundation/shells/app-shell/
  foundation/
  web/
  native/
```

Ele nasceu como runtime visual generico. O subdiretorio `foundation/` guarda
tipos, contrato e resolucao de modelo visual. O subdiretorio `web/` guarda o
runtime React web: Header, Drawer, Sidebar, BottomTabBar, Footer e content
wrapper.
O subdiretorio `native/` guarda o resolver native-ready para o app mobile
futuro consumir a mesma navigation/config/locales sem recriar contrato.

A ponte geral de UI/semi-composed para native fica em:

```text
frontend/foundation/native/
```

Ela registra primitives e familias de recipes disponiveis para o runtime
React Native futuro. Nao e um app mobile e nao importa React Native neste corte.

Status atual:

```text
frontend/foundation/shells/app-shell
frontend/client/web/src/transitional/app-shell ainda existe para compatibilidade
frontend/admin/web/src/transitional/app-shell ainda existe para compatibilidade
```

Rotas, navegacao, slots, labels e ativacao ficam nos manifest de
`client/shared-core` e `admin/shared-core`. Os AppShells antigos de
`transitional` continuam congelados ate nao haver imports.

Objetivo:

```text
render-app nao precisa mais criar estilo local novo
legacy para de crescer
```

### Marco 5 - Congelar E Mapear Legacy

```text
listar imports de legacy
definir tela dona de cada import
definir substituto Foundation
nao apagar ainda
```

### Marco 6 - Refresh Das Render-Apps

Ordem sugerida:

```text
1. normalizar rotas oficiais client
2. refresh client portal por fluxo
3. refresh client landing se necessario
4. criar client mobile ja na arquitetura nova
5. refresh admin screen-types
```

### Marco 7 - Product Components

Depois da Foundation V1:

Ownership alvo futuro:

```text
frontend/foundation/product-components/
  ecommerce/
  subscriptions/
  orders/
  delivery/
  metrics/
```

```text
ProductItemCard
PlanBenefitCard
OrderSummaryCard
DeliveryTracker
MetricKpiCard
```

Regra:

```text
product component recebe props/view-model
product component nao decide regra real
visual fino vem da Foundation
opcoes funcionais podem vir de manifest
```

Regra de criacao:

```text
so criar em foundation/product-components quando houver extracao real
nao criar componente de produto hardcoded antecipado
nao colocar regra RoyalPrime dentro do componente
nao colocar fetch, mock de negocio, preco, estoque ou permissao real
```

Relacao com Kits:

```text
docs/kits
  -> mapa de capacidade e contrato

frontend/client/shared-core/kits
frontend/admin/shared-core/kits
  -> view-models, hooks, adapters e contratos por fluxo

frontend/foundation/product-components
  -> runtime visual generico por dominio
```

O Kit nao deve virar uma tree paralela de runtime visual. Ele documenta o uso e
aponta para o componente generico de Foundation quando esse componente ja tiver
base real de extracao.

Status atual:

```text
frontend/client/web/src/transitional/product-components/
frontend/admin/web/src/transitional/product-components/
frontend/client/web/src/product-components/
```

Product components existentes ficam no render-app enquanto forem hardcoded,
antecipados ou dependentes de tela. Eles so entram em Foundation depois de uma
extracao real e com contrato limpo.

## Ordem Antes De Codar Tela

Antes de voltar para `MeusPedidosView` ou qualquer outra tela:

```text
1. fechar esta tree alvo
2. decidir estrutura final de manifest/
3. criar manifest global base
4. criar overrides client/admin
5. garantir Foundation V1 minima
6. mapear legacy imports
7. so entao fazer refresh/migracao de tela
```

## Fronteira De Refatoracao

Regra:

```text
render-apps podem continuar hardcoded ate o refresh
camadas externas as render-apps devem ser refatoradas agora
```

Camadas externas:

```text
frontend/foundation
frontend/shared-core
frontend/client/shared-core
frontend/admin/shared-core
```

Essas camadas sao a base que as telas vao consumir depois. Por isso precisam
estar corretas antes do refresh de `client/web` e `admin/web`.

Analogia com o trabalho atual:

```text
Kits 01-06 ja organizaram shared-core por fluxo
agora a base visual/manifest deve seguir a mesma disciplina
depois as render-apps antigas sao refeitas por cima dessa base
```

## Regra Final

```text
frontend/shared-core/manifest e a base
client consome a base e declara o que e client
admin consome a base e sobrescreve so o que muda
foundation e codigo visual puro
client/web e admin/web sao render-apps hardcoded em transicao
fora das render-apps, refatorar agora com ownership limpo
legacy fica congelado ate poder morrer
```
