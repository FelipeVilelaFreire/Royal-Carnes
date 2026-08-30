# Admin Catalog Kit

Gestao operacional do catalogo.

Inclui:

```text
produtos
variants
precos
categorias
colecoes
disponibilidade
```

Regra de catalogo continua no backend.

Mapa vertical:

```text
docs/kits/kit-02-catalog-shared-core-map.md
contract.md
flow.md
```

Arquivos runtime:

```text
contracts/catalog.contract.ts
api/catalog.api.ts
hooks/useAdminCatalog.ts
hooks/useAdminProductDetail.ts
hooks/useAdminProductForm.ts
mappers/catalog.mapper.ts
view-models/catalog.view-model.ts
```

Escopo fechado no backend atual:

```text
GET  /api/v1/catalog/admin/products/
POST /api/v1/catalog/admin/products/
```

Nao prometer update/delete enquanto o backend nao publicar esses endpoints.
