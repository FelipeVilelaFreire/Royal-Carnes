# RoyalPrime Client Web Agent Instructions

Antes de implementar em `frontend/client/web`, leia nesta ordem:

1. `../../AGENTS.md`
2. `../../../AGENTS.md`
3. `../../../ROYALPRIME_CODEX_RULES.md`
4. `../../../ROYALPRIME_ARCHITECTURE_CONTRACT.md`
5. `../../../docs/CODEX_ENTRYPOINTS.md`
6. `../../TREE.md`
7. `../../RENDER_ONLY_AUDIT.md`
8. `docs/ROYALPRIME_TO_SERVICEOS_ECOMMERCE_DEPARA.md`

## Regra de Surface

```text
frontend/client/web
  -> render-only

frontend/client/shared-core
  -> contratos, API clients, hooks, mappers, view-models, manifests e mocks do cliente

frontend/foundation
  -> visual-only

backend
  -> regra real
```

Telas web nao devem chamar endpoint direto, calcular regra real ou decidir
workflow de pedido/entrega/assinatura. Elas devem consumir hooks/view-models do
`frontend/client/shared-core`.

## Manifest-First Gradual

Quando mexer em uma tela hardcoded, preserve o fluxo e extraia aos poucos:

```text
copy repetida -> locales/manifest
navegacao/titulos/labels -> shared-core/manifests
fluxo reutilizavel -> shared-core hooks/api/contracts
componentes repetidos de ecommerce -> product-components/ecommerce
```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
