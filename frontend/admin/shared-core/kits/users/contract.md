# Admin Users Contract

Runtime real:

```text
frontend/admin/shared-core/contracts/user.contract.ts
frontend/admin/shared-core/api/users.api.ts
frontend/admin/shared-core/mappers/users.mapper.ts
frontend/admin/shared-core/hooks/useAdminUsers.ts
frontend/admin/shared-core/hooks/useAdminUserDetail.ts
frontend/admin/shared-core/view-models/users.view-model.ts
```

Endpoints backend consumidos neste corte:

```text
GET  /api/v1/accounts/users/
POST /api/v1/accounts/users/
```

Contrato fechado neste kit:

```text
AdminUserDto
AdminUserListParams
AdminUserFormInput
AdminUserListItemView
AdminUserDetailView
AdminUsersViewModel
```

Limite intencional:

```text
detail/update/setRole/status transition ainda nao entram no API client porque
backend/apps/accounts/views.py ainda nao publica esses endpoints.
```

Garantias:

```text
admin users fica no admin shared-core
client shared-core nao importa gestao operacional
mapper aceita id numerico do Django
API client envia roles no formato do UserCreateSerializer
hook chama API client, nunca fetch direto
```
