# Admin View Models

View-models compartilhados do admin ecommerce. Esta pasta deve preparar dados
operacionais para telas, builders e previews sem acoplar a UI.

Proximo corte:

```text
adminOrders.view-model.ts
adminDeliveries.view-model.ts
```

Regra:

```text
view-model organiza DTO para tabela, detalhe, filtros e acoes
view-model nao valida regra real de status, estoque ou entrega
```
