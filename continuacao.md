# Continuacao - RoyalPrime Shared-Core Kit Reset

Data do ponto de parada:

```text
2026-08-28
```

Branch atual:

```text
feature/shared-core-kit-reset
```

## Estado Atual

O marco de reset do shared-core foi concluido e enviado ao GitHub.

Commits importantes:

```text
a5a61d9 Document shared-core reset plan
e7179e8 Reset shared-core runtime for kit-first rebuild
```

O objetivo desse corte foi limpar implementacoes funcionais prematuras de
shared-core para recomecar corretamente por kits.

## O Que Foi Preservado

```text
docs/kits/
frontend/shared-core/kits/
frontend/shared-core/manifest/
frontend/shared-core/public/
frontend/client/shared-core/kits/
frontend/client/shared-core/locales/
frontend/client/shared-core/manifests/
frontend/client/shared-core/mocks/
frontend/client/shared-core/navigation/
frontend/admin/shared-core/kits/
frontend/admin/shared-core/locales/
frontend/admin/shared-core/manifests/
frontend/admin/shared-core/mocks/
frontend/admin/shared-core/navigation/
```

## O Que Foi Removido

Runtime funcional prematuro:

```text
frontend/client/shared-core/api/*.ts
frontend/client/shared-core/hooks/*.ts
frontend/client/shared-core/contracts/*.ts
frontend/client/shared-core/view-models/*.ts

frontend/admin/shared-core/api/*.ts
frontend/admin/shared-core/hooks/*.ts
frontend/admin/shared-core/contracts/*.ts
frontend/admin/shared-core/view-models/*.ts
```

Legado removido do global:

```text
frontend/shared-core/client/
frontend/shared-core/admin/
frontend/shared-core/contracts/index.ts
frontend/shared-core/identity.ts
frontend/shared-core/foundation.ts
```

## Validacao Do Reset

```text
git diff --check: OK
admin web build: OK
client web build: OK
client web prerender: 18 rotas
```

## Regra Central Para Continuar

```text
backend
  -> regra real, banco, validacao, autorizacao, calculo e auditoria

frontend/shared-core
  -> somente contratos/capacidades realmente globais

frontend/client/shared-core
  -> fluxos reutilizaveis entre cliente web e futuro mobile

frontend/admin/shared-core
  -> fluxos reutilizaveis do admin

frontend/client/web e frontend/admin/web
  -> render-only: mostram dados e disparam actions
```

Regra curta:

```text
Regra mora no backend.
Fluxo reutilizavel mora no shared-core do escopo correto.
Tela apenas apresenta e dispara acao.
```

## Proxima Etapa: Kit 01 Auth & Users

Continuar pelo Kit 01, nao por Orders/Deliveries ainda.

Ler primeiro:

```text
AGENTS.md
ROYALPRIME_CODEX_RULES.md
ROYALPRIME_ARCHITECTURE_CONTRACT.md
docs/CODEX_ENTRYPOINTS.md
docs/kits/README.md
docs/kits/SHARED_CORE_ARCHITECTURE_MATRIX.md
docs/kits/SHARED_CORE_KIT_RESET_PLAN.md
docs/kits/SHARED_CORE_KIT_RESET_RESULT.md
docs/kits/auth-users-kit.md
docs/kits/kit-01-auth-users-shared-core-map.md
```

## Objetivo Do Kit 01

Criar a base reutilizavel de Auth & Users sem duplicacao desnecessaria e sem
promover coisa prematura para o global.

Antes de implementar runtime, respeitar a decisao de organizacao fisica:

```text
o runtime nao fica fragmentado por kit
contracts ficam em contracts/
types auxiliares ficam em types/
API clients ficam em api/
hooks ficam em hooks/
mappers ficam em mappers/
view-models ficam em view-models/
mocks ficam em mocks/
kits documentam onde ler e o papel de cada arquivo
```

O kit e o mapa de leitura e fronteira de reuso. Ele deve dizer:

```text
para Kit 01 leia X, Y e Z
este arquivo e contrato
este arquivo e API client
este arquivo e hook
este arquivo e mapper
este arquivo e view-model
esta tela e render-only
```

Nao criar uma arvore paralela de runtime dentro de `kits/`.

Divisao esperada:

```text
frontend/shared-core
  -> identity/organization base realmente comum
  -> tipos pequenos como UserId, OrganizationId, RoleKey, PermissionKey
  -> helpers comuns de header somente se client/admin realmente usarem igual

frontend/client/shared-core
  -> auth do cliente
  -> sessao do cliente
  -> current customer/account
  -> login/register/logout/me do cliente

frontend/admin/shared-core
  -> auth do admin
  -> sessao admin
  -> permissoes/roles/users
  -> users CRUD/list/detail/form view-models
```

## Ordem Recomendada De Implementacao

1. Revisar backend real de Fase 1:

```text
backend/apps/accounts/
backend/apps/organizations/
backend/apps/customers/
backend/API_CONTRACTS.md
```

2. Criar contratos globais minimos se fizer sentido:

```text
frontend/shared-core/contracts/identity.contract.ts
frontend/shared-core/contracts/organization.contract.ts
```

Somente colocar aqui o que for realmente compartilhado por client, mobile e
admin.

3. Criar client Auth:

```text
frontend/client/shared-core/contracts/auth.contract.ts
frontend/client/shared-core/api/auth.api.ts
frontend/client/shared-core/hooks/useAuthSession.ts
frontend/client/shared-core/mappers/auth.mapper.ts
frontend/client/shared-core/view-models/auth.view-model.ts
frontend/client/shared-core/kits/auth/contract.md
frontend/client/shared-core/kits/auth/flow.md
```

4. Criar admin Auth & Users:

```text
frontend/admin/shared-core/contracts/auth.contract.ts
frontend/admin/shared-core/contracts/user.contract.ts
frontend/admin/shared-core/api/auth.api.ts
frontend/admin/shared-core/api/users.api.ts
frontend/admin/shared-core/hooks/useAdminAuthSession.ts
frontend/admin/shared-core/hooks/useAdminUsers.ts
frontend/admin/shared-core/mappers/auth.mapper.ts
frontend/admin/shared-core/mappers/users.mapper.ts
frontend/admin/shared-core/view-models/auth.view-model.ts
frontend/admin/shared-core/view-models/users.view-model.ts
frontend/admin/shared-core/kits/auth/contract.md
frontend/admin/shared-core/kits/auth/flow.md
frontend/admin/shared-core/kits/users/contract.md
frontend/admin/shared-core/kits/users/flow.md
```

5. So depois conectar telas.

As telas podem continuar com mock/locales/manifests ate o shared-core do Kit 01
estar correto.

## O Que Nao Fazer Amanha

```text
nao recriar Orders/Deliveries antes do Kit 01
nao colocar auth inteiro no frontend/shared-core global
nao criar hook generico com if client/admin
nao chamar endpoint direto em tela
nao guardar permissao real, status permitido ou regra de negocio em locale
nao voltar com frontend/shared-core/client ou frontend/shared-core/admin
```

## Resultado Esperado Do Proximo Marco

```text
Kit 01 documentado e iniciado - DONE
global minimo com tipos realmente comuns - DONE
client auth/customer iniciado no shared-core do client - DONE
admin auth/users/permissions iniciado no shared-core do admin - DONE
build client OK
build admin OK
commit e push na feature/shared-core-kit-reset
```

Validacao do primeiro corte de codigo:

```text
npm run build:client -> OK
npm run build:admin -> OK
tsc direto nos index.ts dos tres shared-cores -> OK
```

Frase guia:

```text
backend reutiliza por seed/config
shared-core reutiliza por kit
web/native/admin-web reutiliza por manifest/render
```
