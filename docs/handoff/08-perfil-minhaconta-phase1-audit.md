# Perfil / MinhaConta - Phase 1 Audit

Data: 2026-09-06

## Objetivo

Auditar a tela `Perfil` / `MinhaConta` antes da migracao, seguindo o roteiro usado em `Montar Box`: primeiro funcionalidade e arquitetura, depois refinamento visual.

Tela atual:

```text
frontend/client/web/src/screens/portal/tabs/MinhaContaView.tsx
```

Rota atual:

```text
/perfil -> PortalView initialTab="minhaConta"
clientRoutes.minhaConta -> "/perfil"
portalNavigation.minhaConta -> routeKey "minhaConta"
```

## Diagnostico curto

`MinhaContaView` ainda e uma tela legacy grande. Ela funciona visualmente como prototipo, mas nao esta 100% dentro das regras atuais de Foundation, AppShell, locales, shared-core e render-only.

Status atual: fase 1 executada. A tela foi transformada em orquestrador render-only conectado ao shared-core, com fallback mockado isolado.

Arquivos criados/alterados na execucao:

```text
frontend/client/shared-core/contracts/customer.contract.ts
frontend/client/shared-core/data-sources/customer.fallback.ts
frontend/client/shared-core/hooks/useClientCustomer.ts
frontend/client/shared-core/view-models/customer.view-model.ts
frontend/client/shared-core/locales/pt-BR.ts
frontend/client/web/src/screens/portal/tabs/MinhaContaView.tsx
frontend/client/web/src/screens/portal/tabs/minha-conta/components.tsx
frontend/client/web/src/screens/portal/tabs/minha-conta/styles.module.css
frontend/client/web/src/screens/portal/tabs/minha-conta/types.ts
frontend/client/mobile/src/screens/portal/tabs/MinhaContaView.tsx
frontend/client/mobile/src/screens/portal/PortalView.tsx
```

## Passo 1 - Layout e config.jsx

Status: resolvido para a tela nova.

O que esta correto:

- A rota `/perfil` ja entra pelo `PortalView`.
- O AppShell novo ja consegue renderizar `minhaConta` pelo contrato central.
- `portalAppShellConfig.navigationPlacements.bottomTabBar.routeKeys` inclui `minhaConta`.

Problemas:

- `MinhaContaView` nao importa mais `PortalHeader`, `BottomTabBar`, `Footer` ou `AuthModal` de `legacy/app-shell`.
- A casca fica no `PortalView` + Foundation AppShell.
- Layout principal usa `Container`, `Stack`, `Inline`, `Card`, `Button`, `Input`, `Modal` e CSS module tokenizado.

Direcao:

- Manter a casca exclusivamente no `PortalView` + Foundation AppShell.
- A tela `MinhaContaView` deve renderizar apenas conteudo.
- Trocar layout manual por `Container`, `Grid`, `GridItem`, `Stack`, `Inline`, `Surface` e `Text`.

## Passo 2 - Locales / strings.xxx

Status: resolvido para a tela nova.

O que existe:

- `frontend/client/shared-core/locales/pt-BR.ts` ja tem `minhaConta.title`, `subtitle`, `tabs`, `sections`, `actions` e `legalNotice`.

Problemas:

- A tela nova consome `clientPtBR.minhaContaV2`.
- Prefixos de moeda e nome de plano tambem foram movidos para locale.
- O bloco antigo `minhaConta` foi preservado por compatibilidade; a tela nova nao depende dele.

Direcao:

- Criar/expandir `clientPtBR.minhaConta` com todos os textos da tela.
- Nenhum texto de UI novo deve ficar hardcoded em `MinhaContaView.tsx`.
- Dados vindos do cliente, pedidos, endereco, cartao e plano continuam como dados, nao como locales.

## Passo 3 - Mapear itens que podem virar componentes

Status: executado localmente.

Componentes extraidos:

- `AccountSidebarNav`
- `AccountHeroSummary`
- `CycleUsageGrid`
- `RecentOrdersPanel`
- `SubscriptionPanel`
- `ProfileFormPanel`
- `AddressListPanel`
- `PaymentPanel`
- `NotificationsPanel`
- `SecurityPanel`
- `PlanComparisonModal`

Observacao:

Esses componentes ainda nao devem ir automaticamente para `product-components/ecommerce`. Perfil e conta sao dominio de customer/account. Extrair primeiro localmente dentro da pasta da tela ou `frontend/client/web/src/screens/portal/tabs/minha-conta/`. Depois, se duas telas consumirem o mesmo componente, avaliar promocao.

## Passo 4 - Migrar itens para pasta especifica

Status: executado com arquivo unico de componentes locais.

Proposta de tree:

```text
frontend/client/web/src/screens/portal/tabs/minha-conta/
  components.tsx
  styles.module.css
  types.ts
```

Pausa obrigatoria:

Antes de extrair os componentes acima, confirmar com o usuario quais devem ser locais da tela e quais podem virar shared/componentes reutilizaveis.

Recomendacao inicial:

- Extrair tudo localmente na pasta `minha-conta/`.
- Nao promover nada para `product-components` nesta primeira fase.

## Passo 5 - Ver se precisa de novo UI

Status: nao foi necessario criar UI nova.

Necessidades percebidas:

- Toggle/Checkbox de Foundation para preferencias.
- Possivel `ProgressBar` ou `Meter` para uso de ciclo.
- Possivel `Tabs`/`SegmentedNav` para tabs de conta.

Pausa obrigatoria:

Antes de criar UI nova na Foundation, pedir aprovacao. Se o componente for exclusivo de Perfil, manter local usando `Surface`, `Button`, `Text` e layout.

Recomendacao:

- Nao criar UI nova agora.
- Usar `Button`, `Input`, `Select`, `Modal`, `BottomModal`, `Surface`, `Text`, `Layout`.
- Para progress bar, usar componente local simples vestindo tokens, ate provar reutilizacao.

## Passo 6 - Caso Passo 5 sim, criar

Status: nao executado.

So criar primitive nova se:

- tambem for usada em `Montar Box`, `Catalogo`, `Pedidos` ou Admin;
- a regra for generica;
- houver aprovacao no chat antes.

## Passo 7 - Aplicar UI, semi-composed e theme

Status: resolvido para a tela nova.

Problemas atuais:

- A tela web nova usa Foundation UI.
- A tela web nova nao usa legacy app-shell/design-system.
- Modal de planos usa `Modal`.
- Inputs de dados pessoais usam `Input`.
- Toggle de notificacao foi composto com `Button` localmente, sem criar primitive global.

Direcao:

- Trocar legacy UI por Foundation UI.
- Trocar icons legacy por `@foundation/ui/Icon/AppIcons`.
- Trocar HTML cru por `Button`, `Input`, `Select` e futuros controles Foundation quando existirem.
- Usar `Modal`/`BottomModal` para comparacao de planos.
- CSS local so para composicao especifica da tela, sempre vestindo tokens/vars.

## Passo 8 - Audit geral

Checklist de conclusao da fase 1:

- OK: `MinhaContaView.tsx` sem import direto de mocks.
- OK: `MinhaContaView.tsx` sem `window`, `document`, `localStorage` ou timers.
- OK: dados vindos de `useClientCustomer`.
- OK: fallback mockado isolado em `frontend/client/shared-core/data-sources/customer.fallback.ts`.
- OK: copy de UI em `clientPtBR.minhaContaV2`.
- OK: tela usando AppShell externo, nao shell legacy.
- OK: render principal usando Foundation UI/Layout.
- OK: modal usando `Modal`.
- OK: native com mesma tree conceitual e mesmo hook/shared-core.

## Shared-core necessario

O kit customer existe, mas esta incompleto para a tela real.

Arquivos existentes:

```text
frontend/client/shared-core/contracts/customer.contract.ts
frontend/client/shared-core/api/customer.api.ts
frontend/client/shared-core/mappers/customer.mapper.ts
frontend/client/shared-core/view-models/customer.view-model.ts
frontend/client/shared-core/types/customer.types.ts
frontend/client/shared-core/mocks/customer.mock.ts
```

Criados:

```text
frontend/client/shared-core/data-sources/customer.fallback.ts
frontend/client/shared-core/hooks/useClientCustomer.ts
```

O contrato atual so cobre perfil basico e enderecos resumidos. A tela usa tambem:

- assinatura ativa;
- plano atual e comparacao de planos;
- cota/uso do ciclo;
- pedidos recentes;
- metodos de pagamento;
- historico de pagamentos;
- preferencias de notificacao;
- dados pessoais editaveis.

## Backend / mock agora / admin futuro

Regra de origem:

```text
screen -> shared-core hook -> API client -> backend
                         -> fallback mockado explicito enquanto backend nao cobre tudo
```

Admin futuro:

- edita planos e catalogo em catalog/subscriptions;
- cliente ve plano e beneficios derivados do backend;
- metodos de pagamento, enderecos e preferencias devem vir do customer/account backend;
- historico de pagamentos deve vir de billing/orders;
- pedidos recentes devem continuar usando contracts de orders/ecommerce.

## Ordem recomendada de execucao

1. Criar `customer.fallback.ts` e `useClientCustomer.ts`.
2. Expandir contrato/view-model de customer para tudo que Perfil renderiza.
3. Migrar strings hardcoded para `clientPtBR.minhaConta`.
4. Pausar e confirmar extracao de componentes com o usuario.
5. Extrair componentes locais em `tabs/minha-conta/`.
6. Reescrever `MinhaContaView.tsx` como orquestrador render-only.
7. Criar base native com mesma tree conceitual.
8. Rodar build web, typecheck mobile e audit de hardcodes/imports.

## Nota apos fase 1

Como regra: 8/10.

Motivo:

- render-only e shared-core foram resolvidos para web;
- native recebeu a mesma tree conceitual e o mesmo hook;
- mocks ficaram isolados no fallback;
- ainda falta ligar backend real completo e refinar componentes em arquivos individuais se a tela crescer.

Meta da proxima entrega: backend real do customer/account ou refinamento visual sem quebrar a nova tree.
