# 10 - Minha Caixa render-only audit

Data: 2026-09-07

## Escopo

Tela auditada: `/minha-caixa`.

Objetivo da fase: iniciar a tela de caixa/ciclo da assinatura no mesmo padrao
render-only de `/meus-pedidos`, com dados vindos de `client/shared-core`,
strings por locale, UI web pela Foundation e paridade inicial mobile.

## Resultado

- Web `MinhaCaixaView` nao importa mais `legacy/design-system`.
- Web `MinhaCaixaView` nao importa mais `legacy/app-shell`.
- Web `MinhaCaixaView` nao importa mocks diretamente.
- Web `MinhaCaixaView` nao importa `clientPtBR` diretamente.
- Web `MinhaCaixaView` usa `useClientSubscription({ fallbackOnError: true })`.
- Web `MinhaCaixaView` usa `useClientCurrentCycle({ fallbackOnError: true })`.
- Web `MinhaCaixaView` usa Badge da Foundation para ciclo/categoria.
- Mock de fase 1 fica em `frontend/client/shared-core/data-sources/subscriptions.fallback.ts`.
- `subscriptions.view-model.ts` entrega itens selecionados, preco do plano,
  numero do ciclo, faixa do ciclo e metricas de uso prontas para render.
- Limites demonstrativos do ciclo ficam em metadata do fallback, nao hardcoded na tela.
- Rotas usadas por acoes da tela vêm de `clientRoutes`.
- Mobile ganhou `MinhaCaixaView` consumindo os mesmos hooks, strings e fallback.
- `PortalView` mobile agora reconhece `minhaCaixa`.

## Contrato atual

```text
MinhaCaixaView
  -> useClientSubscription
    -> clientSubscriptionsApi.me()
    -> /api/v1/subscriptions/me/
    -> subscriptionsFallbackDataSource quando API falha na fase 1
  -> useClientCurrentCycle
    -> clientSubscriptionsApi.currentCycle()
    -> /api/v1/subscriptions/me/cycles/current/
    -> selectCurrentCycleItem(input)
    -> /api/v1/subscriptions/me/cycles/current/items/
  -> createClientSubscriptionViewModel()
  -> createClientCycleViewModel()
  -> Foundation UI / mobile UI
```

## Auditoria feita

Busca no escopo da tela para:

- `legacy`
- `clientPtBR`
- `catalogSubscriptionPlansMock`
- `royalCustomerMock`
- `productsMock`
- cores hardcoded `#hex`
- `rgba(`
- `<style`
- `localStorage`
- `document.`
- `span` local para status/source quando Badge atende

Resultado: sem ocorrencias no escopo novo da tela web/native inicial.

## Validacao

- `node node_modules\typescript\bin\tsc -p frontend\client\mobile\tsconfig.json`
- `npm run build:client`
- `npm run build:admin`
- `git diff --check`

## Proximo passo

Quando o backend de subscriptions estiver operacional para cliente real,
revisar `fallbackOnError` para garantir que erro de API nao fique mascarado em
producao. O fallback atual e intencional para fase 1.
