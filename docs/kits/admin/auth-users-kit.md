# Admin Auth & Users Kit

Status:

```text
local scaffold
```

## O Que Este Kit Faz

Organiza login admin, sessao, usuarios operacionais, roles e permissoes da
equipe.

Neste momento, cliente final nao deve entrar aqui. Cliente operacional fica em
`customers-kit.md`; este kit cuida de acesso interno e permissoes.

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
frontend/admin/shared-core/api/dev-auth-bypass.api.ts
frontend/admin/shared-core/hooks/useAdminUsers.ts
frontend/admin/shared-core/hooks/useAdminAuthSession.ts
frontend/admin/shared-core/hooks/useAdminDevAuthBypassToken.ts
frontend/admin/shared-core/mappers/users.mapper.ts
frontend/admin/shared-core/mappers/auth.mapper.ts
frontend/admin/shared-core/view-models/users.view-model.ts
frontend/admin/shared-core/view-models/auth.view-model.ts
frontend/admin/shared-core/manifest/pages/usuarios.config.jsx
```

## Render Admin

```text
frontend/admin/web
```

Tela deve apenas renderizar usuario, permissao visual, formulario e comandos.

Estado local atual:

```text
frontend/admin/web/src/App.tsx
  -> usa auth real quando ativo
  -> em desenvolvimento pode usar dev-auth-bypass quando
     VITE_ADMIN_AUTH_DISABLED=true

frontend/admin/web/.env.example
  -> documenta API URL e auth disabled local
```

Dev bypass e ferramenta local de desenvolvimento. Nao deve virar regra de
producao nem esconder erro real de permissao.

## Proximo Passo

```text
conferir se telas de usuarios usam hook/view-model
tirar copy nova do TSX
garantir que permissao real fica no backend
revisar login automatico local sem comprometer producao
```
