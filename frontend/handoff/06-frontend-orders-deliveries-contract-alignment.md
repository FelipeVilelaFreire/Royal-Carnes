# Handoff 06 - Frontend Orders/Deliveries Contract Alignment

Data: 2026-08-28

Use este documento para continuar a migracao de Orders/Deliveries no frontend
depois do audit do pacote compartilhado.

## Objetivo

```text
alinhar client/shared-core e admin/shared-core ao backend real de Orders e
Deliveries, sem transformar a tela em dona de regra e sem mascarar erro real
como sucesso de API.
```

## Leitura Obrigatoria

Antes de editar, leia nesta ordem:

```text
1. AGENTS.md
2. ROYALPRIME_CODEX_RULES.md
3. ROYALPRIME_ARCHITECTURE_CONTRACT.md
4. docs/CODEX_ENTRYPOINTS.md
5. backend/API_CONTRACTS.md
6. backend/seeds/royalprime/kits/orders.seed.json
7. backend/seeds/royalprime/kits/deliveries.seed.json
8. frontend/RENDER_ONLY_AUDIT.md
9. frontend/handoff/README.md
```

## Estado Encontrado No Audit

Builds passaram, mas a integracao ainda nao esta correta.

```text
admin web build: OK
client web build: OK
git diff --check: OK, com avisos LF/CRLF
walkthrough.md citado no resumo: nao encontrado no repo
```

O problema principal nao e compilacao. O problema e contrato.

## Backend Real

Orders cliente:

```text
GET  /api/v1/orders/config/
GET  /api/v1/orders/me/
POST /api/v1/orders/me/
GET  /api/v1/orders/me/:id/
```

Orders admin:

```text
GET  /api/v1/orders/admin/orders/
POST /api/v1/orders/admin/orders/
GET  /api/v1/orders/admin/orders/:id/
POST /api/v1/orders/admin/orders/:id/transition/
```

Deliveries cliente:

```text
GET /api/v1/deliveries/config/
GET /api/v1/deliveries/me/
GET /api/v1/deliveries/me/:id/
```

Deliveries admin:

```text
GET  /api/v1/deliveries/admin/deliveries/
POST /api/v1/deliveries/admin/deliveries/
GET  /api/v1/deliveries/admin/deliveries/:id/
POST /api/v1/deliveries/admin/deliveries/:id/transition/
POST /api/v1/deliveries/admin/deliveries/:id/confirm/
```

Headers esperados quando houver usuario real:

```text
X-Organization-Slug: royalprime
Authorization: Bearer <token>
```

## Chaves Reais De Seed

Orders kinds:

```text
delivery
subscription-cycle
```

Orders statuses:

```text
received
approved
separating
ready
completed
cancelled
```

Delivery statuses:

```text
pending
packing
out-for-delivery
delivered
failed
cancelled
```

Nao usar estes nomes como contrato novo:

```text
subscriptionCycle
royalDelivery
sentToStore
preparing
outForDelivery
delivered como status de order
```

Se algum desses nomes ainda existir, deve ser tratado como legado/mock adapter,
nao como contrato do backend.

## Achados Que Precisam Ser Corrigidos

### P0 - Client order contract esta legado

Arquivos:

```text
frontend/client/shared-core/contracts/order.contract.ts
frontend/client/shared-core/api/orders.api.ts
frontend/client/shared-core/view-models/orders.view-model.ts
frontend/client/shared-core/hooks/useMyOrders.ts
```

Problema:

```text
contrato usa kind/status camelCase e payload antigo
createOrder envia JSON.stringify(input) sem mapper para kind_key/product_key
fallback usa sentToStore/outForDelivery
view-model depende de labels de mock
```

Correcao esperada:

```text
1. Criar DTOs alinhados ao backend: OrderDto, OrderItemDto, OrderConfigDto.
2. Criar input real: CreateOrderPayload com kind_key e items[].product_key.
3. Criar mapper separado: DTO backend -> view-model de UI.
4. Manter mock apenas como fallback/dev usando o mesmo formato ou passando pelo mapper.
5. Remover RoyalOrderKind/RoyalOrderStatus fechado com chaves legadas.
```

### P0 - Admin APIs apontam para endpoints errados

Arquivos:

```text
frontend/admin/shared-core/api/adminOrders.api.ts
frontend/admin/shared-core/api/adminDeliveries.api.ts
```

Problema:

```text
/api/v1/admin/orders/ nao existe no backend real
/api/v1/admin/deliveries/ nao existe no backend real
nao ha X-Organization-Slug
nao ha Authorization
catch retorna mock e esconde falha real
```

Correcao esperada:

```text
1. Usar API_BASE_URL.
2. Usar /orders/admin/orders/ e /deliveries/admin/deliveries/.
3. Enviar X-Organization-Slug.
4. Aceitar accessToken via options.
5. Separar erro real de fallback dev.
```

### P0 - Fallback nao pode fingir sucesso de API

Arquivos:

```text
frontend/client/shared-core/api/orders.api.ts
frontend/client/shared-core/api/deliveries.api.ts
frontend/client/shared-core/hooks/useMyOrders.ts
frontend/client/shared-core/hooks/useMyDeliveries.ts
frontend/admin/shared-core/api/*.api.ts
frontend/admin/shared-core/hooks/*.ts
```

Problema:

```text
API client da catch e retorna mock
hook marca source como api porque nao recebeu erro
build passa, mas a tela pode estar 100% em mock sem avisar
```

Correcao esperada:

```text
1. API client deve lancar erro quando API real falhar.
2. Hook decide se usa fallback.
3. Hook deve marcar source = fallback quando fallback for usado.
4. Ideal: retornar tambem error/fallbackReason em dev.
```

### P1 - Status/tone ainda hardcoded no view-model

Arquivos:

```text
frontend/admin/shared-core/view-models/adminOrders.view-model.ts
frontend/admin/shared-core/view-models/adminDeliveries.view-model.ts
frontend/client/shared-core/view-models/orders.view-model.ts
frontend/client/shared-core/view-models/deliveries.view-model.ts
```

Problema:

```text
hardcode saiu de algumas telas, mas ficou nos view-models
statusConfig fixo ainda prende o fluxo a nomes locais
```

Correcao esperada:

```text
1. Ler labels/tone de /orders/config/ e /deliveries/config/.
2. Quando nao houver config carregada, usar fallback dev explicito.
3. Tela recebe label/tone prontos.
4. View-model nao deve conhecer regra de transicao.
```

### P1 - Landing ainda tem copy em JSX

Arquivo:

```text
frontend/client/web/src/screens/landing/HeroMarketplaceView.tsx
```

Problema:

```text
alguns textos ainda aparecem inline no JSX
```

Correcao esperada:

```text
mover copy restante para frontend/client/shared-core/locales/pt-BR.ts ou
manifest local da landing, sem mudar visual.
```

## Prompt Para A Proxima IA

```text
Voce esta no RoyalPrime.

Antes de codar, leia:
AGENTS.md
ROYALPRIME_CODEX_RULES.md
ROYALPRIME_ARCHITECTURE_CONTRACT.md
docs/CODEX_ENTRYPOINTS.md
backend/API_CONTRACTS.md
backend/seeds/royalprime/kits/orders.seed.json
backend/seeds/royalprime/kits/deliveries.seed.json
frontend/RENDER_ONLY_AUDIT.md
frontend/handoff/06-frontend-orders-deliveries-contract-alignment.md

Objetivo:
corrigir o shared-core de Orders/Deliveries para falar o contrato real do
backend, mantendo web/admin render-only.

Regras:
- nao hardcodar status/kinds comerciais como contrato TypeScript fechado;
- usar chaves reais do backend e seeds;
- criar mappers entre DTO backend e view-model de UI;
- API client nao deve esconder erro retornando mock silencioso;
- fallback dev deve ser decidido pelo hook e marcado como source=fallback;
- admin deve usar /orders/admin/orders/ e /deliveries/admin/deliveries/;
- enviar X-Organization-Slug e preparar Authorization quando houver token;
- nao mexer no visual salvo o minimo necessario para consumir novos view-models;
- nao implementar scheduling/Royal Box recorrente agora;
- nao promover nada para frontend/shared-core global sem prova real.

Validacao:
- se mexer no client web, rodar npm run build em frontend/client/web;
- se mexer no admin web, rodar npm run build em frontend/admin/web;
- rodar git diff --check;
- documentar no final o que ficou real API e o que ainda e fallback/dev.
```

## Criterio De Conclusao

```text
frontend/client/shared-core/contracts/* representa DTO real do backend
frontend/admin/shared-core/api/* chama endpoints reais
fallback nao mascara erro como source=api
status/kinds sao lidos de config ou mapeados por DTO/config
MeusPedidosView/MinhaContaView/OrderDetailModal continuam render-only
DashboardPage nao passa { status } as any para view-model de order completo
build client passa
build admin passa
git diff --check passa
```
