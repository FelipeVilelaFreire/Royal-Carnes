# Client portal: navegacao e sessao

Status: contrato ativo de comportamento do portal.
Ownership: [contrato raiz](../../ROYALPRIME_ARCHITECTURE_CONTRACT.md).
Montagem: [contrato AppShell](SCREENTYPE_MANIFEST_PIPELINE_CONTRACT.md).

## Surface

Landing apresenta o produto; portal compoe loja e conta.
Ambos usam AppShell Foundation com seu config, sem shell local paralelo.
Nao impor o layout mobile do portal a landing: cada manifest ativa suas regioes.

Portal usa header desktop e bottomTabBar mobile conforme config efetivo.
Itens e ordem vem da navigation e do filtro de placements; nao fixar cinco
labels ou rotas neste documento, nem copiar a antiga lista de abas.
Rotas de compatibilidade devem ser verificadas antes de remover.

## Sessao e acesso

Sessao vem do fluxo de auth do client/shared-core; backend autoriza acesso real.
Config define intencao publica/protegida e apresentacao, nao permissao real.
Nao introduzir usuario autenticado ficticio por viewport.
webIsMobile e native compartilham regra de sessao e acesso.

Areas publicas devem continuar acessiveis conforme o config do produto.
Area protegida sem sessao renderiza o estado de autenticacao previsto e a acao
de login existente. Nao esconder automaticamente itens de navegacao por falta
de sessao sem decisao explicita do contrato de produto.
Loading de sessao, ausencia de login e erro de API sao estados distintos.
Texto e feedback vem de strings ativas; estados vazios usam Foundation.

Flags legadas mockAuthenticated/mobileMockAuthenticated podem existir em
config, mas sua presenca nao prova que o consumidor as use nem autoriza
substituir autenticacao real por elas. Leia hook e consumidor.

## Pontos de partida

- frontend/client/shared-core/manifest/portal/appshell.config.jsx
- frontend/client/shared-core/manifest/landing/appshell.config.jsx
- frontend/client/shared-core/manifest/routes.ts
- frontend/client/shared-core/navigation
- frontend/client/shared-core/locales
- frontend/client/shared-core/hooks/useClientAuthSession.ts
- frontend/client/web/src/screens/portal/PortalView.tsx
- frontend/client/mobile/src/screens/portal/PortalView.tsx

Paths relativos a raiz RoyalPrime. Para sessao/navegacao alterada, confira
publico/protegido, login/logout, acesso direto e recarga, desktop/mobile.
Nao reportar mobile native validado sem executar o runtime correspondente.
