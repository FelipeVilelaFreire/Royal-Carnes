# RoyalPrime Agent Instructions

Este arquivo e a entrada obrigatoria para qualquer agente trabalhando no RoyalPrime.

Antes de implementar, leia nesta ordem:

1. `ROYALPRIME_CODEX_RULES.md`
2. `ROYALPRIME_ARCHITECTURE_CONTRACT.md`
3. `backend/README.md`
4. `backend/ROADMAP.md`
5. `backend/ARCHITECTURE.md`
6. `frontend/client/web/docs/ROYALPRIME_TO_SERVICEOS_ECOMMERCE_DEPARA.md`

## Direcao do Produto

RoyalPrime agora e o produto-foco.

O ServiceOS continua como referencia de organizacao, contratos, AppShell, Foundation, manifests e separacao de responsabilidades. Mas o RoyalPrime nao deve ser bloqueado por uma migracao prematura para ServiceOS.

Regra:

```text
RoyalPrime prova o fluxo real.
ServiceOS recebe depois apenas o que se provar reutilizavel.
```

## Ordem Central

```text
Regra mora no backend.
Fluxo reutilizavel mora no shared-core do escopo correto.
Tela apenas apresenta e dispara acao.
```

## Escopo de Shared-Core

```text
frontend/client/shared-core
  -> fluxos reutilizaveis entre cliente web e cliente mobile

frontend/admin/shared-core
  -> fluxos reutilizaveis dentro do admin

frontend/shared-core
  -> apenas contratos/capacidades realmente comuns entre client, mobile e admin
```

Nao mover algo para `frontend/shared-core` global antes de comprovar que client, mobile e admin usam o mesmo contrato.

## Regras Inviolaveis

- Nao usar emojis Unicode soltos na UI.
- UI/copy nova deve nascer em locales/strings quando for texto de interface.
- Nao hardcodar dados comerciais diretamente em JSX/TSX.
- Screens devem consumir mocks, manifests, hooks ou dados reais.
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
