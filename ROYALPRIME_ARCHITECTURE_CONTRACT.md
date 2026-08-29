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

Shared-core e a camada de contrato e fluxo reutilizavel.

Ele fica entre backend e renderizacao.

Responsabilidades:

- contratos;
- DTOs;
- API clients;
- hooks;
- mappers;
- view-models;
- manifests;
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

Todo shared-core deve ser organizado com mentalidade de kit:

```text
frontend/shared-core/kits
  -> capacidades globais pequenas

frontend/client/shared-core/kits
  -> capacidades do cliente

frontend/admin/shared-core/kits
  -> capacidades operacionais do admin
```

### Modelo De Reuso Em Tres Camadas

RoyalPrime deve separar reuso em tres niveis.

```text
backend
  -> reuso por seed/config
  -> modelos, services, validacoes e endpoints genericos
  -> organization define produtos, planos, status, limites e copy operacional

frontend/*/shared-core
  -> reuso por funcao/kit
  -> contratos, DTOs, API clients, hooks, mappers e view-models
  -> copiavel/adaptavel para outro produto sem depender de JSX

frontend/*/web e frontend/*/mobile
  -> reuso por manifest/render
  -> telas chamam hooks e renderizam manifests/locales/navigation/config
  -> no inicio podem ser mais locais, mas nao devem virar donas de regra
```

Exemplo de produto futuro:

```text
Royal Carnes
  -> seed de carnes, carvao, temperos e planos Basic/Premium/Pro

PeixeClub
  -> seed de peixes, acompanhamentos e planos proprios

CamisaClub
  -> seed de camisas, tamanhos, cores e planos proprios
```

O core esperado:

```text
backend muda pouco
shared-core reaproveita kits de catalog, subscriptions, orders e deliveries
web/native trocam manifest, locale, navigation, tema e assets
```

Anti-padrao:

```text
criar useRoyalCarnesSubscription quando o fluxo e assinatura generica
criar if business == "peixe" no hook
criar tela que calcula limite de plano
colocar regra de tamanho/peso/status em locale
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

### Exemplo Canonico: Botao Adicionar Item

Este exemplo e a regra pratica para telas do client/admin.

Tela:

```tsx
<Button onClick={() => orderActions.addItem(product.id)}>
  {strings.add}
</Button>
```

A tela so conhece:

```text
produto selecionado
evento de clique
loading/erro visual
view-model recebido
```

Shared-core do escopo correto conhece:

```text
contrato minimo
api client
mapper DTO -> view-model
hook/action addItem
fallback dev quando necessario
manifest/locales para labels editaveis
```

Backend conhece:

```text
organization
produto real
estoque
limite do plano/ciclo
preco
unidade de medida
permissao
persistencia
auditoria
```

Nunca fazer:

```text
if planName == "Royal Pro" na tela
if productName == "Picanha" na tela ou shared-core
screen calcular sellableQuantity persistido
screen chamar fetch direto para pedido reutilizavel
shared-core global receber orders/checkout antes de haver reuso real
locale guardar regra de preco, estoque, limite ou transicao
```

Escopo correto:

```text
frontend/client/shared-core/kits/orders
  -> pedido do cliente

frontend/client/shared-core/kits/checkout
  -> montagem do carrinho/pedido do cliente

frontend/admin/shared-core/kits/orders
  -> operacao admin de pedidos

frontend/admin/shared-core/kits/inventory
  -> estoque e ajustes admin
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

Essa migracao deve ser incremental. O RoyalPrime ainda pode ter hardcode
historico em telas enquanto o fluxo esta sendo provado, mas codigo novo deve
nascer com a direcao abaixo:

```text
tela hardcoded funcionando
  -> extrair contrato/shared-core
  -> mover copy/config para locale ou manifest
  -> renderizar por hook/view-model
  -> quando fizer sentido, trocar repeticao por screen type
```

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
- screen types como ListPage, DetailPage, FormPage e DashboardPage;
- colunas, filtros, acoes e estados vazios de admin.

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
      kits/
      manifest/
      public/

    client/
      shared-core/
        contracts/
        kits/
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
        kits/
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

## Kits Como Guia Pratico

`docs/kits/` documenta capacidades reaproveitaveis por arquivo.

Um kit deve dizer para uma IA ou desenvolvedor:

- quais arquivos de backend representam a capacidade;
- quais arquivos de shared-core representam contratos, API clients, hooks e mappers;
- quais telas/modais/componentes apenas renderizam;
- o que pode ser copiado/adaptado;
- o que e especifico do RoyalPrime;
- quando a capacidade pode virar ServiceOS.

Regra:

```text
Kit e mapa de leitura e reaproveitamento.
Kit nao e codigo abstrato antes de uso real.
```

Exemplo:

```text
Novo produto precisa de Auth & Users.
  -> leia docs/kits/auth-users-kit.md
  -> abra os arquivos backend indicados
  -> abra os arquivos shared-core indicados
  -> abra os arquivos render indicados
  -> copie/adapte o que e generico
  -> troque seed/config/copy/tema para a nova empresa
```

Essa estrategia deixa o RoyalPrime progredir como produto real e, ao mesmo tempo, cria memoria operacional para o ServiceOS.

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
