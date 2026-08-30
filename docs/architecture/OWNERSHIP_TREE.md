# RoyalPrime Ownership Tree

## Objetivo

Este documento define a separacao oficial das camadas do RoyalPrime.

A regra central:

```text
backend decide
shared-core transporta e organiza fluxo
render-apps apresentam e disparam acoes
```

## Nome Das Camadas

Usar estes nomes na comunicacao, docs, commits e proximas tarefas:

```text
backend
shared-core/global
shared-core/client
shared-core/admin
render-apps
```

Nao usar `webserver` para a camada de tela.

Motivo: `webserver` parece infraestrutura/servidor. A camada que estamos
tratando agora e UI render-only, entao o nome correto e `render-apps`.

## Tree Conceitual

```text
RoyalPrime
  backend
    -> regra, banco, validacao, permissao, calculo, workflow, auditoria

  frontend/shared-core
    -> contratos globais puros e helpers realmente comuns

  frontend/client/shared-core
    -> contratos, API clients, mappers, hooks e view-models do cliente

  frontend/admin/shared-core
    -> contratos, API clients, mappers, hooks e view-models do admin

  frontend/client/web
    -> render-app client
    -> telas render-only do cliente

  frontend/admin/web
    -> render-app admin
    -> telas render-only do admin
```

## Backend

Dono de:

```text
models
services/use-cases
selectors
serializers
views/controllers
urls
permissions
tests
seeds
migrations
```

Responsabilidades:

```text
validar dados
calcular preco/total/estoque/status
autorizar permissao
aplicar workflow
criar historico/auditoria
resolver tenant/organization
persistir estado
expor endpoint real
```

Exemplos:

```text
backend/apps/orders/services.py
backend/apps/inventory/services.py
backend/apps/deliveries/services.py
backend/seeds/**/kits/*.seed.json
```

## Shared-Core Global

Pasta:

```text
frontend/shared-core
```

Dono de:

```text
types/*.types.ts
contracts/*.contract.ts
api/headers.api.ts
api/errors.api.ts
mappers/api-error.mapper.ts
manifest/assets genericos
```

Responsabilidades:

```text
tipos realmente compartilhados
contratos base puros
IDs/status/input base
headers e erros comuns
assets/manifest comuns quando fizer sentido
```

Nao pode ter:

```text
fetch de feature
hook React de feature
regra client/admin misturada
if por superficie
calculo de negocio
UI
```

## Shared-Core Client

Pasta:

```text
frontend/client/shared-core
```

Dono de:

```text
contracts/
api/
mappers/
view-models/
hooks/
kits/
locales/
manifests/
navigation/
```

Responsabilidades:

```text
fluxos reutilizaveis do cliente
API client do cliente
DTO client -> view model
hooks para telas client
estado de loading/error/data
form readiness basico
contratos de portal/mobile futuro
```

Nao pode ter:

```text
endpoint admin
permissao admin hardcoded
regra de negocio
layout de tela final
copy hardcoded em TSX
```

## Shared-Core Admin

Pasta:

```text
frontend/admin/shared-core
```

Dono de:

```text
contracts/
api/
mappers/
view-models/
hooks/
kits/
locales/
manifests/
navigation/
```

Responsabilidades:

```text
fluxos reutilizaveis do admin
API client admin
DTO admin -> view model
hooks para telas admin
estado de loading/error/data
form readiness basico
contratos operacionais
```

Nao pode ter:

```text
regra de permissao real
workflow hardcoded
calculo de preco/estoque/status
componentes visuais finais
fetch direto em telas
```

## Render-Apps

Nome oficial da camada de telas:

```text
render-apps
```

Pastas atuais:

```text
frontend/client/web
frontend/admin/web
```

Responsabilidades:

```text
renderizar telas
montar layout visual
usar AppShell/manifests
usar hooks do shared-core correto
mostrar loading/error/empty/data
coletar input de usuario
disparar actions
consumir strings/locales
```

Nao pode ter:

```text
fetch direto
snake_case de DTO
regra de negocio
calculo de total/preco/estoque/status
workflow local
permissao real local
emoji de UI
copy hardcoded fora de locale/strings
```

Regra curta:

```text
render-app chama hook
hook chama api
api chama backend
backend decide
```

## Fluxo Correto De Uma Feature

```text
1. backend publica endpoint real
2. shared-core/global recebe tipos puros se houver reuso real
3. shared-core/client ou shared-core/admin recebe DTO/API/mapper/view-model/hook
4. render-app consome hook e renderiza
5. docs do kit registram ownership, endpoint e limite
```

## Como Decidir Onde Criar Arquivo

Se for banco, regra, permissao, workflow ou calculo:

```text
backend
```

Se for tipo base usado por client e admin:

```text
frontend/shared-core
```

Se for fluxo cliente:

```text
frontend/client/shared-core
```

Se for fluxo admin:

```text
frontend/admin/shared-core
```

Se for tela, card, tabela, modal, input visual ou layout:

```text
frontend/client/web
frontend/admin/web
```

## Nomes Que Devemos Evitar

```text
webserver
frontend-core
common-client-admin
shared-ui-local
business-ui
```

Motivo: esses nomes confundem ownership e incentivam mistura de regra,
renderizacao e transporte de dados.

## Nome Padrao Em Conversa

Quando falarmos do projeto, usar:

```text
backend
shared-core global
shared-core client
shared-core admin
render-app client
render-app admin
```

Exemplo:

```text
Orders:
  backend decide preco/status/estoque
  shared-core global define OrderBase
  shared-core client cria useClientOrders
  shared-core admin cria useAdminOrders/useAdminOrderTransition
  render-app client mostra Meus Pedidos
  render-app admin mostra Pedidos Operacionais
```
