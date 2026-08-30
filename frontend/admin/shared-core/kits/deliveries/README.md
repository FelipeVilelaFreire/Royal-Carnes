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

Mapa vertical:

```text
docs/kits/kit-06-fulfillment-delivery-shared-core-map.md
contract.md
flow.md
```

Arquivos runtime:

```text
contracts/deliveries.contract.ts
api/deliveries.api.ts
hooks/useAdminDeliveries.ts
hooks/useAdminDeliveryDetail.ts
hooks/useAdminDeliveryTransition.ts
hooks/useAdminDeliveryConfirm.ts
hooks/useAdminDeliveryForm.ts
mappers/deliveries.mapper.ts
view-models/deliveries.view-model.ts
```

Regra:

```text
admin pode atualizar e confirmar entrega
backend decide workflow logistico
scheduling fica para kit futuro separado
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
