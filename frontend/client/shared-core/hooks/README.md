# Client Hooks

Hooks reutilizaveis entre cliente web e cliente mobile.

Status atual:

```text
Kits 01-06 possuem hooks client quando existe endpoint client/publico real.
```

Hooks atuais principais:

- `useClientAuthSession`
- `useClientCatalog`
- `useClientProductDetail`
- `useClientPlans`
- `useClientSubscription`
- `useClientCurrentCycle`
- `useClientOrders`
- `useClientOrderDetail`
- `useClientDeliveries`
- `useClientDeliveryDetail`

Regra:

```text
hook organiza loading, erro, estado de fluxo e chama api client
screen apenas renderiza e dispara acao
```

Importante:

```text
api client nao deve retornar mock como se fosse response real
screen nao deve importar mock direto quando existir hook do fluxo
```
