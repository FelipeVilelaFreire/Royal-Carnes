# Admin Render-App

Aplicacao web operacional do admin RoyalPrime.

Esta pasta pertence a camada:

```text
render-app admin
```

## Leitura Obrigatoria

Antes de alterar telas, leia:

```text
docs/architecture/OWNERSHIP_TREE.md
docs/architecture/RENDER_APPS_RULES.md
docs/kits/PHASE_2_RENDER_ONLY_SCREEN_PLAN.md
frontend/admin/shared-core/README.md
```

## Regra Central

```text
screen/page/component
  -> chama hook de frontend/admin/shared-core
  -> hook chama api
  -> api chama backend
  -> backend decide regra real
```

Esta aplicacao renderiza screen types, tabelas, detalhes, formularios e acoes
visuais. Ela nao decide permissao real, workflow, estoque, preco ou status.

## Fontes Corretas

```text
frontend/admin/shared-core
frontend/shared-core
frontend/foundation
```

Nao consumir:

```text
frontend/client/shared-core
endpoint client quando existir endpoint admin equivalente
mock direto quando hook existe
```

## Fluxos Disponiveis

```text
auth/session
users/permissions
catalog
subscriptions
inventory
orders
deliveries
```

## Regras De Tela

Nao fazer em TSX:

```text
fetch direto
importar api/*.api.ts direto
converter snake_case
calcular preco/total/estoque/status
validar permissao real
codificar workflow
hardcodar copy nova de UI
usar emoji
criar SVG inline novo dentro da tela
escolher icone por index ou regra de negocio local
```

Copy nova de UI deve vir de locale/strings, por `strings.xxx`, `t("xxx")` ou
contrato equivalente.

Icones devem vir da Foundation/ServiceOS por intencao semantica. A screen type
ou manifest pode declarar o significado visual da action; o render-app resolve
para o componente SVG da plataforma sem criar pacote paralelo.

## Manifests E Screen Types

Manifests/configs podem declarar:

```text
rotas
navegacao
screen type
colunas visuais
filtros visuais
actions visuais
ordem de secoes
feature toggles de UI
```

Eles nao podem virar backend paralelo para permissao real, workflow real,
preco, estoque ou status permitido como autoridade final.
