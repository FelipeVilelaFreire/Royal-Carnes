# Admin Operations Kit

Status:

```text
planned -> local foundation em andamento
```

## Objetivo

Documentar a fronteira reutilizavel do Admin operacional do RoyalPrime.

O Admin Operations Kit nao e uma tela. Ele e o conjunto de padroes para uma
equipe operar pedidos, entregas, estoque, catalogo, assinaturas, clientes e
usuarios sem colocar regra de negocio no render.

## O Que Este Kit Faz

```text
define como o admin trabalha
amarra screen types com manifest/view-model
evita regra de negocio em TSX
organiza a ordem de extracao do admin
serve como indice operacional dos kits admin menores
```

## Escopo Backend

Fonte principal:

```text
backend/API_CONTRACTS.md
backend/apps/orders/
backend/apps/deliveries/
backend/apps/inventory/
backend/apps/catalog/
backend/apps/subscriptions/
backend/apps/customers/
backend/apps/accounts/
backend/apps/organizations/
```

Backend possui:

```text
permissoes por organization
endpoints admin
validacao de status
transicoes
estoque
pedidos
entregas
clientes
catalogo
assinaturas
auditoria futura
```

Regra:

```text
Admin nunca valida workflow de negocio como fonte final.
Admin envia comando; backend valida e persiste.
```

## Escopo Shared-Core Admin

Fonte:

```text
frontend/admin/shared-core/
```

Pastas:

```text
contracts/
api/
hooks/
mappers/
view-models/
manifest/
locales/
navigation/
mocks/
kits/
```

## Escopo Render

Fonte:

```text
frontend/admin/web/
```

Screen types prioritarios:

```text
src/engines/rendering/screen-types/dashboard/DashboardPage.tsx
src/engines/rendering/screen-types/standard/pages/ListPage.tsx
src/engines/rendering/screen-types/standard/pages/DetailPage.tsx
src/engines/rendering/screen-types/standard/pages/AddPage.tsx
```

Render pode possuir:

```text
layout
tabela
modal
formulario
estado visual
event handlers que chamam actions
```

Render nao deve possuir:

```text
regra de status
permissao real
calculo de estoque
fetch direto
mock direto quando existe hook
copy nova hardcoded
emoji de UI
design system paralelo
```

## Ordem Recomendada

```text
1. AppShell admin por manifest consumindo Foundation
2. DashboardPage
3. ListPage
4. DetailPage
5. AddPage
6. Orders
7. Deliveries
8. Inventory
9. Catalog
10. Subscriptions
11. Auth/Users/Customers
```

## AppShell Admin

O admin nao implementa SidebarMenu, BottomTabBar, Drawer ou Header local.

```text
frontend/admin/shared-core/manifest/adminAppShell.config.jsx
  -> liga sidebar no desktop
  -> liga bottomTabBar no mobile
  -> liga nativeTabBar por heranca do mobile
  -> define navigationPlacements
  -> define layout.viewports

frontend/admin/shared-core/navigation/admin.navigation.ts
  -> define itens, rotas, grupos, icones semanticos e placements

frontend/admin/web/src/App.tsx
  -> importa AppShell de @foundation/shells/app-shell
  -> injeta manifest/navigation/routes
  -> renderiza screen ativa
```

## Criterio Para Kit-Ready

```text
admin screen types usam Foundation
admin screen types consomem manifest/view-model/locales
hooks admin chamam api clients admin
api clients admin batem com backend/API_CONTRACTS.md
status/tone/icon nao ficam hardcoded no TSX
npm run build:admin passa
```
