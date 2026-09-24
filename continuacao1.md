# Continuacao 1 - Admin, operacoes e seletores compartilhados

> Superado em 2026-09-20 para Pedido e Entrega: este registro descreve o
> workflow sequencial anterior. O modelo vigente esta em `continuacao.md`:
> Pedido e a fonte unica de verdade, o Admin pode escolher qualquer status
> configurado e a Entrega apenas espelha esse status.

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

### Modelo atual de Pedido e Entrega

Pedido possui os nove status configurados pelo seed e e a fonte unica de
verdade. O Admin pode escolher qualquer status, inclusive para corrigir um
estado terminal; a alteracao entra no historico com ator e nota.

Entrega nao possui workflow ou edicao de status proprios. Ela espelha o status
do Pedido na mesma transacao e preserva somente dados logisticos, como endereco,
pacotes, confirmacao e observacoes. O detalhe de Entrega tem uma aba Pedido que
abre o Pedido vinculado para a alteracao real.

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

1. O status `Recebido` mostra os nove estados, todos selecionaveis.
2. Uma alteracao direta para qualquer status atualiza a Entrega vinculada.
3. A lista rola sem cortar e abre acima perto do rodape.
4. O detalhe de Entrega nao oferece edicao e sua aba Pedido abre o registro que
   controla o status.

## Atualizacao 2026-09-21 - Origem comercial, Royal Box e Scheduling

Pedido continua sendo o centro operacional do Admin. A leitura comercial
vigente possui somente tres origens:

```text
Assinatura -> plano e ciclo de escolha do cliente
Royal Box  -> caixa fixa recorrente
Avulso     -> compra unica sem recorrencia
```

O detalhe de Pedido concentra endereco e contexto da origem dentro de `Dados`.
Nao deve manter uma secao paralela de "Origem comercial" nem expor termos
tecnicos desnecessarios. A apresentacao correta e:

```text
Assinatura -> plano e periodo do ciclo
Royal Box  -> caixa e recorrencia simples, por exemplo "Dia 15"
Avulso     -> endereco, itens, pagamento e status; sem ciclo/recorrencia
```

`SubscriptionCycle` pertence somente a Assinatura. `BoxCycle` e a ocorrencia
interna de Royal Box; ele protege a criacao idempotente do Pedido, mas nao e
um campo principal de leitura operacional. O Pedido conserva os snapshots de
itens, preco e endereco; alterar uma adesao Royal Box vale apenas para os
proximos pedidos.

### Correcao do Checkout

Foi encontrada e corrigida a causa de pedidos hibridos: `useClientCheckout`
enviava `subscriptionId` e `subscriptionCycleId` para qualquer modalidade.
Agora esses IDs so seguem no payload quando `selectedMode === "subscription"`.
Assim, pedidos novos de Royal Box ou Avulso nao recebem vinculo de Assinatura.

Pedidos antigos criados antes dessa correcao podem ter tipo `royal-box` e
vinculo de `SubscriptionCycle`. O Admin ignora o periodo de assinatura quando
o `kindKey` nao for `subscription-cycle`; a correcao definitiva de cada dado
historico exige classificacao/migracao explicita, nunca edicao visual ambigua.

### Scheduling e Royal Box

O Kit 08 (`docs/kits/scheduling-recurrence-kit.md`) possui base backend local:

```text
Schedule + ScheduleOccurrence
  -> regra temporal por organization/timezone e ocorrencia idempotente

BoxSubscription + BoxCycle
  -> caixa, endereco, politica de criacao e snapshot mensal

Order + Delivery
  -> no maximo um Pedido por BoxCycle; Entrega derivada do Pedido
```

Operacao automatica aceita duas entradas para o mesmo service:

```text
Antes do gateway -> scheduler gerenciado da hospedagem chama run_schedules
Com gateway        -> webhook de Payment pago chama o adapter de BoxCycle
```

Nao gerar ciclo quando Admin/Client abre uma tela. O cron/scheduler e da
infraestrutura e o gateway/webhook ainda nao possui endpoint publicado.

### Navegacao Admin

O menu principal foi reorganizado para refletir a operacao:

```text
Dashboard -> Pedidos -> Clientes -> Produtos -> Entregas
```

## Validacao desta atualizacao

- `manage.py test apps.scheduling.tests apps.boxes.tests`: passou.
- `manage.py check`: passou.
- `manage.py makemigrations --check --dry-run`: sem migrations pendentes.
- `git diff --check` dos arquivos tocados: passou.
- A suite combinada de Orders ainda possui falhas no worktree atual ligadas a
  expectativa de seed/reserva de Assinatura; nao foram usadas como evidencia
  de Royal Box.
