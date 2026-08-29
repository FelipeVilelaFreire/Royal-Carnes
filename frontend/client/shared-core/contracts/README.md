# Client Contracts

Contratos compartilhados do ecommerce client. Tipos e contratos que nao dependem de React/Web devem nascer aqui antes de serem consumidos por web, mobile ou admin.

Contratos atuais/esperados:

- `subscription.contract.ts`
- `order.contract.ts`
- `delivery.contract.ts`

Regra:

```text
contrato client descreve o que cliente web/mobile consome
nao expor comandos/admin fields que pertencem ao admin
status, labels e tipos comerciais devem vir da API/config
```

## Regra Para Orders/Deliveries

Nao usar os mocks legados como contrato final.

Leia:

```text
frontend/handoff/06-frontend-orders-deliveries-contract-alignment.md
backend/API_CONTRACTS.md
```

Esperado:

```text
OrderDto e DeliveryDto seguem snake_case do backend quando representarem response
CreateOrderPayload usa kind_key e items[].product_key
ViewModel de UI fica separado do DTO
status/kinds nao devem ser union fechada com valores legados de mock
```
