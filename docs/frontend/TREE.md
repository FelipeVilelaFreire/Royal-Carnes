# RoyalPrime Frontend Tree

> Status: referencia ou registro de estado; nao e contrato ativo.
> Regras e leitura por tarefa: [CODEX_ENTRYPOINTS.md](../../docs/CODEX_ENTRYPOINTS.md).
> Trees, exemplos, proximos passos e instrucoes antigas abaixo devem ser
> confrontados com os contratos ativos e o codigo; nao autorizam excecoes.

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

## Fases De Tela

O trabalho atual deve fechar a Fase 1 das telas antes de buscar acabamento
visual fino em cada uma.

```text
Fase 1 - funcional primeiro
  -> dados essenciais aparecem
  -> inputs, filtros, botoes e steps executam a acao esperada
  -> screen chama hooks/actions e nao calcula regra de negocio pesada
  -> view-model prepara estado de renderizacao
  -> API client conversa com backend real
  -> fallback mockado fica explicito no shared-core correto
  -> product-components reutilizaveis ficam fora da screen
  -> design fica apresentavel, consistente e Foundation-first

Fase 2 - design melhorado
  -> ajustar detalhe fino de layout, contraste, borda, animacao e ritmo
  -> promover padroes repetidos para Foundation/AppShell quando provado
  -> revisar visual depois que o fluxo ja estiver separado
```

Detalhe visual pequeno nao deve bloquear a migracao funcional de uma tela quando
o design ja esta apresentavel. A prioridade e melhorar a tree e deixar tudo
mudavel por backend, shared-core, manifest ou locale.

## Roadmap Operacional Por Tela

Cada tela deve ser migrada por etapas, com pausa antes de extrair componentes
ou criar UI nova.

```text
1. Layout/config
   -> AppShell, Layout, config.jsx/manifest e grid/padding locais

2. Locales/strings
   -> copy de interface para locales; dados livres continuam dados

3. Mapa de componentes
   -> identificar componentes locais, product-components e possiveis UI

4. Proposta de extracao
   -> listar destino dos itens sem mover ainda

PAUSA
   -> pedir aprovacao do usuario antes de extrair ou criar UI

5. Extrair itens aprovados
   -> mover para screen components, product-components ou shared-core correto

6. Avaliar UI nova
   -> so propor Foundation/ServiceOS quando for generico e reutilizavel

7. Criar UI aprovada
   -> sem design system paralelo e sem prefixos native artificiais

8. Aplicar design-system
   -> UI, semi-composed, theme, AppShell e tokens no lugar correto

9. Audit geral
   -> render-only, locale, manifest, backend/fallback, responsivo e builds
```

Para `MontarBox/PedidoView`, os Passos 1-4 devem produzir primeiro um mapa de
layout, copy, estado, calculos, mocks e componentes candidatos. A extracao so
comeca depois da aprovacao explicita desse mapa.

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
1. MontarBox/PedidoView: extrair fluxo funcional para shared-core.
2. Client contracts para checkout/orders/deliveries.
3. Client API clients para catalogo, checkout, orders e deliveries.
4. Client hooks com fallback explicito para mocks atuais.
5. PedidoView render-only lendo view-model e disparando actions.
6. MeusPedidosView lendo hook em vez de mock direto.
7. Admin contracts/API/hooks para catalog, orders e deliveries.
8. Admin pages ligando listagem, detalhe, transicao e confirmacao.
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
