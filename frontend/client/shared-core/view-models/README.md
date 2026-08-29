# Client View Models

View-models compartilhados do ecommerce client. Esta pasta deve preparar dados
de catalogo, checkout, conta, assinaturas, pedidos e entregas para as surfaces.

Proximo corte:

```text
orders.view-model.ts
deliveries.view-model.ts
```

Regra:

```text
view-model adapta DTO para render
view-model nao calcula regra de negocio real
```
