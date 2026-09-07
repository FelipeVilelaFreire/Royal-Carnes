# RoyalPrime Architecture Contract

Status: contrato ativo. Escopo: ownership e regras de implementacao do RoyalPrime.
Precedencia: [AGENTS.md](AGENTS.md). Leitura especializada:
[docs/CODEX_ENTRYPOINTS.md](docs/CODEX_ENTRYPOINTS.md).

## TSX e CSS Modules

Regra prioritaria para codigo web novo ou alterado: componente em .tsx e
estilo local em arquivo .module.css ao lado, consumido por className.
O nome correto e NomeDaTela.module.css, nao NomeDaTela.modules.css.
Aplica-se a telas, screen types, secoes, componentes de produto e componentes
visuais web da Foundation. Arquivos de config .jsx existentes nao sao telas
e nao precisam ser renomeados como efeito colateral desta regra.

```text
MeusPedidosView.tsx         -> composicao, dados recebidos e eventos
MeusPedidosView.module.css  -> composicao local usando contratos/tokens permitidos
```

- Primeiro use props de layout e receitas da Foundation. Se o componente nao
  precisa de CSS proprio, nao criar arquivo vazio apenas para completar o par.
- Nao adicionar style={{ ... }} em JSX/TSX web. Nao transferir o mesmo objeto
  para style={stylesObject}, useMemo, hook, helper ou surfaceStyles.ts: continua
  sendo estilo inline. Usar CSS Modules com classes/estados ou props semanticas.
- Nao embutir CSS em strings, tags style ou injecao manual de DOM na tela para
  contornar a separacao. CSS global fica restrito ao reset/bootstrap existente.
- Proibido criar cores, sombras, bordas, tipografia ou espacamentos fisicos
  locais fora dos tokens/receitas. Mover hardcode de TSX para CSS nao o corrige.
- CSS de tela nao redefine a aparencia interna de Button/Card/Surface nem
  substitui uma capacidade de AppShell, Layout ou SectionContainer.
- Valor dinamico (progresso, dimensao, posicao, imagem ou grid vindo de config)
  deve passar pela prop/contrato do componente dono. Nao justifica style inline
  na screen. Se faltar capacidade, seguir a regra de ampliacao compartilhada;
  nao inventar workaround visual local.
- A materializacao tecnica de tokens/valores dinamicos pelo resolver ou adapter
  dono da Foundation pode precisar de CSS custom properties ou binding de estilo.
  Isso nao autoriza style={{ ... }} novo nem decisoes visuais locais: a origem
  deve ser o contrato publico, com resolucao centralizada e verificavel. Nao
  criar helper local ou chamar um componente de "resolver" para obter excecao.
- React Native nao consome CSS Modules. Seu style/StyleSheet pertence ao adapter
  da plataforma e continua obedecendo Theme -> Semi-composed -> UI. A regra web
  nao autoriza quebrar o mecanismo nativo nem hardcodar sua aparencia.

### Legado nao define o padrao

O repositorio ainda contem hardcode, estilos inline e contratos transicionais.
Isso e divida tecnica conhecida, nao um modelo aprovado para copiar.
Codigo novo deve cumprir o contrato desde a criacao. Em codigo existente,
corrija a estilizacao do trecho alterado; nao expandir o alcance da tarefa para
reescrever todas as telas. Lacunas preservadas fora desse trecho ficam
registradas com caminho e motivo, sem classificar a tela inteira como conforme.
Exemplos, auditorias ou telas antigas nao dispensam esta regra, inclusive quando
chamam estilos inline dinamicos de "excecoes aceitaveis".

### Criterio obrigatorio de aceitacao

Antes de editar UI web, identifique o componente TSX, o CSS Module necessario
e a capacidade Foundation que fornece layout/aparencia. Leia este contrato
antes de copiar uma tela existente.

Antes de entregar, revise o diff da tarefa e confirme:
- nenhum style inline visual novo, inclusive por variavel, helper ou spread;
- nenhum valor fisico hardcoded novo fora de Theme/receitas;
- nenhuma copy nova fora do catalogo ativo;
- nenhum CSS local substituindo aparencia ou capacidade publica da Foundation.

Se o proprio diff introduzir uma violacao, corrija antes de declarar a tarefa
concluida. Nao transformar a violacao nova em backlog, TODO, excecao temporaria
ou "padrao ja usado no projeto". Build aprovado nao dispensa esta revisao.
Falta de primitive exige tratar a capacidade no dono correto e respeitar a
aprovacao aplicavel, nunca improvisar estilo na screen.

Na entrega, informe quais verificacoes foram executadas e qualquer limite real.
Nao afirmar conformidade de todo o repositorio por verificar apenas o trecho
alterado. Este criterio e obrigatorio mesmo em ajuste pequeno ou urgente.

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
