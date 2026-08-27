# Admin API

API clients do fluxo administrativo.

Exemplos futuros:

- `adminOrders.api.ts`
- `adminProducts.api.ts`
- `adminCustomers.api.ts`
- `adminDeliveries.api.ts`

Regra:

```text
admin screen -> admin hook -> admin api -> backend
```

O Admin nao chama endpoint direto em componente quando o fluxo for reutilizavel.
