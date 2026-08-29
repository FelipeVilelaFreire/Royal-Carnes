# Client Deliveries Kit

Fluxo de acompanhamento de entregas do cliente.

Backend disponivel:

```text
GET /api/v1/deliveries/config/
GET /api/v1/deliveries/me/
GET /api/v1/deliveries/me/:id/
```

Arquivos futuros esperados quando o runtime renascer:

```text
contracts/delivery.contract.ts
api/deliveries.api.ts
hooks/useDeliveryConfig.ts
hooks/useMyDeliveries.ts
view-models/deliveries.view-model.ts
```

Regra:

```text
delivery scheduling e recorrencia ficam fora deste kit por enquanto
cliente apenas acompanha entrega criada pelo backend
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

Backend usa:

```text
status_key: pending | packing | out-for-delivery | delivered | failed | cancelled
```

Nao tratar estes valores legados como contrato novo:

```text
outForDelivery
```

Proximo passo:

```text
criar DTOs reais do backend, mappers DTO -> view-model e fallback dev explicito
sem marcar mock como source=api.
```
