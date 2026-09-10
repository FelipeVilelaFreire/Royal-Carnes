# Admin Subscriptions Kit

Status:

```text
local foundation
```

## O Que Este Kit Faz

Organiza a operacao admin de planos de assinatura, assinaturas, ciclo atual,
beneficios/limites, pedidos do ciclo e pagamentos vinculados.

Este kit nao representa a tela "assinantes" como entidade separada. Assinante e
cliente filtrado por assinatura ativa ou historica. A entidade operacional do
admin e `Subscription`.

## Backend

```text
backend/apps/subscriptions/
backend/API_CONTRACTS.md
```

Mapa de arquivos reais:

```text
backend/apps/subscriptions/models.py
  -> Plan, PlanPrice, PlanEntitlement, Subscription, SubscriptionCycle,
     SubscriptionCycleItem
  -> Subscription tambem guarda campos operacionais de entrega/notas

backend/apps/subscriptions/selectors.py
  -> list/detail de plans, subscriptions e cycles
  -> prefetch de plan prices, entitlements, targets, units, cycles e items

backend/apps/subscriptions/services.py
  -> criacao de plano/assinatura/ciclo e regras de selecao quando aplicavel

backend/apps/subscriptions/serializers.py
  -> DTOs admin/client e inputs de create/update
  -> SubscriptionUpdateSerializer valida edicao operacional

backend/apps/subscriptions/views.py
  -> endpoints admin/client
  -> PATCH admin de assinatura/plano quando publicado

backend/apps/subscriptions/urls.py
  -> rotas de plans, subscriptions e cycles

backend/apps/subscriptions/tests/test_api.py
  -> testes de plans, subscriptions, cycles, update e permissoes

backend/apps/subscriptions/migrations/0001_initial.py
backend/apps/subscriptions/migrations/0002_subscription_default_delivery_address_and_more.py
  -> schema base e campos operacionais recentes
```

Endpoints principais:

```text
GET /api/v1/subscriptions/admin/plans/
POST /api/v1/subscriptions/admin/plans/
GET /api/v1/subscriptions/admin/plans/:id/
PATCH /api/v1/subscriptions/admin/plans/:id/
GET /api/v1/subscriptions/admin/subscriptions/
POST /api/v1/subscriptions/admin/subscriptions/
GET /api/v1/subscriptions/admin/subscriptions/:id/
PATCH /api/v1/subscriptions/admin/subscriptions/:id/
GET /api/v1/subscriptions/admin/cycles/
```

## Admin Shared-Core

```text
frontend/admin/shared-core/contracts/subscriptions.contract.ts
frontend/admin/shared-core/api/subscriptions.api.ts
frontend/admin/shared-core/hooks/useAdminSubscriptions.ts
frontend/admin/shared-core/hooks/useAdminPlans.ts
frontend/admin/shared-core/hooks/useAdminSubscriptionCycles.ts
frontend/admin/shared-core/mappers/subscriptions.mapper.ts
frontend/admin/shared-core/view-models/subscriptions.view-model.ts
frontend/admin/shared-core/manifest/pages/assinaturas.config.jsx
frontend/admin/shared-core/manifest/pages/planos.config.jsx
```

Responsabilidade por arquivo:

```text
contracts/subscriptions.contract.ts
  -> PlanDto, PlanEntitlementDto, SubscriptionDto, CycleDto e inputs admin

api/subscriptions.api.ts
  -> list/create/detail/update de planos e assinaturas
  -> list cycles quando usado

hooks/useAdminSubscriptions.ts
hooks/useAdminPlans.ts
hooks/useAdminSubscriptionCycles.ts
hooks/useAdminPlanForm.ts
hooks/useAdminSubscriptionForm.ts
  -> fluxos especificos que podem coexistir com standard quando necessario

mappers/subscriptions.mapper.ts
  -> DTO -> modelo admin
  -> normaliza ciclos, entitlements, datas e FKs

view-models/subscriptions.view-model.ts
  -> rows de planos/assinaturas
  -> detail tabs
  -> currentCycleUsageItems
  -> subscribers RelatedList
  -> payments/orders relacionados

data-sources/standard.data-source.ts
  -> conecta resourceKey planos e assinaturas
  -> carrega fontes clientes, enderecos, produtos, variantes e pagamentos

manifest/pages/planos.config.jsx
  -> fields de plano, preco currency, lineItems de beneficios e assinantes

manifest/pages/assinaturas.config.jsx
  -> fields de assinatura, operacao, ciclo, pedidos e pagamentos

locales/pt-BR.ts
  -> copy de planos, assinaturas, tabs, fields, status e empty states
```

## Planos De Assinatura

```text
ListPage
  -> Nome, Status, Preco, Intervalo, Assinantes

DetailPage
  Dados
    -> Nome, Chave, Descricao, Status, Intervalo, Preco, Trial, Ordem

  Itens inclusos
    -> lista/editavel por produto + limite
    -> unidade vem dinamicamente do produto/variant selecionado
    -> nao usar "catalogo liberado" por enquanto

  Assinantes
    -> RelatedList de assinantes com avatar/nome/email/status

AddPage
  -> Identidade
  -> Comercial
  -> Itens inclusos
```

## Assinaturas

```text
ListPage
  -> Cliente, Plano, Status, Fim do ciclo

DetailPage
  Dados
    -> cliente, plano, status, inicio, fim do ciclo atual

  Operacao
    -> datas de inicio/fim/cancelamento
    -> motivo de cancelamento
    -> endereco padrao
    -> dia preferido
    -> janela de entrega
    -> preferencias de entrega
    -> notas internas

  Ciclo atual
    -> inicio/fim do ciclo
    -> pedidos do ciclo
    -> consumo por item: usado / limite / saldo

  Pedidos
    -> lista de pedidos vinculados a assinatura

  Pagamentos
    -> lista de pagamentos vinculados a assinatura

AddPage
  -> cliente, plano, status, inicio
  -> endereco/dia/janela/preferencias/notas
```

Regra importante:

```text
Box do ciclo nao e um total unico.
Uma assinatura pode gerar varios pedidos/boxes dentro do ciclo.
O admin deve mostrar consumo por item contratado, nao so "2kg de 12kg".
```

## Render Admin

```text
ListPage -> assinaturas e ciclos
DetailPage -> detalhe operacional
AddPage -> plano ou assinatura quando aplicavel
```

Arquivos render que devem ser conferidos ao mexer:

```text
frontend/admin/web/src/engines/rendering/screen-types/standard/pages/ListPage/ListPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/pages/DetailPage/DetailPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/pages/AddPage/AddPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/components/LineItemsEditor/LineItemsEditor.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/components/RelatedList/RelatedList.tsx
```

Fluxo esperado de Plano:

```text
AddPage/DetailPage
  -> item incluso escolhe produto
  -> unidade aparece dinamicamente a partir do produto/variant
  -> admin informa limite
  -> backend recebe entitlement persistivel
```

Fluxo esperado de Assinatura:

```text
AddPage
  -> escolhe cliente e plano vindos do backend
  -> campos operacionais opcionais

DetailPage
  -> edita status/plano/datas/campos operacionais
  -> Ciclo atual mostra usado/limite/saldo por item
  -> Pedidos mostra pedidos vinculados
  -> Pagamentos mostra pagamentos vinculados
```

## Proximo Passo

```text
validar edicao de assinatura no browser
validar que pagamentos aparecem na aba Pagamentos da assinatura
transformar pausar/cancelar/inativar em acoes backend reais
adicionar historico/auditoria quando o fluxo operacional estabilizar
```

Checklist antes de considerar completo:

```text
Planos List/Detail/Add funcionam e persistem
lineItems salva produto + limite sem texto solto
unidade do beneficio vem do produto/variant/backend
Assinaturas List mostra cliente/plano/status/fim do ciclo
Assinatura Detail edita e persiste apos refresh
Ciclo atual mostra consumo por item
Pagamentos vinculados aparecem na aba correta
Pedidos vinculados aparecem quando existirem
pausar/cancelar/inativar nao podem ser falso front-only
py manage.py test apps.subscriptions passa quando backend for alterado
npm run build:admin passa
git diff --check passa
```
