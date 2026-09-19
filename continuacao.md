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

O seed Royal Carnes foi ampliado com categorias pai e filha, produtos com
midia e unidades comerciais. A composicao comercial atual trabalha primeiro
no nivel de categoria pai: Carnes, Acompanhamentos, Carvao, Utensilios e
Brindes. As categorias filhas organizam o catalogo; elas nao criam uma regra
separada no plano nesta etapa.

Em Plano de assinatura, cada capacidade e declarada por config como:

```text
Categoria pai -> limite -> unidade resolvida pelos produtos da categoria
```

Exemplo: Carnes 10 kg, Utensilios 2 un. O backend continua sendo o dono da
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

Lista de Pedido:

```text
Codigo | Cliente | Tipo de pedido | Status | Valor total
```

Status de Pedido e Entrega vem do backend, inclusive metadados semanticos para
as tabelas. No edit mode, o `DropdownPicker` mostra o status atual e apenas as
proximas transicoes permitidas por `allowedNextKeys`.

O carregador generico de fontes reconhece tanto `field.source` quanto
`field.edit.source`, incluindo fontes de colunas editaveis. Isso corrige o
seletor antes vazio de Pedido e Entrega.

Ordem operacional no detalhe de Entrega:

```text
Caixa -> Status de envio -> Assinante -> Pedido de origem -> Criada em
```

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
   - `/pedidos/detalhes`: a secao de itens deve ser a tabela de quatro colunas;
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

`git diff --check`, `npm run verify:rules`, o contrato de detalhes e
`npm run build:admin` passaram para a alteracao de DropdownPicker. A primeira
tentativa de build encontrou o erro intermitente de permissao OneDrive/esbuild;
a repeticao passou. Nenhum navegador estava conectado nesta sessao: a aparencia
final, o teclado e o salvamento da colecao ainda precisam de QA visual e
funcional real.
