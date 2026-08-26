# RoyalPrime para ServiceOS Ecommerce - Tree Ideal e De/Para

## Objetivo

Este documento registra a organizacao-alvo para o RoyalPrime evoluir, aos poucos, para um futuro `services/ecommerce` no ServiceOS.

A regra nao e fingir que o MVP ja esta 100% ServiceOS. A regra e deixar a tree atual organizada de um jeito que cada pasta tenha um destino futuro claro.

```text
Arquitetura segue ServiceOS.
Implementacao pode continuar MVP/local enquanto a capacidade ainda nao amadureceu.
```

## ServiceOS ideal

```text
ServiceOS/
  control-panel/
    backend/
    frontend/

  platform/
    foundation/
      design-system/
        theme/
          core/
          web/
          native/

        semi-composed/
          core/
          web/
          native/

        ui/
          core/
          web/
          native/

      shells/
        app-shell/
          core/
            contracts/
            navigation/
            layout/
            resolver/
          web/
            Header/
            Footer/
            Drawer/
            Sidebar/
            BottomTabBar/
          native/
            Header/
            Footer/
            Drawer/
            BottomTabBar/

      product-components/
        ecommerce/
          core/
            contracts/
            resolvers/
            view-models/
          web/
            ProductItemCard/
            PlanSummaryCard/
            OrderSummary/
            CatalogShowcaseCard/
          native/
            ProductItemCard/
            PlanSummaryCard/
            OrderSummary/
            CatalogShowcaseCard/

    frameworks/
      admin/
        core/
          builder-shared/
          publication/
          draft/
        web/
          BuilderRuntime/
          PreviewRuntime/

      application/
        core/
        web/
        native/

  services/
    ecommerce/
      service.manifest.ts

      backend/
        catalog/
        checkout/
        orders/
        customers/
        subscriptions/

      frontend/
        shared-core/
          contracts/
            catalog.contract.ts
            checkout.contract.ts
            order.contract.ts
            customer.contract.ts
            subscription.contract.ts

          manifests/
            ecommerce.defaults.ts
            app-shell.manifest.ts
            landing.manifest.ts
            web-app.manifest.ts
            mobile-app.manifest.ts
            admin.manifest.ts
            catalog.manifest.ts
            checkout.manifest.ts

          locales/
            pt-BR.ts
            en-US.ts

          navigation/
            web.navigation.ts
            mobile.navigation.ts
            admin.navigation.ts

          view-models/
            catalog.view-model.ts
            checkout.view-model.ts
            order.view-model.ts

          mocks/
            catalog/
            checkout/
            orders/
            customers/
            subscriptions/

        web/
          screens/
            landing/
            portal/
            catalog/
            checkout/
            account/
          modules/
            catalog/
            checkout/
            account/
            subscriptions/

        mobile/
          screens/
            home/
            catalog/
            checkout/
            account/
          modules/
            catalog/
            checkout/
            account/

        admin/
          builders/
            ecommerceAdminBuilder.config.tsx
            ecommerceLandingBuilder.config.tsx
            ecommerceWebAppBuilder.config.tsx
            ecommerceMobileAppBuilder.config.tsx
          screens/
            catalog/
            orders/
            customers/
            subscriptions/
          modules/
            catalog/
            orders/
            customers/
```

## Donos no ServiceOS

`platform/foundation/design-system/ui` e dono de primitives genericas: `Button`, `Card`, `Input`, `Select`, `Badge`, `Text`, `Icon`, `Surface`.

`platform/foundation/shells/app-shell` e dono da casca generica: `Header`, `Footer`, `Drawer`, `Sidebar`, `BottomTabBar`, layout, navegacao e resolver de AppShell.

`platform/foundation/product-components/ecommerce` e dono de componentes reutilizaveis de ecommerce: `ProductItemCard`, `PlanSummaryCard`, `OrderSummary`, `CatalogShowcaseCard`. Eles nao sao primitives; eles compoem Foundation UI e contratos de ecommerce.

`services/ecommerce` e dono do produto operacional: contratos, manifestos, mocks, regras, telas, builders, modulos e integracao com backend.

`platform/frameworks/admin` e dono do motor generico de Builder/Admin. O Admin de ecommerce nao recria o motor; ele declara configs e screens especificas usando esse framework.

## RoyalPrime tree de transicao

Esta e a tree recomendada para o RoyalPrime agora, antes de mover qualquer coisa para ServiceOS:

```text
RoyalPrime/frontend/client/
  shared-core/
    contracts/
      catalog.contract.ts
      checkout.contract.ts
      customer.contract.ts

    manifests/
      app-shell.manifest.ts
      landing.manifest.ts
      portal.manifest.ts
      catalog.manifest.ts
      checkout.manifest.ts

    locales/
      pt-BR.ts

    navigation/
      client.navigation.ts

    mocks/
      catalog/
      checkout/
      customer/

    view-models/
      catalog.view-model.ts
      checkout.view-model.ts

  web/
    src/
      legacy/
        design-system/
          Button.tsx
          Card.tsx
          Input.tsx
          Select.tsx
          Badge.tsx
          Icons.tsx

        app-shell/
          Header.tsx
          PublicHeader.tsx
          Footer.tsx
          BottomTabBar.tsx
          AppearOnScrollRuntime.tsx

      product-components/
        ecommerce/
          ProductItemCard.tsx
          PlanSummaryCard.tsx
          OrderSummary.tsx
          CatalogShowcaseCard.tsx

      modules/
        catalog/
        checkout/
        account/
        subscriptions/

      screens/
        landing/
        portal/
        catalog/
        checkout/
        account/
```

## RoyalPrime admin futuro

Quando o Admin entrar no RoyalPrime, ele deve seguir a mesma separacao:

```text
RoyalPrime/frontend/admin/
  shared-core/
    contracts/
    manifests/
    locales/
    navigation/
    mocks/
    view-models/

  web/
    src/
      builders/
        ecommerceAdminBuilder.config.tsx
        ecommerceLandingBuilder.config.tsx
        ecommerceWebAppBuilder.config.tsx
        ecommerceMobileAppBuilder.config.tsx

      screens/
        catalog/
        orders/
        customers/
        subscriptions/

      modules/
        catalog/
        orders/
        customers/
        subscriptions/
```

O Admin edita manifestos/configs do ecommerce. Ele nao cria uma segunda implementacao do AppShell, dos product components ou do builder-shared.

## De/Para

| RoyalPrime transicao | Papel atual | Destino futuro |
| --- | --- | --- |
| `frontend/client/shared-core/contracts` | Contratos de dados e dominio | `ServiceOS/services/ecommerce/frontend/shared-core/contracts` |
| `frontend/client/shared-core/manifests` | Configuracao declarativa de AppShell, landing, portal, catalogo e checkout | `ServiceOS/services/ecommerce/frontend/shared-core/manifests` |
| `frontend/client/shared-core/locales` | Textos traduziveis de UI | `ServiceOS/services/ecommerce/frontend/shared-core/locales` |
| `frontend/client/shared-core/navigation` | Navegacao declarativa | `ServiceOS/services/ecommerce/frontend/shared-core/navigation` |
| `frontend/client/shared-core/mocks` | Dados MVP/dev | `ServiceOS/services/ecommerce/frontend/shared-core/mocks` |
| `frontend/client/web/src/legacy/design-system` | Primitives visuais locais/MVP | `ServiceOS/platform/foundation/design-system/ui` |
| `frontend/client/web/src/legacy/app-shell` | Casca local/MVP | `ServiceOS/platform/foundation/shells/app-shell` |
| `frontend/client/web/src/product-components/ecommerce` | Componentes reutilizaveis de ecommerce | `ServiceOS/platform/foundation/product-components/ecommerce` |
| `frontend/client/web/src/modules` | Logica web por dominio | `ServiceOS/services/ecommerce/frontend/web/modules` |
| `frontend/client/web/src/screens` | Telas navegaveis | `ServiceOS/services/ecommerce/frontend/web/screens` |
| `frontend/admin/web/src/builders` | Configs de builder da surface | `ServiceOS/services/ecommerce/frontend/admin/builders` |
| `frontend/admin/web/src/screens` | Telas admin especificas do ecommerce | `ServiceOS/services/ecommerce/frontend/admin/screens` |

## Regras de classificacao

Se for primitive visual generica, o destino ideal e Foundation UI. No RoyalPrime MVP, fica em `legacy/design-system`.

Se for Header, Footer, BottomTabBar, Drawer, Sidebar, navegacao de casca ou comportamento de layout global, o destino ideal e AppShell. No RoyalPrime MVP, fica em `legacy/app-shell`.

Se for componente reutilizavel de ecommerce, fica em `product-components/ecommerce`, mesmo que por enquanto ainda consuma primitives legacy.

Se for regra, estado, hook ou composicao de uma area da aplicacao, fica em `modules`.

Se for tela navegavel, fica em `screens`.

Se for contrato, manifesto, locale, navegacao, mock ou view-model que nao depende de React/Web, fica em `shared-core`.

## Cadeia ideal

```text
Admin Builder
  -> edita manifestos do ecommerce

Manifestos ecommerce
  -> configuram AppShell, catalogo, checkout, landing, web e mobile

Web/Mobile runtime
  -> renderizam telas reais usando AppShell + Product Components + Foundation

Backend
  -> fornece dados reais depois; mocks ficam como fallback/dev
```

## Decisao atual

O RoyalPrime deve continuar com uma tree normal de produto, sem tentar copiar a tree inteira do ServiceOS agora.

O que provavelmente sera transcrito ou promovido para ServiceOS no futuro:

```text
1. screens
   -> servem como evidencia real de fluxos, composicoes e necessidades de produto.

2. product-components/ecommerce
   -> componentes reutilizaveis de ecommerce, como ProductItemCard.
```

O restante nao deve ser promovido automaticamente. Antes de qualquer transcricao para ServiceOS, cada arquivo passa por filtro:

```text
E reutilizavel fora do RoyalPrime?
  -> sim: candidato a ServiceOS.
  -> nao: fica no produto.

E regra especifica do RoyalPrime, dado mockado, copy, imagem, atalho MVP ou runtime local?
  -> fica no RoyalPrime ou e descartado na migracao.

E primitive visual ou AppShell local?
  -> nao sobe como esta; serve apenas como referencia temporaria ate usar a Foundation/AppShell real.
```

Portanto, a tree local deve ser simples e legivel:

```text
shared-core
  -> dados, manifests, locales, navigation, contratos e view-models do produto.

web/src/screens
  -> telas reais que mostram o que o ecommerce precisa.

web/src/product-components/ecommerce
  -> componentes de ecommerce com potencial de reuso.

web/src/modules
  -> logica local por dominio.

web/src/legacy ou local runtime
  -> suporte MVP que nao deve ser promovido automaticamente.
```

Primeira etapa feita:

```text
1. Separar legacy/design-system de legacy/app-shell.
2. Mover componentes reutilizaveis de ecommerce para product-components/ecommerce.
3. Renomear views para screens. Feito no client web.
4. Reorganizar shared-core em contracts, manifests, locales, navigation, mocks e view-models.
5. Aplicar aliases/imports novos sem alterar comportamento.
```

Proxima regra: nao continuar reorganizando por previsao abstrata. A partir daqui, mexer principalmente em `screens` e `product-components/ecommerce`, porque esses dois blocos vao revelar, com evidencia real, o que merece virar ServiceOS.

## Foco operacional

A partir deste ponto, trabalharemos principalmente em duas pastas:

```text
frontend/client/web/src/screens
frontend/client/web/src/product-components/ecommerce
```

Essas duas pastas sao a fonte de evidencia real para um futuro ServiceOS Ecommerce.

`screens` mostra os fluxos reais: landing, portal, catalogo, checkout, conta, assinatura e cortes.

`product-components/ecommerce` concentra componentes reutilizaveis de ecommerce que podem virar Product Components no ServiceOS depois de amadurecerem.

As outras pastas continuam existindo, mas nao sao o foco principal de evolucao para ServiceOS:

```text
legacy/design-system
  -> suporte visual MVP/local.

legacy/app-shell
  -> casca MVP/local.

modules
  -> logica local por dominio.

shared-core
  -> dados, manifests, locales, navigation, contratos e view-models do produto.
```

## Como documentar cada evolucao

Sempre que uma screen ou product component for amadurecido, registrar uma ficha neste documento.

Modelo:

```md
## Item: NomeDoItem

Tipo:
screen | product-component

Local atual:
`caminho/do/arquivo`

Status atual:
- O que ele faz hoje.
- Quais dependencias legacy ainda usa.
- Quais dados/mocks/manifests consome.
- Quais partes ainda estao hardcoded.

Manifest necessario:
- `nome.manifest.ts`
- O que esse manifest deve controlar.

Contrato necessario:
- Props, estados, eventos, slots e variacoes.

Filtro ServiceOS:
- Reutilizavel fora do RoyalPrime? sim/nao.
- Depende de regra especifica do RoyalPrime? sim/nao.
- Depende de mock/copy/imagem local? sim/nao.
- Depende de legacy design-system/app-shell? sim/nao.

Proximo passo:
- Pequena acao concreta para aproximar do padrao ServiceOS.
```

## Fichas iniciais

### Item: ProductItemCard

Tipo:
product-component

Local atual:
`frontend/client/web/src/product-components/ecommerce/ProductItemCard.tsx`

Status atual:
- Componente reutilizavel de ecommerce.
- Usado por screens reais de pedido/catalogo.
- Ainda consome `legacy/design-system`.
- Ainda recebe tokens visuais diretamente por props.
- Ainda possui estilos inline.

Manifest necessario:
- `product-item-card.manifest.ts`
- Deve declarar variantes, estados visuais, acoes disponiveis, campos exibidos e comportamento de preco/favorito/quantidade.

Contrato necessario:
- Props de produto.
- Estados de selecao, favorito e quantidade.
- Eventos de adicionar, remover e favoritar.
- Variacoes de exibicao para catalogo, pedido e showcase.

Filtro ServiceOS:
- Reutilizavel fora do RoyalPrime? sim.
- Depende de regra especifica do RoyalPrime? parcialmente.
- Depende de mock/copy/imagem local? parcialmente.
- Depende de legacy design-system/app-shell? sim.

Proximo passo:
- Criar um manifest local do ProductItemCard antes de mudar visual ou comportamento.

### Item: Pedido Screen

Tipo:
screen

Local atual:
`frontend/client/web/src/screens/portal/tabs/PedidoView.tsx`

Status atual:
- Screen real de pedido/checkout.
- Usa mocks de catalogo, frete, pagamento e assinatura.
- Ja consome `ProductItemCard`.
- Ainda mistura estado, fluxo, layout e composicao na mesma screen.

Manifest necessario:
- `checkout.manifest.ts`
- Deve declarar etapas, modos comerciais, opcoes de frete, pagamento, labels por chave e componentes esperados.

Contrato necessario:
- Modelo de carrinho.
- Modelo de frete.
- Modelo de pagamento.
- Eventos de adicionar/remover produto e finalizar pedido.

Filtro ServiceOS:
- Reutilizavel fora do RoyalPrime? como fluxo, sim; como copy/regra exata, nao.
- Depende de regra especifica do RoyalPrime? sim.
- Depende de mock/copy/imagem local? sim.
- Depende de legacy design-system/app-shell? sim.

Proximo passo:
- Extrair primeiro um `checkout.manifest.ts` local e deixar a screen ler mais comportamento dele.

### Item: Cortes Screen

Tipo:
screen

Local atual:
`frontend/client/web/src/screens/portal/tabs/CortesView.tsx`

Status atual:
- Screen real de catalogo/cortes.
- Usa mocks de cortes.
- Ja consome `ProductItemCard`.
- Ainda mistura filtros, busca, favoritos, layout e composicao.

Manifest necessario:
- `catalog.manifest.ts`
- Deve declarar filtros, ordenacao, categorias, estados vazios, labels por chave e modo de exibicao dos cards.

Contrato necessario:
- Modelo de produto/corte.
- Modelo de filtro.
- Modelo de favorito.
- Eventos de busca, filtro, ordenacao e favoritar.

Filtro ServiceOS:
- Reutilizavel fora do RoyalPrime? como padrao de catalogo, sim; como dados/copy, nao.
- Depende de regra especifica do RoyalPrime? parcialmente.
- Depende de mock/copy/imagem local? sim.
- Depende de legacy design-system/app-shell? sim.

Proximo passo:
- Criar primeiro um `catalog.manifest.ts` local e mover configuracao de filtros/labels para ele.

### Item: MinhaConta Screen e Customer/Orders Mocks

Tipo:
screen

Local atual:
`frontend/client/web/src/screens/portal/tabs/MinhaContaView.tsx`

Mocks locais:
- `frontend/client/shared-core/mocks/customer.mock.ts`
- `frontend/client/shared-core/mocks/orders/orders.mock.ts`

Status atual:
- Screen real de conta do cliente logado.
- A rota `/minha-conta` renderiza a screen direta com `PortalHeader` e `BottomTabBar` legados; quando o mock de auth esta deslogado, mostra empty state local com `AuthModal`.
- Passou a consumir mock de cliente para dados pessoais, enderecos, pagamentos, notificacoes, assinatura ativa e faturas.
- Planos exibidos na conta usam `catalogSubscriptionPlansMock`, mantendo a mesma fonte de Basic/Premium/Pro usada pela Home e pelo Pedido.
- Passou a consumir mock de pedidos para pedido em andamento, historico, Royal Delivery e ciclo vinculado a assinatura.
- Decisao MVP: o historico de pedidos do cliente nao usa mais `royalBox`; por enquanto mostra apenas `subscriptionCycle` e `royalDelivery`.
- O card de uso/capacidade passou a ler `cycleUsage` calculado a partir dos itens do ciclo da assinatura mockado e dos limites do plano ativo, em vez de usar numeros fixos no JSX.
- Ainda consome `legacy/design-system` e `legacy/app-shell`.
- Ainda possui bastante copy/layout inline legado; a prioridade desta etapa foi separar os dados comerciais do JSX.

Manifest necessario:
- `account.manifest.ts`
- `orders.manifest.ts`
- Devem declarar secoes da conta, tipos comerciais de pedido, status exibidos, acoes disponiveis e campos visiveis por tipo.

Contrato necessario:
- Modelo de cliente.
- Modelo de endereco.
- Modelo de pagamento/fatura.
- Modelo de assinatura do cliente.
- Modelo de ciclo de assinatura com uso de cortes, peso e complementos.
- Modelo de pedido com `kind`, `status`, `customerId`, vinculo opcional com `subscriptionId`, entrega, pagamento, itens, timeline e avaliacao.

Filtro ServiceOS:
- Reutilizavel fora do RoyalPrime? como modelo de ecommerce/account/orders, sim.
- Depende de regra especifica do RoyalPrime? parcialmente.
- Depende de mock/copy/imagem local? sim.
- Depende de legacy design-system/app-shell? sim.

Proximo passo:
- Criar `MeusPedidosView` consumindo os mesmos mocks de orders e decidir depois se `OrderStatusTimeline` ou `OrderHistoryCard` merecem virar `product-components/ecommerce`.

### Item: MeusPedidos Screen

Tipo:
screen

Local atual:
`frontend/client/web/src/screens/portal/tabs/MeusPedidosView.tsx`

Rota:
`/meus-pedidos`

Status atual:
- Screen real de acompanhamento de pedidos do cliente logado.
- A rota `/meus-pedidos` renderiza a screen direta com `PortalHeader` e `BottomTabBar` legados; quando o mock de auth esta deslogado, mostra empty state local com `AuthModal`.
- Consome `royalCustomerOrdersMock`, `royalCustomerBoxesMock`, `royalCustomerMock` e `catalogSubscriptionPlansMock`.
- Mostra resumo operacional, pedido atual, timeline, codigo de entrega, itens, proxima Royal Box e historico.
- Ainda usa `legacy/design-system` e `legacy/app-shell`.
- A timeline e o card de historico ainda nasceram locais na screen, aguardando evidencia antes de extrair.

Manifest necessario:
- `orders.manifest.ts`
- Deve declarar status, etapas da timeline, filtros, acoes por status, campos por tipo de pedido e comportamento de avaliacao/repeticao.

Contrato necessario:
- Props de pedido.
- Props de timeline.
- Eventos de ver detalhes, repetir pedido, avaliar e editar caixa.
- Variacoes por `kind`: `subscriptionCycle` e `royalDelivery`; `royalBox` fica fora do historico ate a regra comercial ser retomada.

Filtro ServiceOS:
- Reutilizavel fora do RoyalPrime? como padrao ecommerce de pedidos, sim.
- Depende de regra especifica do RoyalPrime? parcialmente.
- Depende de mock/copy/imagem local? sim.
- Depende de legacy design-system/app-shell? sim.

Proximo passo:
- Separar `OrderStatusTimeline` e `OrderHistoryCard` para `product-components/ecommerce` somente se tambem forem usados em detalhes do pedido ou admin operacional.
