# Accounts App

`apps.accounts` e dono de identidade, acesso e permissao.

Pertence aqui:

- `User`;
- `Role`;
- `Permission`;
- `OrganizationMember`;
- sessao/token/reset de senha.
- permissions por organization.

Regra:

```text
User e identidade de login.
OrganizationMember define acesso e papel dentro de uma organization.
Customer fica em apps.customers.
Permissao real soma as permissions das roles ativas em request.organization.
```

Endpoints:

```text
POST /api/v1/auth/login/
POST /api/v1/auth/refresh/
POST /api/v1/auth/register/
POST /api/v1/auth/logout/
GET  /api/v1/accounts/me/
GET  /api/v1/accounts/users/
POST /api/v1/accounts/users/
```

Tenant:

```text
accounts usa request.organization para validar membership/permission
```

Nao pertence aqui:

- endereco do cliente;
- assinatura;
- pedidos;
- regra comercial.
