# Admin Contracts

Contratos compartilhados do admin ecommerce. Tipos de dashboard, pedidos,
entregas, clientes, cortes e assinaturas devem ficar aqui quando forem
reutilizados entre runtime, mocks e builders.

Proximo corte:

```text
admin-order.contract.ts
admin-delivery.contract.ts
```

Regra:

```text
contrato admin pode expor campos e comandos operacionais
cliente nao deve consumir contrato admin
```
