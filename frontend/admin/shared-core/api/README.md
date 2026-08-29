# Admin API

API clients do fluxo administrativo.

Status atual:

```text
runtime resetado na branch feature/shared-core-kit-reset
nenhum API client funcional deve ser tratado como existente
```

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

Quando o runtime renascer por kit, exemplos esperados:

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
