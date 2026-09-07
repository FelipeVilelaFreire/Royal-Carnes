# RoyalPrime Architecture Contract

Status: contrato ativo. Escopo: ownership e regras de implementacao do RoyalPrime.
Precedencia: [AGENTS.md](AGENTS.md). Leitura especializada:
[docs/CODEX_ENTRYPOINTS.md](docs/CODEX_ENTRYPOINTS.md).

## Produto e reuso

RoyalPrime e o produto; Royal Carnes e sua primeira configuracao de negocio.
Variacao de empresa entra em organization, seed/config, tema, copy, assets e
dados. Nao criar if por nome de empresa, plano ou produto no core.

ServiceOS fornece referencia e capacidades reutilizaveis. Verifique primeiro a
Foundation local e as capacidades existentes no ServiceOS. Consuma por pacote,
alias ou facade existente. Uma capacidade generica ausente exige evidencia de uso
e a aprovacao aplicavel; nao copiar uma biblioteca nem migrar o produto inteiro.
Regras comerciais e composicoes exclusivas continuam no RoyalPrime.

## Donos e dependencias

| Dono real | Responsabilidade | Nao pertence aqui |
| --- | --- | --- |
| backend/ | Models, services, selectors, DTOs de API, permissao, calculo, workflow, auditoria, persistencia | UI e copy de componente |
| frontend/shared-core/ | Contratos base e manifest global comprovadamente comuns | Fluxo exclusivo client/admin |
| frontend/client/shared-core/ | Contratos, API, hooks, mappers, view-models, manifest, navigation, locales do cliente | JSX web e operacao administrativa |
| frontend/admin/shared-core/ | Mesmo papel para operacao admin | Fluxos exclusivos do cliente |
| frontend/foundation/ | Tokens, receitas, UI, AppShell, adapters visuais | Regra comercial, dados ou autorizacao de produto |
| frontend/product-components/ecommerce/ | Componentes ecommerce reutilizados no produto | Persistencia e regra comercial autoritativa |
| frontend/client/web/ | Composicao web, rotas do framework, telas e estado visual | Regra, API direta e mocks diretos em screens |
| frontend/client/mobile/ | Render native e adapters existentes | Copia divergente do fluxo client |
| frontend/admin/web/ | Bootstrap, tela ativa e composicao administrativa | Casca paralela e regra de dominio |

Areas locais de product-components ainda podem existir como transicao ou
composicao exclusiva. Antes de extrair, confira imports e facade reais.
Nao mudar caminhos apenas para imitar uma tree antiga.

Dependencias permitidas: render -> shared-core do escopo + Foundation/componentes
publicos; shared-core de escopo -> contratos globais; API client -> backend.
Foundation nao importa shared-core de produto. Client nao importa admin; admin
nao importa mocks ou fluxo privado do client. Contrato comum exige extracao
comprovada para global. Kit e mapa de capacidade, nao uma engine.

## Fluxo de dados e regras

screen -> hook do escopo -> API client -> endpoint -> service/use-case -> banco.

- Backend valida organization, identidade, acesso, estoque, limites, transicoes
  e valores persistidos. IDs e FKs seguem models e backend/API_CONTRACTS.md.
- API client respeita endpoint e payload reais. Mappers convertem DTOs;
  view-models preparam exibicao sem inventar regra comercial autoritativa.
- Hook controla fluxo reutilizavel, loading, erro e acoes.
- Screen pode controlar input imediato, modal, aba, selecao e estado visual.
  Mesmo com um unico consumidor, regra de negocio nao passa a pertencer a tela.
- Uma acao de salvar deve persistir pelo fluxo real ou informar explicitamente
  sua indisponibilidade. Navegar ou fechar modal nao demonstra salvamento.
- Nao usar any/casts para esconder incompatibilidade de contrato sem registrar
  a fronteira e a limitacao concreta da transicao.
- Consulte o contrato ativo de mocks antes de alterar fallback ou ambiente.

## Manifest, rotas, assets e idiomas

Use frontend/<client|admin>/shared-core/manifest (singular). Base visual comum
fica em frontend/shared-core/manifest. Nao criar uma segunda origem declarativa
em frontend/client/manifest ou frontend/admin/manifest.

- routes.ts e dono de paths; navigation referencia routeKey e declara placements.
- Manifest declara composicao, campos, opcoes, regioes e defaults suportados.
- API/hooks fornecem dados e acoes. Manifest de pagina nao vira banco de operacao.
- Assets de produto devem ter referencia central no manifest/catalogo existente.
  Nao duplicar URLs em JSX.
- UI copy, inclusive tooltip, erro, vazio, titulo e aria-label, nasce em
  locales/<locale>.ts ou equivalente existente. Codigo tecnico e dados livres
  permanecem estaveis e nao sao traduzidos automaticamente.
- PT-BR e base/fallback, nao import fixo de UI. Provider/hook ou props entregam
  as strings ativas. Novas chaves precisam de cobertura nos idiomas suportados
  ou de fallback explicito pelo resolvedor.
- Locale nao guarda preco, estoque, permissao, limite ou transicao permitida.
- Nao hardcodar label em config para contornar i18n; config referencia a chave.
- Use contratos publicos tipados e resolvers existentes. Config nunca inventa
  capacidade que runtime ainda nao implementou.

## AppShell e screen types

Admin nao implementa AppShell. Admin declara manifest e consome AppShell da
Foundation. Client segue a mesma regra.

Foundation e dona de Header, Sidebar, Drawer, Footer, BottomTabBar, navegacao
visual, slots, scroll e layout. Surface decide ativacao e valores.
Client: header desktop e bottomTabBar mobile conforme manifest.
Admin: sidebar desktop e bottomTabBar mobile conforme manifest.
Native usa o contrato mobile equivalente, sem assumir que adapter pronto prova
render nativo funcionando.

O bootstrap importa config/navigation/routes e renderiza a screen ativa.
Screen types existentes recebem configuracao, dados e callbacks; nao criar uma
engine nova para substituir essa conexao simples.
Detalhes e exemplo: docs/contracts/SCREENTYPE_MANIFEST_PIPELINE_CONTRACT.md.

## Foundation e aparencia

Theme -> Semi-composed -> UI; AppShell e componentes compoem as APIs publicas.

- Theme possui valores fisicos, escalas e matriz global de colunas.
- Semi-composed seleciona tokens e compoe Surface, Text, Icon e outras receitas.
- UI consome receita resolvida; CSS da primitive nao redefine appearance nem
  acessa Theme diretamente. Props de token passam pelo resolvedor publico.
- Defaults globais mudam no manifest dono; overrides locais usam contrato
  publico de tokens, nao hex, rgba, borda ou dimensao literal.
- Nao criar CSS de tela para simular comportamento generico de Foundation.
- Icones usam intencao semantica e Icon/AppIcons; nenhum emoji de UI.
- Layout externo de secoes usa SectionContainer e configuracao existente:
  atmosfera, espacamento, colunas e altura. Conteudo preenche a composicao.
- Nao criar clamp manual em primitive. Tokens fluidos e fallback estatico
  pertencem ao Theme/resolvedor.
- Resolucao de config nao prova resultado visual; confira o consumidor real.

## Builders

Config da surface descreve campos, tabs, secoes, options, paths, condicoes e
colecoes. Adapter sem JSX normaliza e compoe manifest.
Motor compartilhado fornece controles genericos, draft e persistencia/publicacao.
Preview monta runtime real com o mesmo draft, abaixo dos controles quando aplicavel.
Nao criar schema resumido, esconder campo configuravel ou fabricar shell de preview.
Capacidade generica nova deve servir dois ou mais usos concretos e respeitar a
aprovacao de AGENTS.md; capacidade existente se ativa apenas por config.

## Web mobile e native

webIsMobile == native behavior: mesmos hooks, view-models, acoes, estados,
strings e intencao de navegacao. Renderer e APIs de plataforma podem diferir.
Verifique o adapter real em frontend/client/mobile e a Foundation native.
Typecheck/descriptor nao prova execucao em dispositivo.

## Transicao e criterio de pronto

Codigo legado existente pode permanecer fora da tarefa; nao autoriza novas
violacoes. No trecho alterado, aplique estes contratos sem refatorar o produto
inteiro. Registre incompatibilidade preservada com caminho, motivo e proximo passo.

Uma capacidade esta implementada quando tem codigo, contrato e consumidor real.
Esta verificada somente na extensao das evidencias executadas. Mock, pasta,
export ou build isolado nao prova backend, salvamento, visual ou native.

Nao remover ponte/legacy antes de rastrear consumidores e validar a substituicao.
Nao promover kits abstratos: backend reutiliza por seed/config, shared-core por
capacidade e render por manifest/composicao, depois de uso real.
