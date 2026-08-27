# RoyalPrime Backend Foundation

Este documento registra a decisao tecnica inicial do backend.

## Decisao De Stack

```text
Backend: Django
API: Django REST Framework
Auth inicial: SimpleJWT ou sessao/JWT hibrido a definir no API_CONTRACTS.md
Banco alvo: PostgreSQL
Banco local inicial: SQLite permitido enquanto o runtime nasce
Deploy frontend: Vercel
Banco gerenciado: Supabase Postgres
Web server/API: Render
```

O codigo deve nascer pensando em PostgreSQL, mesmo se o desenvolvimento local
usar SQLite nos primeiros passos.

Regra:

```text
dev pode iniciar simples
arquitetura deve mirar Postgres
models, constraints, indexes e transacoes devem considerar Postgres
```

## Arquitetura De Deploy Alvo

O produto deve nascer pensando neste desenho de producao:

```text
Vercel
  -> frontend client web
  -> frontend admin web, se for publicado separadamente

Render
  -> Django API / web server
  -> jobs administrativos simples quando aplicavel

Supabase
  -> PostgreSQL gerenciado
  -> backups e operacao do banco
```

Fluxo:

```text
Client/Admin em Vercel
  -> chama API Django no Render
    -> Django usa PostgreSQL no Supabase
```

Regra:

```text
frontend nao acessa Supabase direto para regra de negocio
frontend sempre passa por shared-core/api -> Django API
Django e o dono de permissao, organizationId, regra, auditoria e persistencia
Supabase e banco, nao camada de regra do produto
```

Essa decisao preserva a ordem central:

```text
backend -> shared-core -> render-only surfaces
```

Mesmo que Supabase ofereca APIs diretas, o RoyalPrime nao deve usar Supabase
como backend de regra. O banco fica atras do Django.

## Inspiracao Permitida

O backend do HobbyMap pode ser usado como referencia de organizacao Django:

```text
config/settings/base.py
config/settings/development.py
config/settings/production.py
apps/<domain>/
apps/core/
apps/audit/
apps/users/
scripts/
```

O RoyalPrime nao deve copiar regra de dominio do HobbyMap. Deve aproveitar o
padrao tecnico:

- settings separados por ambiente;
- apps por dominio;
- `core` para base compartilhada;
- `audit` separado;
- `users/accounts` com User customizado;
- pagamentos manuais/recorrentes como referencia de desenho;
- scripts/seeds fora do fluxo HTTP principal.

## Politica De Banco

### Local inicial

Pode usar SQLite para dar boot rapido:

```text
DATABASE_ENGINE=sqlite
DATABASE_NAME=royalprime.sqlite3
```

### Produto real

PostgreSQL e o banco alvo. Em producao, a preferencia e Supabase Postgres:

```text
DATABASE_ENGINE=postgres
DATABASE_NAME=royalprime
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
```

Ou via URL:

```text
DATABASE_URL=postgres://postgres:postgres@localhost:5432/royalprime
```

Em deploy real:

```text
DATABASE_URL=<Supabase Postgres connection string>
```

Regra:

```text
usar UUID ou BigAutoField de forma consistente
usar indexes nos campos de listagem e status
usar constraints no banco para invariantes importantes
usar transaction.atomic em services de escrita
nao depender de comportamento especifico de SQLite
```

## Tenant-Ready

Toda entidade de negocio deve carregar `organizationId` desde o inicio.

Excecoes possiveis:

- `User`, quando representar identidade global de login;
- tabelas tecnicas globais;
- tabelas de permissao global, se existirem.

Mesmo nesses casos, o acesso operacional deve passar por:

```text
OrganizationMember
Customer.organizationId
Role/Permission por organization
```

## Config Django Alvo

Tree esperada:

```text
backend/
  manage.py
  requirements.txt

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
    core/
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
    audit/
```

## Env

O backend usa `backend/.env` local e `backend/.env.example` como contrato.

`backend/.env` nao deve ser versionado.

Campos minimos:

```text
DJANGO_SECRET_KEY
DJANGO_DEBUG
DJANGO_ALLOWED_HOSTS
DJANGO_SETTINGS_MODULE
DATABASE_ENGINE
DATABASE_URL
ROYALPRIME_DEFAULT_ORGANIZATION_SLUG
```

Em Render, essas variaveis devem ser configuradas no painel do service, nunca
commitadas.

## Ordem Antes De Codar Runtime

```text
1. TREE.md
2. FOUNDATION.md
3. MER.md
4. API_CONTRACTS.md
5. requirements.txt
6. Django scaffold
7. apps core/organizations/accounts/customers
```

## Decisoes Ainda Abertas

```text
Auth: SimpleJWT puro ou session/JWT hibrido
ID: UUID em todas entidades ou BigAutoField
Postgres local obrigatorio agora ou depois do scaffold
Storage de media: local primeiro, R2/S3 depois
```

Essas decisoes devem ser fechadas antes das primeiras migrations reais.
