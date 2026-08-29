# Global Shared-Core Kits

Kits globais sao apenas capacidades realmente comuns entre client, mobile e
admin.

Esta camada deve ficar pequena.

## Pertence Aqui

```text
identity
organization
money
address
manifest
asset refs
```

## Nao Pertence Aqui

```text
orders.api.ts
deliveries.api.ts
useMyOrders
useAdminOrders
copy exclusiva do cliente
copy exclusiva do admin
runtime visual
```

## Regra

```text
se client e admin ainda usam contratos diferentes, mantenha nos shared-cores
especificos.

so promova para global quando a duplicacao real provar que o contrato e comum.
```
