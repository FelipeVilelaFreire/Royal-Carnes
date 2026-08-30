# Admin Inventory Contract

## Backend Real

```text
GET  /api/v1/inventory/admin/items/
POST /api/v1/inventory/admin/items/
GET  /api/v1/inventory/admin/items/:id/
POST /api/v1/inventory/admin/items/:id/adjust/
GET  /api/v1/inventory/admin/items/:id/movements/
```

## DTOs

```text
AdminInventoryItemDto
AdminInventoryMovementDto
AdminInventoryItemUpsertDto
AdminInventoryAdjustmentDto
```

## Views

```text
AdminInventoryItemView -> InventoryItemBase
AdminInventoryMovementView -> InventoryMovementBase
```

## Inputs

```text
AdminInventoryItemFormInput
AdminInventoryAdjustmentInput
```

## Regras Que Nao Moram Aqui

```text
available/reserved negativo
reserved maior que available
sellableQuantity
status derivado
variant precisa pertencer ao product
permission read/manage
auditoria de movimento
```

Essas regras continuam em `backend/apps/inventory/services.py` e nas views.
