# Organizations App

`apps.organizations` e dono de tenant/organization.

Pertence aqui:

- `Organization`;
- settings por organization;
- dominios;
- feature flags;
- seed inicial RoyalPrime.
- resolucao de organization por request.

Regra:

```text
RoyalPrime e a primeira organization.
Royal Carnes e dado/config dessa organization.
```

Tenant context:

```text
X-Organization-Slug -> request.organization
```

O resolver mora em `apps.core.tenant`, mas a entidade dona continua sendo
`apps.organizations.Organization`.

Nao pertence aqui:

- regra de pedido;
- regra de assinatura;
- regra visual de manifest;
- copy de interface.
