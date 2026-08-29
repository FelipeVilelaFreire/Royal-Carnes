# Shared-Core Kit Reset Result

Branch:

```text
feature/shared-core-kit-reset
```

## Objetivo Executado

O runtime funcional prematuro de shared-core foi removido para permitir que a
camada renasca por kits, comecando pelo Kit 01 Auth & Users.

O reset preserva produto e navegabilidade, mas remove a falsa maturidade de
hooks, API clients, contratos e view-models criados antes do contrato final.

## Preservado

```text
docs/kits/
frontend/shared-core/README.md
frontend/shared-core/config.ts
frontend/shared-core/contracts/README.md
frontend/shared-core/kits/
frontend/shared-core/manifest/
frontend/shared-core/public/
frontend/client/shared-core/README.md
frontend/client/shared-core/kits/
frontend/client/shared-core/locales/
frontend/client/shared-core/manifests/
frontend/client/shared-core/mocks/
frontend/client/shared-core/navigation/
frontend/admin/shared-core/README.md
frontend/admin/shared-core/kits/
frontend/admin/shared-core/locales/
frontend/admin/shared-core/manifests/
frontend/admin/shared-core/mocks/
frontend/admin/shared-core/navigation/
```

## Removido

```text
frontend/shared-core/client/
frontend/shared-core/admin/
frontend/shared-core/contracts/index.ts
frontend/shared-core/identity.ts
frontend/shared-core/foundation.ts

frontend/client/shared-core/api/*.ts
frontend/client/shared-core/hooks/*.ts
frontend/client/shared-core/contracts/*.ts
frontend/client/shared-core/view-models/*.ts

frontend/admin/shared-core/api/*.ts
frontend/admin/shared-core/hooks/*.ts
frontend/admin/shared-core/contracts/*.ts
frontend/admin/shared-core/view-models/*.ts
```

READMEs das pastas tecnicas foram mantidos para documentar onde o runtime deve
renascer.

## Ajustes De Build

As telas que importavam hooks/view-models removidos voltaram a usar mocks e um
adapter local temporario de render:

```text
frontend/client/web/src/product-components/ecommerce/orderDisplayModel.ts
frontend/client/web/src/screens/portal/tabs/MeusPedidosView.tsx
frontend/client/web/src/screens/portal/tabs/MinhaContaView.tsx
frontend/client/web/src/product-components/ecommerce/OrderDetailModal.tsx
frontend/admin/web/src/engines/rendering/screen-types/dashboard/DashboardPage.tsx
```

Esse adapter local nao deve virar padrao de shared-core. Ele existe apenas para
manter o frontend funcionando enquanto o Kit 01 e os proximos kits renascem.

## Proxima Etapa

Recriar o shared-core funcional nesta ordem:

```text
1. Kit 01 Auth & Users
2. contratos globais minimos de identity/organization
3. client auth/customer
4. admin auth/users/permissions
5. somente depois catalog/subscriptions/orders/deliveries
```

Regra:

```text
global recebe apenas o que client, mobile e admin realmente compartilham
client recebe fluxo do cliente
admin recebe fluxo operacional
web/native/admin-web ficam render-only
```
