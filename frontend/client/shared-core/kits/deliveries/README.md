# Client Deliveries Kit

Fluxo de acompanhamento de entregas do cliente.

Backend disponivel:

```text
GET /api/v1/deliveries/config/
GET /api/v1/deliveries/me/
GET /api/v1/deliveries/me/:id/
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
hooks/useClientDeliveries.ts
hooks/useClientDeliveryDetail.ts
mappers/deliveries.mapper.ts
view-models/deliveries.view-model.ts
```

Regra:

```text
delivery scheduling e recorrencia ficam fora deste kit por enquanto
cliente apenas acompanha entrega criada pelo backend
```

Backend usa:

```text
status_key: pending | packing | out-for-delivery | delivered | failed | cancelled
```

Esses valores sao seed/config do RoyalPrime, nao branches de codigo.

Nao tratar estes valores legados como contrato novo:

```text
outForDelivery
```
