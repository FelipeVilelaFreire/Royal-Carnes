# Backend Implementation Log

Registro incremental do que foi implementado no backend.

## 2026-08-27 - Scaffold Django inicial

Objetivo:

```text
criar base Django minima
  -> settings por ambiente
  -> health check
  -> organization
  -> accounts
  -> customers
```

Criado:

```text
manage.py
requirements.txt
config/settings/base.py
config/settings/development.py
config/settings/production.py
api/v1/urls.py
backend/API_CONTRACTS.md
apps/core
apps/organizations
apps/accounts
apps/customers
```

Decisoes:

```text
User = identidade global de login
OrganizationMember = papel/acesso do User dentro da organization
Customer = cliente comercial dentro da organization
```

Ainda nao feito:

```text
migrations reais
seed completo de roles/permissoes
auth endpoints JWT
catalog/subscriptions/orders
```

Proxima acao recomendada:

```text
instalar requirements
rodar py manage.py check
rodar makemigrations para core inicial
criar seed basico de organization/roles
```

## 2026-08-27 - Kits e seeds iniciais

Objetivo:

```text
ligar scaffold inicial aos kits
documentar seed principal Royal Carnes
documentar seed exemplo para provar reuso
```

Criado/atualizado:

```text
kits/README.md
kits/auth-users-kit.md
kits/seed-strategy.md
kits/royal-carnes-seed-kit.md
kits/catalog-kit.md
backend/seeds/README.md
backend/seeds/royalprime/README.md
backend/seeds/examples/README.md
backend/seeds/examples/bikeclub/README.md
backend/seeds/examples/bikeclub/seed.manifest.json
backend/seeds/examples/camisaclub/README.md
backend/seeds/examples/camisaclub/seed.manifest.json
backend/seeds/tests/README.md
backend/seeds/tests/minimal.seed.manifest.json
backend/seeds/royalprime/seed.manifest.json
backend/seeds/**/kits/*.seed.json
```

Decisao:

```text
cada kit deve declarar seed principal Royal Carnes
cada kit deve ter pelo menos um seed exemplo alternativo
seed exemplo agora tambem tem arquivo de dados, nao apenas README
seed.manifest.json virou indice
dados de seed foram separados por kit/capacidade
seed veste capacidade generica
seed nao vira regra hardcoded
```

Ainda nao feito:

```text
catalog app runtime
```

## 2026-08-27 - Fase 1 Auth & Users runtime

Objetivo:

```text
fechar organizations + auth/users + customers em codigo
```

Status:

```text
done
```

Criado/atualizado:

```text
apps/accounts/auth_urls.py
apps/accounts/views.py
apps/accounts/serializers.py
apps/accounts/selectors.py
apps/accounts/services.py
apps/accounts/permissions.py
apps/customers/views.py
apps/customers/serializers.py
apps/customers/services.py
apps/core/seed_loader.py
apps/core/tenant/resolver.py
apps/core/tenant/middleware.py
apps/core/errors.py
apps/core/management/commands/seed_backend.py
apps/core/tests/test_seed_loader.py
apps/core/tests/test_tenant_resolver.py
apps/organizations/migrations/0001_initial.py
apps/accounts/migrations/0001_initial.py
apps/customers/migrations/0001_initial.py
backend/API_CONTRACTS.md
backend/README.md
```

Endpoints:

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

Permissoes aplicadas:

```text
settings.manage -> listar/criar users admin
customers.read  -> listar/detalhar customers
customers.manage -> criar customers
```

Tenant context:

```text
X-Organization-Slug -> request.organization
views nao chamam ensure_default_organization diretamente
permissions validam user em request.organization
```

Seed aplica hoje:

```text
organizations
auth-users
customers
```

Seed carrega mas pula como planned:

```text
catalog
subscriptions
```

Validacao executada:

```text
py manage.py check -> OK
py manage.py migrate -> OK
py manage.py test apps.core -> OK
py manage.py test -> OK
py manage.py seed_backend --seed royalprime -> OK
py manage.py seed_backend --seed examples/bikeclub --dry-run -> OK
py manage.py seed_backend --seed examples/camisaclub --dry-run -> OK
seed manifests/module paths -> OK
```

Fase 1 fechada:

```text
organizations
auth-users
customers
tenant context
seed modular
API tests
```

## 2026-08-27 - Fase 2 Catalog runtime inicial

Objetivo:

```text
criar catalogo vendavel como kit runtime
aplicar catalog.seed.json no banco
provar reuso com Royal Carnes, BikeClub e CamisaClub
```

Status:

```text
local scaffold
```

Criado/atualizado:

```text
apps/catalog/models.py
apps/catalog/selectors.py
apps/catalog/services.py
apps/catalog/serializers.py
apps/catalog/views.py
apps/catalog/urls.py
apps/catalog/tests/test_api.py
apps/catalog/migrations/0001_initial.py
apps/catalog/migrations/0002_*.py
apps/core/seed_loader.py
backend/API_CONTRACTS.md
kits/catalog-kit.md
```

Endpoints:

```text
GET  /api/v1/catalog/collections/
GET  /api/v1/catalog/commercial-modes/
GET  /api/v1/catalog/products/
GET  /api/v1/catalog/products/:id/
GET  /api/v1/catalog/admin/products/
POST /api/v1/catalog/admin/products/
```

Seed aplica agora:

```text
organizations
auth-users
customers
catalog
```

Seed ainda planned:

```text
subscriptions
```

Validacao executada:

```text
py manage.py check -> OK
py manage.py makemigrations --check --dry-run -> OK
py manage.py test -> OK
py manage.py migrate -> OK
py manage.py seed_backend --seed royalprime -> OK
py manage.py seed_backend --seed examples/bikeclub --dry-run -> OK
py manage.py seed_backend --seed examples/camisaclub --dry-run -> OK
```
