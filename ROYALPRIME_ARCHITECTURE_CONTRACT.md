# RoyalPrime Architecture Contract

Este documento define a arquitetura central do RoyalPrime.

Ele deve orientar qualquer decisao de tree, backend, frontend, shared-core, manifests, hooks e ServiceOS futuro.

## Tese Central

RoyalPrime deve ser construido para resolver a empresa atual, mas sem prender o codigo a uma unica empresa para sempre.

```text
RoyalPrime e a primeira organization.
Royal Carnes e o primeiro negocio.
O backend deve conseguir atender outro ecommerce/assinatura por seed/config.
```

Exemplo futuro:

```text
Se amanha surgir assinatura de bicicleta:
  -> cria nova organization
  -> popula seed/config de bicicleta
  -> troca tema/copy/imagens/dominio
  -> reaproveita core de pedidos, assinatura, produtos, pagamento e entrega
```

## Camadas

### 1. Backend

O backend e o dono da regra real.

Responsabilidades:

- banco;
- entidades;
- validacoes;
- autorizacao;
- organizationId;
- calculos;
- limites;
- pedidos;
- assinatura;
- ciclo;
- estoque;
- entrega;
- pagamento;
- carteira;
- voucher;
- auditoria;
- status.

O backend nao deve ter regras hardcoded de Royal Carnes quando elas puderem ser dados.

Exemplo ruim:

```text
if planName == "Royal Pro"
```

Exemplo melhor:

```text
Plan.limit.maxWeightKg
Plan.limit.maxCuts
Plan.allowedProductGroups
```

### 2. Shared-Core

Shared-core e a camada de fluxo reutilizavel.

Ele fica entre backend e renderizacao.

Responsabilidades:

- contratos;
- DTOs;
- API clients;
- hooks;
- mappers;
- view-models;
- mocks temporarios;
- seeds temporarios;
- estado reutilizavel de fluxo.

Shared-core nao e automaticamente global. Ele deve morar no menor escopo correto.

```text
frontend/client/shared-core
  -> cliente web + cliente mobile

frontend/admin/shared-core
  -> admin

frontend/shared-core
  -> somente contratos realmente comuns entre client, mobile e admin
```

### 3. Web, Mobile e Admin Web

As surfaces renderizam.

Responsabilidades:

- layout;
- responsivo;
- componentes visuais;
- screen composition;
- formularios;
- modais;
- tabelas;
- tabs;
- botoes;
- inputs;
- chamada de hooks.

Elas nao devem ser donas da regra de negocio.

## Fluxo Padrao

```text
screen
  -> hook do shared-core
  -> api client do shared-core
  -> backend endpoint
  -> service/use-case no backend
  -> banco
```

Exemplo:

```text
PedidoView
  -> useOrderCart().addProduct(productId)
  -> ordersApi.addOrderItem(orderId, input)
  -> POST /orders/:orderId/items
  -> addOrderItem()
  -> valida produto, estoque, limite, assinatura e preco
  -> salva OrderItem
  -> retorna Order atualizado
```

## Organization e Seed/Config

O backend deve nascer tenant-ready.

Entidades de negocio devem carregar `organizationId` desde o MER.

Exemplos:

- Customer;
- Address;
- Product;
- Category;
- Plan;
- Subscription;
- SubscriptionCycle;
- Order;
- OrderItem;
- Delivery;
- Payment;
- Wallet;
- Voucher;
- InventoryItem;
- AuditLog.

O que muda por organization:

- marca;
- categorias;
- produtos;
- planos;
- precos;
- limites;
- recorrencia;
- regioes de entrega;
- metodos de pagamento;
- copy;
- imagens;
- tema;
- dominio;
- variaveis de ambiente.

## Config-First no Frontend

Sempre que uma tela tiver comportamento editavel, variacao por empresa ou regra visual configuravel, preferir config/manifest.

Exemplos:

- navegacao;
- etapas de checkout;
- labels;
- status exibidos;
- filtros;
- campos de tabela;
- secoes de conta;
- modalidades comerciais;
- limites apresentados;
- componentes esperados.

RoyalPrime pode ter copy e layout especificos, mas o que for claramente configuravel deve nascer preparado para manifest/config.

## Tree Alvo

```text
RoyalPrime/
  AGENTS.md
  ROYALPRIME_CODEX_RULES.md
  ROYALPRIME_ARCHITECTURE_CONTRACT.md

  backend/
    README.md
    ROADMAP.md
    ARCHITECTURE.md
    MER.md              futuro
    TREE.md             futuro
    API_CONTRACTS.md    futuro

  frontend/
    foundation/
      ui/
      semi-composed/
      shells/
      product-components/

    shared-core/
      contracts/
      manifest/
      public/

    client/
      shared-core/
        contracts/
        locales/
        manifests/
        mocks/
        navigation/
        view-models/
        api/            futuro
        hooks/          futuro
        mappers/        futuro

      web/
        src/
          app/
          screens/
          product-components/ecommerce/
          modules/
          legacy/

      mobile/

    admin/
      shared-core/
        contracts/
        locales/
        manifests/
        mocks/
        navigation/
        view-models/
        api/            futuro
        hooks/          futuro
        mappers/        futuro

      web/
        src/
          engines/
          builders/
```

## Regras de Promocao

### Para shared-core

Promova para shared-core quando:

- a screen esta ficando pesada;
- a logica sera usada por web e mobile;
- o admin precisa do mesmo fluxo em outro formato;
- existe contrato claro;
- a tela pode virar render-only depois da extracao.

### Para frontend/shared-core global

Promova somente quando:

- client, mobile e admin realmente compartilham o mesmo contrato;
- nao e regra especifica de uma surface;
- nao e copy/layout;
- nao depende de JSX.

### Para ServiceOS

Promova somente depois de uso real no RoyalPrime.

Nao promover:

- mock cru;
- copy RoyalPrime;
- imagem RoyalPrime;
- workaround visual;
- regra comercial especifica;
- componente ainda dependente demais de legacy.

## Anti-Padroes

- Screen chamando endpoint direto.
- Screen calculando preco, limite ou estoque.
- Admin duplicando regra do cliente.
- Backend com `Royal Pro`, `Picanha` ou `Fraldinha` como regra tecnica fixa.
- Shared-core global recebendo codigo sem segundo uso real.
- Config inventando comportamento que o runtime nao suporta.
- UI nova hardcoded em JSX quando deveria estar em locale/config.
- Emoji Unicode solto na interface.

## Frase Guia

```text
O backend e o corpo reutilizavel.
Seed/config veste esse corpo para cada negocio.
Shared-core organiza o fluxo.
As telas apenas mostram e disparam acoes.
```
