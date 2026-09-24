# Continuacao 3 - RoyalPrime Client Portal

## Estado em 2026-09-19

Branch atual: `feature/shared-core-kit-reset`.

O worktree esta compartilhado e ja contem alteracoes paralelas de Admin,
Checkout, Catalogo e Foundation. Preserve-as; nao use reset, clean, checkout
ou `git add .` para publicar este corte.

## Contrato permanente

```text
backend      -> regras, autorizacao e persistencia
client/shared-core -> DTOs, API, hooks, view-models, strings e acoes
Web/Mobile Native -> render-only e estado visual local
```

`webIsMobile` e Native usam os mesmos hooks, dados, strings, acoes e intencao
de navegacao. A composicao fisica pode variar pelo host; nao criar uma segunda
fonte de dados ou regra de plano no renderer.

## Perfil

Arvore canonica:

```text
client/web/src/screens/portal/Perfil/
client/mobile/src/screens/portal/Perfil/
  fixed/      -> ScreenHeader e navegacao compacta
  PerfilView  -> orquestra resumo, aba ativa e modal visual
```

No desktop, `AccountProfileSummary` agora ocupa a largura util antes da grade
principal. A lateral contem somente navegacao; o antigo cartao "Plano Ativo"
foi removido para nao repetir plano, renovacao e status.

No mobile/native, a ordem e:

```text
ScreenHeader -> resumo da conta -> navegacao compacta -> modulo ativo
```

`useClientCustomer` continua sendo o unico dono de customer, planos, ciclo,
pedidos, enderecos, preferencias e acoes autorizadas.

### Capacidade do ciclo

```text
GET /api/v1/subscriptions/me/cycles/current/
  -> capacity do backend
  -> createClientCustomerCycleUsage / createClientCustomerAccountViewModel
  -> cards Web e Mobile Native
```

- Cada grupo aparece uma unica vez, por exemplo `2 / 10 kg`.
- A tela nao repete selecoes e quantidade como dois cards para a mesma cota.
- Web: sete cards compactos no desktop; 4, 3 e 2 colunas conforme a largura.
- Native: cards compactos em duas colunas com a mesma porcentagem do
  view-model usada na barra de progresso.

### Minha Assinatura

```text
GET /api/v1/subscriptions/me/ + GET /api/v1/subscriptions/plans/
  -> createClientCustomerPlans
  -> ClientCustomerPlan
  -> cards de planos Web e Mobile Native
```

- O plano ativo vem da assinatura, nunca de `plans[0]`.
- `ClientCustomerPlan` carrega a descricao retornada pelo plano.
- Quantidades serializadas pelo backend como Decimal, como `10.000`, sao
  formatadas no view-model como `10 kg`.
- Os cards exibem nome, preco, descricao e itens incluidos. Nao exibem a linha
  redundante de limite de escolhas.
- Os tres cards compartilham padding, altura de cabecalho, area de descricao,
  divisor e inicio da lista; "Atual" e somente um destaque adicional.

### Saida da conta

Web e Native mostram confirmacao antes de sair. A confirmacao chama o logout
real do shared-core:

```text
useClientPortalAuthSession.logout()
  -> POST /api/v1/auth/logout/
  -> limpa a sessao local
```

Nao expor troca/cancelamento de plano, reset de senha, exportacao ou encerramento
de conta como persistencia real enquanto nao existir endpoint autorizado.

## AccessShell

Configuracao: `frontend/client/shared-core/manifest/portal/access-shell.config.jsx`.

- Header declarativo com logo RoyalPrime, nome e fechamento.
- Formulario compacto/flat, fluxo Entrar e Criar conta, provedores Google e
  Apple somente como UI enquanto nao houver OAuth conectado.
- Web e Native leem a mesma configuracao. Native respeita `formSurface`,
  `showForgotPassword`, divisor dos provedores e alternancia de fluxo.

## Checkout mobile coberto nesta rodada

`MobileSelectionSummary` usa uma chave de locale para os `accessibilityLabel`
dos controles de quantidade. Nao concatenar copy de interface diretamente no
renderer.

## Validacao realizada

```text
npm run verify:rules
  -> 0 violacoes; 72 findings legados inalterados

git diff --check (arquivos de Perfil/AccessShell/Checkout mobile alterados)
  -> sem erro; apenas avisos CRLF do worktree

npm run build:client
  -> prebuild de regras passou; Next nao iniciou porque outro next build ja
     estava em execucao no workspace

tsc --noEmit -p frontend/client/mobile/tsconfig.json
  -> arquivos desta rodada sem erro proprio
  -> bloqueios preexistentes: props padding em Landing/Home, Input ausente em
     Checkout Delivery e modulo react-dom ausente em Modal web
```

Nao houve browser nem dispositivo Native disponivel nesta rodada. Logo, a
validacao visual e de interacao em host real permanece pendente.

## Proximo corte seguro

1. Abrir Perfil em web mobile e Native real e comparar densidade, overflow,
   barra de capacidade e modal de saida.
2. Resolver os bloqueios preexistentes do typecheck antes de usar o resultado
   como prova de paridade Native.
3. Conectar OAuth ou reset de senha somente depois de contrato backend e acao
   compartilhada existirem.

## Corte adicional em 2026-09-19: refinamento visual e loading do Perfil Web

O Perfil Web recebeu um refinamento incremental sem substituir a cadeia de
dados real. A rota continua unica em `/perfil`: a lateral altera somente
`activeTab`, e `ProfileModuleContent` monta uma aba por vez.

### Resumo e navegacao

- O resumo da conta passou a apresentar o fallback de iniciais (`CR`) com o
  token de accent dourado e contraste do tema. Foto de pessoa nao foi criada:
  o contrato de customer ainda nao expõe `avatar_url`.
- O resumo mostra titulo, descricao e os dados reais de plano, proxima
  renovacao, proxima entrega e cliente desde.
- A lateral preserva Resumo, Minha Assinatura, Pedidos & Entregas, Dados
  Pessoais, Enderecos, Pagamento, Preferencias e Seguranca.

### Abas e acoes reais

- Minha Assinatura ganhou hierarquia visual para titulo, preco mensal,
  descricao, lista de beneficios e destaque adicional do plano atual. Planos
  continuam vir de `useClientCustomer` e o atual continua vir da assinatura.
- Dados Pessoais organiza os campos em grade; CPF e telefone sao formatados na
  apresentacao, e o hook normaliza CPF em digitos e telefone em formato `+55`
  antes do PATCH do customer.
- A aba Pagamento permanece na lateral, mas o editor de metodos/cartoes e o
  botao "Adicionar metodo" foram removidos. O Portal nao deve sugerir que o
  cliente pode cadastrar cartao sem um fluxo autorizado.
- Enderecos usa modal para criacao e ganhou acao Editar em cada card. A cadeia
  real agora é `AddressListPanel -> useClientCustomer.updateAddress ->
  customerApi.updateAddress -> PATCH /api/v1/customers/me/addresses/:id/`.
  O mesmo modal envia POST para novo endereco ou PATCH para endereco existente.
  CEP-first e ViaCEP permanecem obrigatorios.

### Loading por regiao

O loading normal nao deve exibir a tela textual "Carregando sua conta". A
composicao usa Skeleton da Foundation para resumo, sidebar e modulo ativo.
Os skeletons do resumo e de assinatura foram refinados para refletir avatar,
metricas e cards reais. A reorganizacao completa por pasta esta especificada
em `docs/handoff/perfil-module-skeleton-refactor.md`; nao declarar essa
migracao completa enquanto os facades ainda apontarem para `components.tsx`.

### Referencias e validacao deste corte

- Referencia visual exportada: `docs/perfil-stitch-reference.md`.
- Handoff de modularizacao: `docs/handoff/perfil-module-skeleton-refactor.md`.
- `git diff --check` dos arquivos do Perfil executado sem erro.
- `npm run verify:rules` nao esta globalmente verde no worktree compartilhado:
  ha violacoes em arquivos paralelos de Admin/Foundation. Nao atribuir essas
  violacoes ao Perfil sem revisar o caminho concreto.
- Nao houve QA visual autenticado em browser ou dispositivo Native nesta
  rodada; validar `/perfil` desktop e web mobile antes de chamar o refinamento
  visual de concluido.

## Corte adicional em 2026-09-21: `/library`, Skeleton Foundation e `/meus-pedidos`

### Library do Client

O Client Web agora possui a rota tecnica `/library`, declarada em
`frontend/client/shared-core/manifest/routes.ts` e no manifest do Portal. Ela
e renderizada por:

```text
/library
  -> app/(portal)/library/page.tsx
  -> PortalView (screen = library)
  -> screens/portal/Library/LibraryView.tsx
```

A pagina e uma bancada de referencia para as primitivas Foundation realmente
publicadas no Client: Button, Surface, Card, Input, DropdownPicker, Select,
MultiSelect, Modal, Skeleton, Badge, campos, layout, feedback e composicoes.
Ela nao cria um design system paralelo e usa as strings de locale do Client.
O Mobile Native tambem recebeu a entrada de rota `library`; a composicao pode
variar por host, mas a rota e o contrato de navegacao sao os mesmos.

### Skeleton: dono unico e receita tokenizada

O Skeleton visual e central em `frontend/foundation/ui/web/Skeleton/`. Ele nao
renderiza mais uma `Surface`: uma Surface resolvia e injetava o fundo escuro
da receita no elemento, mascarando a onda. Skeleton agora e uma `div`
aria-hidden, sem foco nem interacao, com a receita vinda de
`frontend/foundation/semi-composed/surface.css`.

```text
Theme opacity/color tokens
  -> semi-composed skeleton base + reflection + wave
  -> Skeleton Foundation
  -> Button/Input/Card/DropdownPicker e composicoes de tela
```

- A onda usa base cinza, reflexo e `background-position`; nao usa cor
  hardcoded. Onde `color-mix` precisa de percentual, a receita converte o
  token alpha com `calc(... * 100%)`, preservando o mesmo token para usos CSS
  de `opacity`.
- `Surface` oferece `state="skeleton"` como entrada generica, mas devolve o
  Skeleton neutro; ela nao volta a aplicar a receita/fundo de Surface.
- Os componentes oficiais agora aceitam `state="skeleton"`:

```tsx
<Surface state="skeleton" />
<Button state="skeleton" size="md" />
<Input state="skeleton" />
<DropdownPicker state="skeleton" />
<Card state="skeleton" />
```

- Button, Input, Card e DropdownPicker mantem sua geometria semantica, mas o
  resultado de loading e uma `div` nao clicavel. `ButtonSkeleton`,
  `InputSkeleton` e `DropdownPickerSkeleton` ficam como compatibilidade e
  delegam para o contrato novo.
- Catalogo, Checkout, Perfil, Admin e product-components que ja compunham o
  Skeleton Foundation passam a usar automaticamente a mesma receita. Nao
  criar shimmer local nem outra cor de loading em cada tela.

Validacao deste corte:

```text
npm run verify:foundation
  -> passou (94 checks)

curl http://localhost:3000/library
  -> Button state="skeleton" emitido como div Skeleton + Button, sem Surface
     e sem --ui-surface-bg inline
```

O typecheck Web continua bloqueado por erros preexistentes de AppShell,
`react-dom` ausente em Modal/DropdownPicker e tipos de Surface/Text. Nenhum
erro novo foi apontado nos contratos de Skeleton. Nao houve browser disponivel
para confirmar visualmente a onda em host real; abrir `/library` e usar
`Ctrl+F5` antes de declarar a aparencia final.

### Meus Pedidos Web

`/meus-pedidos` continua uma tela render-only, com a cadeia real:

```text
MeusPedidosView
  -> useClientOrders
  -> client orders API
  -> createClientOrdersViewModel
```

A tela foi separada para manter dados, regras e composicao visual isolados:

```text
MeusPedidos/
  MeusPedidosView.tsx       -> loading, erro, selecao e orquestracao
  components/
    CurrentOrderPanel.tsx   -> pedido atual, resumo e proximo ciclo
    OrdersHistory.tsx       -> cabecalho e linhas do historico
    OrderDetailDialog.tsx   -> detalhe responsivo
    OrderTimeline.tsx       -> timeline reutilizada
    OrderItemsPreview.tsx   -> itens resumidos
    StatusPill.tsx          -> status vindo do view-model
```

O pedido atual agora prioriza titulo, codigo, status, previsao, pagamento,
timeline e codigo de entrega. O historico ganhou cabecalhos de Tipo, Data,
Status, Valor e Acoes; no mobile, a quantidade de itens fica visivel. O CTA
de avaliar foi removido porque nao havia acao real conectada. Detalhes continuam
abrindo o modal existente e nenhum status comercial e inferido pela tela.

`/meus-pedidos` respondeu HTTP 200 neste ambiente, mas sem sessao autenticada
o Portal mostra AccessShell antes do conteudo. Logo, ainda falta QA visual com
pedidos reais autenticados para ajustar densidade, timeline e historico.

### Proximo corte seguro

1. Abrir `/library` em browser real, em tema escuro e claro, e confirmar a
   onda/reflexo de Button, Input, DropdownPicker, Card e Surface skeleton.
2. Abrir `/meus-pedidos` com uma conta que tenha pedido avulso e assinatura;
   verificar desktop, web mobile, modal e a ordem do historico.
3. Migrar usos novos para `state="skeleton"`; manter os helpers legados ate
   que todos os consumidores sejam revisados, sem remocao ampla prematura.

## Corte adicional em 2026-09-24: laboratorio de telas completas de Meus Pedidos

As rotas oficiais e o fluxo de dados nao foram alterados. `/meus-pedidos`
continua render-only e consome `useClientOrders`; este corte criou apenas um
laboratorio estatico Web para comparar enquadramento, hierarquia e densidade
antes de transportar uma direcao aprovada ao fluxo real.

```text
/meus-pedidos-teste-1 ... /meus-pedidos-teste-5
  -> PortalView
  -> Experiments/MeusPedidosTeste{1..5}
  -> MeusPedidosStudyBase
```

As cinco direcoes sao abertas pelo editor de aparencia do AppShell, no grupo
`Meus Pedidos`, e os labels usam os locales pt-BR, en-US e de-DE:

```text
Tela 1 - acompanhamento
Tela 2 - linha do tempo
Tela 3 - pedido em foco
Tela 4 - painel de etapas
Tela 5 - central do pedido
```

### Enquadramento atual do laboratorio

Cada URL agora representa uma tela completa, em vez de comparar somente uma
faixa de Pedido Atual. No desktop, `MeusPedidosStudyBase` usa o canvas de 20
colunas da Foundation em tres regioes:

```text
Pedido Atual     -> 11 a 14 colunas, conforme a direcao
Lateral          -> 6 a 9 colunas: proximo ciclo / Royal Box e acao
Historico        -> largura total abaixo, em cards
```

No mobile, essas regioes colapsam para uma coluna. Os botoes abrem um modal
ilustrativo de detalhe da direcao ativa. Os dados sao deliberadamente fixos;
nao ha sessao, API, pagamento, entrega, rastreamento, persistencia nem acao
comercial neste laboratorio. A documentacao de escopo e limites esta em
`frontend/client/web/src/screens/portal/Experiments/MEUS_PEDIDOS_TESTES.md`.

### Evidencias e limites deste corte

```text
GET /meus-pedidos-teste-{1..5}
  -> HTTP 200 apos nova tentativa do dev server

git diff --check (Experiments)
  -> sem erro

npm run verify:rules
  -> bloqueado por 6 violacoes preexistentes em theme.manifest e Foundation;
     nenhuma violacao apontada no laboratorio

tsc --noEmit -p frontend/client/web/tsconfig.json
  -> bloqueado por erros preexistentes de subscriptions, AppShell,
     SearchIcon, react-dom e Surface/Text; nenhum erro de Meus Pedidos
```

Nao houve browser, viewport real ou dispositivo Native disponivel para validar
o resultado visual, comportamento do modal ou responsividade. As rotas de
experimento sao Web-only e nao provam paridade Native.

### Proximo corte seguro

1. Abrir as cinco rotas em viewport desktop e mobile reais, com `Ctrl+F5`, e
   escolher uma direcao de enquadramento.
2. Reconstruir somente a direcao aprovada nos componentes oficiais
   `CurrentOrderPanel`, `OrdersHistory` e `OrderDetailDialog`, preservando
   `useClientOrders` e o view-model.
3. Revisar Web e Mobile Native com pedido real autenticado antes de chamar a
   rota oficial de visualmente concluida.

### Ajuste posterior do laboratorio em 2026-09-24

O laboratorio foi reiniciado logo apos o registro acima porque a composicao de
tela completa ainda misturava decisoes demais. O enquadramento de 20 colunas,
a lateral de proximo ciclo, o historico em cards e o modal ilustrativo foram
retirados das cinco rotas de experimento.

O estado atual e somente `Pedido Atual`, com cinco alternativas estaticas. A
comparacao fica restrita a codigo, status, proxima etapa e previsao. Consulte
`frontend/client/web/src/screens/portal/Experiments/MEUS_PEDIDOS_TESTES.md`
antes de recolocar qualquer outra regiao no laboratorio.

### Reconstrucao visual do laboratorio em 2026-09-24

As cinco alternativas foram refeitas novamente como paginas visuais
independentes, seguindo o principio dos testes de Home: cada URL tem sua
propria composicao hardcoded, sem `MeusPedidosStudyBase`, grid compartilhado,
cards de historico, modal, hook ou dado real. A diferenca entre elas agora e
deliberada e facil de comparar:

```text
Teste 1 -> fotografia em tela dividida e painel dourado
Teste 2 -> status central e trilha tipografica
Teste 3 -> composicao editorial com data grande
Teste 4 -> leitura horizontal: agora / em preparo / depois
Teste 5 -> fotografia dominante e cartao sobreposto
```

As imagens sao assets locais de Home e os conteudos sao somente ilustrativos.
Isso continua Web-only e nao altera `/meus-pedidos`, `useClientOrders`, API,
backend ou Mobile Native. A proxima decisao e visual: abrir as cinco URLs em
desktop e mobile, escolher uma direcao e so entao reconstruir essa unica
direcao com os dados reais da rota oficial.

### Correcao de direcao: acompanhamento, nao landing page

As alternativas foram ajustadas para resolver o problema de uso de largura e
de proposito. Todas escapam somente do wrapper visual do Portal para usar o
canvas inteiro do viewport e, dentro dele, centralizam um conteudo amplo de ate
1440px. Nenhuma usa hero fotografico ou copy de campanha.

Cada teste agora trata o pedido como unidade operacional: cabecalho de
contexto, estado atual, entrega prevista, andamento e dados essenciais. Os
cinco layouts continuam comparando hierarquias diferentes desse mesmo fluxo,
sem mudar a rota oficial ou seu contrato de dados.

O Historico foi acrescentado abaixo do acompanhamento, nunca misturado a ele.
Cada teste tem uma leitura diferente para pedidos entregues: linhas densas,
lista, cards em grade, livro-caixa ou cards de resumo. Os dados seguem
ilustrativos e o corte permanece isolado do fluxo oficial.
