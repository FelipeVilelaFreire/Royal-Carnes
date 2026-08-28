# Fulfillment & Delivery Kit

Status atual: `local foundation`

Fase principal: Fase 5B - Delivery Basico

## 1. Objetivo

Controlar a entrega simples de um pedido, sem scheduling, recorrencia,
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
Status inicial vem de DeliveryStatusDefinition.
Transicao de status usa allowedNextKeys.
Codigo vem de CodeSequence por organization.
Confirmacao pode mover para status terminal configurado por effect.
```

## 4. Escopo Shared-Core

Ainda nao existe shared-core de deliveries.

Quando houver frontend real, criar primeiro em:

```text
frontend/client/shared-core
  -> cliente acompanha suas entregas

frontend/admin/shared-core
  -> admin lista, atualiza e confirma entregas
```

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
CodeSequence por organization
Delivery ligado a Order
snapshot de endereco
historico de status auditavel
confirmacao configurada por effect
```

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
2. Criar `deliveries.seed.json` com status e sequencia do novo dominio.
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
seeds alternativos provam workflows diferentes
API cliente/admin documentada
testes cobrem criacao, permissao, transicao e confirmacao
shared-core cliente/admin criado quando a UI real entrar
```

## 11. Criterio Para ServiceOS Candidate

So considerar depois que outro produto real usar Delivery com fluxo diferente.

Scheduling, recorrencia e Royal Box recorrente devem nascer como kit separado
quando a necessidade estiver melhor estudada.
