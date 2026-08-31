# Client Render-App

Aplicacao web do cliente RoyalPrime.

Esta pasta pertence a camada:

```text
render-app client
```

## Leitura Obrigatoria

Antes de alterar telas, leia:

```text
docs/architecture/OWNERSHIP_TREE.md
docs/architecture/RENDER_APPS_RULES.md
docs/kits/PHASE_2_RENDER_ONLY_SCREEN_PLAN.md
frontend/client/shared-core/README.md
```

## Regra Central

```text
screen/page/component
  -> chama hook de frontend/client/shared-core
  -> hook chama api
  -> api chama backend
  -> backend decide regra real
```

Esta aplicacao renderiza dados, coleta input e dispara actions. Ela nao decide
regra de negocio.

## Fontes Corretas

```text
frontend/client/shared-core
frontend/shared-core
frontend/foundation
```

Nao consumir:

```text
frontend/admin/shared-core
endpoint admin
mock direto quando hook existe
```

## Fluxos Disponiveis

```text
auth/session
catalog
subscriptions
orders
deliveries
customer/account parcial
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

Icones devem vir da Foundation/ServiceOS, com intencao semantica compartilhavel
entre web e futuro native. A mesma action em `webIsMobile` deve mapear para o
mesmo significado de icone esperado no native.

## Mobile Web

Regra obrigatoria:

```text
webIsMobile == native behavior
```

O modo mobile da web deve consumir os mesmos hooks/view-models client e manter o
mesmo comportamento esperado para o futuro app native.
