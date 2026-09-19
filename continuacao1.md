# Continuacao 1 - Admin, operacoes e seletores compartilhados

## Estado do trabalho

- Branch: `feature/shared-core-kit-reset`.
- O worktree esta deliberadamente sujo, com trabalho paralelo de Client,
  Checkout, Foundation e documentacao. Nao usar `git add .`, reset ou clean.
- A ordem de implementacao continua sendo:
  `backend -> shared-core -> manifest/config -> renderizador -> Foundation`.
  As telas nao decidem preco, estoque, limite ou transicao operacional.

## O que foi implementado no Admin

### Catalogo, colecoes, categorias e planos

- `DropdownPicker` e o seletor unico da Foundation para Admin: busca no proprio
  campo, opcoes com midia, imagem/avatar, texto truncado, navegacao por teclado
  e scrollbar compartilhada.
- Produtos em Colecoes usam o seletor com imagem e nome; a tabela de Produtos
  tambem mostra a imagem ao lado do produto.
- Capacidades de Planos usam apenas categorias pai e a unidade correta.
  Capacidades gerais e limites especificos persistem em
  `constraints.itemLimits`; o backend valida grupo e produto, sem logica por
  nome de item na tela.
- Categorias sao apresentadas como arvore expansivel no Admin, em vez de uma
  tabela com caminhos repetidos. A configuracao permanece em
  `categorias.config.jsx` e o renderer generico em `ListPageTable.tsx`.
- A relacao de produtos de uma categoria foi preparada como vinculo
  gerenciavel, mas a regra de negocio permanece: um produto nao pode terminar
  sem categoria.

### Clientes, listas e relacoes

- Cliente ganhou abas operacionais de dados, assinatura, pedidos e pagamentos;
  linhas de pedido e pagamento inteiras podem abrir o respectivo detalhe.
- Historico duplicado foi removido quando a propria aba ja representa o
  historico.
- Toolbars de listas usam busca e filtros configurados. Filtros baseados em
  fonte agora exibem o label vindo do backend, em vez de chave tecnica.

## Pedidos e entregas

### Workflow de Pedido configurado no backend

```text
Recebido
  -> Aprovado
  -> Separando
  -> Pronto para envio
  -> Saiu para entrega
  -> Entregue
```

Saidas alternativas:

```text
Pronto para envio -> Concluido
Saiu para entrega -> Falha na entrega
Qualquer fase operacional -> Cancelado
```

Total: nove status de Pedido.

- A definicao vive em `backend/seeds/royalprime/kits/orders.seed.json` e e
  retornada por `/api/v1/orders/config/`; o Admin e o Portal resolvem label,
  ordem e aparencia por esse contrato.
- Entrega continua tendo seu workflow proprio (`Pendente`, `Separando entrega`,
  `Saiu para entrega`, `Entregue`, `Falhou`, `Cancelada`).
- Quando Entrega muda para despacho, confirmacao, falha ou cancelamento, o
  backend atualiza o Pedido pai dentro da mesma transacao:
  `out-for-delivery -> out-for-delivery`, `delivered -> delivered`,
  `failed -> delivery-failed`, `cancelled -> cancelled`.
- A aba **Entrega** foi incluida em `/pedidos/detalhes`, com acesso ao detalhe
  da entrega relacionada.
- O filtro de status de Pedidos vem de `orderStatuses`, nao de uma lista
  hardcoded no manifest.

### Seletor de status no detalhe

- O seletor mostra todo o ciclo configurado, nao apenas tres itens.
- Status que nao sao validos a partir do estado atual aparecem desabilitados;
  apenas o status atual e as proximas transicoes permitidas podem ser clicados.
- O backend continua bloqueando qualquer salto invalido, mesmo se alguem
  manipular o frontend.

## Ajuste atual do DropdownPicker

- O painel e renderizado via portal e mede o espaco disponivel no viewport.
- Se nao houver espaco abaixo do campo, ele abre acima.
- A altura e limitada ao espaco real disponivel; somente a lista de opcoes
  rola, usando a scrollbar padrao da Foundation.
- Isso corrige o painel cortado no fim de `/pedidos/detalhes` e vale para todos
  os DropdownPickers do Admin.

## Arquivos principais alterados neste corte

- `backend/seeds/royalprime/kits/orders.seed.json`
- `backend/apps/deliveries/services.py`
- `backend/apps/orders/tests/test_api.py`
- `backend/apps/deliveries/tests/test_api.py`
- `backend/API_CONTRACTS.md`
- `frontend/admin/shared-core/manifest/pages/pedidos.config.jsx`
- `frontend/admin/web/src/engines/rendering/screen-types/standard/pages/DetailPage/DetailContentCard.tsx`
- `frontend/admin/web/src/engines/rendering/screen-types/standard/pages/ListPage/ListPageToolbar.tsx`
- `frontend/foundation/ui/web/DropdownPicker/DropdownPicker.tsx`
- `frontend/foundation/ui/web/DropdownPicker/DropdownPicker.module.css`

## Evidencia de validacao

- `npm run verify:admin-detail-contract`: passou.
- `npm run verify:foundation`: passou, 94 checks.
- Build direto do Admin por Vite: passou; permanece apenas o aviso de chunks
  grandes.
- `git diff --check`: passou.
- `npm run verify:rules` ainda encontra sete violacoes ja existentes no
  worktree compartilhado, inclusive regras anteriores de DropdownPicker e
  toolbar. Elas nao foram resolvidas neste corte.
- Nao houve browser disponivel nesta sessao; o comportamento visual, scroll,
  teclado e mobile ainda precisam de QA manual.
- O shell atual nao possui Python/Conda funcional. Portanto os testes Django e
  a aplicacao do novo seed no banco local nao foram executados.

## Proximo passo obrigatorio

Quando o ambiente Python estiver disponivel, executar em `backend`:

```powershell
py manage.py seed_backend
py manage.py test apps.orders.tests.test_api apps.deliveries.tests.test_api
```

Depois, recarregar `http://localhost:3001/pedidos/detalhes` e verificar:

1. O status `Recebido` mostra os nove estados.
2. Apenas `Aprovado` e `Cancelado` ficam clicaveis a partir de `Recebido`.
3. A lista rola sem cortar e abre acima perto do rodape.
4. Entrega em `Saiu para entrega`, `Entregue`, `Falhou` e `Cancelada` atualiza
   o Pedido pai conforme o workflow.
