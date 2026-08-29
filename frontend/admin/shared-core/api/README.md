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

Proximo corte:

```text
adminOrders.api.ts
  -> GET /api/v1/orders/admin/orders/
  -> POST /api/v1/orders/admin/orders/
  -> GET /api/v1/orders/admin/orders/:id/
  -> POST /api/v1/orders/admin/orders/:id/transition/

adminDeliveries.api.ts
  -> GET /api/v1/deliveries/admin/deliveries/
  -> POST /api/v1/deliveries/admin/deliveries/
  -> GET /api/v1/deliveries/admin/deliveries/:id/
  -> POST /api/v1/deliveries/admin/deliveries/:id/transition/
  -> POST /api/v1/deliveries/admin/deliveries/:id/confirm/
```
