# Admin Auth & Users Kit

Status:

```text
local scaffold
```

## O Que Este Kit Faz

Organiza login admin, sessao, usuarios operacionais, roles e permissoes da
equipe.

## Backend

```text
backend/apps/accounts/
backend/apps/organizations/
backend/API_CONTRACTS.md
```

Endpoints principais:

```text
POST /api/v1/auth/login/
POST /api/v1/auth/refresh/
GET /api/v1/accounts/me/
GET /api/v1/accounts/users/
POST /api/v1/accounts/users/
```

## Admin Shared-Core

```text
frontend/admin/shared-core/contracts/user.contract.ts
frontend/admin/shared-core/api/auth.api.ts
frontend/admin/shared-core/api/users.api.ts
frontend/admin/shared-core/api/permissions.api.ts
frontend/admin/shared-core/hooks/useAdminUsers.ts
frontend/admin/shared-core/mappers/users.mapper.ts
frontend/admin/shared-core/view-models/users.view-model.ts
frontend/admin/shared-core/kits/auth/
frontend/admin/shared-core/kits/users/
```

## Render Admin

```text
frontend/admin/web
```

Tela deve apenas renderizar usuario, permissao visual, formulario e comandos.

## Proximo Passo

```text
conferir se telas de usuarios usam hook/view-model
tirar copy nova do TSX
garantir que permissao real fica no backend
```

