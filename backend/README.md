# RoyalPrime Backend

Esta pasta agora guarda apenas a direcao arquitetural do backend do RoyalPrime.

O backend Django anterior foi descartado como base de implementacao. Ele nao estava conectado ao fluxo atual do frontend, nao representava mais o produto vendido ao cliente e nao deve guiar o MER novo.

## Como continuar

Antes de implementar qualquer backend novo, leia nesta ordem:

1. `AGENTS.md` na raiz do workspace.
2. `backend/ROADMAP.md`.
3. `backend/ARCHITECTURE.md`.

## Decisao atual

O RoyalPrime passa a ser tratado como produto principal. O ServiceOS continua como referencia de organizacao, contratos, AppShell, shared-core e separacao de responsabilidades, mas nao deve travar a entrega nem forcar abstracao antes da necessidade real.

## Foundation tecnica

A decisao inicial de stack esta em `backend/FOUNDATION.md`.

Resumo:

```text
Django + Django REST Framework
PostgreSQL como banco alvo
SQLite permitido para boot local inicial
codigo e MER pensados para Postgres desde o inicio
Vercel para frontends
Supabase Postgres para banco gerenciado
Render para Django API/web server
```

O contrato de variaveis fica em `backend/.env.example`.

O arquivo `backend/.env` pode existir localmente, mas nao deve ser versionado.

## Scaffold atual

O scaffold Django inicial ja segue:

```text
config/settings/base.py
config/settings/development.py
config/settings/production.py
apps/core
apps/organizations
apps/accounts
apps/customers
apps/catalog
api/v1
```

Registro incremental:

```text
backend/IMPLEMENTATION_LOG.md
```

Contrato inicial da API:

```text
backend/API_CONTRACTS.md
```

## Comandos backend

Instalar dependencias:

```bash
py -m pip install -r backend/requirements.txt
```

Validar configuracao:

```bash
cd backend
py manage.py check
```

Criar migrations quando os models estiverem aprovados:

```bash
cd backend
py manage.py makemigrations
py manage.py migrate
```

Aplicar seed principal da Fase 1:

```bash
cd backend
py manage.py seed_backend --seed royalprime
```

Validar seed sem escrever no banco:

```bash
cd backend
py manage.py seed_backend --seed examples/bikeclub --dry-run
py manage.py seed_backend --seed examples/camisaclub --dry-run
```

Rodar testes da fundacao:

```bash
cd backend
py manage.py test apps.core
```

Rodar a suite completa:

```bash
cd backend
py manage.py test
```

## Fase 1 atual

Status:

```text
done
```

Implementado em codigo:

```text
Organization
User
Role
Permission
RolePermission
OrganizationMember
Customer
Tenant context por X-Organization-Slug
JWT login/refresh/register/logout
me
users admin
customers list/create/detail
seed_backend
initial migrations
```

Rotas principais:

```text
POST /api/v1/auth/login/
POST /api/v1/auth/refresh/
POST /api/v1/auth/register/
POST /api/v1/auth/logout/
GET  /api/v1/accounts/me/
GET  /api/v1/accounts/users/
POST /api/v1/accounts/users/
GET  /api/v1/customers/
POST /api/v1/customers/
GET  /api/v1/customers/:id/
```

Tenant context:

```text
X-Organization-Slug: royalprime
```

Sem header, o backend usa a organization default local para boot/dev.

## Fase 2 atual

Status:

```text
local scaffold
```

Implementado em codigo:

```text
Collection
CollectionProduct
Category
ProductCategory
Product
ProductVariant
ProductMedia
ProductPrice
CommercialMode
CatalogAvailability
Catalog seed aplicado
Catalog endpoints publicos/admin
Catalog API tests
```

Decisao estrutural:

```text
Product pode estar em varias Categories.
Product pode estar em varias Collections.
Product pode ter varios Prices por commercial mode, collection e price_type.
Subscription/Plan nao mora no Catalog; a Fase 3 deve apontar para Product,
Category ou Collection por PlanEntitlement.
```

Rotas principais:

```text
GET  /api/v1/catalog/collections/
GET  /api/v1/catalog/commercial-modes/
GET  /api/v1/catalog/products/
GET  /api/v1/catalog/products/:id/
GET  /api/v1/catalog/admin/products/
POST /api/v1/catalog/admin/products/
```

## Ordem central do produto

Todo desenvolvimento novo deve seguir esta divisao:

```text
backend
  -> regra real, persistencia, validacao, autorizacao e calculo

frontend/*/shared-core
  -> contratos, API clients, hooks, mappers e fluxo reutilizavel no escopo correto

frontend/*/web | mobile | admin
  -> renderizacao, layout, inputs, botoes e chamada dos hooks
```

Regra curta:

```text
Regra mora no backend.
Fluxo reutilizavel mora no shared-core do escopo correto.
Tela apenas apresenta e dispara acao.
```

Escopo de `shared-core`:

```text
frontend/client/shared-core
  -> reutilizavel entre cliente web e cliente mobile

frontend/admin/shared-core
  -> reutilizavel dentro do admin

frontend/shared-core
  -> apenas contratos/capacidades realmente comuns entre client, mobile e admin
```

Regra:

```text
RoyalPrime prova o fluxo real
  -> backend nasce com MER proprio e organizationId
  -> frontend consome API por shared-core/hooks
  -> ServiceOS recebe depois apenas o que se provar reutilizavel
```

## Proxima rodada

A proxima rodada deve decidir se fechamos `subscriptions/plans` ou se conectamos
o frontend ao catalog via shared-core/api/hooks.
