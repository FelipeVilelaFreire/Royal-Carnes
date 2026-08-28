# RoyalPrime Tree Foundation

Este documento e a referencia viva da tree do RoyalPrime antes da montagem do
MER e do backend real.

Objetivo:

```text
organizar a casa
  -> fechar ownership de pastas
  -> separar documentacao, backend, frontend e ferramentas
  -> preparar backend/MER sem codar runtime cedo demais
```

Regra central:

```text
Regra mora no backend.
Fluxo reutilizavel mora no shared-core do escopo correto.
Tela apenas apresenta e dispara acao.
```

## Decisao Atual

O RoyalPrime e o produto-foco.

O backend Django antigo foi descartado e nao deve guiar a nova implementacao.
O backend novo nasce depois de tree, MER, contratos, seeds e endpoints estarem
claros.

O ServiceOS continua como referencia de organizacao, AppShell, Foundation,
contratos e separacao de responsabilidades, mas nao deve travar a entrega do
RoyalPrime.

```text
RoyalPrime prova o fluxo real.
ServiceOS recebe depois apenas o que provar reuso.
```

## Raiz Atual

Estado observado na raiz:

```text
RoyalPrime/
  .git/
  backend/
  bats/
  docs/
  frontend/
  node_modules/
  .env.example
  .gitignore
  AGENTS.md
  package-lock.json
  package.json
  README.md
  ROYALPRIME_ARCHITECTURE_CONTRACT.md
  ROYALPRIME_CODEX_RULES.md
  TREE.md
```

## Regra Para a Raiz

A raiz deve conter apenas:

- documentos de entrada obrigatoria;
- arquivos de workspace/build;
- pastas de produto;
- ferramentas locais simples;
- documentacao consolidada.

## Arquivos Que Devem Ficar na Raiz

```text
AGENTS.md
README.md
ROYALPRIME_CODEX_RULES.md
ROYALPRIME_ARCHITECTURE_CONTRACT.md
TREE.md
package.json
package-lock.json
.env.example
.gitignore
```

Motivo:

- `AGENTS.md` e entrada obrigatoria para agentes.
- `README.md` apresenta o produto e comandos principais.
- `ROYALPRIME_CODEX_RULES.md` guarda regras praticas de execucao.
- `ROYALPRIME_ARCHITECTURE_CONTRACT.md` guarda contrato arquitetural central.
- `TREE.md` registra a organizacao de foundation antes do MER.
- `package.json` e `package-lock.json` sao necessarios porque a raiz e o
  workspace npm.
- `.env.example` documenta variaveis esperadas.
- `.gitignore` protege arquivos locais e outputs.

## Arquivos/Pastas Que Nao Sao Arquitetura

```text
node_modules/
```

`node_modules/` nao e parte da arquitetura. Ele pode existir localmente depois
de `npm install`, mas deve continuar ignorado pelo Git.

Regra:

```text
nao documentar node_modules como camada do produto
nao mover node_modules
nao versionar node_modules
```

## Tree Alvo da Raiz

```text
RoyalPrime/
  AGENTS.md
  README.md
  ROYALPRIME_CODEX_RULES.md
  ROYALPRIME_ARCHITECTURE_CONTRACT.md
  TREE.md

  package.json
  package-lock.json
  .env.example
  .gitignore

  backend/
  docs/
  frontend/
  bats/
```

`docs/kits/` guarda os mapas de reuso, porque kits sao documentacao de reuso,
nao runtime.

## Decisao Sobre Kits

Estado atual:

```text
docs/kits/
  README.md
  kit-template.md
  auth-users-kit.md
  catalog-kit.md
  subscriptions-kit.md
  inventory-kit.md
  royal-carnes-seed-kit.md
  seed-strategy.md
```

Papel:

```text
kit = mapa de leitura e reaproveitamento
kit != biblioteca abstrata pronta
kit != runtime do produto
```

Decisao executada:

```text
docs/kits/
```

Motivo:

- kits sao documentacao;
- a raiz fica mais limpa;
- `docs/kits/` deixa claro que o kit orienta copia/adaptacao futura;
- o runtime real continua em `backend/`, `frontend/*/shared-core` e
  `frontend/*/web`.

Referencias principais foram atualizadas para `docs/kits/`.

Regra:

- `docs/kits/` e documentacao de reuso;
- `backend/seeds/**/kits/` continua sendo dado de seed por capacidade.

## Backend Alvo

O backend deve nascer tenant-ready, com `Organization` e `organizationId` desde
o MER.

Tree alvo inicial:

```text
backend/
  README.md
  ROADMAP.md
  ARCHITECTURE.md
  TREE.md
  MER.md
  API_CONTRACTS.md

  apps/
    organizations/
    accounts/
    customers/
    catalog/
    subscriptions/
    orders/
    deliveries/
    payments/
    wallets/
    vouchers/
    inventory/
    admin_portal/

  core/
    settings/
    database/
    auth/
    common/

  api/
    v1/

  seeds/
    royalprime/
      seed.manifest.json
      kits/
        organizations.seed.json
        auth-users.seed.json
        customers.seed.json
        catalog.seed.json
        subscriptions.seed.json
        inventory.seed.json
    examples/
      bikeclub/
        seed.manifest.json
        kits/
          organizations.seed.json
          auth-users.seed.json
          customers.seed.json
          catalog.seed.json
          subscriptions.seed.json
          inventory.seed.json
      camisaclub/
        seed.manifest.json
        kits/
          organizations.seed.json
          auth-users.seed.json
          customers.seed.json
          catalog.seed.json
          subscriptions.seed.json
          inventory.seed.json
    tests/
      minimal.seed.manifest.json
      kits/
        organizations.seed.json
        auth-users.seed.json
        customers.seed.json
        catalog.seed.json
        subscriptions.seed.json
        inventory.seed.json
```

## Backend Ownership

```text
backend/apps/organizations
  -> organizacoes, tenant, organizationId, seed inicial RoyalPrime

backend/apps/accounts
  -> usuarios, autenticacao, papeis, permissoes cliente/admin

backend/apps/customers
  -> clientes, dados cadastrais, enderecos, contatos

backend/apps/catalog
  -> produtos, categorias, planos comerciais, disponibilidade basica

backend/apps/subscriptions
  -> assinatura, ciclo, limites, uso de ciclo

backend/apps/orders
  -> pedido, itens, status comercial, totalizacao

backend/apps/deliveries
  -> entrega, agenda, janela, codigo, status logistico

backend/apps/payments
  -> pagamento manual, status financeiro, comprovante, gateway futuro

backend/apps/wallets
  -> carteira, saldo, transacoes, credito, estorno

backend/apps/vouchers
  -> vouchers, resgates, regras de uso

backend/apps/inventory
  -> estoque simples por Product/ProductVariant, reserva e ajuste basico

backend/apps/admin_portal
  -> casos de uso e consultas especificas do admin operacional

backend/core
  -> configuracao, banco, autenticacao base e utilitarios comuns

backend/api/v1
  -> rotas HTTP versionadas, serializers/controllers e contratos externos

backend/seeds/royalprime
  -> primeira organizacao, produtos, planos, categorias e dados iniciais

backend/seeds/examples
  -> seeds pequenos para provar reuso fora de Royal Carnes
  -> bikeclub e camisaclub como primeiros exemplos completos pequenos

backend/seeds/tests
  -> fixtures minimas para testes automatizados

Regra de seed:

```text
seed.manifest.json e indice
kits/*.seed.json guarda dados por kit/capacidade
```
```

Regra:

```text
apps guardam dominio e regra
api expõe contrato HTTP
core sustenta infra comum
seeds vestem o negocio RoyalPrime
```

## Documentos do Backend

Documentos obrigatorios antes de codar runtime:

```text
backend/TREE.md
backend/MER.md
backend/API_CONTRACTS.md
```

Ordem:

```text
1. backend/TREE.md
2. backend/MER.md
3. backend/API_CONTRACTS.md
4. backend foundation real
```

## Frontend Alvo

Tree alvo de alto nivel:

```text
frontend/
  foundation/
    design-system/
    semi-composed/
    ui/
    shells/
    product-components/

  shared-core/
    contracts/
    manifest/
    public/
    identity.ts
    foundation.ts
    config.ts

  client/
    shared-core/
      api/
      hooks/
      contracts/
      mappers/
      mocks/
      manifests/
      locales/
      navigation/
      view-models/

    web/
      src/
        app/
        screens/
        product-components/
        modules/
        legacy/

    mobile/

  admin/
    shared-core/
      api/
      hooks/
      contracts/
      mappers/
      mocks/
      manifests/
      locales/
      navigation/
      view-models/

    web/
      src/
        engines/
        builders/
```

## Frontend Ownership

```text
frontend/foundation
  -> runtime visual reutilizavel: Design System, Semi-composed, UI,
     AppShell e Product Components

frontend/foundation/design-system | semi-composed | ui
  -> tokens, receitas e primitives visuais

frontend/foundation/shells
  -> AppShell: Header, Sidebar, Drawer, Footer, BottomTabBar e layout

frontend/foundation/product-components
  -> componentes de produto reutilizaveis quando provarem uso real

frontend/shared-core
  -> somente contratos/configs realmente comuns entre client, mobile e admin;
     nao e dono de runtime visual

frontend/shared-core/contracts
  -> tipos base compartilhados, como OrganizationId, Money, Address,
     OrderStatus, DeliveryStatus e PaymentStatus

frontend/shared-core/manifest
  -> contratos globais de manifest/config, como AppShellConfig,
     ThemeConfig, NavigationItem, AssetRef e IconKey

frontend/shared-core/public
  -> assets publicos realmente comuns entre surfaces

frontend/client/shared-core
  -> contratos, API clients, hooks, mappers, mocks, manifests, locales,
     navigation e view-models do fluxo do cliente

frontend/client/web
  -> telas web do cliente, Next app, composicao visual e chamadas a hooks

frontend/client/mobile
  -> futura surface mobile do cliente; deve consumir client/shared-core
     quando o fluxo for o mesmo do cliente web

frontend/admin/shared-core
  -> contratos, API clients, hooks, mappers, mocks, manifests, locales,
     navigation e view-models do admin

frontend/admin/web
  -> Vite admin, engines de render, builders e telas operacionais
```

Regra:

```text
screen
  -> hook shared-core
  -> api client shared-core
  -> backend endpoint
  -> regra real
```

## Contrato Render-Only das Surfaces

`frontend/client/web`, `frontend/client/mobile` e `frontend/admin/web` sao
surfaces de renderizacao.

Elas existem para transformar estado e view-models em tela. Elas nao sao donas
da regra real do produto.

```text
backend
  -> regra real, persistencia, validacao, autorizacao, calculo e auditoria

shared-core do escopo correto
  -> contratos, DTOs, API clients, hooks, mappers, view-models e mocks temporarios

web / mobile / admin-web
  -> renderizacao, layout, inputs, botoes, modais, tabelas e chamada dos hooks
```

Fluxo padrao obrigatorio:

```text
screen render-only
  -> chama hook da surface
    -> hook chama api client da surface
      -> api client chama endpoint do backend
        -> backend executa use-case/service
          -> banco
```

### Permitido nas surfaces render-only

```text
abrir e fechar modal
controlar input
trocar aba ativa
mostrar loading
mostrar erro recebido do hook
mostrar empty state
renderizar tabela, card, formulario e detalhe
chamar hook
disparar acao recebida do hook
formatar apresentacao simples sem alterar regra
```

Exemplos:

```text
PedidoView
  -> renderiza ProductItemCard
  -> mostra botao Adicionar
  -> chama useOrderCart().addProduct(productId)

MeusPedidosView
  -> renderiza timeline recebida
  -> chama useMyOrders().reload()

AdminOrdersPage
  -> renderiza tabela de pedidos
  -> chama useAdminOrders().approveOrder(orderId)
```

### Proibido nas surfaces render-only

```text
calcular preco final
calcular frete real
calcular limite de plano
calcular saldo do ciclo
decidir disponibilidade de estoque
validar regra de assinatura
decidir se pedido pode mudar status
persistir dado direto
chamar endpoint direto quando houver fluxo reutilizavel
duplicar regra do backend
montar regra comercial complexa em JSX/TSX
hardcodar dados comerciais como se fossem regra
```

Exemplos proibidos:

```text
PedidoView calcula se Royal Pro ainda tem kg disponivel
AdminOrdersPage decide transicao approved -> delivered sem backend
ProductScreen baixa estoque localmente depois de aprovar pedido
Mobile cria pedido chamando fetch direto no componente
```

### Onde cada coisa nasce

```text
Regra de negocio
  -> backend/apps/*

Contrato comum
  -> frontend/shared-core/contracts

Contrato/fluxo do cliente
  -> frontend/client/shared-core

Contrato/fluxo do admin
  -> frontend/admin/shared-core

Render cliente web
  -> frontend/client/web

Render cliente mobile
  -> frontend/client/mobile

Render admin
  -> frontend/admin/web
```

### Regra para componentes de tela

Componentes dentro de `web`, `mobile` ou `admin/web` podem existir, mas seguem
o mesmo contrato render-only.

```text
componente visual local
  -> ok, se apenas apresenta dados e dispara callbacks

componente com regra de negocio
  -> errado; mover regra para backend/shared-core conforme o caso
```

Se um componente visual de ecommerce provar reuso real entre telas, ele pode
amadurecer para:

```text
frontend/foundation/product-components
```

Se for apenas composicao especifica da tela, fica local na surface.

## Regra de Foundation vs Shared-Core

`frontend/foundation` e dono da capacidade executavel.

`frontend/shared-core` e dono de contratos/configs globais.

Exemplo:

```text
frontend/foundation/shells/appshell
  -> implementa Header, Sidebar, Drawer, Footer, BottomTabBar e layout

frontend/shared-core/manifest
  -> define o contrato AppShellConfig e NavigationItem

frontend/client/shared-core/manifests
  -> escolhe AppShell do cliente: header, bottom tabbar, rotas do portal

frontend/admin/shared-core/manifests
  -> escolhe AppShell do admin: sidebar, dashboard, pedidos, produtos
```

Mesma capacidade. Manifests diferentes.

Regra:

```text
Design System e AppShell globais nao moram em shared-core.
Shared-core global descreve o contrato.
Foundation executa a capacidade.
Cada surface declara sua configuracao.
```

## Regra de Surface Shared-Core

Tudo que pertence somente ao Client fica em:

```text
frontend/client/shared-core/
```

Exemplos:

```text
frontend/client/shared-core/locales
  -> strings do portal/client web/mobile

frontend/client/shared-core/navigation
  -> rotas e navegacao do cliente

frontend/client/shared-core/manifests
  -> AppShell, landing, portal, catalogo e checkout do cliente

frontend/client/shared-core/api
  -> clients HTTP do fluxo do cliente

frontend/client/shared-core/hooks
  -> hooks como useProducts, useMyOrders, useCustomer, useSubscriptionCycle

frontend/client/shared-core/mappers
  -> API DTO -> view-model do cliente
```

Tudo que pertence somente ao Admin fica em:

```text
frontend/admin/shared-core/
```

Exemplos:

```text
frontend/admin/shared-core/locales
  -> strings do painel admin

frontend/admin/shared-core/navigation
  -> rotas e navegacao do admin

frontend/admin/shared-core/manifests
  -> AppShell, telas, builders e configs do admin

frontend/admin/shared-core/api
  -> clients HTTP do fluxo admin

frontend/admin/shared-core/hooks
  -> hooks como useAdminOrders, useAdminProducts, useAdminCustomers

frontend/admin/shared-core/mappers
  -> API DTO -> view-model do admin
```

`frontend/shared-core` global deve receber apenas o que for verdadeiramente
igual para Client, Admin e Mobile.

Exemplos globais permitidos:

```text
OrganizationId
Money
Address
AssetRef
ImageAsset
IconKey
NavigationItem
AppShellConfig
ThemeConfig
OrderStatus
DeliveryStatus
PaymentStatus
Product
Category
Plan
Order
OrderItem
CustomerBase
```

Exemplo de separacao correta:

```text
frontend/shared-core/contracts/order.contract.ts
  -> Order, OrderItem, OrderStatus

frontend/client/shared-core/hooks/useMyOrders.ts
  -> cliente lista e acompanha os proprios pedidos

frontend/admin/shared-core/hooks/useAdminOrders.ts
  -> admin filtra, aprova e muda status operacional
```

Mesmo contrato base. Fluxos diferentes.

## Pastas Ambiguas Herdadas

Hoje existem:

```text
frontend/shared-core/client/
frontend/shared-core/admin/
```

Essas pastas sao ambiguas para a tree alvo, porque parecem surface shared-core
dentro do shared-core global.

Decisao:

```text
nao mover agora para evitar quebra de imports
migrar gradualmente para frontend/client/shared-core e frontend/admin/shared-core
manter frontend/shared-core apenas para contratos/configs globais
```

## Docs Alvo

Tree alvo:

```text
docs/
  README.md
  DOCS_ROADMAP.md

  architecture/
  contracts/
  product/
  roadmap/
  kits/
```

Papel:

```text
docs/architecture
  -> visao arquitetural, historico e direcao tecnica

docs/contracts
  -> contratos ativos de comportamento e compatibilidade

docs/product
  -> escopo de produto, MVP, regras comerciais e decisao de negocio

docs/roadmap
  -> planos por fase, sequencias e milestones

docs/kits
  -> guias de reuso futuro por capacidade
```

## Bats

Estado atual:

```text
bats/
```

Decisao:

```text
manter por enquanto
```

Motivo:

- scripts `.bat` ajudam execucao local no Windows;
- nao sao runtime de negocio;
- nao bloqueiam MER/backend.

Possivel decisao futura:

```text
bats/
  -> scripts/windows/
```

Nao mover agora para evitar ruido antes do MER.

## O Que Nao Fazer Agora

- Nao recriar backend runtime antes de `backend/TREE.md` e `backend/MER.md`.
- Nao restaurar backend antigo.
- Nao conectar tela direto em endpoint.
- Nao mover fluxo para `frontend/shared-core` global por previsao abstrata.
- Nao promover nada para ServiceOS antes de provar uso real.
- Nao transformar estoque em ERP.
- Nao iniciar gateway antes de pedido/admin/status estarem firmes.

## Ordem de Trabalho

```text
1. Criar TREE.md na raiz
2. Criar backend/TREE.md
3. Mover kits documentais para docs/kits
4. Atualizar referencias dos docs apos o move
5. Criar backend/MER.md
6. Classificar mocks atuais como entidade, seed, DTO ou temporario
7. Criar backend/API_CONTRACTS.md
8. Escolher backend foundation real
9. Criar runtime backend
10. Migrar frontend por shared-core/api/hooks
```

## Estado Desta Decisao

Status:

```text
foundation documentada, kits documentais movidos para docs/kits
```

Feito:

```text
TREE.md raiz criado
frontend shared-core api/hooks/mappers documentados por surface
backend/TREE.md criado
backend/FOUNDATION.md criado
backend/MER.md criado
backend/.env.example criado
deploy alvo Vercel + Supabase + Render documentado
docs/kits aplicado como local canonico dos kits documentais
backend scaffold Django criado
backend/seeds documentado
kits de seed e catalogo documentados
Fase 1 Auth & Users fechada
Fase 2 Catalog iniciada com runtime
```

Proximo passo recomendado:

```text
revisar MER.md
resolver perguntas abertas de auth, ID e Postgres local
criar backend/API_CONTRACTS.md
```
