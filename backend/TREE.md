# RoyalPrime Backend Tree

Este documento define a tree interna do backend antes do MER virar codigo.

Objetivo:

```text
backend tenant-ready
  -> RoyalPrime como primeira organization
  -> Royal Carnes como primeiro negocio
  -> core reutilizavel por seed/config
```

O backend novo nao deve recuperar a base Django antiga. Ele nasce do MER novo.

## Regra Central

```text
Regra mora no backend.
Frontend consome contratos/hooks.
Tela apenas apresenta e dispara acao.
```

## Tree Alvo

```text
backend/
  README.md
  ROADMAP.md
  ARCHITECTURE.md
  TREE.md
  FOUNDATION.md
  MER.md
  API_CONTRACTS.md
  .env.example
  requirements.txt
  manage.py

  config/
    __init__.py
    urls.py
    wsgi.py
    asgi.py
    settings/
      __init__.py
      base.py
      development.py
      production.py

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

  api/
    v1/

  seeds/
    royalprime/

  tests/
```

## Ownership Por Pasta

### apps/organizations

Dono de tenant e organization.

Entidades:

- `Organization`;
- `OrganizationSettings`;
- `OrganizationDomain`;
- `OrganizationFeatureFlag`.

Responsabilidades:

- criar a organization RoyalPrime;
- garantir `organizationId` em entidades de negocio;
- validar acesso por organization;
- permitir que outro produto use o mesmo core com seed/config diferente.

Kit:

```text
Organizations
```

### apps/accounts

Dono de identidade, auth e permissao.

Entidades:

- `User`;
- `UserIdentity`;
- `Session`;
- `Role`;
- `Permission`;
- `OrganizationMember`;
- `PasswordResetToken`.

Responsabilidades:

- login/logout;
- usuario atual;
- roles cliente/admin/operador;
- permissoes por organization;
- auditoria de acesso.

Kit:

```text
Auth & Users
```

### apps/customers

Dono da pessoa cliente e seus dados operacionais.

Entidades:

- `Customer`;
- `CustomerProfile`;
- `Address`;
- `CustomerNote`;
- `PaymentMethodRef`.

Responsabilidades:

- cadastro de cliente;
- enderecos;
- contato;
- dados que pedidos/entregas referenciam.

Kit:

```text
Auth & Users
Admin Operations
```

### apps/catalog

Dono do catalogo vendavel.

Entidades:

- `Collection`;
- `CollectionProduct`;
- `Category`;
- `Product`;
- `ProductVariant`;
- `ProductMedia`;
- `ProductPrice`;
- `CommercialMode`;
- `CatalogAvailability`.

Responsabilidades:

- colecoes comerciais/editoriais;
- produtos;
- categorias;
- preco base;
- exibicao por modo comercial;
- disponibilidade comercial;
- origem dos seeds de Royal Carnes.

Kit:

```text
Catalog
```

Regra:

```text
Collection organiza vitrine/campanha/sazonalidade.
Category organiza taxonomia.
Product e item vendavel.
Product pode pertencer a varias Collections.
```

### apps/subscriptions

Dono de planos, mensalidade, recorrencia e ciclo.

Entidades:

- `Plan`;
- `PlanLimit`;
- `PlanPrice`;
- `Subscription`;
- `SubscriptionCycle`;
- `SubscriptionCycleUsage`;
- `SubscriptionCycleItem`.

Responsabilidades:

- mensalidade;
- recorrencia;
- limite de peso/cortes/beneficios;
- ciclo mensal;
- consumo de ciclo;
- pedido gerado por assinatura.

Kit:

```text
Orders
Payments
```

Observacao:

`Plan` nao e "Royal Pro" hardcoded. `Royal Pro` e seed/config de uma
organization.

### apps/orders

Dono da compra.

Entidades:

- `Order`;
- `OrderItem`;
- `OrderStatusHistory`;
- `OrderTimelineEvent`;
- `OrderAdjustment`;
- `OrderSource`.

Responsabilidades:

- criar pedido;
- validar itens;
- aplicar preco;
- aplicar limite de assinatura quando existir;
- status comercial;
- historico e auditoria de pedido.

Kit:

```text
Orders
```

### apps/deliveries

Dono da execucao operacional da entrega.

Entidades:

- `Delivery`;
- `DeliveryWindow`;
- `DeliveryStatusHistory`;
- `DeliveryPackage`;
- `DeliveryConfirmation`;

Responsabilidades:

- agenda;
- janela;
- endereco de entrega;
- separacao;
- despacho;
- codigo de entrega;
- confirmacao.

Kit:

```text
Fulfillment & Delivery
Scheduling
```

### apps/payments

Dono do pagamento e status financeiro.

Entidades:

- `Payment`;
- `PaymentMethod`;
- `Invoice`;
- `PaymentAttempt`;
- `PaymentAllocation`;
- `PaymentReceipt`.

Responsabilidades:

- pagamento manual;
- Pix manual;
- pagar na entrega;
- gateway futuro;
- status financeiro;
- comprovantes;
- conciliacao futura.

Kit:

```text
Payments
```

### apps/wallets

Dono de carteira e credito interno.

Entidades:

- `Wallet`;
- `WalletTransaction`;
- `CreditAdjustment`.

Responsabilidades:

- saldo;
- credito;
- estorno;
- debito;
- auditoria financeira.

Kit:

```text
Wallet & Vouchers
```

### apps/vouchers

Dono de vouchers e resgates.

Entidades:

- `Voucher`;
- `VoucherRedemption`;

Responsabilidades:

- cupom/voucher;
- regras de uso;
- resgate;
- validade.

Kit:

```text
Wallet & Vouchers
```

### apps/inventory

Dono de estoque simples.

Entidades:

- `InventoryItem`;
- `InventoryMovement`;
- `StockReservation`;

Responsabilidades:

- ativo/inativo;
- quantidade aproximada;
- indisponibilidade;
- reserva;
- baixa quando pedido for aprovado.

Kit:

```text
Inventory
```

### apps/admin_portal

Dono de consultas e comandos especificos da operacao admin.

Responsabilidades:

- dashboard agregado;
- pedidos recebidos;
- filtros por status/data/tipo;
- mudar status;
- calendario simples;
- visao operacional de cliente/endereco/telefone.

Regra:

```text
admin_portal orquestra use-cases.
Regra de dominio continua no app dono.
```

Kit:

```text
Admin Operations
```

## Foundation Django

Stack decidido:

```text
Django + Django REST Framework
PostgreSQL como banco alvo
SQLite permitido para boot local inicial
Vercel para frontends
Supabase Postgres para banco gerenciado
Render para Django API/web server
```

O backend deve nascer com settings separados:

```text
config/settings/base.py
  -> settings compartilhados

config/settings/development.py
  -> desenvolvimento local

config/settings/production.py
  -> producao/deploy
```

O arquivo `backend/.env.example` e o contrato das variaveis.

O arquivo `backend/.env` e local e nao deve ser versionado.

Deploy alvo:

```text
frontend/client web -> Vercel
frontend/admin web  -> Vercel ou projeto separado na Vercel
backend Django API  -> Render
PostgreSQL          -> Supabase
```

Regra:

```text
Supabase e banco gerenciado.
Django continua sendo backend de regra.
Frontend nao acessa Supabase direto para regra de negocio.
```

## Core App

```text
apps/core
  -> tipos e utilitarios de infraestrutura
  -> base models
  -> soft delete, quando aplicavel
  -> response/errors helpers
  -> validators comuns

apps/core/errors
  -> codigos de erro de API, sem copy final de UI

apps/audit
  -> auditoria de entidades e acoes sensiveis
```

## Tree Padrao De Cada App

Cada app de dominio deve seguir uma organizacao previsivel. A tree pode crescer
conforme a necessidade real, mas o padrao inicial e:

```text
apps/<app_name>/
  __init__.py
  apps.py
  models.py
  selectors.py
  services.py
  serializers.py
  permissions.py
  urls.py
  views.py
  admin.py
  tests/
    __init__.py
  migrations/
    __init__.py
```

Responsabilidades:

```text
models.py
  -> entidades, constraints, indexes e invariantes locais simples

selectors.py
  -> queries/leitura, filtros e read models do dominio

services.py
  -> comandos/use-cases, transacoes e regras reais do dominio

serializers.py
  -> entrada/saida HTTP ou DTOs da API

permissions.py
  -> permissoes do app, sempre considerando organizationId

views.py
  -> controllers/viewsets finos, chamando selectors/services

urls.py
  -> rotas do app dentro da API

admin.py
  -> Django admin interno, quando util

tests/
  -> testes de models, selectors, services e API
```

Regra:

```text
views nao carregam regra complexa
services executam regra e escrita
selectors concentram leitura
models protegem constraints essenciais
serializers nao decidem regra de negocio
```

Apps pequenos podem comecar com menos arquivos, mas se surgir regra de leitura
ou escrita, ela deve ir para `selectors.py` ou `services.py` em vez de crescer
em `views.py`.

## API

```text
api/v1
  -> rotas HTTP versionadas
  -> serializers/controllers
  -> entrada publica para shared-core/api
```

Regra:

```text
endpoint chama use-case/service
endpoint nao contem regra complexa
endpoint nao conhece JSX, locale ou render
```

## Seeds

```text
seeds/royalprime
  -> primeira organization
  -> marca RoyalPrime/Royal Carnes
  -> categorias
  -> produtos
  -> planos
  -> precos
  -> limites
  -> regioes/metodos iniciais
```

Seed nao e regra tecnica hardcoded.

Exemplo:

```text
Plan = entidade generica
Royal Pro = seed da organization royalprime
```

## Ordem De Implementacao

```text
1. MER.md
2. FOUNDATION.md
3. API_CONTRACTS.md
4. organizations + accounts
5. customers + catalog
6. subscriptions + orders
7. deliveries
8. payments manual
9. inventory simples
10. wallets/vouchers
```

## O Que Nao Codar Ainda

- gateway real;
- estoque avancado;
- roteirizacao;
- billing multi-tenant;
- painel para criar organizations;
- ServiceOS completo;
- regra Royal Carnes hardcoded no core.
