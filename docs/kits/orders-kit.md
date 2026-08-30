# Orders Kit

Status atual: `local foundation`

Fase principal: Fase 5A - Orders Foundation

## 1. Objetivo

Criar pedidos operacionais por organization, conectados a cliente, endereco,
catalogo, assinatura opcional e estoque simples.

O kit cobre:

```text
tipo de pedido por seed/config
status workflow por seed/config
codigo sequencial por organization
itens vindos do Catalog
preco calculado no backend
reserva simples de estoque
delivery automatico quando configurado
historico imutavel de status
```

## 2. Produtos Que Podem Reutilizar

Este kit serve para:

```text
ecommerce fisico
delivery simples
loja com retirada futura
assinatura que gera pedido por ciclo
servico com ordem operacional simples
```

Exemplos:

```text
Royal Carnes -> delivery de carnes
BikeClub -> ordem de manutencao ou entrega
CamisaClub -> pedido de roupa
```

## 3. Escopo Backend

Arquivos fonte:

```text
backend/apps/orders/models.py
backend/apps/orders/services.py
backend/apps/orders/selectors.py
backend/apps/orders/serializers.py
backend/apps/orders/views.py
backend/apps/orders/urls.py
backend/apps/orders/tests/test_api.py
backend/apps/core/code_sequences.py
backend/apps/core/seed_loader.py
backend/seeds/**/kits/orders.seed.json
```

Entidades:

```text
OrderKindDefinition
OrderStatusDefinition
Order
OrderItem
OrderStatusHistory
CodeSequence
```

Services/use-cases:

```text
upsert_order_kind
upsert_order_status
create_order
transition_order_status
resolve_product_price
generate_code
```

Endpoints:

```text
GET  /api/v1/orders/config/
GET  /api/v1/orders/me/
POST /api/v1/orders/me/
GET  /api/v1/orders/me/:id/
GET  /api/v1/orders/admin/orders/
POST /api/v1/orders/admin/orders/
GET  /api/v1/orders/admin/orders/:id/
POST /api/v1/orders/admin/orders/:id/transition/
```

Permissoes:

```text
orders.read
orders.manage
```

Regras reais:

```text
Order pertence a organization.
Customer e Address precisam pertencer a mesma organization.
Tipo de pedido vem de OrderKindDefinition.
Status inicial vem de OrderStatusDefinition.
Transicao de status usa allowedNextKeys.
Codigo vem de CodeSequence por organization.
Product/Variant/MeasurementUnit vem do Catalog.
Preco e subtotal sao calculados no backend.
Quando requiresInventory=true, o backend reserva estoque no create_order.
Quando createsDelivery=true, o backend cria Delivery inicial no create_order.
```

## 4. Escopo Shared-Core

Shared-core fechado no Kit 05 para o backend atual.

Global minimo:

```text
frontend/shared-core/types/orders.types.ts
frontend/shared-core/contracts/orders.contract.ts
```

Client runtime:

```text
frontend/client/shared-core/contracts/orders.contract.ts
frontend/client/shared-core/api/orders.api.ts
frontend/client/shared-core/hooks/useClientOrders.ts
frontend/client/shared-core/hooks/useClientOrderDetail.ts
frontend/client/shared-core/hooks/useClientOrderForm.ts
frontend/client/shared-core/mappers/orders.mapper.ts
frontend/client/shared-core/view-models/orders.view-model.ts
```

Admin runtime:

```text
frontend/admin/shared-core/contracts/orders.contract.ts
frontend/admin/shared-core/api/orders.api.ts
frontend/admin/shared-core/hooks/useAdminOrders.ts
frontend/admin/shared-core/hooks/useAdminOrderDetail.ts
frontend/admin/shared-core/hooks/useAdminOrderTransition.ts
frontend/admin/shared-core/hooks/useAdminOrderForm.ts
frontend/admin/shared-core/mappers/orders.mapper.ts
frontend/admin/shared-core/view-models/orders.view-model.ts
```

Regras de preco, status, reserva de estoque e delivery continuam no backend.

## 5. Escopo Render

Ainda nao existe tela render de orders conectada a API.

Quando entrar UI:

```text
cliente cria pedido sem calcular regra local
cliente lista e abre seus pedidos
admin filtra pedidos por status/tipo/data
admin muda status usando endpoint
tela renderiza labels recebidas de config/API
```

## 6. O Que E Generico

```text
OrderKindDefinition por organization
OrderStatusDefinition por organization
CodeSequence por organization
Catalog como origem de produto/variant/preco
Inventory opcional via requiresInventory
Subscription opcional como origem de pedido
historico de status auditavel
```

## 7. O Que E Especifico Do RoyalPrime

```text
label Royal Delivery
prefixo RP
status recebido/aprovado/separando/pronto/concluido
produtos como Picanha, Ancho e Carvao
copy operacional futura
```

Nada disso deve virar branch no backend.

## 8. Como Copiar/Adaptar

1. Copiar app `orders` junto com dependencias de `core`, `organizations`,
   `accounts`, `customers`, `catalog` e `inventory`.
2. Criar `orders.seed.json` com tipos, status e sequencias do novo dominio.
3. Garantir permissoes `orders.read` e `orders.manage` nos roles operacionais.
4. Adaptar Catalog/MeasurementUnit/ProductPrice antes de criar pedidos.
5. Manter regra no service, nao na tela.

## 9. Seeds Esperados

Seed principal:

```text
backend/seeds/royalprime/kits/orders.seed.json
```

Seeds de prova:

```text
backend/seeds/examples/bikeclub/kits/orders.seed.json
backend/seeds/examples/camisaclub/kits/orders.seed.json
backend/seeds/tests/kits/orders.seed.json
```

## 10. Criterio Para Kit-Ready

```text
app backend implementado
seed royalprime aplica code sequence, tipos e status
seeds alternativos provam workflows diferentes
API cliente/admin documentada
testes cobrem criacao, permissao, transicao e reserva de estoque
shared-core cliente/admin criado quando a UI real entrar
```

## 11. Criterio Para ServiceOS Candidate

So considerar depois que outro produto real usar Orders com status/tipos
diferentes do RoyalPrime.

Antes disso, Orders continua RoyalPrime-local com arquitetura copiavel.
