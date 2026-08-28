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
docs/kits/README.md
docs/kits/auth-users-kit.md
docs/kits/seed-strategy.md
docs/kits/royal-carnes-seed-kit.md
docs/kits/catalog-kit.md
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
apps/catalog/migrations/0003_productcategory_and_more.py
apps/core/seed_loader.py
backend/API_CONTRACTS.md
backend/MER.md
docs/kits/catalog-kit.md
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

Naquele momento, seed ainda planned:

```text
subscriptions
```

Decisao estrutural:

```text
Product -> N Categories via ProductCategory
Product -> N Collections via CollectionProduct
Catalog -> N MeasurementUnit por organization
Product -> N Variants via ProductVariant
Product -> N ProductMedia via ProductMedia
Product -> N Prices via ProductPrice
ProductPrice pode ter collection opcional e priceType
Fase 2 nao implementa assinatura
Fase 3 deve conectar PlanEntitlement com Product/Category/Collection
Variant representa SKU/tamanho/peso/embalagem/unidade concreta
MeasurementUnit define kg/g/unit/bag/service; tamanho/cor/aro/corte ficam em
Variant.attributes
ProductMedia do seed usa URL externa apenas como placeholder de demonstracao
Seed principal RoyalPrime cobre 14 produtos com variants: bovinos, aves,
suinos, linguicas e apoio de churrasco
```

Validacao executada:

```text
py manage.py check -> OK
py manage.py makemigrations --check --dry-run -> OK
py manage.py test -> OK, 17 tests
py manage.py migrate -> OK
py manage.py seed_backend --seed royalprime -> OK
py manage.py seed_backend --seed examples/bikeclub --dry-run -> OK
py manage.py seed_backend --seed examples/camisaclub --dry-run -> OK
```

## 2026-08-28 - Fase 3 Plans And Subscriptions foundation

Objetivo:

```text
implementar motor generico de planos, entitlements, assinaturas e ciclos
sem regra hardcoded por nome de plano, produto ou negocio
```

Criado/atualizado:

```text
apps/subscriptions/models.py
apps/subscriptions/selectors.py
apps/subscriptions/services.py
apps/subscriptions/serializers.py
apps/subscriptions/views.py
apps/subscriptions/urls.py
apps/subscriptions/tests/test_api.py
apps/subscriptions/migrations/0001_initial.py
apps/core/seed_loader.py
backend/API_CONTRACTS.md
backend/MER.md
backend/PHASE_3_SUBSCRIPTIONS.md
docs/kits/subscriptions-kit.md
backend/seeds/**/kits/subscriptions.seed.json
```

Endpoints:

```text
GET  /api/v1/subscriptions/plans/
GET  /api/v1/subscriptions/me/
GET  /api/v1/subscriptions/me/cycles/current/
POST /api/v1/subscriptions/me/cycles/current/items/
GET  /api/v1/subscriptions/admin/plans/
POST /api/v1/subscriptions/admin/plans/
GET  /api/v1/subscriptions/admin/subscriptions/
POST /api/v1/subscriptions/admin/subscriptions/
GET  /api/v1/subscriptions/admin/cycles/
```

Decisao estrutural:

```text
PlanEntitlement e o motor generico de beneficios.
Entitlement aponta para collection, category, product ou variant.
MeasurementUnit vem de seed/config por organization.
Constraints guardam limites adicionais como maxSelections, maxQuantity,
allowedAttributes, allowedCommercialModes e requiresAvailability.
Basic/Premium/Pro, BikeClub e CamisaClub sao seeds, nao branches no codigo.
```

Frontend/shared-core:

```text
frontend/client/shared-core/contracts/subscription.contract.ts
frontend/client/shared-core/api/subscriptions.api.ts
frontend/client/shared-core/hooks/useSubscription.ts
frontend/client/web/src/screens/portal/tabs/MeuClubeView.tsx
```

Validacao executada:

```text
py manage.py check -> OK
py manage.py makemigrations --check --dry-run -> OK
py manage.py test -> OK, 28 tests
py manage.py migrate -> OK
py manage.py seed_backend --seed royalprime -> OK
py manage.py seed_backend --seed examples/bikeclub --dry-run -> OK
py manage.py seed_backend --seed examples/camisaclub --dry-run -> OK
py manage.py seed_backend --seed tests/minimal --dry-run -> OK
npm run build em frontend/client/web -> OK
```

## 2026-08-28 - Fase 4 Inventory foundation

Objetivo:

```text
implementar estoque simples ligado ao Catalog
sem transformar o corte em ERP
sem regra hardcoded por dominio, produto ou unidade
```

Criado/atualizado:

```text
apps/inventory/models.py
apps/inventory/selectors.py
apps/inventory/services.py
apps/inventory/serializers.py
apps/inventory/views.py
apps/inventory/urls.py
apps/inventory/tests/test_api.py
apps/inventory/migrations/0001_initial.py
apps/core/seed_loader.py
backend/API_CONTRACTS.md
backend/MER.md
docs/kits/inventory-kit.md
backend/seeds/**/kits/inventory.seed.json
```

Endpoints:

```text
GET  /api/v1/inventory/admin/items/
POST /api/v1/inventory/admin/items/
GET  /api/v1/inventory/admin/items/:id/
POST /api/v1/inventory/admin/items/:id/adjust/
GET  /api/v1/inventory/admin/items/:id/movements/
```

Decisao estrutural:

```text
InventoryItem aponta para Product e ProductVariant opcional.
MeasurementUnit vem do Catalog/seed da organization.
availableQuantity e reservedQuantity formam sellableQuantity.
StockReservation fica modelado para integracao futura com Orders.
Status simples e recalculado pelo backend, exceto disabled.
Royal Carnes, BikeClub e CamisaClub diferem por seed, nao por codigo.
```

Validacao executada:

```text
py manage.py check -> OK
py manage.py makemigrations --check --dry-run -> OK
py manage.py test -> OK, 36 tests
py manage.py migrate -> OK
py manage.py seed_backend --seed royalprime -> OK, inventory items=5
py manage.py seed_backend --seed examples/bikeclub --dry-run -> OK
py manage.py seed_backend --seed examples/camisaclub --dry-run -> OK
py manage.py seed_backend --seed tests/minimal --dry-run -> OK
```

## 2026-08-28 - Hardening pre Fase 5

Objetivo:

```text
subir a confiabilidade das Fases 1 a 4 antes de Orders/Delivery
proteger reuso futuro e eventual extracao para ServiceOS
```

Criado/atualizado:

```text
apps/catalog/models.py
apps/catalog/migrations/0005_remove_productprice_catalog_product_price_unique_mode_and_more.py
apps/catalog/tests/test_api.py
apps/subscriptions/serializers.py
apps/subscriptions/views.py
apps/subscriptions/tests/test_api.py
apps/core/tenant/resolver.py
apps/core/tests/test_tenant_resolver.py
config/settings/base.py
config/settings/production.py
backend/.env.example
backend/API_CONTRACTS.md
backend/MER.md
```

Decisoes:

```text
ProductVariant.sku agora e unico por organization quando informado.
ProductPrice agora tem constraints condicionais para variant/collection
opcionais, evitando duplicidade por NULL.
Admin subscriptions retorna erros tecnicos estruturados para referencias
invalidas.
Resolver da organization default pode desligar auto-create em producao.
```

Validacao executada:

```text
py manage.py check -> OK
py manage.py makemigrations --check --dry-run -> OK
py manage.py test apps.catalog apps.subscriptions apps.core -> OK, 26 tests
py manage.py migrate -> OK
py manage.py test -> OK, 41 tests
py manage.py seed_backend --seed royalprime -> OK
py manage.py seed_backend --seed examples/bikeclub --dry-run -> OK
py manage.py seed_backend --seed examples/camisaclub --dry-run -> OK
py manage.py seed_backend --seed tests/minimal --dry-run -> OK
```

## 2026-08-28 - Fase 5 Orders + Delivery Basico foundation

Objetivo:

```text
implementar pedido real e entrega simples
sem scheduling, recorrencia ou regra hardcoded por negocio
```

Criado/atualizado:

```text
apps/core/code_sequences.py
apps/core/models.py
apps/orders/models.py
apps/orders/services.py
apps/orders/selectors.py
apps/orders/serializers.py
apps/orders/views.py
apps/orders/urls.py
apps/orders/tests/test_api.py
apps/deliveries/models.py
apps/deliveries/services.py
apps/deliveries/selectors.py
apps/deliveries/serializers.py
apps/deliveries/views.py
apps/deliveries/urls.py
apps/deliveries/tests/test_api.py
apps/core/seed_loader.py
backend/API_CONTRACTS.md
backend/MER.md
backend/README.md
backend/ROADMAP.md
docs/kits/orders-kit.md
docs/kits/fulfillment-delivery-kit.md
backend/seeds/**/kits/orders.seed.json
backend/seeds/**/kits/deliveries.seed.json
```

Endpoints:

```text
GET  /api/v1/orders/config/
GET  /api/v1/orders/me/
POST /api/v1/orders/me/
GET  /api/v1/orders/me/:id/
GET  /api/v1/orders/admin/orders/
POST /api/v1/orders/admin/orders/
GET  /api/v1/orders/admin/orders/:id/
POST /api/v1/orders/admin/orders/:id/transition/
GET  /api/v1/deliveries/config/
GET  /api/v1/deliveries/me/
GET  /api/v1/deliveries/me/:id/
GET  /api/v1/deliveries/admin/deliveries/
POST /api/v1/deliveries/admin/deliveries/
GET  /api/v1/deliveries/admin/deliveries/:id/
POST /api/v1/deliveries/admin/deliveries/:id/transition/
POST /api/v1/deliveries/admin/deliveries/:id/confirm/
```

Decisoes:

```text
CodeSequence define codigos por organization e seed.
OrderKindDefinition define tipo de pedido por seed/config.
OrderStatusDefinition define workflow comercial por seed/config.
DeliveryStatusDefinition define workflow logistico por seed/config.
Orders reserva InventoryItem quando o tipo exige estoque.
Delivery nasce automaticamente a partir de Order quando o tipo define
createsDelivery=true.
Confirmacao de entrega pode acionar status terminal via effect configurado.
Royal Delivery, Royal Box, Pro, Picanha e qualquer nome comercial ficam em seed,
copy ou catalogo, nao em branch do backend.
Scheduling, recorrencia, janela/capacidade e Royal Box recorrente ficam para
kit/fase futura separada.
```

Validacao executada:

```text
py manage.py check -> OK
py manage.py makemigrations --check --dry-run -> OK
py manage.py test apps.core apps.orders apps.deliveries -> OK, 19 tests
py manage.py test -> OK, 54 tests
py manage.py migrate -> OK
py manage.py seed_backend --seed royalprime -> OK, orders=0, deliveries=0
py manage.py seed_backend --seed examples/bikeclub --dry-run -> OK
py manage.py seed_backend --seed examples/camisaclub --dry-run -> OK
py manage.py seed_backend --seed tests/minimal --dry-run -> OK
```
