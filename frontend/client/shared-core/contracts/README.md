# Client Contracts

Contratos compartilhados do ecommerce client. Tipos e contratos que nao dependem de React/Web devem nascer aqui antes de serem consumidos por web, mobile ou admin.

Status atual:

```text
Kits 01-06 possuem contratos client quando o backend publica endpoint client
ou publico.
```

Contratos atuais principais:

- `auth.contract.ts`
- `catalog.contract.ts`
- `subscriptions.contract.ts`
- `orders.contract.ts`
- `deliveries.contract.ts`
- `customer.contract.ts`

Regra:

```text
contrato client descreve o que cliente web/mobile consome
nao expor comandos/admin fields que pertencem ao admin
status, labels e tipos comerciais devem vir da API/config
```

## Regra Para Orders/Deliveries

Esperado em qualquer contrato:

```text
OrderDto e DeliveryDto seguem snake_case do backend quando representarem response
CreateOrderPayload usa kind_key e items[].product_key
ViewModel de UI fica separado do DTO
status/kinds nao devem ser union fechada com valores legados de mock
```

Referencia:

```text
docs/architecture/SHARED_CORE_RULES.md
```
