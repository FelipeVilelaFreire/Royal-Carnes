# Scheduling & Recurrence Kit

Status atual: `local foundation`

Posicao: Kit 08 - capacidade transversal de tempo, ocorrencias e recorrencia.

## 1. Objetivo

Fornecer uma base de backend para transformar uma regra temporal em ocorrencias
auditaveis e idempotentes. O kit nao pertence a Royal Box: ele pode abrir o
ciclo mensal de uma assinatura, preparar uma caixa recorrente, disponibilizar
horarios de barbearia ou agendar uma retirada.

```text
regra temporal
  -> ocorrencia concreta em um instante/fuso
  -> acao de dominio responsavel
  -> efeito no dominio (pedido, reserva, appointment, notificacao)
```

## 2. Limite de Responsabilidade

Scheduling sabe **quando** uma ocorrencia deve existir e garante que ela nao
seja criada duas vezes. O dominio consumidor sabe **o que** ela significa.

```text
Scheduling
  -> timezone, frequencia, data devida, cutoff, pausa, reexecucao, auditoria

Orders
  -> cria pedido, calcula preco e reserva estoque

Payments
  -> cobra ou confirma pagamento

Deliveries
  -> acompanha a logistica derivada de um pedido

Appointments
  -> dono futuro de profissional, recurso, conflito de agenda e presenca
```

Assim, uma agenda de barbearia nao vira uma falsa entrega e uma Royal Box nao
vira um appointment. Ambas apenas usam a mesma disciplina de ocorrencia,
timezone e idempotencia.

## 3. Produtos que Podem Reutilizar

```text
RoyalPrime       -> ciclo de assinatura e Royal Box mensal
Barbearia        -> slots e reservas de servico
Clinica          -> consulta, profissional e lembrete
Restaurante      -> reserva de mesa ou retirada agendada
Loja fisica      -> janela de retirada
BikeClub         -> manutencao recorrente ou retirada de bicicleta
```

O produto veste a capacidade com seed/config, definindo labels, regras de
frequencia, janelas e a acao de dominio. Nenhuma regra decide por nome de
produto, tipo de carne ou organizacao.

## 4. Modelo de Dominio Alvo

O primeiro corte deve manter o nucleo pequeno e referencialmente seguro:

```text
Schedule
  -> organization, key, timezone, status, recurrence_rule, cutoff_rule

ScheduleOccurrence
  -> schedule, occurrence_key, scheduled_for, status, snapshot, executed_at
  -> unique(schedule, occurrence_key)

Domain adapter
  -> recebe ScheduleOccurrence
  -> valida contexto do proprio dominio
  -> executa seu service transacional idempotente
```

`occurrence_key` e a chave deterministica da ocorrencia, por exemplo
`2026-10` para uma caixa mensal ou `2026-10-02T10:30:00+02:00` para um horario
de servico. Ela evita duplicacao mesmo que o comando, o servidor ou o cron
sejam executados novamente.

O nucleo nao deve usar `GenericForeignKey` para apontar livremente para qualquer
modelo. Cada adaptador de dominio deve validar e manter sua propria relacao
forte: `BoxCycle -> ScheduleOccurrence`, `SubscriptionCycle ->
ScheduleOccurrence` ou, no futuro, `Appointment -> ScheduleOccurrence`.

## 5. Recorrencia e Agenda nao Sao a Mesma Coisa

```text
Recorrencia
  -> uma regra gera ciclos futuros previsiveis
  -> exemplo: todo dia 10 preparar a Royal Box

Agenda / disponibilidade
  -> regras oferecem horarios; uma reserva disputa recurso e horario
  -> exemplo: barbeiro A disponivel das 09:00 as 18:00

Appointment
  -> confirma uma pessoa, servico, recurso e slot especifico
```

O Kit 08 pode materializar os slots ou ocorrencias. O futuro dominio de
`appointments` continua dono de conflito de profissionais, cadeira/sala,
duracao, no-show e remarcacao. Isso evita um "scheduler" grande demais que
finge conhecer todos os negocios.

## 6. Escopo Backend Atual

Nucleo temporal implementado, ainda sem adaptador comercial publicado:

```text
backend/apps/scheduling/models.py
backend/apps/scheduling/services.py
backend/apps/scheduling/selectors.py
backend/apps/scheduling/management/commands/run_schedules.py
backend/apps/scheduling/tests/
backend/apps/scheduling/migrations/0001_initial.py
backend/apps/boxes/models.py
backend/apps/boxes/services.py
```

Services esperados:

```text
ensure_occurrence(schedule, at)
pause_schedule(schedule)
resume_schedule(schedule)
cancel_future_occurrences(schedule)
run_due_schedules(at)
execute_occurrence(occurrence)
```

Regras obrigatorias:

```text
- todo Schedule pertence a uma organization;
- o instante recebido pelo job e UTC; a regra e avaliada no timezone do Schedule;
- reexecucao retorna a mesma ocorrencia, nunca duplica efeito;
- pausa/cancelamento so impede futuro, nao reescreve historico;
- cutoff congela o snapshot que o dominio precisar;
- um adaptador falho registra falha auditavel e pode ser retomado com seguranca;
- cron apenas chama o comando; nao contem regra de negocio.
```

O primeiro executor e um comando Django deterministico:

```text
manage.py run_schedules --at <timestamp UTC>
manage.py run_schedules --at <timestamp UTC> --execute
```

Sem `--execute`, ele somente materializa ocorrencias. Com `--execute`, chama
apenas adaptadores de dominio registrados. Infraestrutura
(cron, worker ou scheduler gerenciado) apenas o dispara. Celery
ou fila entram somente quando houver volume, retentativas assincronas ou mais
de um executor que justifiquem essa infraestrutura.

## 7. Aplicacao Inicial no RoyalPrime

RoyalPrime possui o primeiro consumidor, sem contaminar o nucleo:

```text
SubscriptionSchedule adapter
  -> abre/fecha SubscriptionCycle conforme regra do plano

RoyalBoxSchedule adapter (implementado)
  -> cria BoxCycle com snapshot mensal de itens, preco e endereco
  -> aguarda pagamento confirmado
  -> chama Orders para criar um unico pedido
```

O segundo adaptador esta detalhado em
[Royal Box recorrente](../../backend/ROYAL_BOX_RECURRING_DESIGN.md). Pedido
continua o dono da operacao; Entrega continua espelho logistico do Pedido.
`SubscriptionSchedule` permanece pendente. `RoyalBoxSchedule` executa por
`royal_box.prepare`: com politica `payment_confirmed`, prepara o ciclo e
aguarda confirmacao; com `immediate`, cria o Pedido e a Entrega derivada.

## 8. Escopo Shared-Core e Render

Nenhum hook, tela ou calendario deve nascer antes de endpoint real.

Quando o backend publicar contratos:

```text
frontend/shared-core/types/scheduling.types.ts
frontend/shared-core/contracts/scheduling.contract.ts
frontend/client/shared-core/{contracts,api,hooks,mappers,view-models}/scheduling.*
frontend/admin/shared-core/{contracts,api,hooks,mappers,view-models}/scheduling.*
```

O Admin configura e acompanha regras/ocorrencias. O Client apenas visualiza ou
altera aquilo que o dominio permitir, como pausar uma caixa ou reservar um
horario. A tela nao calcula slots disponiveis, proximo ciclo ou cutoff.

## 9. Seeds de Prova

```text
RoyalPrime
  -> Royal Box mensal dia 10, Europe/Berlin, com uma ocorrencia preparada

Barbearia de exemplo
  -> profissional com regra semanal e um slot materializado

BikeClub de exemplo
  -> manutencao mensal com ocorrencia pendente
```

Esses exemplos devem provar que a capacidade e temporal, nao comercial. A
barbearia so entra como seed/teste quando o dominio Appointment existir; nao
criar um seed sem entidade real apenas para parecer generico.

## 10. Criterio Para Kit-Ready

```text
- backend possui Schedule e ScheduleOccurrence com constraints reais;
- comando aceita --at e cobre timezone em teste;
- duas execucoes criam uma unica ocorrencia e um unico efeito de dominio;
- RoyalPrime possui ao menos SubscriptionSchedule e RoyalBoxSchedule reais;
- seeds demonstram regras diferentes sem branch por organization;
- shared-core consome endpoints publicados; render nao cria regra local;
- erro, pausa, cancelamento e retomada possuem auditoria e teste.
```

## 11. Criterio Para ServiceOS Candidate

Somente apos um segundo produto real usar o contrato. Se RoyalPrime e uma
barbearia precisarem da mesma ocorrencia, timezone e idempotencia, o nucleo
tem candidato a ServiceOS. As regras de pedido, caixa, profissional, recurso e
pagamento permanecem nos dominios de cada produto.
