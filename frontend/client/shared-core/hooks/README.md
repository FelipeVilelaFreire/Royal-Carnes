# Client Hooks

Hooks reutilizaveis entre cliente web e cliente mobile.

Status atual:

```text
runtime resetado na branch feature/shared-core-kit-reset
nenhum hook funcional deve ser tratado como existente
```

Exemplos futuros:

- `useProducts`
- `useCustomer`
- `useAddresses`
- `useSubscriptionCycle`
- `useSubscription`

Primeiro corte recomendado:

```text
Kit 01 Auth & Users
```

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
