# Client Shared-Core

Camada de contrato e fluxo do cliente.

```text
cliente web/mobile
  -> render-only

client/shared-core
  -> contratos, DTOs, API clients, hooks, mappers e view-models

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

hooks/useClientOrders.ts
  -> estado de fluxo, loading, erro e actions

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

Kits 01-06 estao recriados por contrato real de backend. A proxima fase e
render-apps consumirem hooks/view-models sem chamar API direta.

Leia:

```text
docs/architecture/OWNERSHIP_TREE.md
docs/architecture/SHARED_CORE_RULES.md
docs/kits/SHARED_CORE_KITS_01_06_HANDOFF.md
docs/kits/PHASE_2_RENDER_ONLY_SCREEN_PLAN.md
```

Regra adicional:

```text
contracts descrevem DTO real ou view-model explicitamente separado
api client fala o endpoint real e nao converte falha em mock silencioso
hook organiza loading/error/data/action
view-model recebe DTO/config e entrega dados prontos para render
```
