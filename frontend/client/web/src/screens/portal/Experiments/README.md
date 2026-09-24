# Laboratorio visual Web

Rotas estaticas e intencionalmente isoladas para comparar direcoes de design:

Para comparar somente a primeira secao das Homes, consulte
[HOME_TESTES.md](HOME_TESTES.md).

Para comparar cinco telas completas de Meus Pedidos, consulte
[MEUS_PEDIDOS_TESTES.md](MEUS_PEDIDOS_TESTES.md).

- `/landing-teste-1`
- `/landing-teste-2`
- `/landing-teste-3`
- `/landing-teste-4`
- `/landing-teste-5`
- `/home-teste-1`
- `/home-teste-2`
- `/home-teste-3`
- `/home-teste-4`
- `/home-teste-5`
- `/meus-pedidos-teste-1`
- `/meus-pedidos-teste-2`
- `/meus-pedidos-teste-3`
- `/meus-pedidos-teste-4`
- `/meus-pedidos-teste-5`
- `/catalogo-teste-1`

Elas reutilizam o `PortalView` apenas para manter o AppShell/Header oficial.
Nao fazem fetch, nao representam precos, estoque, catalogo ou navegacao reais e
nao entram no menu. Cada experimento mantem conteudo e CSS hardcoded localmente
por decisao explicita de prototipagem visual.
