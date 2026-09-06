# 09 - Meus Pedidos render-only audit

Data: 2026-09-06

## Escopo

Tela auditada: `/meus-pedidos`.

Objetivo da fase: deixar a tela em render-only, com dados vindos de `shared-core`, UI via Foundation e paridade inicial com native.

## Resultado

- Web `MeusPedidosView` nao importa mais legacy app-shell/design-system.
- Web `MeusPedidosView` nao importa mocks diretamente.
- Web `MeusPedidosView` nao importa `clientPtBR` diretamente.
- Web `MeusPedidosView` usa `useClientOrders({ fallbackOnError: true })`.
- Mock de fase 1 fica em `frontend/client/shared-core/data-sources/orders.fallback.ts`.
- `orders.view-model.ts` entrega labels e estados prontos para render.
- Modal web usa `Modal`/`BottomModal` da Foundation.
- Native consome `useClientOrders` e `useClientStrings`.
- Native ganhou primitive local `ui/Modal` bottom-first para detalhe de pedido.

## Contrato atual

```text
MeusPedidosView
  -> useClientOrders
    -> clientOrdersApi
      -> /api/v1/orders/config/
      -> /api/v1/orders/me/
    -> ordersFallbackDataSource quando API falha na fase 1
  -> createClientOrdersViewModel
  -> Foundation UI / mobile UI
```

## Auditoria feita

Busca no escopo da tela para:

- `legacy`
- `clientPtBR`
- `royalCustomerOrdersMock`
- `catalogSubscriptionPlansMock`
- `prepareMockOrderViewModel`
- `OrderDetailModal`
- cores hardcoded `#hex`
- `rgba(`
- `<style`
- `localStorage`
- `document.`

Resultado: sem ocorrencias no escopo novo da tela web/native e modal mobile.

## Validacao

- `npm run build:client`
- `node node_modules\typescript\bin\tsc -p frontend\client\mobile\tsconfig.json`
- `git diff --check`
- `curl.exe -I http://localhost:3000/meus-pedidos`

## Proximo passo

Quando o backend estiver autenticando o cliente real, revisar `fallbackOnError` para garantir que erro de API nao fique mascarado em producao. O fallback atual e intencional para fase 1.
