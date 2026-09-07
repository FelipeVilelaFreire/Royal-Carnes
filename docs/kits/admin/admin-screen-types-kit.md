# Admin Screen Types Kit

Status:

```text
planned -> local foundation em andamento
```

## O Que Este Kit Faz

Define como o Admin renderiza telas reutilizaveis sem criar uma tela artesanal
para cada recurso.

Screen types principais:

```text
DashboardPage
ListPage
DetailPage
AddPage
HistoryPage
SettingsPage
TrashPage
```

## Dono De Cada Parte

```text
manifest/pages/*.config.jsx
  -> titulo, subtitulo, colunas, filtros, acoes, secoes e campos

locales/pt-BR.ts
  -> copy de UI

view-models/*.view-model.ts
  -> linhas, cards, badges, status label/tone/icon, detalhes prontos

hooks/useAdmin*.ts
  -> data/loading/error/actions

screen-types/*.tsx
  -> renderizacao com Foundation
```

## Nao Pode

```text
screen type decidir workflow
screen type calcular regra de dominio
screen type chamar endpoint direto
screen type importar mock direto quando existe hook
screen type criar copy nova hardcoded
screen type usar emoji de UI
```

## Primeiro Corte

```text
DashboardPage
  -> remover status/tone/icon hardcoded do TSX
  -> preparar via manifest/view-model
  -> manter visual equivalente
  -> validar npm run build:admin
```

