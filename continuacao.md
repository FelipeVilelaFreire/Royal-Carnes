# Continuacao - RoyalPrime Shared-Core Kit Reset

Data do ponto de parada:

```text
2026-08-30
```

Branch atual:

```text
feature/shared-core-kit-reset
```

## Estado Atual

O marco de reset do shared-core foi concluido e enviado ao GitHub.

Commits importantes:

```text
a5a61d9 Document shared-core reset plan
e7179e8 Reset shared-core runtime for kit-first rebuild
04e689f Start shared-core auth users kit
cc32fc4 Build shared-core kits 01-04
```

O objetivo desse corte foi limpar implementacoes funcionais prematuras de
shared-core para recomecar corretamente por kits.

## O Que Foi Preservado

```text
docs/kits/
frontend/shared-core/kits/
frontend/shared-core/manifest/
frontend/shared-core/public/
frontend/client/shared-core/kits/
frontend/client/shared-core/locales/
frontend/client/shared-core/manifests/
frontend/client/shared-core/mocks/
frontend/client/shared-core/navigation/
frontend/admin/shared-core/kits/
frontend/admin/shared-core/locales/
frontend/admin/shared-core/manifests/
frontend/admin/shared-core/mocks/
frontend/admin/shared-core/navigation/
```

## O Que Foi Removido

Runtime funcional prematuro:

```text
frontend/client/shared-core/api/*.ts
frontend/client/shared-core/hooks/*.ts
frontend/client/shared-core/contracts/*.ts
frontend/client/shared-core/view-models/*.ts

frontend/admin/shared-core/api/*.ts
frontend/admin/shared-core/hooks/*.ts
frontend/admin/shared-core/contracts/*.ts
frontend/admin/shared-core/view-models/*.ts
```

Legado removido do global:

```text
frontend/shared-core/client/
frontend/shared-core/admin/
frontend/shared-core/contracts/index.ts
frontend/shared-core/identity.ts
frontend/shared-core/foundation.ts
```

## Validacao Do Reset

```text
git diff --check: OK
admin web build: OK
client web build: OK
client web prerender: 18 rotas
```

## Regra Central Para Continuar

```text
backend
  -> regra real, banco, validacao, autorizacao, calculo e auditoria

frontend/shared-core
  -> somente contratos/capacidades realmente globais

frontend/client/shared-core
  -> fluxos reutilizaveis entre cliente web e futuro mobile

frontend/admin/shared-core
  -> fluxos reutilizaveis do admin

frontend/client/web e frontend/admin/web
  -> render-only: mostram dados e disparam actions
```

Regra curta:

```text
Regra mora no backend.
Fluxo reutilizavel mora no shared-core do escopo correto.
Tela apenas apresenta e dispara acao.
```

## Kit 01 Auth & Users - Corte Shared-Core

O Kit 01 foi fechado no nivel shared-core para os endpoints que existem hoje no
backend.

Arquivos centrais:

```text
docs/kits/auth-users-kit.md
docs/kits/kit-01-auth-users-shared-core-map.md
frontend/client/shared-core/kits/auth/contract.md
frontend/client/shared-core/kits/auth/flow.md
frontend/admin/shared-core/kits/auth/contract.md
frontend/admin/shared-core/kits/auth/flow.md
frontend/admin/shared-core/kits/users/contract.md
frontend/admin/shared-core/kits/users/flow.md
```

Cobertura backend real:

```text
POST /api/v1/auth/login/
POST /api/v1/auth/refresh/
POST /api/v1/auth/register/
POST /api/v1/auth/logout/
GET  /api/v1/accounts/me/
GET  /api/v1/accounts/users/
POST /api/v1/accounts/users/
```

Limite intencional:

```text
admin users detail/update/setRole nao foram implementados no API client porque
o backend atual ainda nao publica esses endpoints.
```

Validacao deste corte:

```text
npm run build:client -> OK
npm run build:admin -> OK
py manage.py check -> OK
```

## Kit 02 Catalog - Corte Shared-Core

Kit 02 Catalog tambem foi fechado no nivel shared-core para os endpoints que
existem hoje no backend.

Arquivos centrais:

```text
docs/kits/catalog-kit.md
docs/kits/kit-02-catalog-shared-core-map.md
frontend/client/shared-core/kits/catalog/contract.md
frontend/client/shared-core/kits/catalog/flow.md
frontend/admin/shared-core/kits/catalog/contract.md
frontend/admin/shared-core/kits/catalog/flow.md
```

Cobertura backend real:

```text
GET  /api/v1/catalog/collections/
GET  /api/v1/catalog/commercial-modes/
GET  /api/v1/catalog/products/
GET  /api/v1/catalog/products/:id/
GET  /api/v1/catalog/admin/products/
POST /api/v1/catalog/admin/products/
```

Limite intencional:

```text
PATCH/DELETE admin product, categories endpoint e measurement-units endpoint
nao foram implementados no shared-core porque o backend atual ainda nao publica
essas rotas em backend/apps/catalog/urls.py.
```

## Kit 03 Subscriptions - Corte Shared-Core

Kit 03 Subscriptions tambem foi fechado no nivel shared-core para os endpoints
que existem hoje no backend.

Arquivos centrais:

```text
docs/kits/subscriptions-kit.md
docs/kits/kit-03-subscriptions-shared-core-map.md
frontend/client/shared-core/kits/subscriptions/contract.md
frontend/client/shared-core/kits/subscriptions/flow.md
frontend/admin/shared-core/kits/subscriptions/contract.md
frontend/admin/shared-core/kits/subscriptions/flow.md
```

Cobertura backend real:

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

Limite intencional:

```text
update/cancel/pause/detail e transicoes de ciclo nao foram implementados no
shared-core porque o backend atual ainda nao publica essas rotas.
```

## Kit 04 Inventory - Corte Shared-Core

Kit 04 Inventory tambem foi fechado no nivel shared-core para os endpoints
admin que existem hoje no backend.

Arquivos centrais:

```text
docs/kits/inventory-kit.md
docs/kits/kit-04-inventory-shared-core-map.md
frontend/admin/shared-core/kits/inventory/contract.md
frontend/admin/shared-core/kits/inventory/flow.md
frontend/client/shared-core/kits/inventory/README.md
```

Cobertura backend real:

```text
GET  /api/v1/inventory/admin/items/
POST /api/v1/inventory/admin/items/
GET  /api/v1/inventory/admin/items/:id/
POST /api/v1/inventory/admin/items/:id/adjust/
GET  /api/v1/inventory/admin/items/:id/movements/
```

Limite intencional:

```text
client inventory API, PATCH/DELETE admin item e reservations API nao foram
implementados no shared-core porque o backend atual ainda nao publica essas
rotas.
```

## Kit 05 Orders - Corte Shared-Core

Kit 05 Orders tambem foi fechado no nivel shared-core para os endpoints client
e admin que existem hoje no backend.

Arquivos centrais:

```text
docs/kits/orders-kit.md
docs/kits/kit-05-orders-shared-core-map.md
frontend/client/shared-core/kits/orders/contract.md
frontend/client/shared-core/kits/orders/flow.md
frontend/admin/shared-core/kits/orders/contract.md
frontend/admin/shared-core/kits/orders/flow.md
```

Cobertura backend real:

```text
GET  /api/v1/orders/config/
GET  /api/v1/orders/me/
POST /api/v1/orders/me/
GET  /api/v1/orders/me/:id/
GET  /api/v1/orders/admin/orders/
POST /api/v1/orders/admin/orders/
GET  /api/v1/orders/admin/orders/:id/
POST /api/v1/orders/admin/orders/:id/transition/
```

Limite intencional:

```text
PATCH/DELETE/cancel shortcut, payment behavior, delivery update e inventory
release nao foram implementados no shared-core porque o backend atual nao
publica essas rotas neste kit.
```

## Kit 06 Fulfillment & Delivery - Corte Shared-Core

Kit 06 Delivery tambem foi fechado no nivel shared-core para os endpoints
client e admin que existem hoje no backend.

Arquivos centrais:

```text
docs/kits/fulfillment-delivery-kit.md
docs/kits/kit-06-fulfillment-delivery-shared-core-map.md
frontend/client/shared-core/kits/deliveries/contract.md
frontend/client/shared-core/kits/deliveries/flow.md
frontend/admin/shared-core/kits/deliveries/contract.md
frontend/admin/shared-core/kits/deliveries/flow.md
```

Cobertura backend real:

```text
GET  /api/v1/deliveries/config/
GET  /api/v1/deliveries/me/
GET  /api/v1/deliveries/me/:id/
GET  /api/v1/deliveries/admin/deliveries/
POST /api/v1/deliveries/admin/deliveries/
GET  /api/v1/deliveries/admin/deliveries/:id/
POST /api/v1/deliveries/admin/deliveries/:id/transition/
POST /api/v1/deliveries/admin/deliveries/:id/confirm/
```

Limite intencional:

```text
package management API, client create/transition/confirm, scheduling, route
optimization e driver app nao foram implementados porque o backend atual nao
publica essas capacidades neste kit.
```

## Documentacao Geral Antes Das Telas

Documentos criados para orientar a proxima fase:

```text
docs/architecture/OWNERSHIP_TREE.md
docs/kits/SHARED_CORE_KITS_01_06_HANDOFF.md
docs/kits/PHASE_2_RENDER_ONLY_SCREEN_PLAN.md
```

Eles sao a porta de entrada para qualquer IA ou desenvolvedor entender:

```text
estado dos Kits 01-06
ownership backend/shared-core/render
nome oficial render-apps para a camada de telas
ordem recomendada das telas
contrato render-only
quando parar e voltar para backend
```

## Proxima Etapa: Fase 2 Render-Only Screens

Nao existe Kit 07 implementavel neste momento. Payments, Checkout, Wallet e
Vouchers continuam planejados ate nascer backend real.

Seguir para telas mantendo a mesma disciplina:

```text
backend real primeiro
shared-core do menor escopo correto
tela render-only consome hook/view-model
documentar qualquer gap antes de criar backend novo
```

## O Que Nao Fazer No Proximo Marco

```text
nao colocar auth inteiro no frontend/shared-core global
nao criar hook generico com if client/admin
nao chamar endpoint direto em tela
nao guardar permissao real, status permitido ou regra de negocio em locale
nao voltar com frontend/shared-core/client ou frontend/shared-core/admin
nao criar Kit 07 sem backend real
```

## Resultado Do Kit 01

```text
Kit 01 shared-core fechado para endpoints atuais - DONE
global minimo com tipos realmente comuns - DONE
client auth/session iniciado no shared-core do client - DONE
admin auth/users/permissions iniciado no shared-core do admin - DONE
telas render-only ainda nao conectadas - INTENCIONAL
```

Validacao do corte:

```text
npm run build:client -> OK
npm run build:admin -> OK
py manage.py check -> OK
```

## Resultado Do Kit 02

```text
Kit 02 Catalog shared-core fechado para endpoints atuais - DONE
global minimo com tipos/contratos catalog puros - DONE
client catalog publico iniciado no shared-core do client - DONE
admin catalog operacional iniciado no shared-core do admin - DONE
telas render-only ainda nao conectadas - INTENCIONAL
```

## Resultado Do Kit 03

```text
Kit 03 Subscriptions shared-core fechado para endpoints atuais - DONE
global minimo com tipos/contratos subscriptions puros - DONE
client plans/subscription/current cycle iniciado no shared-core do client - DONE
admin plans/subscriptions/cycles iniciado no shared-core do admin - DONE
telas render-only ainda nao conectadas - INTENCIONAL
```

## Resultado Do Kit 04

```text
Kit 04 Inventory shared-core fechado para endpoints atuais - DONE
global minimo com tipos/contratos inventory puros - DONE
admin inventory operacional iniciado no shared-core do admin - DONE
client inventory sem runtime proprio neste corte - INTENCIONAL
telas render-only ainda nao conectadas - INTENCIONAL
```

## Resultado Do Kit 05

```text
Kit 05 Orders shared-core fechado para endpoints atuais - DONE
global minimo com tipos/contratos orders puros - DONE
client orders iniciado no shared-core do client - DONE
admin orders iniciado no shared-core do admin - DONE
telas render-only ainda nao conectadas - INTENCIONAL
```

## Resultado Do Kit 06

```text
Kit 06 Fulfillment & Delivery shared-core fechado para endpoints atuais - DONE
global minimo com tipos/contratos deliveries puros - DONE
client deliveries iniciado no shared-core do client - DONE
admin deliveries iniciado no shared-core do admin - DONE
telas render-only ainda nao conectadas - INTENCIONAL
```

Frase guia:

```text
backend reutiliza por seed/config
shared-core reutiliza por kit
web/native/admin-web reutiliza por manifest/render
```
