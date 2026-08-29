# Client Shared-Core

Camada de contrato e fluxo do cliente.

```text
cliente web/mobile
  -> render-only

client/shared-core
  -> contratos, DTOs, API clients, hooks, mappers, view-models e mocks

backend
  -> regra real
```

Esta pasta e a abstracao operacional do backend para as surfaces do cliente.
Ela nao e visual e nao deve depender de React Web quando o contrato puder ser
reutilizado pelo mobile.

## Mentalidade de Kit

Cada capacidade relevante deve ter um kit documentado em `kits/`.

```text
kits/orders
  -> explica objetivo, endpoints, contratos, hooks e screens consumidoras

contracts/order.contract.ts
  -> DTOs e tipos client

api/orders.api.ts
  -> chamadas HTTP

hooks/useMyOrders.ts
  -> estado de fluxo e fallback temporario

view-models/orders.view-model.ts
  -> adaptacao para render
```

## Regra

```text
screen nao importa mock direto quando existir hook
screen nao chama endpoint direto
screen nao calcula regra real
```

## Handoff Atual

Para Orders/Deliveries, a proxima correcao obrigatoria e alinhar contracts,
API clients, hooks e view-models ao backend real.

Leia:

```text
frontend/handoff/06-frontend-orders-deliveries-contract-alignment.md
backend/API_CONTRACTS.md
backend/seeds/royalprime/kits/orders.seed.json
backend/seeds/royalprime/kits/deliveries.seed.json
```

Regra adicional:

```text
contracts descrevem DTO real ou view-model explicitamente separado
api client fala o endpoint real e nao converte falha em mock silencioso
hook decide fallback dev e marca source=fallback
view-model recebe DTO/config e entrega dados prontos para render
```
