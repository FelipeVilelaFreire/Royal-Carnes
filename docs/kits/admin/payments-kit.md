# Admin Payments Kit

Status:

```text
local foundation + admin 360 real
```

## O Que Este Kit Faz

Organiza a operacao financeira inicial do admin: criar cobranca manual, editar
status, acompanhar vencimento e conectar pagamento a cliente, assinatura e
pedido.

## Backend

```text
backend/apps/payments/
backend/api/v1/urls.py
backend/config/settings/base.py
backend/API_CONTRACTS.md
```

Mapa de arquivos reais:

```text
backend/apps/payments/models.py
  -> Payment
  -> organization, customer, subscription, order, reference, status, currency,
     amount_cents, due_at, paid_at, notes, metadata

backend/apps/payments/selectors.py
  -> list/detail por organization
  -> deve crescer para filtros por customer/subscription/order/status

backend/apps/payments/serializers.py
  -> PaymentSerializer, PaymentCreateSerializer, PaymentUpdateSerializer
  -> valida FKs e campos editaveis

backend/apps/payments/views.py
  -> admin list/create/detail/patch
  -> aplica permissao e organization scope

backend/apps/payments/urls.py
  -> rotas admin de payments

backend/apps/payments/tests.py
  -> criar/listar e editar status

backend/apps/payments/migrations/0001_initial.py
  -> schema inicial de Payment

backend/config/settings/base.py
  -> registra apps.payments em INSTALLED_APPS

backend/api/v1/urls.py
  -> inclui /api/v1/payments/
```

Endpoints principais:

```text
GET /api/v1/payments/admin/payments/
POST /api/v1/payments/admin/payments/
GET /api/v1/payments/admin/payments/:id/
PATCH /api/v1/payments/admin/payments/:id/
```

## Admin Shared-Core

```text
frontend/admin/shared-core/contracts/payments.contract.ts
frontend/admin/shared-core/api/payments.api.ts
frontend/admin/shared-core/mappers/payments.mapper.ts
frontend/admin/shared-core/view-models/payments.view-model.ts
frontend/admin/shared-core/data-sources/standard.data-source.ts
frontend/admin/shared-core/manifest/pages/pagamentos.config.jsx
frontend/admin/shared-core/locales/pt-BR.ts
```

Responsabilidade por arquivo:

```text
contracts/payments.contract.ts
  -> PaymentDto, PaymentCreateInput, PaymentUpdateInput e status

api/payments.api.ts
  -> list/create/detail/update contra backend real

mappers/payments.mapper.ts
  -> DTO -> modelo admin
  -> preserva ids de customer/subscription/order

view-models/payments.view-model.ts
  -> formata amount_cents em BRL
  -> formata due_at/paid_at para display e datetime input
  -> define statusLabelKey/statusTone

data-sources/standard.data-source.ts
  -> source pagamentos
  -> create/update/list/detail reais
  -> carrega orders/subscriptions para contexto financeiro 360
  -> passa payments para subscriptions.view-model montar aba Pagamentos

manifest/pages/pagamentos.config.jsx
  -> columns, tabs, relatedLists, fields, status options, currency e datetime

locales/pt-BR.ts
  -> copy da tela Pagamentos e status financeiros
```

## Render Admin

```text
ListPage -> pagamentos
DetailPage -> detalhe financeiro editavel
AddPage -> nova cobranca manual
RelatedList -> pagamentos dentro do detalhe de assinatura
```

Arquivos render que devem ser conferidos ao mexer:

```text
frontend/admin/web/src/engines/rendering/screen-types/standard/pages/ListPage/ListPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/pages/DetailPage/DetailPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/pages/AddPage/AddPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/components/RelatedList/RelatedList.tsx
```

Campos atuais:

```text
ListPage
  -> Referencia
  -> Cliente
  -> Origem
  -> Vinculo
  -> Status
  -> Valor
  -> Vencimento

DetailPage
  -> Dados
  -> Valores
  -> Pedido
  -> Assinatura
  -> Historico

AddPage
  -> Referencia
  -> Cliente
  -> Assinatura
  -> Pedido
  -> Status
  -> Valor
  -> Vencimento
  -> Notas
```

## Corte 2026-09-10 - Pagamentos Como Fila Financeira

Decisao de produto:

```text
Pagamentos e uma tela propria para operacao financeira.
Pedido continua sendo o centro operacional.
Assinatura continua sendo o contrato/ciclo recorrente.
```

Separacao pratica:

```text
Pedido
  -> mostra pagamento daquele pedido no DetailPage

Pagamentos
  -> fila financeira transversal
  -> permite trabalhar pendencias, pagos, falhas, cancelamentos e reembolsos

Assinatura
  -> mostra pagamentos recorrentes ligados ao plano/ciclo
```

Arquivos entregues neste corte:

```text
backend/seeds/royalprime/kits/payments.seed.json
  -> cria 3 pagamentos demo reais

backend/seeds/royalprime/seed.manifest.json
  -> inclui modulo payments depois de deliveries

backend/apps/core/seed_loader.py
  -> aplica payments por customerKey, subscriptionKey e orderKey

backend/apps/payments/views.py
  -> valida coerencia basica entre customer, subscription e order

backend/apps/payments/tests.py
  -> cobre seed real e rejeicao de referencia incoerente

frontend/admin/shared-core/view-models/payments.view-model.ts
  -> monta origem, pedido, assinatura/ciclo e eventos created/updated

frontend/admin/shared-core/data-sources/standard.data-source.ts
  -> Pagamentos carrega payments + orders + subscriptions
  -> AddPage recebe source pedidos

frontend/admin/shared-core/manifest/pages/pagamentos.config.jsx
  -> ListPage curta para fila financeira
  -> DetailPage com abas Dados, Valores, Pedido, Assinatura e Historico

frontend/admin/shared-core/locales/pt-BR.ts
  -> chaves novas de origem, relacao, abas e listas relacionadas
```

Validacao executada:

```text
py manage.py test apps.payments apps.subscriptions
py manage.py seed_backend --seed royalprime
py manage.py check
npm run build:admin
readback Payment:
  PAY-RP-2026-09-PRO paid order=true subscription=true
  PAY-RP-BOX-0001 pending order=true subscription=false
  PAY-RP-DEL-0001 failed order=true subscription=false
```

## Regras Do Admin

```text
valor visual usa currency input, mas backend recebe amount_cents
datas editaveis usam datetime
cliente vem de source clientes
assinatura vem de source assinaturas
status vem de options do manifest/locales
erro real de API deve aparecer, nao virar lista vazia silenciosa
```

## Proximo Passo

```text
validar criar/editar pagamento no browser
validar pagamento aparecendo na aba Pagamentos da assinatura
decidir depois gateway/Pix/recibo/conciliacao
```

Checklist antes de considerar completo:

```text
GET list mostra pagamentos reais ou empty real
POST cria cobranca manual
PATCH muda pending -> paid e grava paid_at quando informado
DetailPage mostra valor formatado e edita em currency
assinatura vinculada mostra o pagamento na aba Pagamentos
refresh mantem alteracao
seed demo cria pelo menos pending e paid
py manage.py test apps.payments apps.subscriptions passa
npm run build:admin passa
git diff --check passa
```
