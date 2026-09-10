# Admin Orders Kit

Status:

```text
local foundation + base admin real
```

## O Que Este Kit Faz

Organiza a operacao admin de pedidos recebidos, detalhe e transicao de status.

Pedidos e o proximo nivel funcional recomendado depois de Clientes, Catalogo,
Planos, Assinaturas e Pagamentos. Ele conecta o que foi comprado, por quem, em
qual canal, qual status e qual entrega/pagamento esta associado.

## Backend

```text
backend/apps/orders/
backend/API_CONTRACTS.md
```

Mapa de arquivos reais:

```text
backend/apps/orders/models.py
  -> OrderKindDefinition, OrderStatusDefinition, Order, OrderItem,
     OrderStatusHistory

backend/apps/orders/selectors.py
  -> list/detail/config de pedidos por organization

backend/apps/orders/services.py
  -> create_order, transition_order_status, gerar codigo, calcular totais,
     reservar estoque e criar delivery quando configurado
  -> valida pedido recorrente: subscription-cycle exige subscription e
     subscription_cycle coerentes com customer/organization

backend/apps/orders/serializers.py
  -> DTOs admin/client e inputs de create/transition
  -> expõe contexto de assinatura/ciclo no pedido: plan key/name, cycle id,
     number, status e datas

backend/apps/orders/views.py
  -> endpoints me/admin/config

backend/apps/orders/urls.py
  -> rotas publicadas de orders

backend/apps/orders/tests/test_api.py
  -> testes de config, create, list/detail, permissao e transition
  -> cobre seed de pedido recorrente vinculado ao ciclo e bloqueio de
     subscription-cycle sem assinatura/ciclo

backend/apps/orders/migrations/
  -> schema de order, items, status e historico
```

Endpoints principais:

```text
GET /api/v1/orders/admin/orders/
POST /api/v1/orders/admin/orders/
GET /api/v1/orders/admin/orders/:id/
POST /api/v1/orders/admin/orders/:id/transition/
```

## Admin Shared-Core

```text
frontend/admin/shared-core/contracts/orders.contract.ts
frontend/admin/shared-core/api/orders.api.ts
frontend/admin/shared-core/hooks/useAdminOrders.ts
frontend/admin/shared-core/hooks/useAdminOrderDetail.ts
frontend/admin/shared-core/hooks/useAdminOrderTransition.ts
frontend/admin/shared-core/mappers/orders.mapper.ts
frontend/admin/shared-core/view-models/orders.view-model.ts
frontend/admin/shared-core/manifest/pages/pedidos.config.jsx
```

Responsabilidade por arquivo:

```text
contracts/orders.contract.ts
  -> OrderDto, OrderItemDto, OrderCreateInput, OrderTransitionInput

api/orders.api.ts
  -> config/list/detail/create/transition reais

hooks/useAdminOrders.ts
hooks/useAdminOrderDetail.ts
hooks/useAdminOrderTransition.ts
hooks/useAdminOrderForm.ts
  -> fluxo operacional quando a tela precisar de hook dedicado

mappers/orders.mapper.ts
  -> DTO -> modelo admin
  -> preserva statusKey/kindKey/customerId/addressId

view-models/orders.view-model.ts
  -> rows, badges, labels, item summaries, total formatado e timeline

data-sources/standard.data-source.ts
  -> conecta resourceKey pedidos ao StandardScreen

manifest/pages/pedidos.config.jsx
  -> columns, tabs, fields e actions declarativas

locales/pt-BR.ts
  -> copy de pedidos, campos, status e empty states
```

Campos atuais esperados no standard:

```text
ListPage
  -> Codigo
  -> Cliente
  -> Tipo de pedido
  -> Status
  -> Status da entrega
  -> Status do pagamento
  -> Valor total

DetailPage
  -> dados do pedido
  -> cliente/endereco
  -> assinatura/ciclo quando houver
  -> itens
  -> entrega vinculada sem sair do pedido
  -> pagamento vinculado sem sair do pedido
  -> status/historico

AddPage
  -> cliente
  -> tipo
  -> assinatura/ciclo opcional para pedido recorrente
  -> itens de catalogo
  -> endereco
  -> observacoes
```

Regra importante:

```text
pedido nao calcula preco no TSX
pedido nao decide transicao no TSX
pedido nao cria entrega localmente
backend cria codigo, calcula subtotal/total e valida status
pedido recorrente sem assinatura/ciclo deve falhar no backend
```

## Corte 2026-09-10 - Base Antes Da Tela

Foi feito o corte 1-5 antes da tela visual:

```text
1. seed royalprime rodado e conferido
2. backend orders auditado
3. regra de pedido recorrente fortalecida
4. seed de pedido recorrente passou a referenciar subscriptionCycleKey
5. admin shared-core/manifest preparado para List/Detail/Add reais
```

Arquivos tocados:

```text
backend/apps/orders/services.py
backend/apps/orders/selectors.py
backend/apps/orders/serializers.py
backend/apps/orders/tests/test_api.py
backend/apps/core/seed_loader.py
backend/seeds/royalprime/kits/orders.seed.json
frontend/shared-core/contracts/orders.contract.ts
frontend/admin/shared-core/contracts/orders.contract.ts
frontend/admin/shared-core/mappers/orders.mapper.ts
frontend/admin/shared-core/view-models/orders.view-model.ts
frontend/admin/shared-core/data-sources/standard.data-source.ts
frontend/admin/shared-core/manifest/pages/pedidos.config.jsx
frontend/admin/shared-core/locales/pt-BR.ts
backend/API_CONTRACTS.md
```

Evidencia local:

```text
py manage.py seed_backend --seed royalprime
  -> orders=4, deliveries=4

py manage.py shell
  -> RP-000001 subscription-cycle True True 1

py manage.py test apps.orders apps.subscriptions
  -> 24 tests OK

py manage.py check
  -> passou

py manage.py makemigrations --check --dry-run
  -> No changes detected

npm run build:admin
  -> passou

npm run verify:rules
  -> 0 violations no diff

git diff --check
  -> passou, apenas avisos LF/CRLF do Windows
```

## Corte 2026-09-10 - UX 360 Do Pedido

Decisao operacional:

```text
Pedido e Entrega continuam separados no backend.
Pedido e Pagamento continuam separados no backend.
No Admin, o detalhe do Pedido mostra Entrega e Pagamento relacionados.
```

Motivo:

```text
Pedido e o centro do caso individual.
Entrega e a fila logistica.
Pagamento e a fila financeira.
Operador nao deve precisar sair do pedido para saber se foi pago ou entregue.
```

Implementado no shared-core/admin:

```text
ListPage de Pedidos ficou menor:
  -> Codigo
  -> Cliente
  -> Tipo
  -> Status do pedido
  -> Entrega
  -> Pagamento
  -> Total

DetailPage de Pedidos virou visao 360:
  -> Dados
  -> Assinatura
  -> Itens
  -> Entrega
  -> Pagamento
  -> Historico
```

Arquivos:

```text
frontend/admin/shared-core/view-models/orders.view-model.ts
  -> relaciona deliveries/payments por orderId
  -> entrega deliveryStatusLabel, deliveryCode, paymentStatusLabelKey,
     deliveries[] e payments[]

frontend/admin/shared-core/data-sources/standard.data-source.ts
  -> Pedidos carrega orders + deliveries + payments em conjunto

frontend/admin/shared-core/manifest/pages/pedidos.config.jsx
  -> lista enxuta e abas Entrega/Pagamento no detalhe

frontend/admin/shared-core/locales/pt-BR.ts
  -> chaves de Entrega/Pagamento dentro de pedidos
```

## Render Admin

```text
ListPage -> pedidos
DetailPage -> detalhe do pedido
acoes -> transition via hook
```

Arquivos render que devem ser conferidos ao mexer:

```text
frontend/admin/web/src/engines/rendering/screen-types/standard/pages/ListPage/ListPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/pages/DetailPage/DetailPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/pages/AddPage/AddPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/components/LineItemsEditor/LineItemsEditor.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/components/RelatedList/RelatedList.tsx
```

Fluxo esperado:

```text
ListPage
  -> simples para operacao: codigo, cliente, tipo, resumo, total, status, data

DetailPage
  -> dados comerciais
  -> itens
  -> cliente/endereco
  -> pagamento
  -> entrega
  -> historico/status

AddPage
  -> seleciona cliente
  -> seleciona tipo de pedido
  -> adiciona produtos/variants
  -> backend calcula preco e cria codigo
```

## Proximo Passo

```text
abrir o admin e validar a tela Pedidos com dados reais
testar list/detail/add de pedido avulso, royal-box e subscription-cycle
garantir action de transition via backend
expor action de entrega/pagamento somente depois de validar leitura 360
```

Checklist antes de considerar completo:

```text
GET config carrega tipos/status do backend
GET list mostra seed real de orders
POST cria pedido com itens reais de catalogo
POST subscription-cycle exige assinatura e ciclo
backend calcula total sem ajuda do TSX
transition chama endpoint real e atualiza historico
pedido cria/relaciona delivery quando config mandar
pagamentos vinculados aparecem no detalhe
entregas vinculadas aparecem no detalhe
refresh mantem status e dados
py manage.py test apps.orders apps.deliveries passa quando backend for alterado
npm run build:admin passa
git diff --check passa
```
