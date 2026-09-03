# Docs Roadmap

Este e o indice mestre da documentacao atual do RoyalPrime.

## Objetivo

Manter uma entrada curta e confiavel para qualquer pessoa ou agente entender:

```text
produto
arquitetura
frontend tree
shared-core
manifest
Foundation
render-apps
kits
handoff
```

## Ordem De Leitura

```text
1. ../AGENTS.md
2. ../ROYALPRIME_CODEX_RULES.md
3. ../ROYALPRIME_ARCHITECTURE_CONTRACT.md
4. CODEX_ENTRYPOINTS.md
5. architecture/NEXT_STEPS.md
6. architecture/FRONTEND_TARGET_TREE_ROADMAP.md
7. architecture/SHARED_CORE_TREE_STANDARD.md
8. architecture/MANIFEST_DESIGN_SYSTEM_TREE.md
9. architecture/DESIGN_SYSTEM_V1_TREE.md
10. frontend/TREE.md
11. kits/README.md
12. handoff/README.md
```

## Documentos Ativos

```text
architecture/NEXT_STEPS.md
  -> proxima sequencia oficial de cortes

architecture/FRONTEND_TARGET_TREE_ROADMAP.md
  -> tree alvo do frontend

architecture/SHARED_CORE_TREE_STANDARD.md
  -> gramatica comum dos tres shared-cores

architecture/MANIFEST_DESIGN_SYSTEM_TREE.md
  -> separacao Theme, Semi-Composed, UI e Capabilities

architecture/DESIGN_SYSTEM_V1_TREE.md
  -> corte Foundation V1 atual

architecture/RENDER_APPS_RULES.md
  -> contrato render-only

architecture/RENDER_APPS_TREE_ANALYSIS.md
  -> analise das telas atuais em transicao

frontend/TREE.md
  -> tree detalhada do frontend

kits/README.md
  -> mapa de reuso por capacidade

handoff/README.md
  -> continuidade operacional
```

## Regra De Atualizacao

Quando a tree real mudar, atualize no mesmo corte:

```text
TREE.md
docs/frontend/TREE.md
docs/architecture/FRONTEND_TARGET_TREE_ROADMAP.md
docs/architecture/SHARED_CORE_TREE_STANDARD.md
docs/architecture/MANIFEST_DESIGN_SYSTEM_TREE.md
docs/architecture/NEXT_STEPS.md
```

## Estado Atual

```text
frontend/foundation
  -> tokens, semi-composed e ui

frontend/shared-core/manifest
  -> theme, semi-composed, ui e capabilities globais

frontend/client/shared-core/manifest
  -> overrides/configs do cliente

frontend/admin/shared-core/manifest
  -> overrides/configs do admin

frontend/client/web
frontend/admin/web
  -> render-apps em transicao
```

O caminho oficial e sempre `shared-core/manifest`.
