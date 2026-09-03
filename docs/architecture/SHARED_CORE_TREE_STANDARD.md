# Shared-Core Tree Standard

## Objetivo

Os tres shared-cores do frontend devem seguir a mesma gramatica de pastas para
facilitar leitura, ownership e extracao futura.

```text
frontend/shared-core
frontend/client/shared-core
frontend/admin/shared-core
```

## Tree Padrao

```text
shared-core/
  api/
  contracts/
  hooks/
  kits/
  locales/
  manifest/
  mappers/
  mocks/
  navigation/
  types/
  view-models/
  index.ts
  README.md
```

## Regra De Ownership

```text
frontend/shared-core
  -> contratos globais e manifest base comum

frontend/client/shared-core
  -> contratos, hooks, view-models, mocks, locales e manifest do cliente

frontend/admin/shared-core
  -> contratos, hooks, view-models, mocks, locales e manifest do admin
```

Client e admin podem sobrescrever a base global, mas nao duplicam regra global
sem motivo.

## Manifest Canonico

`manifest/` no singular e o dono canonico nos tres shared-cores. Nao existe
pasta paralela pluralizada para manifest fora de render-app.

Regra:

```text
frontend/shared-core/manifest
  -> frontend/client/shared-core/manifest
    -> client/web render-app

frontend/shared-core/manifest
  -> frontend/admin/shared-core/manifest
    -> admin/web render-app
```

Render-apps consomem esse manifest pelo alias local que escolherem, mas a origem
fora do web deve ser sempre `shared-core/manifest`.

## Design System Manifest

A separacao oficial dentro de `manifest/` e:

```text
manifest/
  theme/
    -> tokens brutos, cores, layout, radius, typography, spacing

  semi-composed/
    -> receitas que leem theme e vestem Surface, Button, Card, Text, Icon,
       Background e futuras cascas

  ui/
    -> contrato publico dos primitives e defaults de uso

  capabilities/
    -> capacidades conhecidas, estado atual e destino futuro
```

`design-system/` nao e pasta valida dentro do manifest novo. Codigo novo deve
entrar em `theme`, `semi-composed`, `ui` ou `capabilities`.

## Pastas Vazias

Pastas globais como `hooks`, `locales`, `mocks`, `navigation` e `view-models`
existem para manter a tree simetrica. Elas so recebem conteudo quando houver
uso global real.

Nao preencher pasta por previsao abstrata.
