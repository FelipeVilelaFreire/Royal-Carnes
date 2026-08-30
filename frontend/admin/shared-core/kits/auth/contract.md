# Admin Auth Contract

Runtime real:

```text
frontend/admin/shared-core/contracts/auth.contract.ts
frontend/admin/shared-core/contracts/session.contract.ts
frontend/admin/shared-core/api/auth.api.ts
frontend/admin/shared-core/mappers/auth.mapper.ts
frontend/admin/shared-core/hooks/useAdminAuthSession.ts
frontend/admin/shared-core/hooks/useAdminPermissions.ts
```

Endpoints backend consumidos:

```text
POST /api/v1/auth/login/
POST /api/v1/auth/refresh/
POST /api/v1/auth/logout/
GET  /api/v1/accounts/me/
```

Contrato fechado neste kit:

```text
AdminLoginInput
AdminAuthSession
AdminRefreshInput
AdminRefreshResult
AdminSessionState
AdminCurrentUser
```

Garantias:

```text
auth admin nao conhece portal customer
permissoes saem do backend via memberships/permissions
frontend apenas mostra/oculta UI; backend continua autoridade real
hook controla loading, erro, sessao e persistencia opcional
```
