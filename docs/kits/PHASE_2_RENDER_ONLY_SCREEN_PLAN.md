# Phase 2 - Render-Only Screen Plan

## Objetivo

Conectar telas reais aos Kits 01-06 sem mover regra para o frontend.

Esta fase nao cria Kit 07. Ela consome os shared-cores existentes e transforma
telas mockadas em telas render-only.

Nome oficial da camada de telas:

```text
render-apps
```

Referencia de ownership:

```text
docs/architecture/OWNERSHIP_TREE.md
docs/architecture/BACKEND_RULES.md
docs/architecture/SHARED_CORE_RULES.md
docs/architecture/RENDER_APPS_RULES.md
docs/architecture/RENDER_APPS_TREE_ANALYSIS.md
```

## Ordem Recomendada

1. Auth/session base
2. Client Catalog
3. Client Subscriptions
4. Client Orders
5. Client Deliveries
6. Admin Catalog
7. Admin Subscriptions
8. Admin Inventory
9. Admin Orders
10. Admin Deliveries

Essa ordem evita tela operacional sem dado base.

## Contrato Render-Only

Cada tela deve seguir:

```text
screen TSX
  -> importa hook do shared-core
  -> chama load/action
  -> recebe viewModel
  -> renderiza loading/error/empty/data
  -> dispara action com input de form
```

Cada tela nao deve:

```text
importar api/*.api.ts diretamente
fazer fetch direto
converter snake_case
calcular total/preco/estoque/status
validar permissao real
codificar workflow
codificar copy de UI fora de locale/strings
usar emoji em UI
```

## Client Web

### Catalog

Provavel superficie:

```text
frontend/client/web/src/modules/catalog
frontend/client/web/src/screens
```

Consumir:

```text
useClientCatalog
useClientProductDetail
```

Tela renderiza produtos, colecoes e modos comerciais vindos do shared-core.

### Subscriptions

Consumir:

```text
useClientPlans
useClientSubscription
useClientCurrentCycle
useClientCycleItems
```

Tela renderiza plano atual, ciclo atual e selecao de item. Regra de entitlement
continua no backend.

### Orders

Consumir:

```text
useClientOrders
useClientOrderDetail
useClientOrderForm
```

Tela cria pedido com `kindKey`, itens e referencias opcionais. Preco, estoque,
delivery e codigo sao backend.

### Deliveries

Consumir:

```text
useClientDeliveries
useClientDeliveryDetail
```

Tela acompanha entrega. Cliente nao cria, confirma ou muda status.

## Admin Web

### Catalog

Consumir:

```text
useAdminCatalog
useAdminProductDetail
useAdminProductForm
```

Admin lista e cria produto conforme endpoint atual. Nao prometer update/delete.

### Subscriptions

Consumir:

```text
useAdminPlans
useAdminSubscriptions
useAdminSubscriptionCycles
useAdminPlanForm
useAdminSubscriptionForm
```

Admin lista/cria planos e assinaturas, lista ciclos. Nao prometer pausa/cancel
enquanto backend nao publicar.

### Inventory

Consumir:

```text
useAdminInventory
useAdminInventoryItemDetail
useAdminInventoryAdjustment
useAdminInventoryItemForm
```

Admin lista/cria/upsert item e ajusta estoque. Regra de quantidade/status fica
no backend.

### Orders

Consumir:

```text
useAdminOrders
useAdminOrderDetail
useAdminOrderTransition
useAdminOrderForm
```

Admin lista/cria pedido e solicita transicao. Backend decide se transicao e
permitida.

### Deliveries

Consumir:

```text
useAdminDeliveries
useAdminDeliveryDetail
useAdminDeliveryTransition
useAdminDeliveryConfirm
useAdminDeliveryForm
```

Admin lista/cria entrega por orderId, solicita transicao e confirma entrega.
Backend decide workflow e efeito terminal.

## Checklist Por Tela

Antes de finalizar cada tela:

```text
sem fetch direto
sem snake_case no TSX
sem regra de negocio local
sem string nova hardcoded de UI
sem emoji
loading/error/empty/data renderizados
hook vem do shared-core correto
endpoint existe no backend
build client/admin passa conforme superficie afetada
```

## Ordem De Commit Recomendada

Nao misturar tela client e admin no mesmo commit se a mudanca ficar grande.

Sequencia sugerida:

```text
commit Kits 05-06 + docs gerais
commit client catalog/subscriptions render-only
commit client orders/deliveries render-only
commit admin catalog/subscriptions render-only
commit admin inventory/orders/deliveries render-only
```

## Quando Parar E Voltar Para Backend

Voltar ao backend quando a tela precisar de:

```text
rota inexistente
update/delete nao publicado
novo filtro server-side obrigatorio
permissao nova
novo status/effect
payment/checkout/wallet/voucher
package management de delivery
scheduling
```

Nesses casos, documentar primeiro o gap e nao simular como se estivesse pronto.
