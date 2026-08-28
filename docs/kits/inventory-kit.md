# Inventory Kit

## 1. Objetivo

Controlar estoque simples por organization, conectado ao Catalog, sem virar ERP.

O kit cobre:

```text
produto com estoque disponivel
variant/SKU com estoque disponivel
quantidade reservada
quantidade vendavel derivada
limite simples de baixo estoque
ajuste manual auditavel
seed por dominio
```

## 2. Produtos Que Podem Reutilizar

Este kit serve para:

```text
ecommerce de produtos fisicos
assinaturas com selecao de itens
lojas com SKU/variant
cardapio com insumo simples
servicos com capacidade simples
```

Exemplos:

```text
Royal Carnes -> kg e bag
BikeClub -> unit e service
CamisaClub -> unit
```

## 3. Escopo Backend

Arquivos fonte:

```text
backend/apps/inventory/models.py
backend/apps/inventory/services.py
backend/apps/inventory/selectors.py
backend/apps/inventory/serializers.py
backend/apps/inventory/views.py
backend/apps/inventory/urls.py
backend/apps/inventory/tests/test_api.py
backend/apps/core/seed_loader.py
backend/seeds/**/kits/inventory.seed.json
```

Entidades:

```text
InventoryItem
InventoryMovement
StockReservation
```

Services/use-cases:

```text
upsert_inventory_item
adjust_inventory_item
resolve_inventory_status
```

Endpoints:

```text
GET  /api/v1/inventory/admin/items/
POST /api/v1/inventory/admin/items/
GET  /api/v1/inventory/admin/items/:id/
POST /api/v1/inventory/admin/items/:id/adjust/
GET  /api/v1/inventory/admin/items/:id/movements/
```

Permissoes:

```text
inventory.read
inventory.manage
```

Regras reais:

```text
InventoryItem pertence a organization.
InventoryItem aponta para Product e opcionalmente ProductVariant.
Variant precisa pertencer ao Product.
MeasurementUnit vem do Catalog/seed.
availableQuantity e reservedQuantity nao podem ficar negativas.
reservedQuantity nao pode passar availableQuantity.
sellableQuantity e derivado no backend.
status e recalculado pelo backend, exceto disabled.
```

## 4. Escopo Shared-Core

Ainda nao existe shared-core de inventory.

Quando houver tela admin real, criar primeiro em:

```text
frontend/admin/shared-core
```

Somente mover para `frontend/shared-core` global se client, mobile e admin
usarem o mesmo contrato.

## 5. Escopo Render

Ainda nao existe tela render de inventory.

Quando entrar UI:

```text
admin lista InventoryItem
admin ajusta quantidade manual
admin visualiza movimentos
tela nao calcula regra de estoque
```

## 6. O Que E Generico

```text
Product/ProductVariant como referencia de item vendavel
MeasurementUnit configurada por seed
available/reserved/sellable
threshold simples
movimento auditavel
permissoes inventory.read/manage
```

## 7. O Que E Especifico Do RoyalPrime

```text
nomes de produtos como Picanha, Ancho e Carvao
unidades usadas no seed Royal Carnes
quantidades iniciais do seed
copy operacional futura
```

Nada disso deve virar branch no backend.

## 8. Como Copiar/Adaptar

1. Copiar app `inventory` junto com dependencias de `core`, `organizations`, `accounts` e `catalog`.
2. Adaptar seeds de `MeasurementUnit`, `Product` e `ProductVariant`.
3. Criar `inventory.seed.json` do novo dominio.
4. Garantir permissoes `inventory.read` e `inventory.manage` nos roles operacionais.
5. Manter regra no service, nao na tela.

## 9. Seeds Esperados

Seed principal:

```text
backend/seeds/royalprime/kits/inventory.seed.json
```

Seeds de prova:

```text
backend/seeds/examples/bikeclub/kits/inventory.seed.json
backend/seeds/examples/camisaclub/kits/inventory.seed.json
backend/seeds/tests/kits/inventory.seed.json
```

## 10. Criterio Para Kit-Ready

```text
app backend implementado
seed royalprime aplicado
seeds alternativos provam unidades diferentes
API admin documentada
testes cobrem permissao, ajuste, seed e product-level sem variant
```

Status atual:

```text
local foundation
```

## 11. Criterio Para ServiceOS Candidate

So considerar depois que outro produto real usar o kit.

Antes disso, Inventory continua RoyalPrime-local com arquitetura copiavel.
