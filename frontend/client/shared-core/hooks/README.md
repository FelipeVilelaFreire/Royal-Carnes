# Client Hooks

Hooks reutilizaveis entre cliente web e cliente mobile.

Exemplos futuros:

- `useProducts`
- `useCustomer`
- `useAddresses`
- `useSubscriptionCycle`
- `useSubscription`

Proximo corte:

- `useOrderConfig`
- `useMyOrders`
- `useDeliveryConfig`
- `useMyDeliveries`

Regra:

```text
hook organiza loading, erro, estado de fluxo e chama api client
screen apenas renderiza e dispara acao
```

Regra de migracao:

```text
hook pode ter fallback para mocks atuais durante a transicao
screen nao deve importar mock direto quando existir hook do fluxo
```

Importante:

```text
se o hook usar mock por falha da API, source deve ser fallback
error/fallbackReason deve continuar visivel para debug
api client nao deve retornar mock como se fosse response real
```
