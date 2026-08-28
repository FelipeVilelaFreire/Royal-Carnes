# RoyalPrime

RoyalPrime e o produto-foco para ecommerce, assinatura, pedidos, entrega e admin operacional.

O ServiceOS continua como referencia de organizacao e futura promocao de capacidades reutilizaveis, mas a execucao atual e RoyalPrime-first.

## Leitura Inicial

Antes de implementar, leia nesta ordem:

1. `AGENTS.md`
2. `ROYALPRIME_CODEX_RULES.md`
3. `ROYALPRIME_ARCHITECTURE_CONTRACT.md`
4. `backend/README.md`
5. `backend/ROADMAP.md`
6. `backend/ARCHITECTURE.md`
7. `docs/kits/README.md`
8. `frontend/client/web/docs/ROYALPRIME_TO_SERVICEOS_ECOMMERCE_DEPARA.md`

## Regra Central

```text
Regra mora no backend.
Fluxo reutilizavel mora no shared-core do escopo correto.
Tela apenas apresenta e dispara acao.
```

## Direcao Arquitetural

O backend deve nascer tenant-ready, com `Organization` e `organizationId` desde o MER.

RoyalPrime/Royal Carnes e a primeira organizacao, nao o unico formato possivel do sistema.

Exemplo de objetivo futuro:

```text
Hoje:
  Organization = royalprime
  Produtos = carnes, carvao, temperos, utensilios

Amanha:
  Organization = bikeclub
  Produtos = bicicletas, capacetes, acessorios, manutencao
```

O codigo core deve continuar generico. O que muda por empresa deve vir de seed/config, tema, copy, imagens, dominio e variaveis de ambiente.

## Kits Reutilizaveis

`docs/kits/` documenta capacidades que podem ser copiadas/adaptadas para outros produtos no futuro.

Exemplo:

```text
Novo produto precisa de Auth & Users.
  -> leia docs/kits/auth-users-kit.md
  -> copie/adapte backend, contratos, hooks e telas conforme o escopo
```

Os kits devem nascer como documentacao e ficar `kit-ready` somente quando os arquivos reais estiverem maduros no RoyalPrime.

## Estrategia de Branches

```text
main
  -> MVP atual estavel, ainda majoritariamente mockado e apresentavel

feature/backend-foundation
  -> branch de trabalho para MER, backend novo, API, shared-core/hooks e conexao real
```

A partir da virada de backend, o desenvolvimento de backend real deve acontecer primeiro em `feature/backend-foundation`.

Na branch de feature, os mocks podem continuar como fallback/dev enquanto os endpoints nascem. A substituicao deve ser gradual:

```text
mock
  -> contrato
  -> api client
  -> hook
  -> endpoint real
  -> screen render-only
```

## Tree Principal

```text
backend/
  README.md
  ROADMAP.md
  ARCHITECTURE.md

frontend/
  foundation/
  shared-core/
  client/
    shared-core/
    web/
    mobile/
  admin/
    shared-core/
    web/
```

## Comandos

```bash
npm run dev:client
npm run dev:admin
npm run build:client
npm run build:admin
```

## Validacao

- Alterou `frontend/client/web`: rodar build do client.
- Alterou `frontend/admin/web`: rodar build do admin.
- Alterou apenas documentacao: nao precisa build.

## Git

Preserve o worktree.

Nao rode reset, checkout, clean, commit ou push sem autorizacao explicita.
