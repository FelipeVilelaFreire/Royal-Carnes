# Client API

API clients do fluxo do cliente.

Status atual:

```text
runtime resetado na branch feature/shared-core-kit-reset
nenhum API client funcional deve ser tratado como existente
```

Exemplos futuros:

- `products.api.ts`
- `orders.api.ts`
- `customer.api.ts`
- `subscriptionCycle.api.ts`
- `subscriptions.api.ts`
- `deliveries.api.ts`

Regra:

```text
client screen -> client hook -> client api -> backend
```

Screens web/mobile nao chamam endpoint direto quando o fluxo for reutilizavel.

API client nao deve esconder falha real retornando mock silencioso. Fallback dev
deve ser decisao do hook, com `source=fallback`.

Quando o runtime renascer por kit, exemplos esperados:

```text
orders.api.ts
  -> GET /api/v1/orders/config/
  -> GET /api/v1/orders/me/
  -> POST /api/v1/orders/me/
  -> GET /api/v1/orders/me/:id/

deliveries.api.ts
  -> GET /api/v1/deliveries/config/
  -> GET /api/v1/deliveries/me/
  -> GET /api/v1/deliveries/me/:id/
```

Leia tambem:

```text
docs/kits/SHARED_CORE_KIT_RESET_PLAN.md
frontend/handoff/06-frontend-orders-deliveries-contract-alignment.md
backend/API_CONTRACTS.md
```
