# Global Contracts

Contratos globais devem ser minimos e realmente compartilhados por client,
mobile e admin.

Status atual:

```text
Kits 01-06 possuem contratos globais minimos quando ha reuso real
contratos globais sao base compartilhada, nao runtime de feature
```

Pode existir aqui:

```text
identity
organization
auth base
catalog base
subscriptions base
inventory base
orders base
deliveries base
```

Nao colocar aqui:

```text
DTO exclusivo client/admin
API client de feature
hook React
view-model de tela
regra de negocio
```

Referencia:

```text
docs/architecture/SHARED_CORE_RULES.md
```
