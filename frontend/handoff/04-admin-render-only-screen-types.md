# 04 - Admin Render-Only Screen Types

Objetivo:

```text
fazer admin web renderizar screen types alimentados por manifests/view-models,
sem decidir status, labels, colunas e acoes dentro do componente.
```

## Arquivos Prioritarios

```text
frontend/admin/web/src/engines/rendering/screen-types/dashboard/DashboardPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/pages/ListPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/pages/DetailPage.tsx
frontend/admin/shared-core/manifests/pages/*.config.jsx
frontend/admin/shared-core/locales/pt-BR.ts
frontend/admin/shared-core/view-models/
```

## Problemas Atuais

```text
DashboardPage decide status com if status === packing/outForDelivery/etc
labels Em Embalagem, Em Transito, Entregue, Aprovado e Pendente no render
icones de widget decididos por index
ListPage/DetailPage ainda podem crescer com regras se nao forem manifest-first
```

## Meta Do Corte

```text
manifest define title/subtitle/columns/filters/actions/status tones
view-model prepara linhas e badges
admin web renderiza ListPage/DetailPage/DashboardPage
workflow de status continua no backend
```

## Admin Shared-Core Esperado

```text
frontend/admin/shared-core/contracts/admin-order.contract.ts
frontend/admin/shared-core/contracts/admin-delivery.contract.ts
frontend/admin/shared-core/api/adminOrders.api.ts
frontend/admin/shared-core/api/adminDeliveries.api.ts
frontend/admin/shared-core/hooks/useAdminOrders.ts
frontend/admin/shared-core/hooks/useAdminDeliveries.ts
frontend/admin/shared-core/view-models/adminOrders.view-model.ts
frontend/admin/shared-core/view-models/adminDeliveries.view-model.ts
```

## Prompt Para Outra IA

```text
Execute o corte 04-admin-render-only-screen-types.md.

Comece por DashboardPage e screen types standard. Mova status labels/tones/icons
para manifest ou view-model. Nao duplique workflow do backend. Se criar
adminOrders/adminDeliveries shared-core, mantenha hooks com fallback para mocks.

Rode npm run build em frontend/admin/web.
```
