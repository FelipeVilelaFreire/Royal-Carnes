# RoyalPrime: instrucoes para agentes

Entrada obrigatoria para qualquer tarefa neste repositorio.
Este arquivo define o protocolo; nao e um backlog.

## Primeiro: preservar o padrao de UI

Toda tarefa de frontend web deve cumprir o
[contrato central TSX e CSS Modules](ROYALPRIME_ARCHITECTURE_CONTRACT.md#tsx-e-css-modules)
antes de editar e antes de entregar. Ele e criterio de aceitacao, nao sugestao.
Codigo novo nao pode repetir hardcode ou estilo inline do legado. Violacao
introduzida pelo proprio diff deve ser corrigida antes de concluir a tarefa;
build aprovado ou promessa de corrigir depois nao substitui conformidade.

Execute npm run verify:rules antes de entregar codigo. Se houve commit durante
a tarefa, use -- --base com o commit inicial; nao ocultar violacoes usando HEAD
ja alterado. Client/admin tambem executam o check no prebuild. Cobertura e limites
em [scripts/README.md](scripts/README.md); analise automatica nao substitui a
revisao manual exigida pelo contrato.

## Leitura inicial unica

1. Leia este arquivo e as instrucoes de workspace aplicaveis.
2. Leia [ROYALPRIME_ARCHITECTURE_CONTRACT.md](ROYALPRIME_ARCHITECTURE_CONTRACT.md).
3. Use [docs/CODEX_ENTRYPOINTS.md](docs/CODEX_ENTRYPOINTS.md) para ler somente
   os contratos e arquivos correspondentes a tarefa.
4. Leia os AGENTS.md entre a raiz e os arquivos afetados. Ao retomar trabalho,
   consulte tambem continuacao.md e o handoff pertinente, confirmando o estado no Git.

Nao percorra todos os roadmaps, auditorias e handoffs antes de uma tarefa pequena.

## Autoridade e conflitos

- Instrucoes do usuario e regras superiores da sessao prevalecem.
- AGENTS.md locais detalham seu escopo; nao revogam silenciosamente regras globais.
- O contrato arquitetural e a autoridade de ownership do RoyalPrime.
- Os contratos ativos listados em docs/CODEX_ENTRYPOINTS.md detalham sua area.
- README, mapas, guias, exemplos, kits, roadmaps, auditorias e handoffs sao
  referencias ou registros de estado, salvo registro explicito como contrato
  ativo; nao autorizam excecoes aos contratos de maior precedencia.
- docs/archive e conteudo explicitamente historico nao sao instrucoes vigentes.
- A data mais recente, o nome CONTRACT ou a palavra "canonico" em um documento
  fora do registro ativo nao lhe conferem precedencia.
- Codigo real prova o estado implementado, mas nao torna uma violacao permitida.
  Corrija divergencias dentro da tarefa e registre lacunas fora dela.
- Conflito material entre regras ativas sem resolucao pela hierarquia deve ser
  exposto ao usuario antes da alteracao dependente; continue o trabalho independente.

## Regras obrigatorias para codigo novo ou alterado

- Backend decide regras, autorizacao, calculos, workflow e persistencia.
- Todo fluxo funcional respeita quatro donos: backend -> shared-core ->
  config.jsx/manifest -> JSX render-only. Em tela Portal sem manifest proprio,
  mantenha shared-core -> JSX; nao crie config artificial sem capacidade real.
- Fluxo de produto usa screen -> hook -> API client -> backend.
- Shared-core fica no menor escopo correto: client, admin ou global comprovado.
- Texto novo de UI nasce em chave de locale, inclusive aria-label e feedback.
  Se nao existir catalogo, crie-o no escopo correto. Dados livres nao sao traduzidos.
- UI usa strings do idioma ativo; nao fixar pt-BR em componentes reativos a idioma.
- Nao usar emojis Unicode na UI. Use Icon/AppIcons da Foundation.
- Theme -> Semi-composed -> UI. Valores visuais pertencem aos tokens/receitas;
  nao criar biblioteca paralela.
- Admin e client declaram manifest e consomem o mesmo AppShell da Foundation.
  Nao implementar Header, Sidebar, Drawer, Footer ou BottomTabBar por surface.
- webIsMobile compartilha contrato e comportamento com mobile native.
- Uma rota Client so e considerada migrada sem mock depois da revisao e
  eliminacao de fallback tanto no Web quanto no Mobile; a revisao de uma
  plataforma nunca autoriza assumir a outra equivalente.
- Legado tolerado nao e exemplo para codigo novo. Nao adicionar mocks diretos,
  copy inline, regras comerciais ou persistencia em screens.
- Nao criar runtime, engine ou abstracao nova apenas para conectar configuracao existente.

## Autonomia e limites

Inspecione a implementacao existente antes de propor algo novo. Consuma capacidades
existentes da Foundation local e confira ServiceOS antes de criar capacidade generica.
RoyalPrime continua dono de seu produto; nao iniciar migracao ampla para ServiceOS.

Antes de criar ou ampliar capacidade em builder-shared ou TSX compartilhado,
explique a necessidade, os consumidores reais e peca a aprovacao exigida pelo
contrato do workspace. Se a autorizacao especifica ja existe na sessao, respeite-a.
Declarar campos ja suportados em config nao exige ampliar o motor.
Nao remover legado antes de provar que nao ha consumidores.

## Git, verificacao e entrega

- Confira branch e status reais; nenhum documento escolhe a branch automaticamente.
- Preserve alteracoes existentes, inclusive em arquivos que precisar editar.
- Nao executar reset, checkout, clean, commit ou push sem autorizacao explicita.
- Nao expor nem versionar credenciais; documente variaveis em .env.example.
- Execute as verificacoes da matriz em docs/CODEX_ENTRYPOINTS.md.
- Relate o que mudou, evidencias executadas e limites. Build nao prova fluxo real,
  aparencia no navegador nem paridade native.
- Atualize somente os contratos ou registros afetados; nao copie a mesma regra
  para varios documentos. Documentacao apenas nao exige build de aplicacao.
