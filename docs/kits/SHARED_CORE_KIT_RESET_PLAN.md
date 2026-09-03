# Shared-Core Kit Reset Plan

Este documento registra o corte planejado antes de criar a branch de reset do
shared-core.

## Objetivo

Recomecar o runtime funcional de shared-core com mentalidade de kits, sem
carregar implementacoes prematuras de hooks, API clients, contratos e
view-models que nasceram antes do contrato final.

O reset nao apaga a direcao arquitetural. Ele limpa o que pode confundir a
proxima etapa.

## Branch De Trabalho

```text
feature/shared-core-kit-reset
```

## Regra Do Corte

Manter a tree e os materiais de produto:

```text
docs/kits/
README.md das pastas
kits/**/README.md
locales
manifest
navigation
mocks
assets
config base realmente global
```

Remover runtime funcional prematuro:

```text
frontend/client/shared-core/api/*.ts
frontend/client/shared-core/hooks/*.ts
frontend/client/shared-core/contracts/*.ts
frontend/client/shared-core/view-models/*.ts
frontend/admin/shared-core/api/*.ts
frontend/admin/shared-core/hooks/*.ts
frontend/admin/shared-core/contracts/*.ts
frontend/admin/shared-core/view-models/*.ts
frontend/shared-core/client/
frontend/shared-core/admin/
```

Preservar `README.md` em pastas tecnicas quando ele documenta o escopo futuro.

## Resultado Esperado

```text
frontend/shared-core
  -> minimo global real

frontend/client/shared-core
  -> mocks, locales, manifest, navigation e kits documentados
  -> sem hooks/API/contracts/view-models funcionais ate o Kit 01 renascer

frontend/admin/shared-core
  -> mocks, locales, manifest, navigation e kits documentados
  -> sem hooks/API/contracts/view-models funcionais ate o Kit 01 renascer
```

## Ajuste Obrigatorio

Se alguma tela quebrar por importar hooks, API clients ou view-models removidos,
ela deve voltar a consumir mocks/locales/manifest diretamente de forma
temporaria.

Isso e aceitavel porque o objetivo do corte e manter o frontend vivo enquanto o
shared-core funcional recomeca por kit.

## Proximo Marco

Depois do reset:

```text
Kit 01 Auth & Users
  -> definir contratos base globais minimos
  -> definir fluxo client auth/customer
  -> definir fluxo admin auth/users/permissions
  -> so entao recriar contracts/api/hooks/mappers/view-models
```

Regra final:

```text
backend reutiliza por seed/config
shared-core reutiliza por kit
web/native/admin-web reutiliza por manifest/render
```
