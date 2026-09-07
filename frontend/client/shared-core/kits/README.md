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
subscriptions
```

Ledger atual:

```text
docs/kits/KITS_RUNTIME_LEDGER.md
docs/handoff/09-meus-pedidos-render-only-audit.md
docs/handoff/10-minha-caixa-render-only-audit.md
```
