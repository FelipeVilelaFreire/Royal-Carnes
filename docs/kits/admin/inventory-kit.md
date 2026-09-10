# Admin Inventory Kit

Status:

```text
local foundation
```

## O Que Este Kit Faz

Organiza o controle admin de estoque simples, ajustes e movimentos auditaveis.

Estoque existe como fundacao, mas esta fora da V1 imediata do admin para nao
competir com Clientes, Catalogo, Assinaturas, Pagamentos, Pedidos e Entregas.

## Backend

```text
backend/apps/inventory/
backend/API_CONTRACTS.md
```

Mapa de arquivos reais:

```text
backend/apps/inventory/models.py
  -> InventoryItem e InventoryMovement

backend/apps/inventory/selectors.py
  -> list/detail/movements por organization

backend/apps/inventory/services.py
  -> ajuste manual, reserva/liberacao e auditoria de movimento

backend/apps/inventory/serializers.py
  -> DTOs admin e inputs de item/adjustment

backend/apps/inventory/views.py
  -> endpoints admin

backend/apps/inventory/urls.py
  -> rotas publicadas

backend/apps/inventory/tests/test_api.py
  -> item, movement, adjustment e permissao

backend/apps/inventory/migrations/0001_initial.py
  -> schema inicial
```

Endpoints principais:

```text
GET /api/v1/inventory/admin/items/
POST /api/v1/inventory/admin/items/
GET /api/v1/inventory/admin/items/:id/
POST /api/v1/inventory/admin/items/:id/adjust/
GET /api/v1/inventory/admin/items/:id/movements/
```

## Admin Shared-Core

```text
frontend/admin/shared-core/contracts/inventory.contract.ts
frontend/admin/shared-core/api/inventory.api.ts
frontend/admin/shared-core/hooks/useAdminInventory.ts
frontend/admin/shared-core/hooks/useAdminInventoryItemDetail.ts
frontend/admin/shared-core/hooks/useAdminInventoryAdjustment.ts
frontend/admin/shared-core/mappers/inventory.mapper.ts
frontend/admin/shared-core/view-models/inventory.view-model.ts
frontend/admin/shared-core/manifest/pages/cortes.config.jsx
frontend/admin/shared-core/manifest/pages/estoque.config.jsx
```

Responsabilidade por arquivo:

```text
contracts/inventory.contract.ts
  -> InventoryItemDto, InventoryMovementDto e inputs

api/inventory.api.ts
  -> list/detail/create/adjust/movements reais

hooks/useAdminInventory.ts
hooks/useAdminInventoryItemDetail.ts
hooks/useAdminInventoryAdjustment.ts
hooks/useAdminInventoryItemForm.ts
  -> fluxo dedicado de estoque quando ele voltar para a V1.1

mappers/inventory.mapper.ts
  -> DTO -> modelo admin

view-models/inventory.view-model.ts
  -> rows, saldo, reservado, status e movimentos

manifest/pages/cortes.config.jsx
manifest/pages/estoque.config.jsx
  -> configs transicionais de inventory/estoque

locales/pt-BR.ts
  -> copy da tela e dos motivos/status
```

## Render Admin

```text
ListPage -> estoque
DetailPage -> item e movimentos
AddPage/modal -> ajuste manual
```

Campos esperados quando voltar para V1.1:

```text
ListPage
  -> Produto/variante
  -> Disponivel
  -> Reservado
  -> Limite baixo
  -> Status

DetailPage
  -> saldo
  -> reservas
  -> movimentos
  -> ajuste manual com motivo

AddPage/modal
  -> produto/variante
  -> quantidade
  -> motivo
```

## Proximo Passo

```text
garantir que status de estoque, tons e acoes venham de view-model/manifest
nao voltar ao estoque antes de fechar fluxo comercial da V1
```

Checklist antes de considerar completo:

```text
GET list mostra itens reais
DetailPage mostra saldo, reservado e movimentos
adjust cria InventoryMovement com motivo
pedido com requiresInventory reserva estoque pelo backend
cancelamento/liberacao ajusta saldo se regra existir
refresh mantem saldo/movimentos
py manage.py test apps.inventory apps.orders passa quando backend for alterado
npm run build:admin passa
git diff --check passa
```
