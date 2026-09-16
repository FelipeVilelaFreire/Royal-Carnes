# Roadmap de entrega V1 - 15 a 30 de setembro de 2026

> Status: plano de trabalho. Nao substitui contratos, nao define branch e nao
> comprova que uma capacidade foi entregue. Para regras ativas, usar
> [CODEX_ENTRYPOINTS.md](CODEX_ENTRYPOINTS.md).

## Objetivo do corte

Entregar uma V1 coerente do RoyalPrime ate 30 de setembro, priorizando a
construcao das telas Client. O frontend e a frente de maior esforco deste
corte; backend e shared-core avancam somente para dar suporte real a cada tela
da sequencia, sem abrir uma frente abstrata paralela.

```text
Client
  -> Catalogo
  -> Montar Box
  -> Meus Pedidos
  -> Perfil
  -> Home
  -> Landing Page

Backend e shared-core
  -> liberam apenas os contratos, dados, hooks e view-models
     que a tela corrente precisa

Admin
  -> fica em manutencao e validacao; so entra quando um bloqueio
     da jornada Client exigir uma acao operacional correspondente
```

## Definicao de entrega em 30 de setembro

A V1 somente e considerada entregue se as seis telas Client forem apresentaveis
e funcionais no escopo prometido, com demonstracao baseada em backend real e
dados seed. Uma tela nao precisa antecipar recursos futuros, mas nao pode
simular como real um fluxo que ainda depende de fallback.

Todo fluxo que exigir dados ou acao precisa usar o contrato:

```text
backend -> shared-core -> manifest/config quando aplicavel -> renderer
```

O Web mobile deve manter o mesmo comportamento funcional do Mobile Native. O
trabalho visual de cada tela deve ser tratado como parte da entrega: build e
mock isolado nao comprovam fidelidade, fluxo ou paridade.

## Mapa real de telas e camadas

### Admin

O Admin e a frente visual e estrutural mais madura. Ele ja possui Dashboard e
Settings especiais, alem de um renderer `screenType: "standard"` reutilizado
por Clientes, Produtos, Planos, Assinaturas, Pagamentos, Pedidos, Categorias e
Colecoes. Entregas, Usuarios e Estoque ja possuem manifest normalizado, mas
ainda dependem de adapters de detalhe e comandos reais antes de prometer CRUD.

Isso significa que o Admin nao e uma nova sequencia de telas deste corte. A
prioridade e QA das telas existentes e correcoes somente quando elas bloquearem
o fluxo Client ou revelarem um problema real de contrato.

### Client

Existem rotas e estruturas iniciais para Catalogo, Montar Box, Meus Pedidos,
Perfil, Home e Landing. Entretanto, para este roadmap, uma rota existente nao
vale como tela entregue. A ordem de maturacao obrigatoria e:

```text
1. Catalogo       -> tela mais avancada; dados reais, aguardando QA visual final
2. Montar Box     -> tela atual; checkout ainda depende de fallback
3. Meus Pedidos   -> estrutura usa shared-core, mas recebe acabamento e QA depois
4. Perfil         -> proxima tela de conta
5. Home           -> proxima tela principal autenticada
6. Landing Page   -> fecha a jornada publica por ultimo
```

### Backend e shared-core

O produto ja possui base de autenticacao, clientes, catalogo, planos, pedidos,
delivery, assinaturas, pagamentos e estoque simples. O shared-core ja concentra
contratos, API clients, hooks, mappers, view-models, manifestos e locales nos
escopos Client e Admin.

A lacuna principal nao e criar outra camada generica: e fechar os contratos que
Montar Box requer, como snapshot real de checkout, endereco self-service,
frete/prazo e pagamento. Depois disso, cada tela Client usa e amadurece o que
ja existe no menor escopo correto.

## Fora deste corte

Estas frentes ficam propositalmente para depois da V1, salvo bloqueio real da
entrega:

- gateway de pagamento, cartao, webhooks, reembolso e conciliacao;
- assinatura recorrente completa e automacao de ciclos da Royal Box;
- roteirizacao, GPS, aplicativo de entregador e logistica avancada;
- estoque de ERP: lote, validade, fornecedor, custo medio e inventario avancado;
- carteira, creditos, vouchers e programas de fidelidade;
- extracoes novas para Foundation, AppShell, builder-shared ou ServiceOS sem
  evidencia de pelo menos dois consumidores reais.

Melhorias visuais continuam importantes, mas entram depois que o fluxo
operacional estiver demonstravel. Nenhuma tela deve ser declarada visualmente
aprovada sem QA no navegador.

## Estado de partida em 15 de setembro

Ja existe fundacao relevante para catalogo, pedidos, delivery, estoque simples,
Admin e screen types. O trabalho recente de Admin e Client possui mudancas
locais nao publicadas e deve ser preservado e consolidado em cortes separados.

Gaps conhecidos para a V1:

- checkout ainda usa fonte de fallback para catalogo e planos;
- endereco self-service do cliente ainda nao possui API publicada;
- frete e prazo ainda nao possuem contrato/backend publicado;
- pagamento ainda precisa ser confrontado com a jornada real de Montar Box;
- QA visual e de fluxo do Admin e do Catalogo permanece pendente;
- build Client e verificacao Native precisam ser destravados ou o impedimento
  precisa ser isolado e registrado como preexistente.

## Plano diario

| Data | Foco | Resultado do dia | Evidencia minima |
| --- | --- | --- | --- |
| 15/09 | Inventario | Registrar o estado real de Admin, Client, backend e shared-core; preservar separacao de mudancas locais. | Mapa de telas e limites conhecido. |
| 16/09 | Montar Box: escopo | Auditar a tela atual, sua referencia visual e cada dado que ela precisa; listar o contrato minimo sem criar UI paralela. | Plano da tela e checklist de aceite Montar Box. |
| 17/09 | Montar Box: contrato | Fechar snapshot de checkout, endereco self-service, frete/prazo e pagamento somente no nivel necessario. | API, seed e testes do contrato real. |
| 18/09 | Montar Box: Web e Mobile | Trocar fallback por API, mapper, hook e view-model nos dois runtimes; tratar loading, erro e vazio. | Sem fallback silencioso em Web e Mobile. |
| 19/09 | Montar Box: acabamento | Fazer QA visual e funcional de desktop/mobile, finalizar pedido e publicar o corte isolado. | Pedido real criado e checklist da tela aprovado. |
| 20/09 | Meus Pedidos: auditoria | Conferir dados, estados, timeline e detalhe contra o pedido criado no dia anterior. | Mapa de gaps de dados e interface. |
| 21/09 | Meus Pedidos: tela | Refinar Web/Mobile com dados reais, feedback e responsivo; corrigir contrato apenas se o fluxo provar necessidade. | Cliente encontra e abre seu pedido real. |
| 22/09 | Meus Pedidos: QA | Validar estados de pedido, pagamento e entrega; consolidar a tela antes de abrir Perfil. | QA de fluxo e visual concluido. |
| 23/09 | Perfil: auditoria e contrato | Mapear dados de conta e enderecos; implementar somente APIs/shared-core ausentes para a tela. | Contrato de Perfil e estados de erro definidos. |
| 24/09 | Perfil: tela | Construir/refinar Perfil em Web e Mobile com locale, Foundation e dados reais. | Perfil funcional e responsivo. |
| 25/09 | Home: estrutura | Definir a composicao da Home a partir dos dados e acoes ja reais, sem criar regra comercial local. | Configuracao e view-model da Home definidos. |
| 26/09 | Home: tela | Implementar/refinar Home em Web e Mobile e validar a navegacao para Catalogo, Montar Box, Pedidos e Perfil. | Jornada autenticada navegavel. |
| 27/09 | Landing: auditoria | Revisar a Landing existente, manifesto, assets, locale e hierarquia contra a referencia antes de mudar componentes. | Plano visual e de extracao, se houver, aprovado. |
| 28/09 | Landing: tela | Refinar a Landing pelo manifesto e SectionContainer, sem shell local ou copy hardcoded. | Landing responsiva e navegavel. |
| 29/09 | Integracao e release candidate | Executar a jornada publica e autenticada: Landing, Home, Catalogo, Montar Box, Pedidos e Perfil; tratar apenas regressao. | Roteiro completo e lista de correcoes. |
| 30/09 | Entrega V1 | QA final, publicacao dos cortes aprovados, handoffs e backlog de melhorias de outubro. | Demonstracao, checklist final e commits separados. |

## Disciplina de execucao

Cada dia deve encerrar com uma decisao simples:

```text
feito e demonstrado
ou
nao feito, com bloqueio, dono e proximo passo claros
```

Nao deslocar uma pendencia silenciosamente para o dia seguinte. Se uma tarefa
de backend alterar contrato, o mesmo dia precisa listar o impacto esperado em
shared-core, Web, Mobile e Admin. Se uma melhoria exigir capacidade nova de
Foundation, AppShell, builder-shared ou ServiceOS, ela deve ser proposta e
aprovada antes da implementacao, conforme os contratos ativos.

## Checklist de aceite da V1

- [ ] Catalogo esta validado com dados reais em desktop e Web mobile.
- [ ] Montar Box nao usa fallback silencioso e finaliza pedido real.
- [ ] Meus Pedidos mostra o pedido criado e seus estados reais.
- [ ] Perfil funciona com os dados e enderecos permitidos ao cliente.
- [ ] Home conecta as quatro telas autenticadas sem navegar para fluxos mortos.
- [ ] Landing apresenta a jornada publica e leva ao acesso/portal correto.
- [ ] Backend e shared-core foram alterados apenas onde uma tela precisou de
  contrato, dado ou acao real.
- [ ] Fluxo Client completo foi testado com backend e seed, nao apenas com mock.
- [ ] `npm run build:client`, `npm run build:admin`, validacoes backend e
  `git diff --check` passam, ou cada bloqueio preexistente esta documentado.
- [ ] QA visual foi feito em desktop e web mobile; a paridade Native foi
  comprovada no runtime disponivel ou registrada como limitacao concreta.
- [ ] Copy nova usa locales ativos, icones usam Foundation e screens mantem
  render-only sem regra de negocio local.
- [ ] Mudancas de Admin e Client foram publicadas em cortes separados.

## Pos-V1: ciclo de melhorias

Depois da entrega, priorizar a melhoria a partir de evidencia do uso real:

1. corrigir pendencias encontradas na homologacao;
2. aperfeicoar hierarquia visual, densidade e responsivo das telas ja
   operacionais;
3. amadurecer assinatura recorrente e ciclos da Royal Box;
4. ampliar o Admin por operacao comprovada, incluindo detalhes e comandos que
   ainda nao existem para Entregas, Usuarios e Estoque;
5. avaliar gateway real apenas quando pagamento manual e status estiverem
   estaveis;
6. promover uma capacidade para Foundation, AppShell ou ServiceOS somente se
   houver reuso comprovado por mais de um consumidor.
