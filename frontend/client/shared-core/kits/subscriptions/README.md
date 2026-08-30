# Client Subscriptions Kit

Fluxo de planos, assinatura atual e ciclo visto pelo cliente.

Inclui:

```text
planos publicos
assinatura ativa do cliente
ciclo atual
itens selecionados do ciclo
selecao de item do ciclo
```

Regra de entitlement, limite, disponibilidade e unidade continua no backend.

Mapa vertical:

```text
docs/kits/kit-03-subscriptions-shared-core-map.md
contract.md
flow.md
```

Arquivos runtime:

```text
contracts/subscriptions.contract.ts
api/subscriptions.api.ts
hooks/useClientPlans.ts
hooks/useClientSubscription.ts
hooks/useClientCurrentCycle.ts
hooks/useClientCycleItems.ts
mappers/subscriptions.mapper.ts
view-models/subscriptions.view-model.ts
```

Nao inclui:

```text
criar plano
editar entitlement
listar todas as assinaturas
admin cycles
regra de limite calculada na tela
```
