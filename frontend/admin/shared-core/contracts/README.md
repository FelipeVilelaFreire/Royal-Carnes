# Admin Contracts

Contratos compartilhados do admin ecommerce. Tipos de dashboard, pedidos,
entregas, clientes, cortes e assinaturas devem ficar aqui quando forem
reutilizados entre runtime, mocks e builders.

Status atual:

```text
Kits 01-06 possuem contratos admin para endpoints admin/publicos existentes.
```

Regra:

```text
contrato admin pode expor campos e comandos operacionais
cliente nao deve consumir contrato admin
DTO response segue snake_case do backend
view-model fica separado do DTO
```

Referencia:

```text
docs/architecture/SHARED_CORE_RULES.md
```
