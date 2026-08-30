# Client Catalog Flow

List:

```text
screen render-only
  -> useClientCatalog().load()
  -> clientCatalogApi.listCollections()
  -> clientCatalogApi.listCommercialModes()
  -> clientCatalogApi.listProducts()
  -> backend public catalog endpoints
  -> mappers
  -> createClientCatalogViewModel()
```

Product detail:

```text
screen render-only
  -> useClientProductDetail().load(productId)
  -> clientCatalogApi.detail(productId)
  -> GET /api/v1/catalog/products/:id/
  -> mapClientProductDto()
  -> ClientProductCardViewModel
```

Backend authority:

```text
backend decide status, preco, disponibilidade real e organization
client shared-core filtra apenas view-model ja recebido
screen nao calcula preco, disponibilidade real ou regra comercial
```
