# RoyalPrime Backend

Esta pasta agora guarda apenas a direcao arquitetural do backend do RoyalPrime.

O backend Django anterior foi descartado como base de implementacao. Ele nao estava conectado ao fluxo atual do frontend, nao representava mais o produto vendido ao cliente e nao deve guiar o MER novo.

## Como continuar

Antes de implementar qualquer backend novo, leia nesta ordem:

1. `AGENTS.md` na raiz do workspace.
2. `backend/ROADMAP.md`.
3. `backend/ARCHITECTURE.md`.

## Decisao atual

O RoyalPrime passa a ser tratado como produto principal. O ServiceOS continua como referencia de organizacao, contratos, AppShell, shared-core e separacao de responsabilidades, mas nao deve travar a entrega nem forcar abstracao antes da necessidade real.

## Ordem central do produto

Todo desenvolvimento novo deve seguir esta divisao:

```text
backend
  -> regra real, persistencia, validacao, autorizacao e calculo

frontend/*/shared-core
  -> contratos, API clients, hooks, mappers e fluxo reutilizavel no escopo correto

frontend/*/web | mobile | admin
  -> renderizacao, layout, inputs, botoes e chamada dos hooks
```

Regra curta:

```text
Regra mora no backend.
Fluxo reutilizavel mora no shared-core do escopo correto.
Tela apenas apresenta e dispara acao.
```

Escopo de `shared-core`:

```text
frontend/client/shared-core
  -> reutilizavel entre cliente web e cliente mobile

frontend/admin/shared-core
  -> reutilizavel dentro do admin

frontend/shared-core
  -> apenas contratos/capacidades realmente comuns entre client, mobile e admin
```

Regra:

```text
RoyalPrime prova o fluxo real
  -> backend nasce com MER proprio e organizationId
  -> frontend consome API por shared-core/hooks
  -> ServiceOS recebe depois apenas o que se provar reutilizavel
```

## Proxima rodada

A proxima rodada deve comecar por documentacao e modelagem:

1. Rever a tree final do produto.
2. Definir a foundation do backend.
3. Montar o MER.
4. Classificar mocks atuais como entidade, seed, DTO ou dado temporario.
5. So depois iniciar implementacao.

Nao recriar runtime backend antes de fechar tree e MER.
