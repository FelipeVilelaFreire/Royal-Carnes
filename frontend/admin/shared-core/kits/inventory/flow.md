# Admin Inventory Flow

## Lista

```text
screen render-only
  -> useAdminInventory.load()
  -> adminInventoryApi.listItems()
  -> GET /api/v1/inventory/admin/items/
  -> mapper
  -> view-model rows/totals
```

## Criacao Ou Upsert

```text
screen render-only
  -> useAdminInventory.create(input)
  -> adminInventoryApi.create(input)
  -> POST /api/v1/inventory/admin/items/
  -> backend upsert_inventory_item
  -> mapper
  -> snapshot atualizado
```

## Detalhe E Movimentos

```text
screen render-only
  -> useAdminInventoryItemDetail(itemId).load()
  -> GET /api/v1/inventory/admin/items/:id/
  -> GET /api/v1/inventory/admin/items/:id/movements/
  -> mapper
  -> detail row + movement rows
```

## Ajuste Manual

```text
screen render-only
  -> useAdminInventoryAdjustment(itemId, input).submit()
  -> POST /api/v1/inventory/admin/items/:id/adjust/
  -> backend valida e audita
  -> mapper
  -> item ajustado
```

## Limite

Tela nao calcula disponibilidade real nem muda status por conta propria. Ela
apenas apresenta o que o backend devolve.
