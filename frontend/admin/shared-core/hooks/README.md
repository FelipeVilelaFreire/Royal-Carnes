# Admin Hooks

Hooks reutilizaveis dentro do Admin.

Exemplos futuros:

- `useAdminOrders`
- `useAdminProducts`
- `useAdminCustomers`
- `useAdminDeliveries`

Regra:

```text
hook organiza loading, erro, filtros, comandos e chama api client
screen admin apenas renderiza tabela, modal, detalhe e botoes
```

Regra de migracao:

```text
hook pode manter fallback para mocks durante a transicao
admin page nao deve importar mock direto quando existir hook do fluxo
```
