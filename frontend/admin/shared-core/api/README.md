# Admin API

API clients do fluxo administrativo.

Status atual:

```text
Kits 01-06 possuem API clients admin conforme endpoints existentes no backend.
```

API clients atuais principais:

- `auth.api.ts`
- `users.api.ts`
- `permissions.api.ts`
- `catalog.api.ts`
- `subscriptions.api.ts`
- `inventory.api.ts`
- `orders.api.ts`
- `deliveries.api.ts`

Regra:

```text
admin screen -> admin hook -> admin api -> backend
```

O Admin nao chama endpoint direto em componente quando o fluxo for reutilizavel.

Endpoints centrais ja cobertos:

```text
orders.api.ts
  -> GET /api/v1/orders/admin/orders/
  -> POST /api/v1/orders/admin/orders/
  -> GET /api/v1/orders/admin/orders/:id/
  -> POST /api/v1/orders/admin/orders/:id/transition/

deliveries.api.ts
  -> GET /api/v1/deliveries/admin/deliveries/
  -> POST /api/v1/deliveries/admin/deliveries/
  -> GET /api/v1/deliveries/admin/deliveries/:id/
  -> POST /api/v1/deliveries/admin/deliveries/:id/transition/
  -> POST /api/v1/deliveries/admin/deliveries/:id/confirm/
```
