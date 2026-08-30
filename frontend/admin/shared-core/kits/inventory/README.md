# Admin Inventory Kit

Gestao operacional de estoque simples.

Inclui:

```text
InventoryItem
InventoryMovement
ajuste manual
baixo estoque
reservado/vendavel
```

Admin renderiza os dados; backend valida quantidade e status.

Mapa vertical:

```text
docs/kits/kit-04-inventory-shared-core-map.md
contract.md
flow.md
```

Arquivos runtime:

```text
contracts/inventory.contract.ts
api/inventory.api.ts
hooks/useAdminInventory.ts
hooks/useAdminInventoryItemDetail.ts
hooks/useAdminInventoryAdjustment.ts
hooks/useAdminInventoryItemForm.ts
mappers/inventory.mapper.ts
view-models/inventory.view-model.ts
```

Escopo fechado no backend atual:

```text
GET  /api/v1/inventory/admin/items/
POST /api/v1/inventory/admin/items/
GET  /api/v1/inventory/admin/items/:id/
POST /api/v1/inventory/admin/items/:id/adjust/
GET  /api/v1/inventory/admin/items/:id/movements/
```

Nao prometer PATCH/DELETE, reservations API ou client inventory enquanto o
backend nao publicar esses endpoints.
