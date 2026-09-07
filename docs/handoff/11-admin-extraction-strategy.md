# 11 - Admin Extraction Strategy

> Status: referencia ou registro de estado; nao e contrato ativo.
> Regras e leitura por tarefa: [CODEX_ENTRYPOINTS.md](../../docs/CODEX_ENTRYPOINTS.md).
> Trees, exemplos, proximos passos e instrucoes antigas abaixo devem ser
> confrontados com os contratos ativos e o codigo; nao autorizam excecoes.

Objetivo:

```text
preparar a extracao do Admin sem abrir refactor infinito e sem misturar com o
client.
```

Este documento e o ponto de partida para um chat focado apenas em Admin.

## Sintonia Do Corte

```text
Este chat:
  -> admin/web
  -> admin/shared-core
  -> screen types
  -> manifest/pages
  -> admin locales
  -> admin kits

Outro chat:
  -> client/web
  -> client/mobile
  -> portal
  -> webIsMobile == native behavior
```

Regra:

```text
nao misturar migracao de client com migracao de admin no mesmo corte.
```

## Regras Sintetizadas

### 1. Backend Decide

```text
backend
  -> permissao
  -> status permitido
  -> transicao de pedido/entrega
  -> calculo
  -> estoque
  -> persistencia
  -> auditoria
```

Admin nao decide workflow. Admin dispara comando.

### 2. Admin Shared-Core Organiza

```text
frontend/admin/shared-core
  -> contracts
  -> api
  -> hooks
  -> mappers
  -> view-models
  -> manifest
  -> locales
  -> mocks/fallback temporario
  -> kits
```

Regra curta:

```text
admin screen -> admin hook -> admin api -> backend
```

### 3. Admin Web Renderiza

```text
frontend/admin/web
  -> App
  -> consumo do AppShell Foundation com manifest da surface (sem casca local)
  -> screen types
  -> pages
  -> modais
  -> formularios
  -> tabelas
```

Admin web pode ter estado visual local:

```text
modal aberto
linha selecionada
input digitado
aba ativa
loading visual
erro visual
```

Admin web nao pode:

```text
chamar fetch direto para fluxo reutilizavel
importar mock direto quando ja existe hook
decidir status/tone por if no componente
calcular regra de estoque
validar transicao de pedido
duplicar permissao do backend
criar copy nova hardcoded
usar emoji de UI
criar design system paralelo
```

### 4. Foundation Primeiro

Admin deve usar Foundation quando a capacidade visual ja existe:

```text
Button
Card
Surface
Text
Input
TextArea
Select
DropdownPicker
SegmentedControl
Badge
Divider
Modal
EmptyState
Layout
Icon/AppIcons
AppShell
```

Se faltar algo:

```text
1. provar uso real no admin
2. verificar se client tambem precisa
3. propor capacidade Foundation/ServiceOS
4. pedir aprovacao antes de criar primitive ou engine compartilhada
```

### 5. Manifest E Locales Antes De JSX

Nova copy de Admin deve nascer em:

```text
frontend/admin/shared-core/locales/pt-BR.ts
```

Nova configuracao editavel/repetida deve nascer em:

```text
frontend/admin/shared-core/manifest/pages/*.config.jsx
frontend/admin/shared-core/manifest/adminAppShell.config.jsx
frontend/admin/shared-core/navigation/admin.navigation.ts
```

Exemplos:

```text
title
subtitle
table columns
filters
actions
empty states
status label
status tone
badge config
widget labels
detail sections
form fields
```

## Ordem Recomendada

### Corte 1 - DashboardPage

Antes do DashboardPage, fechar a casca Admin:

```text
adminAppShell.config.jsx
  -> declara sidebar desktop
  -> declara bottomTabBar mobile
  -> declara nativeTabBar herdando mobile
  -> declara navigationPlacements
  -> declara layout.viewports

admin/web/src/App.tsx
  -> importa AppShell de @foundation/shells/app-shell
  -> passa adminAppShellConfig, adminNavigation, adminRoutes e activePath
  -> nao importa app-shell transicional
  -> nao implementa SidebarMenu ou BottomTabBar local
```

Regra:

```text
Admin nao implementa AppShell.
Admin declara manifest e consome AppShell da Foundation.
```

Arquivos:

```text
frontend/admin/web/src/engines/rendering/screen-types/dashboard/DashboardPage.tsx
frontend/admin/shared-core/manifest/pages/dashboard.config.jsx
frontend/admin/shared-core/locales/pt-BR.ts
frontend/admin/shared-core/view-models/
```

Meta:

```text
DashboardPage renderiza widgets, listas e badges ja preparados.
Status label/tone/icon nao ficam no TSX.
Copy nova vem de locale.
Config repetida vem do manifest.
```

### Corte 2 - Standard Screen Types

Arquivos:

```text
frontend/admin/web/src/engines/rendering/screen-types/standard/pages/ListPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/pages/DetailPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/pages/AddPage.tsx
frontend/admin/shared-core/manifest/pages/*.config.jsx
```

Meta:

```text
ListPage, DetailPage e AddPage recebem columns, filters, actions, detail
sections e fields do manifest/view-model.
```

### Corte 3 - Kits Operacionais Prioritarios

Prioridade:

```text
1. dashboard
2. orders
3. deliveries
4. inventory
5. catalog
6. subscriptions
7. customers
8. users
```

Para cada kit:

```text
1. conferir endpoint real em backend/API_CONTRACTS.md
2. conferir api client admin
3. conferir hook admin
4. conferir mapper
5. conferir view-model
6. conferir manifest/page config
7. ligar screen type sem regra local
```

## Criterio De Pronto

```text
DashboardPage nao decide status localmente
ListPage nao conhece regra de dominio
DetailPage nao calcula workflow
AddPage nao hardcoda copy nova
screen types usam Foundation
admin pages usam admin/shared-core
copy nova esta em locale
config esta em manifest
nenhum emoji de UI foi adicionado
npm run build:admin passa
git diff --check passa
```

## Nao Fazer Neste Corte

```text
nao converter admin para Next agora
nao mexer em client/mobile
nao criar builder novo
nao criar design system admin paralelo
nao promover nada para frontend/shared-core global sem prova
nao implementar gateway
nao implementar scheduling avancado
nao trocar toda a UI por polimento visual
```

## Frase Guia

```text
Admin e operacao. Shared-core prepara o estado operacional. Screen type so
apresenta, filtra visualmente e dispara a acao.
```
