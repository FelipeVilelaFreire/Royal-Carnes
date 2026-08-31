# Shared-Core Kits 01-06 Handoff

## Objetivo

Este documento e a entrada geral para qualquer IA ou desenvolvedor entender o
estado atual do RoyalPrime antes de criar telas.

O corte atual fechou os Kits 01-06 em shared-core, sempre a partir do backend
real publicado:

```text
Kit 01 Auth & Users
Kit 02 Catalog
Kit 03 Subscriptions
Kit 04 Inventory
Kit 05 Orders
Kit 06 Fulfillment & Delivery
```

Nao existe Kit 07 implementavel neste momento. Payments, Checkout, Wallet e
Vouchers continuam planejados ate nascer backend real.

## Regra Central

```text
backend
  -> regra real, banco, validacao, autorizacao, calculo, workflow e auditoria

frontend/shared-core
  -> tipos e contratos puros usados por mais de um escopo

frontend/client/shared-core
  -> API clients, mappers, hooks e view-models reutilizaveis do cliente

frontend/admin/shared-core
  -> API clients, mappers, hooks e view-models reutilizaveis do admin

frontend/client/web e frontend/admin/web
  -> render-only: mostram dados, coletam input e disparam actions
```

Regra curta:

```text
Tela nao chama endpoint direto.
Tela nao calcula regra de negocio.
Tela nao inventa workflow.
Tela nao hardcoda status como regra.
```

## Kits Fechados

| Kit | Backend | Global | Client shared-core | Admin shared-core | Tela conectada |
| --- | --- | --- | --- | --- | --- |
| 01 Auth & Users | real | minimo identity/auth | auth/session | auth/users/permissions | nao |
| 02 Catalog | real | catalog puro | catalog publico | catalog admin create/list/detail | nao |
| 03 Subscriptions | real | subscriptions puro | plans/me/current cycle | plans/subscriptions/cycles | nao |
| 04 Inventory | real | inventory puro | sem runtime | inventory admin | nao |
| 05 Orders | real | orders puro | config/me/create/detail | admin list/create/detail/transition | nao |
| 06 Delivery | real | deliveries puro | config/me/detail | admin list/create/detail/transition/confirm | nao |

## Documentos Principais

Leia nesta ordem:

```text
docs/architecture/OWNERSHIP_TREE.md
docs/architecture/BACKEND_RULES.md
docs/architecture/SHARED_CORE_RULES.md
docs/architecture/RENDER_APPS_RULES.md
docs/architecture/RENDER_APPS_TREE_ANALYSIS.md
docs/kits/README.md
docs/kits/SHARED_CORE_KITS_01_06_HANDOFF.md
docs/kits/PHASE_2_RENDER_ONLY_SCREEN_PLAN.md
continuacao.md
```

Depois abra o mapa do kit afetado:

```text
docs/kits/kit-01-auth-users-shared-core-map.md
docs/kits/kit-02-catalog-shared-core-map.md
docs/kits/kit-03-subscriptions-shared-core-map.md
docs/kits/kit-04-inventory-shared-core-map.md
docs/kits/kit-05-orders-shared-core-map.md
docs/kits/kit-06-fulfillment-delivery-shared-core-map.md
```

## Arvore De Runtime

Global:

```text
frontend/shared-core/types/*.types.ts
frontend/shared-core/contracts/*.contract.ts
frontend/shared-core/api/headers.api.ts
frontend/shared-core/api/errors.api.ts
frontend/shared-core/mappers/api-error.mapper.ts
```

Client:

```text
frontend/client/shared-core/contracts/
frontend/client/shared-core/api/
frontend/client/shared-core/mappers/
frontend/client/shared-core/view-models/
frontend/client/shared-core/hooks/
frontend/client/shared-core/kits/
```

Admin:

```text
frontend/admin/shared-core/contracts/
frontend/admin/shared-core/api/
frontend/admin/shared-core/mappers/
frontend/admin/shared-core/view-models/
frontend/admin/shared-core/hooks/
frontend/admin/shared-core/kits/
```

## Como Identificar Onde Uma Mudanca Entra

Se a mudanca altera validacao, permissao, calculo, workflow, status permitido,
preco, estoque, ciclo, confirmacao, sequencia de codigo ou auditoria:

```text
backend
```

Se a mudanca e um tipo ou contrato puro compartilhado por client e admin:

```text
frontend/shared-core
```

Se a mudanca e fetch, hook, mapper ou view-model usado por telas do cliente:

```text
frontend/client/shared-core
```

Se a mudanca e fetch, hook, mapper ou view-model usado por telas admin:

```text
frontend/admin/shared-core
```

Se a mudanca e layout, form visual, tabela, card, modal, loading, empty state ou
evento de clique:

```text
frontend/client/web
frontend/admin/web
```

## Limites Para A Fase De Telas

Nao fazer:

```text
fetch direto em TSX
calculo de preco no TSX
calculo de estoque vendavel no TSX
validacao de workflow no TSX
if por nome de empresa, plano, produto ou status
mock silencioso como se fosse API real
novo Kit 07 sem backend real
```

Fazer:

```text
usar hooks do shared-core
usar view-models do shared-core
renderizar labels vindas de config/API
manter copy em locale/strings
manter tela sem regra de negocio
documentar qualquer limite encontrado
```

## Validacao Do Corte Atual

Validacoes feitas durante os Kits 05-06:

```text
git diff --check -> OK, apenas warnings CRLF
npm run build:client -> OK
npm run build:admin -> OK
py manage.py check -> OK
py manage.py test apps.orders -> OK
py manage.py test apps.deliveries -> OK
tsc client --noEmit -> OK
```

`tsc admin --noEmit` ainda falha em pontos antigos fora dos Kits 05-06:

```text
frontend/admin/web/src/App.tsx
frontend/admin/web/src/engines/rendering/screen-types/history/HistoryPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/trash/TrashPage.tsx
frontend/foundation/tokens/resolver.ts
frontend/foundation/ui/Button/Button.tsx
```

## Nota De Identificabilidade

Para outra IA ou desenvolvedor identificar o sistema:

```text
Kits 01-04: 9.5/10
Kit 05: 10/10
Kit 06: 10/10
Documentacao geral apos este handoff: 10/10
```

O criterio da nota e:

```text
ownership claro
endpoints reais listados
arquivos runtime apontados
limites intencionais explicitos
proxima fase definida
regras anti-legado registradas
```
