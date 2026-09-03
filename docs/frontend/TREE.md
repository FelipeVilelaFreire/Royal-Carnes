# RoyalPrime Frontend Tree

Este documento e o mapa operacional do frontend antes de ligar Orders e
Deliveries nas telas reais.

## Regra Central

```text
backend
  -> regra real, persistencia, validacao, autorizacao, calculo e auditoria

shared-core do escopo correto
  -> contratos, DTOs, API clients, hooks, mappers, view-models e mocks temporarios

web/mobile/admin
  -> renderizacao, layout, inputs, botoes, modais, tabelas e chamada dos hooks
```

## Direcao De Reuso

```text
backend
  -> reutilizavel por seed/config

frontend/client/shared-core e frontend/admin/shared-core
  -> reutilizaveis por funcao/kit

frontend/client/web, frontend/client/mobile e frontend/admin/web
  -> render-only
  -> manifest-driven aos poucos
```

Na pratica:

```text
hooks/API/mappers/view-models ficam no shared-core do kit
telas apenas chamam actions e renderizam estado
manifest/locales/navigation/config reduzem hardcode visual/composicional
backend continua dono de regra real
```

## Tree Atual

```text
frontend/
  foundation/
    docs/

  shared-core/
    README.md
    config.ts
    contracts/
    kits/
      identity/
      organization/
      money/
      address/
      manifest/
    manifest/
    public/

  client/
    shared-core/
      README.md
      api/
      contracts/
      hooks/
      kits/
        auth/
        customer/
        catalog/
        subscriptions/
        orders/
        deliveries/
        checkout/
      locales/
      mappers/
      manifest/
      mocks/
      navigation/
      view-models/

    web/
      docs/
      src/
        screens/
        product-components/

  admin/
    shared-core/
      README.md
      api/
      contracts/
      hooks/
      kits/
        auth/
        users/
        customers/
        catalog/
        subscriptions/
        inventory/
        orders/
        deliveries/
        dashboard/
      locales/
      mappers/
      manifest/
      mocks/
      navigation/
      view-models/

    web/
```

## Ownership

## Status Atual Do Reset

```text
branch: feature/shared-core-kit-reset
runtime funcional de shared-core resetado
hooks/API/contracts/view-models serao recriados por kit
```

Foram removidos os legados:

```text
frontend/shared-core/client
frontend/shared-core/admin
```

### frontend/shared-core

Somente contratos e referencias realmente comuns entre client, mobile e admin.

Pertence aqui:

```text
OrganizationId
Money
Address
identidade comum do produto
contratos globais de manifest/config
assets publicos comuns
```

Nao pertence aqui:

```text
orders.api.ts
deliveries.api.ts
useMyOrders
useAdminOrders
strings exclusivas do client/admin
navegacao exclusiva de surface
runtime visual
```

As pastas `frontend/shared-core/client` e `frontend/shared-core/admin` sao
legado removido. Novos fluxos devem nascer em `frontend/client/shared-core` ou
`frontend/admin/shared-core`.

### frontend/client/shared-core

Dono dos fluxos reutilizaveis entre cliente web e futuro cliente mobile.

Mentalidade de kit:

```text
kit = capacidade de produto organizada por contrato e fluxo
kit nao e tela
kit nao e visual
kit nao contem regra real que pertence ao backend
```

Tree ideal de um kit client:

```text
kits/<capability>/
  README.md
  contract.md
  flow.md
```

Arquivos runtime ainda podem ficar nas pastas tecnicas enquanto a tree amadurece:

```text
contracts/<capability>.contract.ts
api/<capability>.api.ts
hooks/use<Capability>.ts
mappers/<capability>.mapper.ts
view-models/<capability>.view-model.ts
```

Proximo corte natural:

```text
kits/orders/
kits/deliveries/
contracts/order.contract.ts
contracts/delivery.contract.ts
api/orders.api.ts
api/deliveries.api.ts
hooks/useMyOrders.ts
hooks/useMyDeliveries.ts
view-models/orders.view-model.ts
view-models/deliveries.view-model.ts
```

Screens que devem consumir esse corte:

```text
frontend/client/web/src/screens/portal/tabs/PedidoView.tsx
frontend/client/web/src/screens/portal/tabs/MeusPedidosView.tsx
frontend/client/web/src/screens/portal/tabs/MinhaContaView.tsx
```

### frontend/admin/shared-core

Dono dos fluxos reutilizaveis dentro do Admin.

Mentalidade de kit:

```text
kit admin = capacidade operacional organizada
admin shared-core pode ter comandos, filtros e estados de operacao
admin web apenas renderiza tabelas, modais, detalhes e botoes
```

Tree ideal de um kit admin:

```text
kits/<capability>/
  README.md
  contract.md
  flow.md
```

Arquivos runtime ainda podem ficar nas pastas tecnicas enquanto a tree amadurece:

```text
contracts/admin-<capability>.contract.ts
api/admin<Capability>.api.ts
hooks/useAdmin<Capability>.ts
mappers/admin<Capability>.mapper.ts
view-models/admin<Capability>.view-model.ts
```

Proximo corte natural:

```text
kits/orders/
kits/deliveries/
contracts/admin-order.contract.ts
contracts/admin-delivery.contract.ts
api/adminOrders.api.ts
api/adminDeliveries.api.ts
hooks/useAdminOrders.ts
hooks/useAdminDeliveries.ts
view-models/adminOrders.view-model.ts
view-models/adminDeliveries.view-model.ts
```

Admin screens/builders devem consumir hooks/API desse escopo, nao chamar
endpoint direto.

## Ordem Recomendada

```text
1. Client contracts para Orders/Deliveries.
2. Client API clients para endpoints /orders/me e /deliveries/me.
3. Client hooks com fallback para mocks atuais.
4. MeusPedidosView lendo hook em vez de mock direto.
5. PedidoView enviando create_order pelo hook.
6. Admin contracts/API/hooks para orders e deliveries.
7. Admin pages ligando listagem, detalhe, transicao e confirmacao.
```

Audit render-only:

```text
docs/frontend/RENDER_ONLY_AUDIT.md
```

Use esse arquivo para priorizar a migracao de copy, status, filtros, steps e
comandos hardcoded para shared-core, manifest e view-models.

Handoff para outra IA:

```text
docs/handoff/README.md
docs/handoff/01-client-orders-deliveries-shared-core.md
docs/handoff/02-client-orders-screens-render-only.md
docs/handoff/03-client-landing-manifest-copy.md
docs/handoff/04-admin-render-only-screen-types.md
docs/handoff/05-checklists-and-validation.md
```

## Fora Deste Corte

```text
scheduling
recorrencia de entrega
Royal Box recorrente
pagamentos
extracao para ServiceOS
```

Esses temas continuam planejados, mas nao devem poluir o primeiro corte de
shared-core.
