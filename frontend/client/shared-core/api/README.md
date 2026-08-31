# Client API

API clients do fluxo do cliente.

Status atual:

```text
Kits 01-06 possuem API clients conforme endpoints client/publicos existentes
no backend.
```

API clients atuais:

- `auth.api.ts`
- `catalog.api.ts`
- `customer.api.ts`
- `orders.api.ts`
- `subscriptions.api.ts`
- `deliveries.api.ts`

Regra:

```text
client screen -> client hook -> client api -> backend
```

Screens web/mobile nao chamam endpoint direto quando o fluxo for reutilizavel.

API client nao deve esconder falha real retornando mock silencioso. Fallback dev
deve ser decisao do hook, com `source=fallback`.

Endpoints centrais ja cobertos:

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
docs/architecture/SHARED_CORE_RULES.md
docs/kits/SHARED_CORE_KITS_01_06_HANDOFF.md
```
