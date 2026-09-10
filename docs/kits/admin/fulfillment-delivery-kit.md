# Admin Fulfillment & Delivery Kit

Status:

```text
local foundation
```

## O Que Este Kit Faz

Organiza a operacao admin de expedicao, entrega, transicao de status e
confirmacao.

Entrega deve entrar depois de Pedidos, porque a entrega operacional nasce de um
pedido, usa endereco/snapshot e acompanha status de expedicao.

## Backend

```text
backend/apps/deliveries/
backend/API_CONTRACTS.md
```

Mapa de arquivos reais:

```text
backend/apps/deliveries/models.py
  -> Delivery, DeliveryStatusHistory e definicoes relacionadas

backend/apps/deliveries/selectors.py
  -> list/detail/config por organization

backend/apps/deliveries/services.py
  -> criar entrega a partir do pedido, transition e confirm

backend/apps/deliveries/serializers.py
  -> DTOs admin/client e inputs de transition/confirm

backend/apps/deliveries/views.py
  -> endpoints admin/client

backend/apps/deliveries/urls.py
  -> rotas publicadas

backend/apps/deliveries/tests/test_api.py
  -> permissao, list/detail, transition e confirm

backend/apps/deliveries/migrations/
  -> schema de entrega e historico
```

Endpoints principais:

```text
GET /api/v1/deliveries/admin/deliveries/
POST /api/v1/deliveries/admin/deliveries/
GET /api/v1/deliveries/admin/deliveries/:id/
POST /api/v1/deliveries/admin/deliveries/:id/transition/
POST /api/v1/deliveries/admin/deliveries/:id/confirm/
```

## Admin Shared-Core

```text
frontend/admin/shared-core/contracts/deliveries.contract.ts
frontend/admin/shared-core/api/deliveries.api.ts
frontend/admin/shared-core/hooks/useAdminDeliveries.ts
frontend/admin/shared-core/hooks/useAdminDeliveryTransition.ts
frontend/admin/shared-core/mappers/deliveries.mapper.ts
frontend/admin/shared-core/view-models/deliveries.view-model.ts
frontend/admin/shared-core/manifest/pages/deliveries.config.jsx
```

Responsabilidade por arquivo:

```text
contracts/deliveries.contract.ts
  -> DeliveryDto, DeliveryTransitionInput, DeliveryConfirmInput

api/deliveries.api.ts
  -> list/detail/create/transition/confirm reais

hooks/useAdminDeliveries.ts
hooks/useAdminDeliveryDetail.ts
hooks/useAdminDeliveryTransition.ts
hooks/useAdminDeliveryConfirm.ts
hooks/useAdminDeliveryForm.ts
  -> fluxo operacional dedicado quando necessario

mappers/deliveries.mapper.ts
  -> DTO -> modelo admin

view-models/deliveries.view-model.ts
  -> rows, timeline, status label/tone, endereco resumido

data-sources/standard.data-source.ts
  -> conecta entregas ao StandardScreen quando estiver no standard

manifest/pages/deliveries.config.jsx
  -> columns, fields e acoes

locales/pt-BR.ts
  -> copy de entregas, status, tabs e feedback
```

Campos esperados:

```text
ListPage
  -> Pedido
  -> Cliente
  -> Janela/data
  -> Status
  -> Endereco resumido

DetailPage
  -> pedido vinculado
  -> cliente
  -> endereco/snapshot
  -> janela de entrega
  -> status atual
  -> historico
  -> confirmacao

AddPage
  -> normalmente deve nascer a partir do pedido
  -> criar entrega solta so se o backend permitir explicitamente
```

## Render Admin

```text
ListPage -> expedicao/entregas
DetailPage -> entrega
acoes -> transition/confirm via hook
```

Arquivos render que devem ser conferidos ao mexer:

```text
frontend/admin/web/src/engines/rendering/screen-types/standard/pages/ListPage/ListPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/pages/DetailPage/DetailPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/components/RelatedList/RelatedList.tsx
```

## Proximo Passo

```text
garantir que timeline, status e confirmacao sejam preparados fora do TSX
validar transition/confirm pelo backend antes de polir timeline
```

Checklist antes de considerar completo:

```text
GET list mostra entregas seedadas
DetailPage mostra pedido, cliente, endereco e status
transition muda status pelo backend
confirm grava confirmacao real
historico/timeline vem do backend/view-model
entrega vinculada aparece no detalhe do pedido
refresh mantem status
py manage.py test apps.deliveries apps.orders passa quando backend for alterado
npm run build:admin passa
git diff --check passa
```
