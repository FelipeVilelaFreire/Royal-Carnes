# RoyalPrime Client Web

Leia [../../AGENTS.md](../../AGENTS.md) e use
[../../../docs/CODEX_ENTRYPOINTS.md](../../../docs/CODEX_ENTRYPOINTS.md)
nas linhas client, AppShell, shared-core e visual conforme a tarefa.

Screen consome hooks/view-models de client/shared-core, strings ativas e
Foundation. Nao importar mock ou API diretamente para fluxo novo.
Ao alterar comportamento mobile web, confira o consumidor client/mobile.

Antes de escrever codigo dependente de Next.js, siga tambem a orientacao
gerada abaixo. Ela descreve a ferramenta, nao altera ownership de produto.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
