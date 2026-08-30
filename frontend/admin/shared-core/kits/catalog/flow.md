# Admin Catalog Flow

List:

```text
admin screen render-only
  -> useAdminCatalog().load()
  -> adminCatalogApi.listProducts()
  -> GET /api/v1/catalog/admin/products/
  -> mapAdminProductDto()
  -> createAdminCatalogViewModel()
```

Create:

```text
admin screen render-only
  -> useAdminProductForm()
  -> useAdminCatalog().create(input)
  -> mapAdminProductFormInput()
  -> POST /api/v1/catalog/admin/products/
  -> backend create_admin_product()
  -> mapAdminProductDto()
```

Detail:

```text
admin screen render-only
  -> useAdminProductDetail().load(productId)
  -> adminCatalogApi.detail(productId)
  -> GET /api/v1/catalog/products/:id/
```

Backend authority:

```text
products.manage permission gates admin list/create
backend decides price persistence, category relations, variants and availability
frontend never hardcodes product names, plan names or commercial modes
```
