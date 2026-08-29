# Admin Shared-Core Kits

Cada pasta aqui representa uma capacidade operacional organizada para o Admin.

## Tree De Um Kit

```text
kits/<capability>/
  README.md
  contract.md
  flow.md
```

## Regra

```text
kit admin descreve listagens, filtros, comandos e permissoes
contracts/api/hooks/mappers/view-models implementam o fluxo
admin web apenas consome hooks e renderiza
```

Primeiro corte recomendado:

```text
orders
deliveries
```
