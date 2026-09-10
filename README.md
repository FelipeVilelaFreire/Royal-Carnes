# RoyalPrime

Produto de ecommerce, assinaturas, pedidos, entregas e operacao administrativa.

## Comecar

- [AGENTS.md](AGENTS.md): protocolo obrigatorio de trabalho.
- [Contrato arquitetural](ROYALPRIME_ARCHITECTURE_CONTRACT.md): donos e regras.
- [Leitura por tarefa](docs/CODEX_ENTRYPOINTS.md): contratos, caminhos e validacao.
- [Documentacao](docs/README.md): indice e politica de manutencao.
- [Continuacao](continuacao.md): contexto operacional; confirmar no codigo e Git.

## Estrutura

### Quatro Separacoes

```text
backend
  -> dados, regras, autorizacao, persistencia e endpoints
shared-core
  -> contratos, API clients, hooks, mappers, view-models e runtime tecnico
config.jsx / manifest
  -> composicao, capacidades, campos, defaults, rotas e opcoes
JSX render-only
  -> apresenta estado e dispara callbacks, sem HTTP, mock ou regra de negocio
```

No Portal, telas ainda sem manifest proprio seguem temporariamente
`shared-core -> JSX render-only`; o manifest entra quando houver uma capacidade
ou composicao real para declarar. A definicao normativa completa esta no
[Contrato arquitetural](ROYALPRIME_ARCHITECTURE_CONTRACT.md#quatro-separacoes-do-produto).

- backend/: Django, API e regras persistidas.
- frontend/foundation/: capacidades visuais e AppShell.
- frontend/shared-core/: base comum comprovada.
- frontend/client/: shared-core do cliente, web e mobile.
- frontend/admin/: shared-core administrativo e web.
- frontend/product-components/: composicoes reutilizadas no produto.
- docs/kits/: mapas de capacidades, consumidores e limites de reuso.

## Comandos na raiz

- npm run dev:client
- npm run dev:admin
- npm run build:client
- npm run build:admin
- npm run verify:foundation

Ambiente e comandos Django: [backend/README.md](backend/README.md).
Nao escolher branch por README: consultar git status e a autorizacao da sessao.
