# Kit 04 - Inventory Shared-Core Map

## Objetivo

Fechar o shared-core de Inventory somente para o contrato backend real de
estoque simples:

```text
GET  /api/v1/inventory/admin/items/
POST /api/v1/inventory/admin/items/
GET  /api/v1/inventory/admin/items/:id/
POST /api/v1/inventory/admin/items/:id/adjust/
GET  /api/v1/inventory/admin/items/:id/movements/
```

O backend continua dono de validacao, permissao, quantidade vendavel, status e
auditoria de movimentos.

## Arvore De Propriedade

```text
backend/apps/inventory/
  models.py
  services.py
  selectors.py
  serializers.py
  views.py
  urls.py

frontend/shared-core/
  types/inventory.types.ts
  contracts/inventory.contract.ts

frontend/admin/shared-core/
  contracts/inventory.contract.ts
  api/inventory.api.ts
  mappers/inventory.mapper.ts
  view-models/inventory.view-model.ts
  hooks/useAdminInventory.ts
  hooks/useAdminInventoryItemDetail.ts
  hooks/useAdminInventoryAdjustment.ts
  hooks/useAdminInventoryItemForm.ts
  kits/inventory/README.md
  kits/inventory/contract.md
  kits/inventory/flow.md

frontend/client/shared-core/
  kits/inventory/README.md
```

## Fronteira Global

`frontend/shared-core` contem apenas tipos e contratos puros:

```text
InventoryItemBase
InventoryMovementBase
InventoryItemFormInputBase
InventoryAdjustmentInputBase
InventoryStatus
InventoryMovementType
StockQuantity
```

Nao ha fetch, hook, regra de status ou calculo de estoque no global.

## Fronteira Admin

`frontend/admin/shared-core` contem o fluxo operacional reutilizavel do admin:

```text
contracts -> DTOs e inputs do endpoint real
api       -> cliente HTTP fino
mappers   -> snake_case backend para camelCase do render
view-models -> agregacao de linhas/totais/form readiness
hooks     -> load/create/detail/adjust
```

Permissoes continuam no backend:

```text
inventory.read
inventory.manage
```

## Fronteira Client

Nao foi criado runtime client para Inventory neste corte porque o backend nao
publica endpoint client de estoque.

Quando a tela client precisar de disponibilidade, ela deve receber informacao
por Catalog, Orders ou outro endpoint publicado, sem consultar Inventory admin
diretamente.

## Limites Intencionais

Nao foram implementados:

```text
PATCH item
DELETE item
reservations API
client inventory API
calculo frontend de sellableQuantity/status
regras por nome de produto, plano ou empresa
```

Esses pontos dependem de backend publicado ou de novo kit.

## Criterio De Pronto

```text
contrato global minimo criado
runtime admin alinhado ao backend atual
client marcado sem runtime proprio
docs do kit atualizadas
build client OK
build admin OK
backend check OK
```
