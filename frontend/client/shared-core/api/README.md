# Client API

API clients do fluxo do cliente.

Exemplos futuros:

- `products.api.ts`
- `orders.api.ts`
- `customer.api.ts`
- `subscriptionCycle.api.ts`

Regra:

```text
client screen -> client hook -> client api -> backend
```

Screens web/mobile nao chamam endpoint direto quando o fluxo for reutilizavel.
