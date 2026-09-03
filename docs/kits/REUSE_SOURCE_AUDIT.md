# Reuse Source Audit

Data: 2026-08-29

## Objetivo

Mapear o que pode ser reaproveitado de outros projetos do workspace para
amadurecer os kits verticais do RoyalPrime, sem copiar codigo cru e sem afetar
o produto atual sem decisao explicita.

Este documento existe para responder:

```text
Se amanha eu criar assinatura de camisa, peixe, vinho, agenda ou outro produto,
quais kits do RoyalPrime e quais referencias antigas aceleram a nova aplicacao?
```

## Regra Principal

Toda descoberta de reuso deve virar documentacao em kit antes de virar codigo.

```text
primeiro documentar
depois comparar com o contrato real do RoyalPrime
depois decidir se copia, adapta ou ignora
por ultimo implementar somente o menor corte necessario
```

RoyalPrime continua sendo produto real. Outros projetos servem como fonte de
experiencia, nao como fonte automatica de migracao.

## Modelo De Kit Vertical

Um kit vertical atravessa o produto inteiro:

```text
backend
  -> entidades, services, endpoints, seeds e permissoes

frontend shared-core
  -> contracts, DTOs, API clients, hooks, mappers, view-models e fallback dev

frontend web/mobile/admin
  -> telas render-only, modais, listas, formularios e actions visuais

docs
  -> criterio de copia/adaptacao para outro produto
```

Exemplo:

```text
Kit 01 - Auth & Users
  -> backend de contas, usuarios, permissoes e organization member
  -> client/admin shared-core de sessao, login, usuario atual e permissoes
  -> telas de login/conta/admin users apenas renderizando
  -> seeds de roles/permissoes
```

Produto futuro:

```text
Assinatura de camisa
  -> usa Kit 01 Auth & Users
  -> usa Kit 02 Catalog adaptado para produtos/tamanhos/cores
  -> usa Kit 03 Subscriptions adaptado para planos/ciclos
  -> usa Kit 05 Orders/Deliveries se houver pedido e entrega
```

## Fontes Auditadas

### HobbyMap

Pastas/documentos relevantes:

```text
../HobbyMap/packages/shared-core/README.md
../HobbyMap/docs/templates/shared/setup/SHARED-CORE.md
../HobbyMap/docs/templates/shared/setup/core/RENDER-ONLY-AND-BFF.md
../HobbyMap/docs/templates/shared/setup/core/LAYER-DONE-CHECKLISTS.md
../HobbyMap/docs/templates/shared/setup/core/FLOW-RECIPES.md
../HobbyMap/docs/templates/shared/setup/core/COPY-MAP.md
../HobbyMap/docs/templates/shared/setup/frontend-application/APP-REFERENCE-IMPLEMENTATION.md
../HobbyMap/docs/templates/shared/setup/frontend-admin/ADMIN-REFERENCE-IMPLEMENTATION.md
```

O que reaproveitar como ideia:

```text
shared-core como cerebro de UX/fluxo, nao fonte da verdade
HTTP sempre por services/API clients do shared-core
DTO -> mapper -> service -> hook/view-model -> render
strings/i18n fora de JSX
storage adapter por plataforma
checklists de camada pronta
templates de feature/screen
```

Kits RoyalPrime impactados:

```text
Kit 01 Auth & Users
Kit 02 Catalog
Kit 03 Subscriptions
Kit 05 Orders & Deliveries
Kit futuro Scheduling
Kit futuro Notifications
```

Pode copiar direto?

```text
nao copiar codigo direto agora
copiar formato de documentacao, checklists e fluxo mental
adaptar nomes para RoyalPrime e contratos backend reais
```

Risco:

```text
HobbyMap usa pacote compartilhado unico; RoyalPrime decidiu escopos separados:
frontend/shared-core, frontend/client/shared-core e frontend/admin/shared-core.
Nao importar a estrutura inteira sem adaptar.
```

### Syrax

Pastas/documentos relevantes:

```text
../Syrax/AGENTS.md
../Syrax/docs/DEVELOPMENT-STRATEGY.md
../Syrax/docs/MOBILE-MULTILANGUAGE-REACTIVATION-PLAN.md
../Syrax/docs/FRONTEND-ROUTE-MAP.md
../Syrax/docs/FRONTEND-APPLICATION-DESIGN-SYSTEM.md
../Syrax/docs/screens/CLIENT-SCREENS.md
../Syrax/docs/screens/ADMIN-SCREENS.md
../Syrax/docs/workflows/STITCH-HTML-TO-SYRAX-SCREEN.md
../Syrax/frontend/shared-core/
../Syrax/frontend/admin/
../Syrax/frontend/mobile/
../Syrax/frontend/web/
```

O que reaproveitar como ideia:

```text
web/mobile/admin como render-only
mobile espelhando web por shared-core contracts
route map ligando rota -> screen -> shared-core
admin com strings, routes, filtros, actions e page models no shared-core
copy visivel em shared-core strings
status/badges vindos de view-models
```

Kits RoyalPrime impactados:

```text
Kit 01 Auth & Users
Kit 04 Inventory
Kit 05 Orders & Deliveries
Kit Admin Operations
Kit futuro Mobile Client
```

Pode copiar direto?

```text
nao
usar como referencia de organizacao admin/mobile e de route map
adaptar ao modelo vertical por kit do RoyalPrime
```

Risco:

```text
Syrax tem dominio de recuperacao/vendas/WhatsApp.
Nao copiar regra de negocio, nomes de rotas ou modelos especificos.
```

### ServiceOS

Pastas/documentos relevantes:

```text
../ServiceOS/AGENTS.md
../ServiceOS/docs/SYSTEM_ARCHITECTURE_PILLAR.md
../ServiceOS/docs/BUILDER_DRAFT_AND_MANIFEST_PUBLICATION_CONTRACT.md
../ServiceOS/platform/foundation/
../ServiceOS/platform/foundation/shells/app-shell/
../ServiceOS/platform/manifest/
../ServiceOS/services/ecommerce/
../ServiceOS/services/appointments/
```

O que reaproveitar como ideia:

```text
Foundation como dona de primitives visuais
AppShell como capacidade de casca reutilizavel
Product Components acima de UI
manifest publicado como contrato de runtime
services consumindo Foundation/AppShell por APIs publicas
Appointments como referencia futura de scheduling
Ecommerce como destino futuro de capacidades maduras do RoyalPrime
```

Kits RoyalPrime impactados:

```text
todos, mas somente como destino futuro
Kit futuro Scheduling pode consultar services/appointments
Product components ecommerce podem virar candidatos depois de uso real
```

Pode copiar direto?

```text
nao agora
ServiceOS e destino/espelho arquitetural, nao dependencia do RoyalPrime
promover somente depois de reuso comprovado
```

Risco:

```text
tentar transformar RoyalPrime em ServiceOS cedo demais
criar manifest sem runtime real
promover Foundation/AppShell antes do produto provar necessidade
```

## Mapa Inicial Por Kit

| Kit RoyalPrime | Fontes uteis | Reuso esperado | Status da decisao |
| --- | --- | --- | --- |
| Kit 01 Auth & Users | HobbyMap shared-core, Syrax auth/admin docs | sessao, login, roles, permissoes, usuario atual, storage adapter | documentar antes de mexer |
| Kit 02 Catalog | HobbyMap templates, ServiceOS ecommerce | products/categories/variants/services catalog, filtros, mappers, cards | usar RoyalPrime como fonte principal |
| Kit 03 Subscriptions | HobbyMap plans patterns, RoyalPrime backend atual | planos, beneficios, ciclos, assinatura ativa | backend RoyalPrime ja e autoridade |
| Kit 04 Inventory | RoyalPrime backend atual, Syrax admin patterns | estoque admin, ajustes, status visual, permissoes | nao copiar dominio externo |
| Kit 05 Orders & Deliveries | RoyalPrime backend atual, Syrax admin screens | pedidos, timeline, delivery, transicoes, detalhes | alinhar contratos primeiro |
| Kit futuro Scheduling | ServiceOS appointments, HobbyMap agenda docs | calendario, recorrencia, slots, capacidade | planejar separado depois |
| Kit futuro Payments | HobbyMap payments docs, Syrax business-model | pagamento manual/gateway, status, conciliacao | depois de orders/admin firmes |
| Kit futuro Notifications | HobbyMap notification patterns | notification DTO, bell, toast, read/unread | nao iniciar agora |

## Como Usar Este Audit

Quando for criar ou melhorar um kit:

```text
1. Abrir o README do kit RoyalPrime.
2. Abrir este REUSE_SOURCE_AUDIT.md.
3. Escolher no maximo 1 ou 2 fontes externas relevantes.
4. Copiar ideia, nao copiar codigo cru.
5. Escrever no kit:
   - fonte consultada
   - decisao adotada
   - o que foi ignorado
   - risco de acoplamento
6. Implementar apenas se houver contrato/tela/necessidade real.
```

## Exemplo De Uso Futuro: Assinatura De Camisa

Kits provaveis:

```text
Kit 01 Auth & Users
Kit 02 Catalog
Kit 03 Subscriptions
Kit 05 Orders & Deliveries
Kit futuro Payments
```

O que muda:

```text
seed/config:
  -> produtos viram camisas
  -> variants viram tamanho/cor/modelo
  -> planos viram combinacoes de envio/ciclo
  -> categorias mudam

manifest/locale/tema/assets:
  -> marca, navegacao, copy, imagens e layout de apresentacao
```

O que deve reaproveitar:

```text
auth
usuarios
customers
catalog contracts
subscription contracts
orders flow
admin list/detail/status patterns
render-only discipline
```

O que nao deve reaproveitar:

```text
copy Royal Carnes
imagens de carne
regras especificas de peso de carne
nomes de plano como regra tecnica
status hardcoded de uma operacao especifica
```

## Criterio Para Virar Reuso Real

Um kit so deve ser considerado reaproveitavel quando:

```text
tem backend ou contrato claro
tem README apontando arquivos reais
explica o que copiar e o que adaptar
nao depende de Royal Carnes como regra tecnica
tem seeds/configs separando negocio de codigo
tem shared-core fino e testavel
tem tela render-only consumindo o fluxo
```

## Regra Final

```text
Todo aprendizado de HobbyMap, Syrax ou ServiceOS entra primeiro em docs/kits.
RoyalPrime nao deve receber copia direta de outro produto sem mapa de kit.
Kits sao o mecanismo de reaproveitamento; nao a desculpa para acoplar projetos.
```
