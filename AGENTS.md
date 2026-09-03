# RoyalPrime Agent Instructions

Este arquivo e a entrada obrigatoria para qualquer agente trabalhando no RoyalPrime.

Antes de implementar, leia nesta ordem:

1. `ROYALPRIME_CODEX_RULES.md`
2. `ROYALPRIME_ARCHITECTURE_CONTRACT.md`
3. `docs/CODEX_ENTRYPOINTS.md`
4. `backend/README.md`
5. `backend/ROADMAP.md`
6. `backend/ARCHITECTURE.md`
7. `docs/frontend/TREE.md`
8. `docs/frontend/RENDER_ONLY_AUDIT.md`
9. `docs/kits/README.md`
10. `frontend/client/web/docs/ROYALPRIME_TO_SERVICEOS_ECOMMERCE_DEPARA.md`

## Direcao do Produto

RoyalPrime agora e o produto-foco.

O ServiceOS continua como referencia de organizacao, contratos, AppShell, Foundation, manifest e separacao de responsabilidades. Mas o RoyalPrime nao deve ser bloqueado por uma migracao prematura para ServiceOS.

Regra:

```text
RoyalPrime prova o fluxo real.
ServiceOS recebe depois apenas o que se provar reutilizavel.
```

## Ordem Central

```text
backend
  -> regra real, persistencia, validacao, autorizacao, calculo e auditoria

shared-core do escopo correto
  -> contratos, DTOs, API clients, hooks, mappers, view-models, manifest e mocks temporarios

web/mobile/admin-web
  -> render-only: layout, inputs, modais, tabelas, screen composition e chamada dos hooks

foundation
  -> visual-only: design system, primitives, AppShell, tokens e componentes visuais genericos
```

Regra curta:

```text
Regra mora no backend.
Fluxo reutilizavel mora no shared-core do escopo correto.
Tela apenas apresenta e dispara acao.
Foundation nao conhece regra de produto.
```

## Tres Camadas De Reuso

Esta e a direcao principal do RoyalPrime:

```text
backend
  -> reutilizavel por seed/config
  -> o mesmo core deve servir Royal Carnes, clube de peixe, assinatura de camisa etc.

frontend/*/shared-core
  -> reutilizavel por funcao/kit
  -> hooks, API clients, DTOs, mappers e view-models devem ser copiaveis/adaptaveis
  -> nao devem depender de uma tela especifica

frontend/*/web e frontend/*/mobile
  -> render-only agora
  -> manifest-driven aos poucos
  -> no futuro, a mesma capacidade pode ser renderizada por web/native mudando manifest, locale, navigation e config
```

Exemplo:

```text
backend de assinatura
  -> usa seeds para Royal Carnes, PeixeClub ou CamisaClub

client/shared-core/kits/subscriptions
  -> expoe useSubscription, contracts, API e view-models reutilizaveis

client/web ou client/mobile
  -> apenas renderiza plano, ciclo, botoes e estados vindos do hook/manifest
```

O objetivo nao e deixar tudo abstrato agora. O objetivo e que cada novo corte
siga essa direcao sem criar hardcode especifico desnecessario.

## Manifest-First Gradual

Hoje ainda existe hardcode historico em telas, mocks e configs. A tarefa nao e
quebrar tudo para abstrair de uma vez.

Regra:

```text
manter funcionando
extrair aos poucos
tirar regra/copy repetida de telas
levar comportamento configuravel para shared-core/manifest
levar textos de UI para locales/strings quando mexer no trecho
```

Exemplos de extracao gradual:

- `ListPage`, `DetailPage`, filtros, colunas e acoes admin devem caminhar para
  screen types + manifest em `frontend/admin/shared-core/manifest`.
- Navegacao, titulos, labels e estados vazios devem sair de JSX hardcoded aos
  poucos.
- Telas podem continuar hardcoded temporariamente quando isso preservar o fluxo,
  mas codigo novo deve nascer com direcao clara para manifest/shared-core.
- Evite novos `String.xxx`/copy inline em JSX quando ja existir local correto em
  locale/config/manifest.

## Kits Reutilizaveis

Use `docs/kits/` como mapa de reuso para futuros produtos.

Um kit nao e uma biblioteca abstrata pronta. Ele e uma ficha para a IA entender:

- qual capacidade existe;
- quais arquivos representam essa capacidade;
- o que pode ser copiado/adaptado;
- o que e especifico do RoyalPrime;
- qual fase do roadmap amadurece o kit.

Antes de recriar Auth, Users, Orders, Catalog, Scheduling, Payments ou Admin Operations em outro produto, leia o kit correspondente.

## Escopo de Shared-Core

```text
frontend/client/shared-core
  -> fluxos reutilizaveis entre cliente web e cliente mobile
  -> organizado com mentalidade de kit por capacidade

frontend/admin/shared-core
  -> fluxos reutilizaveis dentro do admin
  -> organizado com mentalidade de kit por capacidade operacional

frontend/shared-core
  -> apenas contratos/capacidades realmente comuns entre client, mobile e admin
  -> deve continuar pequeno
```

Nao mover algo para `frontend/shared-core` global antes de comprovar que client, mobile e admin usam o mesmo contrato.

Os kits de shared-core ficam em:

```text
frontend/shared-core/kits
frontend/client/shared-core/kits
frontend/admin/shared-core/kits
```

## Regras Inviolaveis

- Nao usar emojis Unicode soltos na UI.
- UI/copy nova deve nascer em locales/strings quando for texto de interface.
- Nao hardcodar dados comerciais diretamente em JSX/TSX.
- Screens devem consumir mocks, manifest, hooks ou dados reais.
- AppShell e Foundation sao donos de capacidades genericas de casca e primitives.
- Product components reutilizaveis de ecommerce devem ficar em `frontend/client/web/src/product-components/ecommerce`.
- Fluxo/copy/regra especifica do RoyalPrime fica local no produto.
- Nada sobe cru para ServiceOS.

## Worktree

Preserve o worktree.

Nao rode `reset`, `checkout`, `clean`, commit ou push sem autorizacao explicita do usuario.

## Builds

- Se mexer em `frontend/client/web`, rodar build do client.
- Se mexer em `frontend/admin/web`, rodar build do admin.
- Se mexer apenas em documentacao, nao precisa build; informe isso no final.
