# 02 - Client Orders Screens Render-Only

Objetivo:

```text
fazer MeusPedidosView, MinhaContaView e OrderDetailModal dependerem de
client/shared-core em vez de mocks e regras locais.
```

## Arquivos Prioritarios

```text
frontend/client/web/src/screens/portal/tabs/MeusPedidosView.tsx
frontend/client/web/src/screens/portal/tabs/MinhaContaView.tsx
frontend/client/web/src/product-components/ecommerce/OrderDetailModal.tsx
```

## Problemas Atuais

```text
status visual decidido por if status === delivered/cancelled/sentToStore
labels como Codigo, Pendente, Validado e Nao aplicado no componente
copy Royal Delivery/Royal Carnes dentro da screen
pedido atual e historico importados de mocks diretos
```

## Meta Do Corte

```text
MeusPedidosView chama useClientOrders/useClientDeliveries
OrderDetailModal recebe status/copy/timeline prontos por props
MinhaContaView reutiliza o mesmo view-model de pedidos quando exibir resumo
screen controla apenas modal, aba ativa, loading e cliques
```

## Nao Mudar Ainda

```text
visual geral
layout
rotas
auth flow
Royal Box recorrente
scheduling
```

## Criterio De Pronto

```text
MeusPedidosView nao importa mock de orders diretamente
OrderDetailModal nao tem if de status comercial
status/tone/label vem de view-model ou manifest
copy nova vem de locale/strings
nenhum emoji de UI foi adicionado
webIsMobile preserva o comportamento esperado para native
build client passa
```

## Prompt Para Outra IA

```text
Execute o corte 02-client-orders-screens-render-only.md.

Antes de editar, leia docs/architecture/RENDER_APPS_RULES.md.

Use os hooks/view-models de frontend/client/shared-core ja criados:
useClientOrders, useClientOrderDetail, useClientOrderForm,
useClientDeliveries e useClientDeliveryDetail.

Preserve o visual atual. Substitua imports diretos de mocks de
pedidos/entregas por hooks. Remova decisoes de status de OrderDetailModal,
recebendo statusLabel/statusTone/timeline ja preparados. Toda copy nova deve
nascer em locale/strings. O mobile web deve manter o mesmo contrato funcional
esperado para native.

Rode npm run build em frontend/client/web.
```
