# Admin Shared-Core

Camada de contrato e fluxo do admin.

```text
admin web
  -> render-only

admin/shared-core
  -> contratos, DTOs, API clients, hooks, comandos e view-models

backend
  -> regra real, permissao e auditoria
```

Esta pasta organiza capacidades operacionais sem acoplar regra em tela.

## Mentalidade de Kit

Cada capacidade administrativa relevante deve ter um kit documentado em `kits/`.

```text
kits/orders
  -> explica listagem, detalhe, filtros e transicao de status

contracts/orders.contract.ts
  -> DTOs e tipos admin

api/orders.api.ts
  -> chamadas HTTP admin

hooks/useAdminOrders.ts
  -> estado de tabela, filtros, comandos e erro

view-models/orders.view-model.ts
  -> adaptacao para tabela/detalhe
```

## Regra

```text
admin page nao importa mock direto quando existir hook
admin page nao chama endpoint direto
admin page nao decide workflow de status
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

Atencao:

```text
usar /api/v1/orders/admin/orders/
usar /api/v1/deliveries/admin/deliveries/
enviar X-Organization-Slug
preparar Authorization quando houver token
fallback dev nao pode mascarar erro real como sucesso de API
```
