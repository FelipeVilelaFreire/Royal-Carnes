# Codex: leitura por tarefa

Status: registro ativo de contratos e verificacao.
Leia primeiro [../AGENTS.md](../AGENTS.md) e
[../ROYALPRIME_ARCHITECTURE_CONTRACT.md](../ROYALPRIME_ARCHITECTURE_CONTRACT.md).
Depois escolha as linhas aplicaveis abaixo. Uma tarefa que cruza camadas usa
a uniao das linhas; uma pergunta ou revisao nao autoriza alteracoes.

## Contratos ativos

Somente os documentos desta secao, o AGENTS aplicavel e o contrato arquitetural
raiz fornecem regras normativas. Os demais documentos sao referencias, estado,
planejamento ou historico, mesmo que seus titulos antigos digam "contrato".
Referencia detalha exemplos; nao amplia permissao nem muda ownership.

| Tarefa | Contrato ativo complementar | Inspecao no codigo |
| --- | --- | --- |
| Backend, endpoint, models, permissao, workflow | [backend/ARCHITECTURE.md](../backend/ARCHITECTURE.md), [API_CONTRACTS.md](../backend/API_CONTRACTS.md) | backend/apps do dominio, urls, serializers, services, permissions, tests |
| Payload, DTO, hook, mapper, view-model | [API_CONTRACTS.md](../backend/API_CONTRACTS.md) e contrato raiz | shared-core do escopo: contracts, api, hooks, mappers, view-models e tela consumidora |
| Admin, client, AppShell, rotas, navigation, screen types | [SCREENTYPE_MANIFEST_PIPELINE_CONTRACT.md](contracts/SCREENTYPE_MANIFEST_PIPELINE_CONTRACT.md) | manifest, navigation, locales da surface; frontend/foundation/shells/app-shell; bootstrap real |
| Mocks, fallback, env, seed | [MOCK_AND_ENV_ARCHITECTURE.md](contracts/MOCK_AND_ENV_ARCHITECTURE.md) | hook, API client, data source, .env.example e backend/seeds |
| Portal, autenticacao, acesso publico/protegido | [CLIENT_PORTAL_NAVIGATION_AND_AUTH_STATE_CONTRACT.md](contracts/CLIENT_PORTAL_NAVIGATION_AND_AUTH_STATE_CONTRACT.md) | client/shared-core auth, navigation, portal manifest, PortalView web/mobile |
| UI, Theme, Semi-composed, tokens, CSS, icones | Secao Foundation do contrato raiz | frontend/shared-core/manifest e overrides; frontend/foundation/tokens, semi-composed, ui; consumidor |
| Builder, campos, draft, preview | Secao Builders do contrato raiz e contrato AppShell acima | config de campos, adapter, controle existente, persistencia e runtime do preview |
| Mobile/native e webIsMobile | Secao Web mobile do contrato raiz | frontend/client/mobile, client/shared-core e Foundation/native; nao presumir runtime pronto |
| Nova capacidade ou promocao para ServiceOS | Secoes Produto e reuso / Donos do contrato raiz | exports e consumidores RoyalPrime e ServiceOS; provar reuso antes de ampliar |
| Documentacao, organizacao, remocao de docs | [docs/README.md](README.md) | referencias de entrada, links, status Git e contratos afetados |

## Referencias por necessidade

Estas leituras sao condicionais; nao sao outra lista obrigatoria.

- Backend local: [backend/README.md](../backend/README.md), backend/MER.md,
  backend/TREE.md, backend/seeds/README.md e README do app afetado.
- Kits e lacunas: [kits/README.md](kits/README.md),
  [KITS_RUNTIME_LEDGER.md](kits/KITS_RUNTIME_LEDGER.md).
- Retomada: [continuacao.md](../continuacao.md) e [handoff/README.md](handoff/README.md).
  Datas e "proximo passo" sao contexto; a tarefa atual define o escopo.
- Guias visuais: frontend/foundation/docs/; sao exemplos e podem refletir
  origem ServiceOS. Confirme nomes de props, paths e implementacao no RoyalPrime.
- Tree, auditorias e roadmaps: consulte somente para a area tocada. Nao mover
  codigo para realizar uma tree alvo sem tarefa e verificacao dos consumidores.

## Caminhos de montagem atuais

| Area | Entrada |
| --- | --- |
| Admin bootstrap | frontend/admin/web/src/App.tsx |
| Admin manifest | frontend/admin/shared-core/manifest/adminAppShell.config.jsx |
| Admin navigation | frontend/admin/shared-core/navigation/admin.navigation.ts |
| Admin routes | frontend/admin/shared-core/manifest/routes.ts |
| Admin screens | frontend/admin/shared-core/manifest/pages |
| Client portal AppShell | frontend/client/shared-core/manifest/portal/appshell.config.jsx |
| Client landing AppShell | frontend/client/shared-core/manifest/landing/appshell.config.jsx |
| Client routes | frontend/client/shared-core/manifest/routes.ts |
| Idiomas | frontend/client/shared-core/locales e frontend/admin/shared-core/locales |
| AppShell compartilhado | frontend/foundation/shells/app-shell |
| Componentes ecommerce compartilhados | frontend/product-components/ecommerce |

Caminhos sao pontos de inspecao, nao promessa de que todo fluxo esta concluido.

## Protocolo de execucao

1. Identifique o resultado pedido, o dono e as dependencias afetadas.
2. Confira branch/status e leia o trecho real; preserve mudancas existentes.
3. Use o contrato e a API publica existentes. Nao crie runtime para organizar imports.
4. Implemente somente o necessario, respeitando as aprovacoes ja definidas.
5. Confira copy/locale, imports, config versus runtime e fluxo de dados.
6. Execute verificacao proporcional abaixo e registre limitacoes concretas.
7. Atualize o contrato se a regra mudou; atualize o handoff se mudou apenas o estado.

## Matriz de verificacao

Comandos de frontend abaixo partem da raiz RoyalPrime. Use dependencias locais;
nao instalar ferramentas implicitamente para executar uma verificacao.

| Mudanca | Verificacao exigida |
| --- | --- |
| Somente docs | git diff --check dos arquivos alterados; links/caminhos de entrada; ausencia de orientacoes conflitantes; leitura de cenarios por tarefa |
| Client web | npm run build:client; fluxo alterado no navegador se houver comportamento/UI |
| Admin web | npm run build:admin; fluxo alterado no navegador se houver comportamento/UI |
| Foundation, tokens, recipes, AppShell | npm run verify:foundation; builds dos consumidores afetados; inspecao visual desktop/mobile quando visual |
| Shared-core client / contrato native | build client; .\node_modules\.bin\tsc.cmd --noEmit -p frontend/client/mobile/tsconfig.json; testes focados do contrato |
| Shared-core admin | build admin; testes focados de mapper/API/fluxo conforme risco |
| Contrato global | builds client/admin e verificacao mobile dos consumidores atingidos |
| Backend | em backend/: py manage.py check e py manage.py test com os modulos afetados; suite maior se contrato compartilhado exigir |
| Models/migrations | verificacao backend, revisar migration e py manage.py makemigrations --check --dry-run; nao migrar ambiente externo implicitamente |
| Persistencia/API | testar resposta, erro e efeito persistido no ambiente autorizado; mocks nao comprovam integracao |
| Native visual | executar runtime nativo disponivel; se indisponivel, declarar que so contrato/typecheck foi verificado |

Sempre executar git diff --check no diff da tarefa.
Se falhar por ambiente ou erro preexistente, registrar comando e limite observado,
sem reportar como aprovado. Nao executar builds so para mudanca documental.
