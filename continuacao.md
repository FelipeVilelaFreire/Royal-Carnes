# Continuacao RoyalPrime

## Contexto

Este arquivo e o ponto de entrada rapido para o proximo chat continuar o
trabalho atual no RoyalPrime.

Leia tambem, nesta ordem, os arquivos obrigatorios do projeto:

```text
ROYALPRIME_CODEX_RULES.md
ROYALPRIME_ARCHITECTURE_CONTRACT.md
docs/CODEX_ENTRYPOINTS.md
backend/README.md
backend/ROADMAP.md
backend/ARCHITECTURE.md
docs/frontend/TREE.md
docs/frontend/RENDER_ONLY_AUDIT.md
docs/kits/README.md
frontend/client/web/docs/ROYALPRIME_TO_SERVICEOS_ECOMMERCE_DEPARA.md
```

## Estado Atual

RoyalPrime esta seguindo esta direcao:

```text
backend
  -> regra real, persistencia, validacao, autorizacao, calculo e auditoria

shared-core do escopo correto
  -> contratos, DTOs, API clients, hooks, mappers, view-models, manifest,
     navigation, locales e mocks temporarios

foundation
  -> design system, tokens, semi-composed, primitives visuais, AppShell e
     bridges native-ready

client/web e admin/web
  -> render-only, compondo telas com Foundation + shared-core
```

Regra curta:

```text
regra mora no backend
fluxo reutilizavel mora no shared-core correto
tela apresenta e dispara acao
foundation nao conhece regra de produto
```

## Foundation

Foi criado o corte atual da Foundation:

```text
frontend/foundation/
  tokens/
  semi-composed/
  ui/
  native/
  shells/
    app-shell/
      foundation/
      web/
      native/
```

Responsabilidade:

```text
foundation/ui
  -> primitives visuais web atuais

foundation/semi-composed
  -> recipes visuais reutilizaveis

foundation/native
  -> bridge native-ready de primitives e semi-composed

foundation/shells/app-shell/foundation
  -> contrato, tipos, resolver e modelo visual comum

foundation/shells/app-shell/web
  -> runtime React web: Header, Drawer, Sidebar, BottomTabBar, Footer e content

foundation/shells/app-shell/native
  -> resolver native-ready para app mobile futuro
```

Native aqui significa `native-ready`, nao app mobile pronto. Ainda nao existe:

```text
frontend/client/native
frontend/client/mobile
```

Quando existir, ele deve consumir os mesmos manifests, locales e navigation do
client shared-core.

## AppShell

Novo AppShell oficial:

```text
@foundation/shells/app-shell
```

Entrypoints importantes:

```text
frontend/foundation/shells/app-shell/index.ts
frontend/foundation/shells/app-shell/foundation/index.ts
frontend/foundation/shells/app-shell/web/index.ts
frontend/foundation/shells/app-shell/native/index.ts
```

O AppShell nao decide:

```text
rota real
permissao real
copy de produto
navegacao hardcoded
regra de cliente/admin
estado de pedido/assinatura
```

O AppShell recebe:

```text
navigation declarativa
routesMap
strings/locales
theme/config
slots
callbacks de navegacao
```

## Navigation Web E Native

A mesma navigation deve alimentar:

```text
Header desktop
Drawer
BottomTabBar do web mobile
NativeTabBar futuro
Footer quando houver
```

Contrato esperado por item:

```text
key
labelKey ou label
iconIntent ou iconName
routeKey ou routePath
order
auth
placements
```

Placements:

```text
header
sidebar
drawer
bottomTabBar
nativeTabBar
footer
```

Nao criar navegacao separada para desktop, mobile web e native. O que muda e a
apresentacao, nao a intencao.

## Manifests

Caminho correto e singular:

```text
manifest/
```

Nao usar/ressuscitar:

```text
manifests/
```

Client:

```text
frontend/client/shared-core/manifest/
```

Admin:

```text
frontend/admin/shared-core/manifest/
```

Global:

```text
frontend/shared-core/manifest/
```

## Config E Locales

Nova UI/copy/config deve tentar nascer primeiro em:

```text
manifest
config.jsx/config.ts
navigation
locales/strings
view-model
```

Hardcode temporario so dentro de:

```text
frontend/client/web
frontend/admin/web
```

Mesmo assim, nao criar novo design system local e nao crescer `legacy`.

## Estado De Qualidade

Nota atual da Foundation: 9/10.

Motivo:

```text
tokens, semi-composed, UI primitives e AppShell estao organizados
AppShell esta separado em foundation/web/native
native-ready existe sem criar app mobile prematuro
manifest/navigation/locales estao conectados
existe verificador automatico de contrato
build client/admin passou
```

Ainda nao e 10/10 absoluto porque falta provar em uso real:

```text
migrar mais telas antigas para Foundation
reduzir imports de legacy/app-shell
criar runtime React Native real quando existir app native/mobile
```

## Validacoes

Comandos usados e esperados:

```text
npm run verify:foundation
npm run build:client
npm run build:admin
git diff --check
```

Ultimo estado validado:

```text
npm run verify:foundation -> passou, 38 checks
npm run build:client      -> passou
npm run build:admin       -> passou
git diff --check          -> passou, apenas warnings LF/CRLF do Windows
```

## Proximo Corte Recomendado

Continuar pelas telas render-only usando a Foundation nova.

Ordem sugerida:

```text
1. client/web: MeusPedidosView + OrderDetailModal
2. client/web: MinhaCaixaView
3. client/web: MeuClubeView
4. admin/web: DashboardPage
5. admin/web: ListPage/DetailPage/AddPage por screen type
```

Regra para cada tela:

```text
screen
  -> shared-core hook
  -> shared-core API client
  -> backend
  -> view-model
  -> Foundation UI/AppShell
```

Nao fazer tela nova importando:

```text
legacy/app-shell
legacy/design-system
mock direto quando ja existe hook
api direto quando ja existe shared-core client
texto novo hardcoded quando pode ir para locale/config
```

## Arquivos Chave Criados/Alterados

```text
frontend/foundation/shells/app-shell/
frontend/foundation/native/
frontend/foundation/docs/NATIVE.md
scripts/verify-foundation-contract.mjs
package.json
docs/architecture/DESIGN_SYSTEM_V1_TREE.md
docs/architecture/FRONTEND_TARGET_TREE_ROADMAP.md
docs/architecture/NEXT_STEPS.md
frontend/client/shared-core/navigation/client.navigation.ts
frontend/admin/shared-core/navigation/admin.navigation.ts
frontend/client/shared-core/manifest/portal/appshell.config.jsx
frontend/client/shared-core/manifest/landing/appshell.config.jsx
frontend/admin/shared-core/manifest/adminAppShell.config.jsx
```

## Observacao Sobre Worktree

O worktree estava sujo antes do commit atual. Nao assumir que toda mudanca do
commit nasceu no ultimo corte; varias mudancas de docs, manifest singular,
Foundation primitives e render-only ja estavam acumuladas no trabalho em curso.

O usuario pediu explicitamente para fazer:

```text
git add .
git commit
git push
```
