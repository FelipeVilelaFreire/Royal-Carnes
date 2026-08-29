# Codex Entrypoints

Este documento lista os arquivos principais que um agente deve ler antes de
implementar no RoyalPrime.

## Ordem Global

```text
1. AGENTS.md
2. ROYALPRIME_CODEX_RULES.md
3. ROYALPRIME_ARCHITECTURE_CONTRACT.md
4. frontend/TREE.md
5. frontend/RENDER_ONLY_AUDIT.md
6. frontend/COPY_LOCALE_AUDIT.md
7. frontend/KIT_FUNCTIONALITY_STRATEGY.md
8. frontend/handoff/README.md
9. frontend/handoff/06-frontend-orders-deliveries-contract-alignment.md
10. backend/README.md
11. backend/ROADMAP.md
12. backend/ARCHITECTURE.md
13. backend/API_CONTRACTS.md
14. docs/kits/README.md
15. docs/kits/REUSE_SOURCE_AUDIT.md
16. docs/kits/SHARED_CORE_KIT_RESET_PLAN.md
17. docs/kits/SHARED_CORE_KIT_RESET_RESULT.md
18. frontend/client/web/docs/ROYALPRIME_TO_SERVICEOS_ECOMMERCE_DEPARA.md
```

## Regra De Camadas

```text
backend
  -> regra real, persistencia, validacao, autorizacao, calculo e auditoria

shared-core do escopo correto
  -> contratos, DTOs, API clients, hooks, mappers, view-models, manifests e mocks temporarios

web/mobile/admin-web
  -> render-only

foundation
  -> visual-only
```

## Tres Camadas De Reuso

```text
backend
  -> reutilizavel por seed/config

frontend/*/shared-core
  -> reutilizavel por funcao/kit

frontend/*/web e frontend/*/mobile
  -> render-only agora
  -> manifest-driven aos poucos
```

Regra curta:

```text
backend reutiliza por seed
shared-core reutiliza por kit
web/native reutiliza por manifest/render
```

Exemplo:

```text
assinatura de carne, peixe ou camisa
  -> backend troca seed/config
  -> shared-core reaproveita subscriptions/catalog/orders
  -> web/native trocam manifest, locale, navigation, tema e assets
```

## Exemplo Que Todo Agente Deve Seguir

Caso: botao "Adicionar item".

```text
screen
  -> renderiza botao
  -> onClick chama action do hook

shared-core do escopo correto
  -> hook/action addItem
  -> api client
  -> mapper
  -> view-model

backend
  -> valida produto, estoque, limite, preco, organization e persistencia
```

Exemplo de tela:

```tsx
<Button onClick={() => orderActions.addItem(product.id)}>
  {strings.add}
</Button>
```

Nunca fazer:

```text
screen calcular regra de plano/estoque/preco
screen chamar fetch direto para fluxo reutilizavel
shared-core global receber logica antes de reuso real
locale guardar regra de negocio
```

## Regra De Shared-Core

```text
frontend/shared-core
  -> global pequeno: identity, organization, money, address, manifest

frontend/client/shared-core
  -> fluxo do cliente web/mobile

frontend/admin/shared-core
  -> fluxo operacional/admin
```

Nao promover para `frontend/shared-core` global por previsao abstrata.

## Mentalidade De Kit

```text
kit descreve capacidade e fronteira de reuso
contracts/api/hooks/mappers/view-models implementam o fluxo
manifests guardam configuracao editavel
surface renderiza
backend decide regra real
```

Locais:

```text
docs/kits
  -> mapas de reuso do produto inteiro

frontend/shared-core/kits
  -> kits globais pequenos

frontend/client/shared-core/kits
  -> kits do cliente

frontend/admin/shared-core/kits
  -> kits do admin
```

Para decidir quando criar funcionalidade no shared-core, leia:

```text
frontend/KIT_FUNCTIONALITY_STRATEGY.md
```

Para reaproveitar ideias de HobbyMap, Syrax, ServiceOS ou outro projeto:

```text
docs/kits/REUSE_SOURCE_AUDIT.md
docs/kits/SHARED_CORE_KIT_RESET_PLAN.md
docs/kits/SHARED_CORE_KIT_RESET_RESULT.md
```

Regra:

```text
fonte externa vira documentacao de kit antes de virar codigo
```

## Manifest-First Gradual

O RoyalPrime ainda tem hardcode historico. Isso e aceitavel enquanto o fluxo
esta sendo provado.

Ao tocar em uma tela:

```text
1. manter comportamento funcionando
2. extrair contrato/DTO/hook quando houver fluxo reutilizavel
3. mover copy/config repetida para locale ou manifest
4. mover navegacao, titulos, labels e estados vazios para manifest quando fizer sentido
5. trocar repeticao por screen type quando o padrao estiver claro
```

Exemplos:

```text
ListPage
DetailPage
FormPage
DashboardPage
colunas
filtros
acoes
labels
estados vazios
navegacao
AppShell config
```

## Regra Para Strings

Nao criar novo texto de UI espalhado em JSX quando houver lugar claro em
locale, config ou manifest.

Se a tela ainda estiver hardcoded por motivo de transicao, documente a intencao
e evite transformar copy comercial em regra tecnica.

Para o audit atual de copy, leia:

```text
frontend/COPY_LOCALE_AUDIT.md
```

## Ordem Para Orders/Deliveries Frontend

```text
1. ler backend/API_CONTRACTS.md
2. ler backend/seeds/royalprime/kits/orders.seed.json
3. ler backend/seeds/royalprime/kits/deliveries.seed.json
4. alinhar client contracts/DTOs aos campos reais do backend
5. criar mappers DTO -> view-model
6. corrigir API clients para endpoints reais
7. hooks decidem fallback dev e source=fallback quando usar mock
8. telas cliente continuam render-only
9. admin/shared-core usa endpoints /orders/admin/* e /deliveries/admin/*
10. admin web continua render-only com screen types
```

## Handoff Atual

Para continuar a migracao Orders/Deliveries, leia primeiro:

```text
frontend/handoff/06-frontend-orders-deliveries-contract-alignment.md
```
