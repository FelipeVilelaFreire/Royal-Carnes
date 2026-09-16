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

Limite importante: no detalhe de Pedido, itens ainda sao somente leitura. O
backend calcula preco e total, reserva estoque e aplica regras de assinatura.
Nao habilitar edicao de itens ate existir comando transacional real no backend.
Status continua sendo a mutacao permitida nesse detalhe.

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
   - `/pedidos/detalhes`: a secao de itens deve ser a tabela de quatro colunas;
   - `/planos/detalhes`: itens editaveis devem preservar a mesma tabela;
   - `/deliveries/detalhes`: Editar -> Status de envio deve abrir opcoes;
   - viewport desktop e mobile: tabelas rolam dentro do card, sem estourar a
     pagina ou converter linhas em cards.
4. Se houver defeito visual da tabela, alterar somente os donos abaixo:

```text
estrutura       LineItemsEditor/table/LineItemsTable.tsx
leitura         LineItemsEditor/read/LineItemsReadTable.tsx
edicao          LineItemsEditor/edit/LineItemsEditorRow.tsx
controle/celula LineItemsEditor/edit/LineItemsEditCell.tsx
estilos         LineItemsEditor/LineItemsEditor.module.css
contrato        standard.view-model.ts + config.jsx da entidade
```

5. Se o usuario pedir edicao de itens em Pedido, parar antes de marcar
   `editable`. Primeiro propor e implementar o contrato backend para substituir
   itens de forma transacional: validar produto/variante, recalcular preco e
   total, compensar/reservar estoque e respeitar ciclo de assinatura. So depois
   conectar API, shared-core e `pedidos.config.jsx`.
6. Ao concluir, executar os checks da secao anterior, registrar apenas o novo
   estado consolidado neste arquivo e manter este handoff curto.

## Limites de verificacao desta sessao

Os builds e contratos recentes passaram. Nenhum navegador estava conectado
nesta sessao; a aparencia final e os cliques ainda precisam de QA visual real.
