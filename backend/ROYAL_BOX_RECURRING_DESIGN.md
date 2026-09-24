# Royal Box recorrente

Status: backend foundation implementada. Nao declara API Client, cron de
infraestrutura ou cobranca automatica como prontos.

Este e o adaptador RoyalPrime do
[Scheduling & Recurrence Kit](../docs/kits/scheduling-recurrence-kit.md). O
kit e generico; BoxSubscription e BoxCycle continuam entidades comerciais
proprias desta modalidade.

## Decisao

Royal Box e uma modalidade recorrente de caixa fixa, diferente de:

```text
Assinatura de plano -> cliente seleciona itens dentro de capacidades
Royal Box            -> itens ja definidos por uma caixa
Royal Delivery       -> pedido avulso sem recorrencia
```

O modelo `Subscription` existente continua pertencendo a planos e capacidades.
Ele exige `Plan` e seus ciclos registram escolhas do cliente. Nao deve receber
uma caixa fixa por meio de um plano artificial. Royal Box ganha suas entidades
proprias e reutiliza somente o fluxo operacional de Pedido e Entrega.

## Modelo alvo

```text
BoxTemplate
  -> caixa configurada pelo Admin: nome, preco, status e itens atuais

BoxTemplateItem
  -> produto, variante e quantidade que compoem a caixa

BoxSubscription
  -> cliente, BoxTemplate, endereco, dia mensal, timezone e status

BoxCycle
  -> ocorrencia concreta de uma BoxSubscription em um mes
  -> data prevista, snapshot dos itens, preco/currency snapshot e status

Order
  -> no maximo um Order por BoxCycle

Delivery
  -> nasce do Order e espelha seu status
```

Uma mudanca posterior no `BoxTemplate` afeta apenas ciclos futuros. O
`BoxCycle` guarda o snapshot para que Pedido, preco e itens de outubro nao
mudem quando a caixa for editada em novembro.

## Cardinalidade e idempotencia

```text
1 BoxTemplate      -> N BoxSubscriptions
1 BoxSubscription  -> N BoxCycles
1 BoxCycle         -> 0..1 Orders
1 Order            -> 0..1 Delivery no V1
```

O banco deve impor unicidade para `organization + box_cycle` em `Order`. O
servico gerador tambem deve travar o ciclo e retornar o mesmo pedido quando
for executado novamente. Rodar o agendador duas vezes nunca pode duplicar
ciclo, reserva, pedido ou entrega.

## Ciclo mensal V1

Para a primeira versao, a recorrencia e mensal e o dia permitido e de 1 a 28.
Isso evita regras implicitas para fevereiro e meses menores.

```text
ativa
  -> ciclo planejado
  -> cutoff de edicao
  -> aguardando pagamento ou confirmacao
  -> pedido criado
  -> entrega em operacao
  -> concluido | falhou | pulado
```

Endereco, dia mensal ou caixa alterados depois do cutoff valem apenas para o
proximo ciclo. Pausar ou cancelar impede geracao futura, sem reescrever
ciclos/pedidos ja existentes.

## Pedido e pagamento

Enquanto nao houver cobranca recorrente automatica, um BoxCycle nao cria Order
imediatamente. Primeiro fica aguardando pagamento ou confirmacao operacional.
Depois disso, um service transacional:

```text
trava BoxCycle
  -> confirma que esta elegivel e ainda nao possui Order
  -> valida estoque com os itens do snapshot
  -> cria Order kind royal-box
  -> reserva estoque
  -> cria Delivery
  -> vincula Order ao BoxCycle
```

Sem pagamento confirmado, nao existe reserva de estoque. Se algum item nao
estiver disponivel, o ciclo falha sem criar pedido parcial.

## Scheduling: primeira implementacao segura

Hoje nao existe scheduler no backend. A primeira versao nao precisa introduzir
Celery, fila ou um servico paralelo: nasce como comando Django idempotente,
executado diariamente por um cron da infraestrutura.

```text
cron da infraestrutura
  -> manage.py run_recurring_boxes --at <timestamp UTC>
  -> converte o instante para o timezone de cada organization
  -> localiza BoxSubscriptions ativas com ciclo devido
  -> ensure_box_cycle(...)
  -> cria ou retorna o mesmo BoxCycle
```

O comando sem `--execute` apenas prepara ciclos e snapshots. Com `--execute`,
a politica da adesao decide: `payment_confirmed` aguarda confirmacao e chama
`create_order_for_box_cycle`; `immediate` cria no maximo um Pedido e sua
Entrega derivada. A recorrencia fica na adesao, nunca no Pedido.

Regras do scheduler V1:

```text
dia mensal       -> 1..28
timezone         -> timezone da organization
horizonte        -> cria somente o ciclo do mes devido
reexecucao       -> nao duplica BoxCycle
pausada/cancelada -> nao cria ciclo futuro
cutoff            -> congela snapshot; mudancas valem no proximo ciclo
```

O comando precisa aceitar `--at` para teste deterministico. O cron so dispara
o comando; a regra de negocio, idempotencia e tenant continuam no service.

## Operacao automatica na nuvem

O ciclo nao deve depender de alguem abrir Admin ou Client. Ha duas entradas
aceitas para o mesmo service de dominio:

```text
Antes do gateway
  -> scheduler gerenciado da hospedagem chama run_schedules diariamente
  -> custo baixo e configuracao unica de infraestrutura
  -> backend prepara BoxCycle e, se a politica for immediate, cria o Pedido

Com gateway recorrente
  -> webhook autenticado informa Payment pago
  -> payment.metadata.boxCycleId identifica o ciclo
  -> create_order_for_paid_box_payment chama create_order_for_box_cycle
  -> a mesma protecao retorna o Pedido existente em repeticao de webhook
```

Nao criar ciclo por leitura de tela: se ninguem acessar o produto, a operacao
nao pode atrasar. O gateway ainda nao possui webhook publicado; o adapter
transacional existe para ser chamado quando esse contrato for integrado.

## Contexto no detalhe administrativo do Pedido

Para Pedido ligado a `BoxCycle`, a aba `Royal Box` do detalhe mostra caixa,
ciclo, data prevista, status do ciclo e politica de criacao. Esses campos sao
somente contexto recorrente: o status operacional continua pertencendo ao
Pedido e a Entrega permanece derivada dele.

## Caminho de implementacao

1. Models, migration e services para Template, Subscription e Cycle de Box.
2. Restricao unica de `Order.box_cycle` e criacao idempotente do pedido.
3. Seed com uma caixa recorrente e um ciclo de exemplo.
4. Endpoints Admin para configurar caixas e assinaturas de caixa.
5. Comando `run_recurring_boxes` idempotente e testes com `--at`.
6. Cron diario da infraestrutura, usando timezone da organization no service.
7. Endpoint Client para aderir, pausar e acompanhar a Royal Box.
8. Integracao Web/Native e homologacao ponta a ponta.

## Testes obrigatorios

- duas execucoes do agendador geram um unico ciclo mensal;
- um ciclo gera no maximo um pedido e uma entrega;
- snapshot nao muda quando o template e editado;
- pausa/cancelamento nao geram o proximo ciclo;
- estoque indisponivel nao deixa reserva ou pedido parcial;
- endereco/dia alterados apos cutoff so afetam o proximo ciclo;
- tenant, cliente, template e endereco sempre pertencem a mesma organization.
- timezone, dia 28 e reexecucao do comando produzem o ciclo correto.
