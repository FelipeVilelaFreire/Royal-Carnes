# Continuacao RoyalPrime

> Handoff curto e atual. Historico antigo nao e fonte de decisao.
> Antes de alterar algo: leia `AGENTS.md`, `docs/CODEX_ENTRYPOINTS.md`, o
> contrato da area e `git status --short`. Preserve mudancas paralelas.

## Estado atual

O Admin segue o fluxo unico:

```text
config.jsx -> shared-core -> view-model -> screen type render-only -> Foundation
```

- `screenType: "standard"` cobre listas, detalhes e criacao declarativa.
- Dashboard e Configuracoes continuam screen types especiais.
- Nenhuma entidade deve criar pagina, tabela, modal ou shell proprio quando o
  renderer standard puder compor a mesma capacidade por config.
- Textos novos de interface pertencem aos locales; UI usa somente icones SVG da
  Foundation, nunca emojis soltos.

## Catalogo, planos e colecoes

O seed Royal Carnes organiza o catalogo sem faixas como "dia a dia" ou
"premium": Carnes e a categoria pai, com Bovinos, Aves e Suinos como filhas;
Temperos fica sem filha; Utensilios agrupa Espetos, Facas, Grelhas, Tabuas e
Acessorios. Fogo agrupa Carvao e Acendedores porque ambos continuam no
catalogo e nas capacidades dos planos. Os produtos de tempero possuem midia
propria para a selecao rica no Admin.

O kit RoyalPrime declara `reconcileCategories: true`. Ao reaplicar esse seed,
categorias que sairam do contrato sao desativadas e recebem soft delete; elas
nao permanecem visiveis no Admin, mas historico e FKs existentes nao sao
apagados. O upsert restaura uma categoria se sua key voltar ao seed.

Em Plano de assinatura, cada capacidade e declarada por config como:

```text
Categoria pai -> limite -> unidade resolvida pelos produtos da categoria
```

Exemplo: Carnes 10 kg, Temperos 2 un, Utensilios 2 un. O backend continua sendo o dono da
validacao de capacidade; o Admin apenas apresenta e edita o contrato suportado.
Nao reintroduzir hierarquia de limites filho/produto no formulario sem antes
definir e implementar a regra comercial no backend.

Colecao e relacao real de Catalogo, nao texto decorativo. A aba Produtos de
`/colecoes/detalhes` mostra os produtos vinculados em leitura. No modo Editar,
salvar compara `collectionProductKeys` e atualiza somente os produtos que
entraram ou sairam da colecao pelo endpoint real de produto. Nao existe PATCH
proprio de Colecao: a relacao e persistida por `product.collectionKeys`.

## DropdownPicker e selecao rica

`frontend/foundation/ui/web/DropdownPicker/` e o dono unico do seletor rico.
Ele recebe opcoes genericas com `label`, `description`, `imageSrc` e `imageAlt`;
nao conhece Produto, Colecao ou qualquer entidade administrativa.

O componente suporta, por props/config:

```text
searchable          -> busca no painel, com foco inicial
optionPresentation  -> "text" ou "media"
searchPlaceholder   -> copy fornecida pela surface
emptySearchLabel    -> estado vazio fornecido pela surface
```

Quando `optionPresentation: "media"`, cada opcao usa imagem ou avatar de
iniciais, nome e descricao. Ha selecao visivel, fechamento ao escolher e
navegacao por teclado com setas, Enter e Esc. O `MultiSelect` reutiliza esse
componente quando `searchable` esta ativo; os itens ja escolhidos continuam
como badges removiveis.

Hoje somente a aba Produtos da Colecao ativa essa apresentacao, por config:

```text
colecoes.config.jsx -> edit.source: "produtos"
                     -> searchable: true
                     -> optionPresentation: "media"
```

As imagens, unidade e nome chegam pela fonte `produtos` do shared-core. Copy de
busca e vazio esta em `frontend/admin/shared-core/locales/pt-BR.ts`; Foundation
nao possui texto de interface hardcoded.

## Configs standard

Os manifests ativos ficam em:

```text
frontend/admin/shared-core/manifest/pages/
```

Um detalhe standard declara tabs e secoes explicitas:

```js
{ type: "fields", fields: [...] }
{ type: "lineItems", itemsKey: "items", columns: [...] }
```

Cada secao deve ter `key`, `titleKey`, `iconIntent` e `grid` responsivo. O
config define campos, leitura, edicao, fontes e layout; o renderer nao inventa
regras por entidade.

`Editar` e `Remover` sao acoes padrao do detalhe. No edit mode, todos os dados
continuam visiveis; somente campos `editable: true` ficam habilitados. Remover
executa apenas quando houver comando real; caso contrario o modal informa a
limitacao sem simular exclusao.

## Pedido e Entrega

O desenho de Royal Box recorrente esta em `backend/ROYAL_BOX_RECURRING_DESIGN.md`.
Ele nao reaproveita `Subscription` de planos, pois esse modelo representa
capacidades selecionaveis; usa `BoxTemplate -> BoxSubscription -> BoxCycle ->
Order -> Delivery`, com no maximo um pedido por ciclo.

### Modelo operacional vigente

```text
Pedido -> unico dono do status e do historico
Entrega -> espelho logistico do Pedido
```

O operador pode selecionar qualquer um dos nove status configurados no detalhe
de Pedido, inclusive para corrigir um estado terminal. O backend valida a
existencia do status na organization, registra `de -> para` com ator e nota e,
na mesma transacao, atualiza a Entrega vinculada. Confirmacao, endereco,
pacotes e observacoes permanecem dados proprios da Entrega, sem alterar status.

Lista de Pedido:

```text
Codigo | Cliente | Tipo de pedido | Status | Valor total
```

Pedidos chegam da API por criacao mais recente primeiro (desempate por maior
id), e a lista declara `Codigo` em ordem decrescente como padrao. Cada
cabecalho tem um unico controle compacto: ele alterna somente entre
decrescente e crescente. Apenas uma coluna pode ordenar por vez: ao escolher
outra, ela substitui a anterior. Prazo usa sua data ISO, situacao de prazo usa
prioridade operacional e valor total usa centavos para evitar ordenar texto
formatado.

Decisao de V1: a ordenacao e exclusivamente simples, sem criterios combinados
nem indicador de prioridade. O proximo recorte do Admin e responsividade:
auditar a Foundation/AppShell e as paginas padrao em larguras mobile antes de
alterar componentes ou criar comportamentos especificos por rota.

Responsividade do Admin (inicio pelo Dashboard): a tela agora usa o
`ScreenHeader` web existente da Foundation como primeiro elemento da rota, no
mesmo modo recolhivel usado pelo Client em telefones. Os quatro KPIs passam a
usar grade 2 x 2 abaixo de 760px; tabelas continuam com rolagem horizontal
para preservar informacao operacional. O adaptador web `AdminScreenHeader`
fixa essa apresentacao compacta e usa `containerWidth="full"` com
`containerInset="sectionFull"` para alinhar Dashboard, Lista, Criar, Detalhe
e Configuracoes ao mesmo gutter da grade de 20 colunas; cada config continua
declarando somente os dados da rota. Em
cada uma dessas composicoes, `SectionContainer.headerSafety` reduz o espaco
entre o cabecalho contextual e o conteudo sem sobrescrever CSS da Foundation.
Para Listas, `ScreenHeader.actions` recebe contagem, troca de visualizacao e
criacao no mesmo cabecalho; filtros e tabela permanecem no conteudo abaixo.
Acoes de detalhe (voltar, editar, salvar e remover) continuam no seu contexto
operacional ate receberem uma composicao propria.

Status de Pedido e Entrega vem do backend, inclusive metadados semanticos para
as tabelas. Pedido e a fonte unica de verdade: no edit mode, o
`DropdownPicker` apresenta todos os status configurados, sem desabilitar
saltos ou estados terminais. Cada mudanca diferente do valor atual entra no
historico do Pedido e sincroniza sua Entrega.

O carregador generico de fontes reconhece tanto `field.source` quanto
`field.edit.source`, incluindo fontes de colunas editaveis. Isso corrige o
seletor antes vazio de Pedido e Entrega.

Ordem operacional no detalhe de Entrega:

```text
Caixa -> Status de envio -> Assinante -> Pedido de origem -> Criada em
```

Entrega e um detalhe logistico de leitura: endereco, pacotes, confirmacao e
observacoes continuam nela, mas seu status espelha o Pedido. A aba Pedido da
Entrega abre o detalhe real onde a operacao altera o status.

## Tabela de itens

Itens repetidos sao tabela, nunca uma sequencia de cards:

```text
Item | Quantidade | Preco unitario | Total
```

O config tambem declara o alinhamento da coluna. Em Pedido, `Item` fica no
inicio; quantidade, preco unitario e total usam `align: "end"`, mantendo os
valores comparaveis em uma leitura rapida.

O renderer esta em:

```text
frontend/admin/web/src/engines/rendering/screen-types/standard/components/LineItemsEditor/
  LineItemsEditor.tsx          estado, adicionar/remover e atualizacao
  table/LineItemsTable.tsx     table e cabecalho de colunas
  read/LineItemsReadTable.tsx  linhas de leitura
  edit/LineItemsEditorRow.tsx  linha editavel
  edit/LineItemsEditCell.tsx   DropdownPicker, Select, Input e CurrencyInput
  line-items.utils.ts          fontes dependentes, sufixos e normalizacao
```

Colunas sao config-first:

```text
select   -> fonte de opcoes declarada
number   -> Input numerico
currency -> CurrencyInput com moeda e locale do config
text     -> Input de texto
```

Produto pode declarar `presentation: "media"` e usa o `DropdownPicker`
compartilhado com imagem e unidade quando essas informacoes existirem.

No detalhe de Pedido, `Editar` troca a tabela por duas celulas editaveis no
mesmo lugar: `Item` e `Quantidade`. O seletor mostra somente o produto (por
exemplo, `Picanha`); sua unidade comercial fixa (`kg` ou `un`) entra
automaticamente como sufixo da quantidade. A variante tecnica padrao, quando
existir, segue oculta para preservar preco e reserva de estoque; o maximo do
campo e o saldo vendavel retornado pelo estoque. `Adicionar item` insere uma
nova linha; em `/pedidos/novo`, a tabela aparece mesmo vazia para receber essa
acao. Preco unitario e total continuam calculados pelo backend.

A persistencia usa `PUT /api/v1/orders/admin/orders/<id>/items/`. O servico
substitui os itens em uma transacao, recalcula preco/total e compensa/reserva o
estoque. Por seguranca, isso vale apenas para Pedido em `received` sem ciclo de
assinatura; pedidos posteriores ou de ciclo retornam `order_items_locked`.

Em mobile, a tabela preserva colunas e usa rolagem horizontal dentro da
superficie; ela nao se converte em cards.

## Configuracoes

`/configuracoes` organiza somente preferencias do produto:

```text
Frontend  -> marca, tema e aparencia
Operacao  -> expedicao, entrega e cadeia de frio
Comercial -> cobranca, moeda e ciclo
```

A navegacao local e compacta (nao cards), e largura/grade pertencem ao
`settings.config.jsx`. O AppShell continua global e nao aparece como uma aba
editavel local.

## Corte atual: prazo comprometido de Royal Box

`recurrence_day` de Royal Box e o dia mensal que foi combinado para a entrega;
nao e somente uma preferencia para iniciar o pedido. O backend e o dono da
resolucao, no fuso da organizacao:

```text
dia do pedido <= dia recorrente -> entrega no mes corrente
dia do pedido >  dia recorrente -> entrega no mesmo dia do mes seguinte
dia 29/30/31 em mes curto        -> ultimo dia existente do mes
```

Exemplo confirmado: pedido criado em 23/09 com dia recorrente 21 tem entrega
prometida em 21/10, e nao em 29/09 por soma de prazo operacional.

O fluxo e:

```text
checkout Royal Box -> BoxSubscription/ScheduleOccurrence -> BoxCycle.scheduled_for
                  -> Order -> Delivery.promised_delivery_by_on
```

`delivery_min_business_days` e `delivery_max_business_days` permanecem na
policy, mas representam a janela interna de preparacao, calculada para tras a
partir da data prometida. Eles nunca devem adiar a data comprometida ao
cliente. O snapshot da entrega usa a origem
`royal_box_recurring_delivery_day` e guarda a janela operacional.

Arquivos principais:

```text
backend/apps/boxes/services.py
backend/apps/deliveries/services.py
backend/apps/boxes/management/commands/backfill_royal_box_delivery_dates.py
backend/API_CONTRACTS.md
```

O comando de backfill e seguro por padrao: sem `--apply` apenas mostra a
previsao; com `--apply`, atualiza ciclo, ocorrencia e a promessa da Entrega.
Nesta sessao ele corrigiu o pedido existente `RP-000008` para 21/10/2026.

No Admin, o detalhe usa "Entrega recorrente" e "Proxima entrega". A lista
continua usando a coluna geral "Entregar ate", que para Royal Box recebe a
mesma data comprometida. O contrato/mapeador do Client tambem recebe
`box_cycle_scheduled_for`; a revisao do checkout chama o campo de
"Entrega recorrente".

## Corte atual: detalhes de Produto e Foundation

`/produtos/detalhes` foi organizado em abas Dados, Midia e Planos de
assinatura. O seletor de midia da Foundation foi compactado: preview de leitura
em 240 x 180, picker com largura maxima de 360 e proporcao 4:3. A imagem pode
ser substituida por clique ou arraste; durante o arraste ela exibe o aviso de
substituicao. Remover imagem e uma acao transparente em tom de perigo, com
confirmacao.

`DropdownPicker` nao usa mais a barra lateral esquerda para indicar a opcao
selecionada. Nao reintroduzir icones sem semantica (coracao, estrela ou check)
como substitutos: a selecao deve continuar clara por texto, foco e estado da
Foundation.

## Validacao obrigatoria

Para mudancas no Admin:

```text
npm run verify:admin-detail-contract
npm run verify:foundation
npm run verify:rules
npm run build:admin
git diff --check
```

O build pode avisar sobre chunks grandes do Vite; e aviso conhecido, nao falha.
Avisos LF/CRLF no worktree tambem nao sao falha. Checks estaticos nao substituem
QA visual e funcional em navegador real.

## Proxima retomada

### Roteiro para o proximo Codex

1. Entrar em `RoyalPrime`, executar `git status --short` e nao reverter nem
   reorganizar mudancas que nao pertençam a tarefa atual.
2. Ler este arquivo, `AGENTS.md`, `docs/CODEX_ENTRYPOINTS.md` e, para qualquer
   alteracao Admin, abrir primeiro o `*.config.jsx` da entidade. Nao iniciar por
   JSX de tela.
3. Conferir visualmente em `http://localhost:3001`:
   - `/colecoes/detalhes`: aba Produtos em leitura deve listar itens reais da
     colecao; Editar deve abrir o seletor pesquisavel com imagem/avatar e
     unidade, adicionar/remover e salvar a relacao apos recarregar;
   - `/planos/detalhes`: capacidades devem exibir apenas categorias pai e a
     unidade correta de cada grupo;
   - `/pedidos/detalhes`: a secao de itens deve ser a tabela de quatro colunas
     e todos os status devem estar selecionaveis;
   - `/entregas/detalhes`: nao deve haver edicao propria; a aba Pedido deve
     abrir o Pedido vinculado e o status mostrado deve espelhar sua mudanca;
   - viewport desktop e mobile: paineis, tabelas e dropdowns nao devem estourar
     a pagina ou converter linhas em cards.
4. Se houver defeito visual do DropdownPicker, alterar somente os donos abaixo:

```text
interacao/portal  foundation/ui/web/DropdownPicker/DropdownPicker.tsx
layout local      foundation/ui/web/DropdownPicker/DropdownPicker.module.css
opcoes ricas      fonte no shared-core + config.jsx da entidade
copy              locales da surface que consome o componente
```

5. Se houver defeito visual da tabela, alterar somente os donos abaixo:

```text
estrutura       LineItemsEditor/table/LineItemsTable.tsx
leitura         LineItemsEditor/read/LineItemsReadTable.tsx
edicao          LineItemsEditor/edit/LineItemsEditorRow.tsx
controle/celula LineItemsEditor/edit/LineItemsEditCell.tsx
estilos         LineItemsEditor/LineItemsEditor.module.css
contrato        standard.view-model.ts + config.jsx da entidade
```

6. Se a operacao pedir edicao de itens depois de `received` ou em ciclo de
   assinatura, ampliar primeiro o servico `replace_order_items` com a regra de
   negocio correspondente; nao contornar `order_items_locked` no frontend.
7. Ao concluir, executar os checks da secao anterior, registrar apenas o novo
   estado consolidado neste arquivo e manter este handoff curto.

## Limites de verificacao desta sessao

Para o corte de entrega recorrente, `py manage.py check`,
`py manage.py makemigrations --check --dry-run`, seis testes focados de
Boxes/Orders, `npm run verify:foundation` (94 checks),
`npm run verify:admin-detail-contract`, build do Client e `git diff --check`
passaram. A tentativa ampla de 30 testes encontrou tres falhas preexistentes e
dependentes de estado de seed/reserva; nao atribuir essas falhas a Royal Box.

`npm run verify:rules` conserva seis violacoes legadas em theme manifest e
componentes Foundation, sem novas violacoes deste corte. O build completo do
Admin esta bloqueado antes da compilacao por uma referencia preexistente a
`frontend/client/web/src/screens/portal/Experiments/HomeTeste2/HomeTeste2View.tsx`,
que nao existe no worktree. Nenhum navegador estava conectado: ainda falta QA
visual e funcional do Admin/checkout em navegador real.
