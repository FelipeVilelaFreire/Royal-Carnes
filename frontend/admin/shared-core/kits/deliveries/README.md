# Admin Deliveries Kit

Gestao operacional de entregas.

Backend disponivel:

```text
GET  /api/v1/deliveries/config/
GET  /api/v1/deliveries/admin/deliveries/
POST /api/v1/deliveries/admin/deliveries/
GET  /api/v1/deliveries/admin/deliveries/:id/
POST /api/v1/deliveries/admin/deliveries/:id/transition/
POST /api/v1/deliveries/admin/deliveries/:id/confirm/
```

Arquivos futuros esperados quando o runtime renascer:

```text
contracts/admin-delivery.contract.ts
api/adminDeliveries.api.ts
hooks/useAdminDeliveries.ts
view-models/adminDeliveries.view-model.ts
```

Regra:

```text
admin pode atualizar e confirmar entrega
backend decide workflow logistico
scheduling fica para kit futuro separado
```

## Audit Atual

Este kit esta resetado na branch `feature/shared-core-kit-reset`.

Os arquivos funcionais antigos foram removidos para evitar contrato prematuro.

Leia junto:

```text
backend/API_CONTRACTS.md
backend/seeds/royalprime/kits/deliveries.seed.json
frontend/handoff/06-frontend-orders-deliveries-contract-alignment.md
```

Endpoint correto:

```text
/api/v1/deliveries/admin/deliveries/
```

Nao usar:

```text
/api/v1/admin/deliveries/
```

Status reais:

```text
pending
packing
out-for-delivery
delivered
failed
cancelled
```

Regras para a proxima IA:

```text
enviar X-Organization-Slug
preparar Authorization Bearer token
nao esconder falha real com mock silencioso
scheduling continua fora deste corte
```
