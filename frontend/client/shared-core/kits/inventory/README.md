# Client Inventory Kit

Inventory nao tem runtime client neste corte.

Motivo:

```text
backend publica somente endpoints admin de inventory
estoque e uma regra operacional
client deve receber disponibilidade via Catalog, Orders ou Checkout quando o backend publicar
```

Nao criar fetch direto para `/api/v1/inventory/admin/*` em tela client.

Quando houver endpoint client real, criar a sequencia:

```text
contracts/inventory.contract.ts
api/inventory.api.ts
mappers/inventory.mapper.ts
view-models/inventory.view-model.ts
hooks/useClientInventory...
```

ate la, este README e apenas fronteira de ownership.
