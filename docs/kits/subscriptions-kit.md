# Subscriptions Kit

Status atual: `local foundation`

Fase principal: Fase 3 - Plans And Subscriptions

## Objetivo

Documentar a capacidade de planos, beneficios recorrentes, assinaturas e ciclos
sem prender o backend a Royal Carnes.

Regra:

```text
Plano nao contem regra hardcoded.
Plano contem direitos.
Backend valida se a escolha cabe dentro desses direitos.
```

## Escopo Backend

Arquivos fonte:

```text
backend/apps/subscriptions/models.py
backend/apps/subscriptions/services.py
backend/apps/subscriptions/selectors.py
backend/apps/subscriptions/serializers.py
backend/apps/subscriptions/views.py
backend/apps/subscriptions/urls.py
backend/apps/subscriptions/tests/test_api.py
backend/apps/core/seed_loader.py
backend/seeds/**/kits/subscriptions.seed.json
```

Entidades:

```text
Plan
PlanPrice
PlanEntitlement
Subscription
SubscriptionCycle
SubscriptionCycleItem
```

## Escopo Shared-Core

Ainda pendente.

Arquivos esperados:

```text
frontend/client/shared-core/contracts/subscription.contract.ts
frontend/client/shared-core/api/subscriptions.api.ts
frontend/client/shared-core/hooks/useSubscription.ts
frontend/admin/shared-core/contracts/subscription.contract.ts
frontend/admin/shared-core/api/subscriptions.api.ts
```

## Escopo Render

Ainda pendente.

Screens futuras devem apenas renderizar planos, assinatura atual, ciclo e itens
recebidos dos hooks/shared-core.

## O Que E Generico

- Planos por organization.
- Precos recorrentes.
- Entitlements por collection, category, product ou variant.
- Unidades vindas de `MeasurementUnit` por seed.
- Constraints como `maxSelections`, `maxQuantity`, `allowedAttributes`,
  `allowedCommercialModes` e `requiresAvailability`.

## O Que E Especifico Do RoyalPrime

- Nomes Basic, Premium e Pro.
- Collections como `dia-a-dia` e `churrasco-premium`.
- Produtos como Picanha e Carvao.
- Copy comercial e imagens.

## Como Copiar/Adaptar

1. Copiar o app subscriptions e dependencias de accounts, customers e catalog.
2. Criar seed de organization, catalog e measurement units do novo negocio.
3. Criar `subscriptions.seed.json` com plans, prices e entitlements.
4. Trocar somente dados/copy/tema; nao criar if por nome de plano.

## Seeds Esperados

```text
backend/seeds/royalprime/kits/subscriptions.seed.json
backend/seeds/examples/bikeclub/kits/subscriptions.seed.json
backend/seeds/examples/camisaclub/kits/subscriptions.seed.json
backend/seeds/tests/kits/subscriptions.seed.json
```

## Criterio Para Kit-Ready

- Backend real de subscriptions existir; DONE
- Seed RoyalPrime criar planos, entitlements, subscription e ciclo; DONE
- Seeds exemplo provarem unidade/categoria diferente por negocio; DONE
- APIs publicas/cliente/admin existirem; DONE
- Testes cobrirem seed, permissao e validacao generica; DONE
- Endpoint de selecao de item do ciclo existir; DONE
- Frontend consumir por shared-core/hooks; DONE em `MeuClubeView`

## Criterio Para ServiceOS Candidate

Somente depois de reuso fora do RoyalPrime e quando a extracao reduzir
complexidade real.
