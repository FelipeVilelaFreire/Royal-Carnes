# Fulfillment & Delivery Kit

Status atual: `local foundation`

Fase principal: Fase 5B - Delivery Basico

## 1. Objetivo

Controlar a entrega simples de um pedido, incluindo a promessa de prazo,
sem scheduling, recorrencia,
roteirizacao ou app de entregador nesta fase.

O kit cobre:

```text
delivery criado a partir de pedido existente
status logistico por seed/config
codigo sequencial por organization
snapshot de endereco
pacotes simples
historico imutavel de status
confirmacao de entrega
politicas de prazo por organization, tipo de pedido e plano
```

## 2. Produtos Que Podem Reutilizar

Este kit serve para:

```text
delivery simples
retirada futura com status logistico
ecommerce fisico com entrega manual
servico que precisa de confirmacao operacional
```

Exemplos:

```text
Royal Carnes -> entrega de pedido
BikeClub -> envio/recebimento de bike ou item
CamisaClub -> envio de roupa
```

## 3. Escopo Backend

Arquivos fonte:

```text
backend/apps/deliveries/models.py
backend/apps/deliveries/services.py
backend/apps/deliveries/selectors.py
backend/apps/deliveries/serializers.py
backend/apps/deliveries/views.py
backend/apps/deliveries/urls.py
backend/apps/deliveries/tests/test_api.py
backend/apps/core/code_sequences.py
backend/apps/core/seed_loader.py
backend/seeds/**/kits/deliveries.seed.json
```

Entidades:

```text
DeliveryStatusDefinition
DeliveryPromisePolicy
Delivery
DeliveryPackage
DeliveryStatusHistory
DeliveryConfirmation
CodeSequence
```

Services/use-cases:

```text
upsert_delivery_status
create_delivery_for_order
resolve_delivery_promise_policy
transition_delivery_status
confirm_delivery
generate_code
```

Endpoints:

```text
GET  /api/v1/deliveries/config/
GET  /api/v1/deliveries/me/
GET  /api/v1/deliveries/me/:id/
GET  /api/v1/deliveries/admin/deliveries/
GET  /api/v1/deliveries/admin/promise-policies/
POST /api/v1/deliveries/admin/promise-policies/
GET  /api/v1/deliveries/admin/promise-policies/:id/
PUT  /api/v1/deliveries/admin/promise-policies/:id/
POST /api/v1/deliveries/admin/deliveries/
GET  /api/v1/deliveries/admin/deliveries/:id/
POST /api/v1/deliveries/admin/deliveries/:id/transition/
POST /api/v1/deliveries/admin/deliveries/:id/confirm/
```

Permissoes:

```text
deliveries.read
deliveries.manage
```

Regras reais:

```text
Delivery pertence a organization.
Delivery nasce de Order existente da mesma organization.
Order pode criar Delivery automaticamente quando seu tipo define createsDelivery.
Customer e Address sao herdados do pedido.
Status inicial espelha o status do Pedido em DeliveryStatusDefinition.
Nao existe transicao propria: a Entrega acompanha toda alteracao de status do
Pedido vinculado.
Codigo vem de CodeSequence por organization.
Confirmacao registra evidencia logistica; nao muda o status do Pedido ou da
Entrega.
DeliveryPromisePolicy pertence a organization e declara minimo/maximo de dias
uteis, antecedencia do alerta e os tipos de pedido/planos aos quais se aplica.
Ao criar a Entrega, o backend resolve plano especifico, depois tipo de pedido,
depois politica padrao da organization; grava o snapshot para que mudancas
futuras nao alterem uma promessa existente.
Situacoes No prazo, Proximo do prazo, Vence hoje e Atrasado sao calculadas pelo
backend a partir da promessa e da data atual. Resultado de status terminal
vem de metadata do catalogo de status seedado, nunca de nomes fixos no codigo.
```

## 4. Escopo Shared-Core

Shared-core fechado no Kit 06 para o backend atual.

Global minimo:

```text
frontend/shared-core/types/deliveries.types.ts
frontend/shared-core/contracts/deliveries.contract.ts
```

Client runtime:

```text
frontend/client/shared-core/contracts/deliveries.contract.ts
frontend/client/shared-core/api/deliveries.api.ts
frontend/client/shared-core/hooks/useClientDeliveries.ts
frontend/client/shared-core/hooks/useClientDeliveryDetail.ts
frontend/client/shared-core/mappers/deliveries.mapper.ts
frontend/client/shared-core/view-models/deliveries.view-model.ts
```

Admin runtime:

```text
frontend/admin/shared-core/contracts/deliveries.contract.ts
frontend/admin/shared-core/api/deliveries.api.ts
frontend/admin/shared-core/hooks/useAdminDeliveries.ts
frontend/admin/shared-core/hooks/useAdminDeliveryDetail.ts
frontend/admin/shared-core/hooks/useAdminDeliveryTransition.ts
frontend/admin/shared-core/hooks/useAdminDeliveryConfirm.ts
frontend/admin/shared-core/hooks/useAdminDeliveryForm.ts
frontend/admin/shared-core/mappers/deliveries.mapper.ts
frontend/admin/shared-core/view-models/deliveries.view-model.ts
```

Regras de workflow, confirmacao, permissao e scheduling continuam no backend.

## 5. Escopo Render

Ainda nao existe tela render de deliveries conectada a API.

Quando entrar UI:

```text
cliente acompanha status publico da entrega
admin muda status logistico
admin confirma entrega
tela renderiza labels vindas de config/API
```

## 6. O Que E Generico

```text
DeliveryStatusDefinition por organization
DeliveryPromisePolicy por organization
CodeSequence por organization
Delivery ligado a Order
snapshot de endereco
historico de status auditavel
confirmacao configurada por effect
```

### Politica de prazo

```text
DeliveryPromisePolicy
  key / name
  min_business_days / max_business_days
  approaching_business_days
  order_kind_keys[]
  subscription_plan_keys[]
  is_default / is_active / sort_order
```

Uma policy nao conhece Royal Box, carne, camisa ou outra marca. Ela recebe
aplicacoes configuradas por chaves que pertencem a mesma organization. A
prioridade de resolucao e deliberada e auditavel:

```text
plano de assinatura declarado na policy
  -> tipo de pedido declarado na policy
  -> policy padrao ativa da organization
  -> sem promessa quando nenhuma policy se aplica
```

No momento da criacao, a Delivery salva `startsOn`, `byOn`, policyKey, policyId,
faixa e antecedencia de alerta em `delivery_promise_snapshot`. Esse snapshot e
historico: editar uma policy muda apenas entregas futuras.

O catalogo de `DeliveryStatusDefinition` tambem pode declarar
`metadata.deliveryPromiseOutcome` como `fulfilled` ou `closed`. Assim a regra
de situacao respeita o fluxo de cada empresa, inclusive BikeClub e CamisaClub,
sem listar status RoyalPrime no service.

No Admin, a rota `Politicas de entrega` usa a tela standard existente. Ela
permite cadastrar a policy, definir faixa, alerta, tipos de pedido, planos,
ordem, ativacao e o fallback da organization. O Admin nao calcula datas nem
altera promessas ja emitidas.

Para historico sem promessa, o comando seguro e primeiro executado em previa:

```bash
py manage.py backfill_delivery_promises --organization-slug royalprime
py manage.py backfill_delivery_promises --organization-slug royalprime --execute
```

Ele atua somente em Deliveries sem `promised_delivery_by_on` e nunca reescreve
uma promessa ja emitida. Antes do `--execute`, a organization precisa ter suas
policies cadastradas (pelo seed ou Admin).

## 7. O Que E Especifico Do RoyalPrime

```text
prefixo DEL
labels como pendente, separando e saiu para entrega
copy operacional futura
rotina manual da loja atual
```

Nada disso deve virar branch no backend.

## 8. Como Copiar/Adaptar

1. Copiar app `deliveries` junto com dependencias de `core`, `organizations`,
   `accounts`, `customers` e `orders`.
2. Criar `deliveries.seed.json` com status, sequencia e politicas iniciais do
   novo dominio. Seed fornece defaults; cada organization pode administrar suas
   politicas no Admin sem branch por marca/produto.
3. Garantir permissoes `deliveries.read` e `deliveries.manage`.
4. Manter scheduling/recorrencia fora deste kit ate haver necessidade real.
5. Manter regra no service, nao na tela.

## 9. Seeds Esperados

Seed principal:

```text
backend/seeds/royalprime/kits/deliveries.seed.json
```

Seeds de prova:

```text
backend/seeds/examples/bikeclub/kits/deliveries.seed.json
backend/seeds/examples/camisaclub/kits/deliveries.seed.json
backend/seeds/tests/kits/deliveries.seed.json
```

## 10. Criterio Para Kit-Ready

```text
app backend implementado
seed royalprime aplica code sequence e status logisticos
seed royalprime aplica politicas de entrega e exemplos alternativos podem
declarar prazos diferentes
seeds alternativos provam workflows diferentes
API cliente/admin documentada
testes cobrem criacao, permissao, transicao e confirmacao
shared-core cliente/admin criado quando a UI real entrar
```

## 11. Criterio Para ServiceOS Candidate

So considerar depois que outro produto real usar Delivery com fluxo diferente.

Scheduling, recorrencia e Royal Box recorrente pertencem a um kit separado.
O desenho inicial esta em
`backend/ROYAL_BOX_RECURRING_DESIGN.md`: ele prepara ciclos por comando
idempotente e cron externo, mas preserva Pedido como dono da operacao e Entrega
como espelho logistico. Nao introduzir job, fila ou agendamento visual no
Delivery basico antes das entidades de Box e de seus testes existirem.
