# RoyalPrime Frontend Agent Instructions

Este arquivo e a entrada obrigatoria para agentes trabalhando dentro de
`frontend/`.

Antes de implementar frontend, leia nesta ordem:

1. `../AGENTS.md`
2. `../ROYALPRIME_CODEX_RULES.md`
3. `../ROYALPRIME_ARCHITECTURE_CONTRACT.md`
4. `../docs/CODEX_ENTRYPOINTS.md`
5. `../docs/architecture/NEXT_STEPS.md`
6. `../docs/architecture/FRONTEND_TARGET_TREE_ROADMAP.md`
7. `../docs/architecture/SHARED_CORE_TREE_STANDARD.md`
8. `../docs/architecture/MANIFEST_DESIGN_SYSTEM_TREE.md`
9. `../docs/frontend/TREE.md`
10. `../docs/frontend/RENDER_ONLY_AUDIT.md`
11. `client/web/docs/ROYALPRIME_TO_SERVICEOS_ECOMMERCE_DEPARA.md`

## Ordem Central

```text
foundation
  -> visual-only: design system, primitives, AppShell, tokens e componentes visuais genericos

shared-core do escopo correto
  -> contratos, DTOs, API clients, hooks, mappers, view-models, manifest e mocks temporarios

web/mobile/admin-web
  -> render-only: layout, inputs, modais, tabelas, screen composition e chamada dos hooks

backend
  -> regra real
```

## Shared-Core Como Kits

```text
shared-core/kits
  -> capacidades globais pequenas

client/shared-core/kits
  -> capacidades do cliente

admin/shared-core/kits
  -> capacidades operacionais do admin
```

Novos fluxos devem nascer no menor shared-core correto. Nao promover para
`frontend/shared-core` global antes de provar que client, mobile e admin usam o
mesmo contrato.

## Manifest-First Gradual

Hardcode legado ainda existe. Nao quebrar telas para abstrair tudo de uma vez.

Ao tocar em uma tela:

```text
1. manter comportamento funcionando
2. extrair contrato/DTO/hook quando houver fluxo reutilizavel
3. mover copy/config repetida para locale ou manifest
4. trocar repeticao por screen type quando houver padrao real
```

Exemplos:

```text
admin ListPage/DetailPage/FormPage/DashboardPage
colunas, filtros, acoes, titulos, labels e estados vazios
navegacao e AppShell config
```
