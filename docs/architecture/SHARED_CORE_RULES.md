# Shared-Core Rules

## Objetivo

Este documento define como Codex e desenvolvedores devem trabalhar em
`frontend/shared-core`, `frontend/client/shared-core` e
`frontend/admin/shared-core`.

Shared-core nao decide regra de negocio. Ele transporta contrato, organiza
fluxo e prepara dados para render.

## Regra Central

```text
shared-core chama backend
backend decide
render-app consome shared-core
```

## Tres Escopos

```text
frontend/shared-core
  -> global puro

frontend/client/shared-core
  -> fluxo do cliente

frontend/admin/shared-core
  -> fluxo do admin
```

Nao recriar `frontend/shared-core/client` ou `frontend/shared-core/admin`.

## Global

Pertence ao global:

```text
types/*.types.ts
contracts/*.contract.ts
api/headers.api.ts
api/errors.api.ts
mappers/api-error.mapper.ts
manifest/assets compartilhaveis
```

Pode conter:

```text
IDs
status keys como string/type amplo
contratos base
inputs base
erros tecnicos
helpers comuns de API
```

Nao pode conter:

```text
fetch de feature
React hook de feature
mapper client/admin especifico
view-model de tela
regra de negocio
if por client/admin
UI
```

## Client Shared-Core

Pertence ao client:

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

Responsabilidade:

```text
DTO client
API client de endpoint client/publico
mapper snake_case -> camelCase
view-model para tela client
hook de loading/error/data/action
form readiness basico
```

Nao pode chamar endpoint admin.

## Admin Shared-Core

Pertence ao admin:

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

Responsabilidade:

```text
DTO admin
API client de endpoint admin
mapper snake_case -> camelCase
view-model para tabela/detalhe/form
hook de loading/error/data/action
form readiness basico
```

Nao pode virar fonte de permissao real ou workflow real.

## Padrao Por Kit

Quando o backend publica endpoint real, criar:

```text
contracts/<kit>.contract.ts
api/<kit>.api.ts
mappers/<kit>.mapper.ts
view-models/<kit>.view-model.ts
hooks/use<Scope><Kit>.ts
kits/<kit>/README.md
kits/<kit>/contract.md
kits/<kit>/flow.md
```

Global recebe apenas:

```text
types/<kit>.types.ts
contracts/<kit>.contract.ts
```

se o contrato base for usado por mais de um escopo.

## API Clients

Regra:

```text
api client fala com endpoint real
api client nao retorna mock silencioso
api client usa buildApiHeaders
api client chama throwIfApiError
```

Client com token:

```text
buildApiHeaders({
  token: config.getAccessToken?.(),
  organizationSlug: config.organizationSlug,
})
```

Endpoint publico:

```text
buildApiHeaders({ organizationSlug: config.organizationSlug })
```

## Mappers

Regra:

```text
DTO snake_case entra no mapper
view camelCase sai do mapper
render-app nao ve snake_case
```

Mapper pode normalizar nulos e defaults de apresentacao simples.
Mapper nao calcula regra de negocio.

## Hooks

Regra:

```text
hook chama api
hook guarda loading/error/data
hook expoe action
hook retorna viewModel
```

Hook nao deve:

```text
decidir permissao real
simular sucesso com mock quando API falha
calcular preco/status/estoque/workflow
misturar client e admin no mesmo hook
```

## View-Models

View-model prepara dados para render:

```text
rows
totals
labels resolvidas por config/API
canSubmit basico
missingFields basico
```

Nao pertence ao view-model:

```text
validacao final
workflow permitido como autoridade
calculo financeiro real
calculo de estoque real
efeitos de status
autorizacao
```

## Render-Apps

Render-apps consomem shared-core assim:

```text
screen -> hook -> api -> backend
```

Nao importar:

```text
api/*.api.ts direto na tela
DTO direto quando view-model existe
mock direto quando hook existe
```

## Documentacao Obrigatoria

Cada kit implementado deve atualizar:

```text
docs/kits/<kit>-kit.md
docs/kits/kit-XX-<kit>-shared-core-map.md
frontend/client/shared-core/kits/<kit>/*
frontend/admin/shared-core/kits/<kit>/*
continuacao.md
```

Se uma rota nao existe no backend atual, documentar como limite intencional.

## Validacao Esperada

Para mudanca shared-core:

```text
git diff --check
npm run build:client
npm run build:admin
```

Quando o kit depende de backend especifico:

```text
py manage.py check
py manage.py test apps.<app>
```
