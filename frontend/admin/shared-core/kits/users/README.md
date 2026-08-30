# Admin Users Kit

Gestao operacional de usuarios e membros da organization.

Inclui:

```text
usuarios
roles
permissoes
membros da organization
```

Regra de permissao continua no backend.

Escopo fechado no backend atual:

```text
GET  /api/v1/accounts/users/
POST /api/v1/accounts/users/
```

Nao prometer detail/update/setRole enquanto os endpoints nao existirem no
backend.

Mapa vertical:

```text
docs/kits/kit-01-auth-users-shared-core-map.md
contract.md
flow.md
```

Regra:

```text
users admin pertence ao admin shared-core
tipos base de UserId, RoleKey e PermissionKey podem vir do global
gestao operacional de usuarios nao deve ir para client shared-core
```

Arquivos runtime:

```text
contracts/user.contract.ts
api/users.api.ts
hooks/useAdminUsers.ts
hooks/useAdminUserDetail.ts
mappers/users.mapper.ts
view-models/users.view-model.ts
```
