# Admin Hooks

Hooks reutilizaveis dentro do Admin.

Status atual:

```text
Kits 01-06 possuem hooks admin para endpoints admin existentes.
```

Hooks atuais principais:

- `useAdminAuthSession`
- `useAdminUsers`
- `useAdminCatalog`
- `useAdminPlans`
- `useAdminSubscriptions`
- `useAdminInventory`
- `useAdminOrders`
- `useAdminDeliveries`

Regra:

```text
hook organiza loading, erro, filtros, comandos e chama api client
screen admin apenas renderiza tabela, modal, detalhe e botoes
```

Admin page nao deve importar mock direto quando existir hook do fluxo.
