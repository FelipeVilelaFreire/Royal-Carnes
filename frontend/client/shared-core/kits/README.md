# Client Shared-Core Kits

Cada pasta aqui representa uma capacidade do cliente organizada para reuso em
client web e futuro mobile.

## Tree De Um Kit

```text
kits/<capability>/
  README.md
  contract.md
  flow.md
```

## Regra

```text
kit descreve capacidade
contracts/api/hooks/mappers/view-models implementam o fluxo
screens apenas consomem hooks e renderizam
```

Primeiro corte recomendado:

```text
orders
deliveries
```
