# Next Steps

> Status: referencia ou registro de estado; nao e contrato ativo.
> Regras e leitura por tarefa: [CODEX_ENTRYPOINTS.md](../../docs/CODEX_ENTRYPOINTS.md).
> Trees, exemplos, proximos passos e instrucoes antigas abaixo devem ser
> confrontados com os contratos ativos e o codigo; nao autorizam excecoes.

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

## Regra De Fases Para Telas

A sequencia atual das telas deve priorizar entrega funcional antes de
refinamento visual fino.

```text
Fase 1 - funcional e arquitetural
  -> mostrar os dados essenciais
  -> permitir as acoes essenciais
  -> conectar hook/view-model/API/backend ou fallback mockado explicito
  -> separar regra de negocio da screen
  -> mover copy para locale e configuracao repetida para manifest
  -> organizar componentes reutilizaveis na tree correta
  -> manter design apresentavel usando Foundation/AppShell existentes

Fase 2 - refinamento visual
  -> polir espacamento fino, borda, animacao, composicao e densidade
  -> melhorar hierarquia visual depois que o fluxo estiver separado
  -> ajustar variantes visuais globais quando houver repeticao real
```

Na pratica, nao bloquear uma tela funcional por detalhe estetico pequeno se ela
ja esta apresentavel e segue Foundation. O corte deve primeiro deixar a tela
editavel, conectavel e facil de evoluir.

## Roadmap Padrao Por Tela

Toda tela funcional deve seguir o mesmo roteiro antes de receber polimento
visual fino.

```text
Passo 1 - Layout/config
  -> verificar se a tela respeita AppShell, Layout e config.jsx/manifest
  -> identificar maxWidth, padding, grids, media queries e shell local

Passo 2 - Locales/strings
  -> mover copy de interface para locales/strings
  -> manter dados comerciais como dados, mock ou seed

Passo 3 - Mapa de componentes
  -> listar blocos que podem virar component local, product-component ou UI
  -> separar componente visual de regra funcional

Passo 4 - Proposta de extracao
  -> escrever quais itens seriam extraidos e para qual pasta
  -> nao mover nem criar componente reutilizavel ainda

Pausa obrigatoria
  -> perguntar no chat se a extracao proposta faz sentido
  -> continuar somente depois da aprovacao do usuario

Passo 5 - Extrair itens aprovados
  -> mover para a pasta especifica aprovada
  -> manter imports e ownership claros

Passo 6 - Avaliar UI nova
  -> verificar se falta uma primitive/capacidade generica
  -> se for necessidade repetivel, propor Foundation/ServiceOS

Passo 7 - Criar UI somente se aprovado
  -> criar ou amadurecer UI apenas quando o Passo 6 justificar
  -> nao criar biblioteca paralela local

Passo 8 - Aplicar design-system corretamente
  -> usar UI, semi-composed, theme, AppShell e product-components
  -> remover hardcode visual novo fora do render-app

Passo 9 - Audit geral
  -> conferir render-only, locale, manifest, backend/fallback e builds
  -> registrar pendencias da Fase 2 visual
```

Entre os Passos 4 e 5, a resposta deve parar no plano de extracao e pedir
aprovacao. Isso evita mover componentes cedo demais ou criar UI nova sem
evidencia real de reuso.

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

Sidebar e Drawer podem agrupar itens com:

```text
groupKey
groupLabelKey
groupOrder
navigationGroups no appshell.config
```

O resolver comum do AppShell deve gerar `sidebarGroups` e `drawerGroups`.
BottomTabBar e NativeTabBar continuam planos, consumindo as mesmas intencoes de
navegacao por placement.

Regra curta:

```text
nao criar uma navegacao para desktop e outra para mobile/native
criar uma navegacao semantica e mudar apenas a apresentacao por placement
```

## Regra De Layout V1

O AppShell agora deve ser o primeiro consumidor do contrato de Layout. A
configuracao nasce em `appShell.config.jsx` por viewport:

```text
layout.viewports.desktop
layout.viewports.mobile
layout.viewports.native
```

Cada viewport declara somente intencao:

```text
content/header/footer/bottomTabBar
  -> width
  -> gutter
  -> align
  -> enabled quando a regiao existir
```

Semantica de largura:

```text
compact      -> span menor para leitura
comfortable  -> span intermediario
wide         -> span amplo
full         -> span completo da matriz do viewport
```

No desktop, `full` deve corresponder as 20 colunas da matriz, preservando o
gutter externo quando `gutter: "page"` estiver ativo. Isso e diferente de
remover toda delimitacao: o elemento fica full pela malha, nao por CSS solto.

O native pode herdar do mobile com:

```text
native.inheritFrom: "mobile"
```

As telas do portal devem migrar aos poucos para `Container`, `Grid`,
`GridItem`, `Stack`, `Inline`, `Flex` e `Box`, evitando novos `maxWidth`,
`padding`, `gridTemplateColumns` e media queries locais quando a decisao puder
vir do manifest/layout.

## Regra Web Mobile E Native Juntos

Depois do primeiro pass responsivo de uma tela web funcional, o proximo corte
da mesma tela deve considerar native junto. O objetivo nao e criar uma
experiencia paralela: `webIsMobile` e o espelho funcional do futuro native.

Regra obrigatoria:

```text
webIsMobile == native behavior
```

Na pratica, cada tela funcional do cliente deve andar assim:

```text
1. web desktop render-only
2. web mobile responsivo usando os mesmos hooks/view-models/actions
3. native screen usando o mesmo contrato de dados e comportamento do web mobile
```

O native pode mudar somente a camada de render:

```text
web mobile -> DOM/CSS/Foundation web
native     -> React Native/native bridge equivalente
```

Nao permitido:

```text
web mobile chamar endpoint diferente do native
web mobile ter estado/copy/action que native nao consiga reproduzir
native recriar regra de negocio que ja esta no hook/view-model client
native virar uma tela conceitualmente diferente da web mobile
```

Para a sequencia atual do portal, a decisao operacional e:

```text
fechar o responsivo web uma vez
seguir para native da mesma tela funcional
so depois abrir a proxima tela grande
```

## Regra Tree Mobile Igual A Web

O mobile deve nascer com a mesma linguagem publica do web. A pasta define a
plataforma; o nome do componente continua igual.

```text
web Button -> mobile Button
web Text -> mobile Text
web Surface -> mobile Surface
web Layout -> mobile Layout
web Icon -> mobile Icon
web AppShell -> mobile AppShell
web ProductItemCard -> mobile ProductItemCard
```

Nao usar prefixos como `NativeButton`, `NativeText`, `NativeSurface`,
`NativeProductItemCard` em componentes de UI/produto. Quando Expo/React Native
entrar, `View`, `Text`, `Pressable`, listas e inputs reais entram como hosts do
runtime ou adapters internos, nao como imports espalhados por telas de produto.

Toda navegacao, icone semantico e ativacao de Header/BottomTabBar/Drawer deve
continuar vindo de manifest/navigation. Exemplo: trocar `iconIntent` ou
`iconName` no manifest/navigation deve refletir web header, web bottom tabbar e
mobile AppShell sem editar cada runtime manualmente.

Tree minima atual do mobile:

```text
frontend/client/mobile/src/
  app/
  shell/
  ui/
  product-components/
  screens/
```

## Proximo Corte

```text
1. escolher uma tela funcional do client/web ou admin/web
2. executar os Passos 1-4 do Roadmap Padrao Por Tela
3. pausar e pedir aprovacao para extracoes/componentes/UI novos
4. executar Passos 5-9 somente depois da aprovacao
5. fechar responsivo web mobile da tela quando ela for client
6. preparar ou implementar native usando o mesmo contrato do webIsMobile
7. validar build client/admin e contratos Foundation
```

## Ordem Recomendada

```text
1. client/web: MontarBox/PedidoView em Fase 1 funcional
2. client/web: MeusPedidosView + OrderDetailModal em Fase 1 funcional
3. client/web: MinhaCaixaView em Fase 1 funcional
4. client/web: MeuClubeView em Fase 1 funcional
5. admin/web: DashboardPage em Fase 1 funcional
6. admin/web: ListPage/DetailPage/AddPage por screen type
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
