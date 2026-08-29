# Admin Shared-Core

Camada de contrato e fluxo do admin.

```text
admin web
  -> render-only

admin/shared-core
  -> contratos, DTOs, API clients, hooks, filtros, comandos e view-models

backend
  -> regra real, permissao e auditoria
```

Esta pasta organiza capacidades operacionais sem acoplar regra em tela.

## Mentalidade de Kit

Cada capacidade administrativa relevante deve ter um kit documentado em `kits/`.

```text
kits/orders
  -> explica listagem, detalhe, filtros e transicao de status

contracts/admin-order.contract.ts
  -> DTOs e tipos admin

api/adminOrders.api.ts
  -> chamadas HTTP admin

hooks/useAdminOrders.ts
  -> estado de tabela, filtros, comandos e erro

view-models/adminOrders.view-model.ts
  -> adaptacao para tabela/detalhe
```

## Regra

```text
admin page nao importa mock direto quando existir hook
admin page nao chama endpoint direto
admin page nao decide workflow de status
```

## Handoff Atual

Para Orders/Deliveries, a proxima correcao obrigatoria e alinhar contratos e
API clients ao backend real.

Leia:

```text
frontend/handoff/06-frontend-orders-deliveries-contract-alignment.md
```

Atencao:

```text
usar /api/v1/orders/admin/orders/
usar /api/v1/deliveries/admin/deliveries/
enviar X-Organization-Slug
preparar Authorization quando houver token
fallback dev nao pode mascarar erro real como sucesso de API
```
