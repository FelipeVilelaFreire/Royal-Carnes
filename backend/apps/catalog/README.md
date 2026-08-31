# Catalog App

`apps.catalog` e dono do catalogo vendavel dentro de uma organization.

Pertence aqui:

- `Collection`;
- `CollectionProduct`;
- `Category`;
- `Product`;
- `ProductVariant`;
- `ProductMedia`;
- `ProductPrice`;
- `CommercialMode`;
- `CatalogAvailability`.

Regra:

```text
Collection organiza vitrine/campanha/sazonalidade.
Category organiza taxonomia.
Product e item vendavel.
CommercialMode e dado/config por organization.
```

Fase 2:

```text
catalog seed aplica Royal Carnes
catalog exemplos provam BikeClub e CamisaClub
client/admin consomem endpoint
frontend nao calcula preco ou disponibilidade real
```

Endpoints:

```text
GET  /api/v1/catalog/collections/
GET  /api/v1/catalog/products/
GET  /api/v1/catalog/products/:id/
GET  /api/v1/catalog/commercial-modes/
GET  /api/v1/catalog/admin/products/
POST /api/v1/catalog/admin/products/
```

Permissoes:

```text
products.manage -> criar/editar catalogo via admin
```

Limite atual:

```text
PATCH/DELETE admin product ainda nao estao publicados em urls.py.
Nao criar shared-core ou tela para essas rotas ate o backend existir.
```
