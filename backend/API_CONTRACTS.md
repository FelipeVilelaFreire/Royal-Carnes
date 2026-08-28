# RoyalPrime API Contracts

Este documento registra o contrato inicial da API.

Regra:

```text
frontend -> shared-core/api -> Django API -> services/selectors -> banco
```

O frontend nao acessa Supabase diretamente para regra de negocio.

## Base

```text
Base path: /api/v1
Formato: JSON
Auth: JWT com access/refresh
Erros: devem retornar codigo/chave tecnica, nao copy final de UI
```

## Tenant Context

Toda request pode informar a organization ativa por header:

```text
X-Organization-Slug: royalprime
```

Se o header nao vier, o backend usa a organization default local:

```text
royalprime
```

Regra:

```text
views usam request.organization
permissions validam o user dentro de request.organization
frontend nao envia organizationId solto em payload para regra de negocio
```

Auth atual:

```text
JWT via djangorestframework-simplejwt
access token para chamadas autenticadas
refresh token para renovar sessao
```

## Endpoints Atuais

### GET /api/v1/health/

Objetivo:

```text
validar que o Django API esta respondendo
```

Auth:

```text
publico
```

Response:

```json
{
  "status": "ok",
  "service": "royalprime-api"
}
```

### GET /api/v1/organizations/default/

Objetivo:

```text
garantir/retornar a organization padrao local RoyalPrime
```

Auth:

```text
publico por enquanto
```

Observacao:

Este endpoint e temporario de scaffold. O seed definitivo deve virar comando
ou rotina controlada antes de producao.

Response:

```json
{
  "id": 1,
  "slug": "royalprime",
  "name": "RoyalPrime",
  "business_name": "Royal Carnes",
  "status": "active",
  "default_locale": "pt-BR",
  "timezone": "America/Sao_Paulo",
  "currency": "BRL"
}
```

### GET /api/v1/accounts/me/

Objetivo:

```text
retornar usuario autenticado e memberships por organization
```

Auth:

```text
requer usuario autenticado
```

Response:

```json
{
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin",
    "phone": "",
    "is_active": true
  },
  "memberships": [
    {
      "id": 1,
      "organization": {
        "id": 1,
        "slug": "royalprime",
        "name": "RoyalPrime",
        "business_name": "Royal Carnes",
        "status": "active",
        "default_locale": "pt-BR",
        "timezone": "America/Sao_Paulo",
        "currency": "BRL"
      },
      "organization_slug": "royalprime",
      "role_key": "admin",
      "status": "active"
    }
  ],
  "permissions": {
    "royalprime": [
      "customers.read",
      "orders.read",
      "products.manage"
    ]
  }
}
```

### POST /api/v1/auth/login/

Objetivo:

```text
autenticar usuario por email/senha
retornar access/refresh e contexto do usuario
```

Auth:

```text
publico
```

Request:

```json
{
  "email": "admin@royalprime.local",
  "password": "senha"
}
```

Response:

```json
{
  "refresh": "...",
  "access": "...",
  "user": {},
  "memberships": [],
  "permissions": {}
}
```

### POST /api/v1/auth/refresh/

Objetivo:

```text
renovar access token
```

### POST /api/v1/auth/register/

Objetivo:

```text
criar usuario cliente na request.organization
criar OrganizationMember com role customer
criar Customer ligado ao User
```

Auth:

```text
publico
```

Request:

```json
{
  "email": "cliente@royalprime.local",
  "password": "senha-segura",
  "name": "Cliente RoyalPrime",
  "phone": "+5500000000000"
}
```

### POST /api/v1/auth/logout/

Objetivo:

```text
endpoint de encerramento de sessao para contrato frontend
```

Observacao:

```text
JWT blacklist ainda nao esta ativado; o cliente deve descartar tokens localmente.
```

### GET /api/v1/accounts/users/

Objetivo:

```text
listar users da request.organization para admin
```

Permissao:

```text
settings.manage
```

### POST /api/v1/accounts/users/

Objetivo:

```text
criar usuario operacional/admin/cliente com roles na request.organization
```

Permissao:

```text
settings.manage
```

Request:

```json
{
  "email": "operador@royalprime.local",
  "password": "senha-opcional",
  "name": "Operador",
  "phone": "",
  "roles": ["operator"]
}
```

### GET /api/v1/customers/

Objetivo:

```text
listar clientes da request.organization
```

Auth:

```text
requer customers.read
```

### POST /api/v1/customers/

Objetivo:

```text
criar cliente na request.organization
```

Auth:

```text
requer customers.manage
```

### GET /api/v1/customers/:id/

Objetivo:

```text
detalhar cliente da request.organization
```

Auth:

```text
requer customers.read
```

## Commands Atuais

### seed_backend

Objetivo:

```text
aplicar seed modular no banco
```

Comandos:

```bash
cd backend
py manage.py seed_backend --seed royalprime
py manage.py seed_backend --seed examples/bikeclub --dry-run
py manage.py seed_backend --seed examples/camisaclub --dry-run
py manage.py seed_backend --seed tests/minimal --dry-run
```

Aplica hoje:

```text
organizations
auth-users
customers
catalog
subscriptions
inventory
```

Subscriptions aplica:

```text
plans
plan prices
plan entitlements
customer subscriptions
subscription cycles
subscription cycle items
```

Inventory aplica:

```text
inventory items
initial available/reserved quantities
measurement unit per product/variant
```

Orders aplica:

```text
code sequences
order kinds
order status definitions
```

Deliveries aplica:

```text
code sequences
delivery status definitions
```

Status:

```text
royalprime -> aplicado com sucesso
bikeclub -> dry-run OK
camisaclub -> dry-run OK
```

## Catalog

### GET /api/v1/catalog/collections/

Objetivo:

```text
listar colecoes ativas da request.organization
```

Auth:

```text
publico
```

### GET /api/v1/catalog/commercial-modes/

Objetivo:

```text
listar modos comerciais ativos da request.organization
```

Auth:

```text
publico
```

### GET /api/v1/catalog/products/

Objetivo:

```text
listar produtos ativos da request.organization com category, collections, media, variants e prices
```

Auth:

```text
publico
```

### GET /api/v1/catalog/products/:id/

Objetivo:

```text
detalhar produto da request.organization
```

Auth:

```text
publico
```

### GET /api/v1/catalog/admin/products/

Objetivo:

```text
listar produtos para admin
```

Auth:

```text
requer products.manage
```

### POST /api/v1/catalog/admin/products/

Objetivo:

```text
criar produto, vincular colecoes, preco e modos comerciais
```

Auth:

```text
requer products.manage
```

Request:

```json
{
  "key": "maminha",
  "name": "Maminha",
  "category_keys": ["carnes", "combos"],
  "unit": "kg",
  "price_cents": 5490,
  "price_type": "base",
  "commercial_mode_keys": ["delivery"],
  "collection_keys": ["dia-a-dia"],
  "variants": [
    {
      "sku": "MAMINHA-1KG",
      "name": "Maminha 1kg",
      "unit": "kg",
      "unit_key": "kg",
      "unit_quantity": 1,
      "weight_grams": 1000,
      "attributes": {
        "cut": "maminha",
        "portion": "1kg"
      },
      "price_cents": 5490,
      "commercial_mode_keys": ["delivery"]
    }
  ]
}
```

Response inclui:

```json
{
  "key": "picanha",
  "primary_media_url": "https://example.com/picanha.png",
  "media": [
    {
      "url": "https://example.com/picanha.png",
      "alt": "Picanha crua com capa de gordura em fundo claro",
      "is_primary": true
    }
  ],
  "variants": [],
  "prices": []
}
```

Variant response inclui:

```json
{
  "sku": "MAMINHA-1KG",
  "unit": "kg",
  "unit_key": "kg",
  "unit_name": "Quilograma",
  "unit_kind": "weight",
  "unit_symbol": "kg",
  "unit_quantity": "1.000",
  "weight_grams": 1000,
  "attributes": {
    "cut": "maminha",
    "portion": "1kg"
  }
}
```

Garantias de Catalog:

```text
ProductVariant.sku e unico por organization quando informado.
ProductPrice e unico por organization, product, commercial mode, price type e
escopo opcional de variant/collection.
Campos opcionais NULL em variant/collection nao podem gerar precos duplicados.
```

## Endpoints De Foundation Atual

## Subscriptions

### GET /api/v1/subscriptions/plans/

Objetivo:

```text
listar planos ativos da request.organization com precos e entitlements
```

Auth:

```text
publico
```

Response inclui:

```json
{
  "key": "pro",
  "prices": [{ "amount_cents": 44900, "billing_interval": "month" }],
  "entitlements": [
    {
      "key": "premium-cuts-12kg",
      "target_type": "collection",
      "target_key": "churrasco-premium",
      "quantity": "12.000",
      "measurement_unit_key": "kg",
      "constraints": {
        "maxSelections": 10,
        "allowedCommercialModes": ["subscription"]
      }
    }
  ]
}
```

### GET /api/v1/subscriptions/me/

Objetivo:

```text
retornar assinatura ativa do Customer ligado ao usuario autenticado
```

Auth:

```text
requer usuario autenticado
```

### GET /api/v1/subscriptions/me/cycles/current/

Objetivo:

```text
retornar ciclo aberto atual da assinatura ativa do cliente
```

Auth:

```text
requer usuario autenticado
```

### POST /api/v1/subscriptions/me/cycles/current/items/

Objetivo:

```text
selecionar/adicionar item no ciclo atual da assinatura ativa
```

Auth:

```text
requer usuario autenticado
```

Request:

```json
{
  "entitlement_key": "premium-cuts-12kg",
  "product_key": "picanha",
  "variant_sku": "PICANHA-1KG",
  "quantity": "1.000",
  "measurement_unit_key": "kg"
}
```

Validacao:

```text
entitlement pertence ao plano da assinatura
produto/variant pertencem ao target do entitlement
unidade bate com MeasurementUnit do entitlement
quantidade total do ciclo nao excede entitlement.quantity
constraints maxSelections, maxQuantity, allowedAttributes,
allowedCommercialModes e requiresAvailability sao respeitadas
```

Erros principais:

```text
customer_not_found
subscription_not_found
current_cycle_not_found
selection_reference_not_found
target_mismatch
unit_mismatch
quantity_exceeded
max_selections_exceeded
attribute_not_allowed
```

### GET /api/v1/subscriptions/admin/plans/

Objetivo:

```text
listar planos da organization para admin
```

Permissao:

```text
plans.read
```

### POST /api/v1/subscriptions/admin/plans/

Objetivo:

```text
criar ou atualizar plano administrativo basico
```

Permissao:

```text
plans.manage
```

Erro de referencia:

```text
plan_entitlement_reference_not_found
```

### GET /api/v1/subscriptions/admin/subscriptions/

Objetivo:

```text
listar assinaturas da organization para operacao/admin
```

Permissao:

```text
subscriptions.read
```

### POST /api/v1/subscriptions/admin/subscriptions/

Objetivo:

```text
criar assinatura para Customer e Plan da mesma organization
```

Permissao:

```text
subscriptions.manage
```

Erro de referencia:

```text
subscription_reference_not_found
```

### GET /api/v1/subscriptions/admin/cycles/

Objetivo:

```text
listar ciclos de assinatura da organization
```

Permissao:

```text
subscriptions.read
```

## Inventory

### GET /api/v1/inventory/admin/items/

Objetivo:

```text
listar estoque simples da request.organization com produto, variant, unidade,
quantidade disponivel, quantidade reservada e quantidade vendavel
```

Permissao:

```text
inventory.read
```

### POST /api/v1/inventory/admin/items/

Objetivo:

```text
criar ou atualizar item de estoque por Product e ProductVariant opcional
```

Permissao:

```text
inventory.manage
```

Request:

```json
{
  "product_key": "picanha",
  "variant_sku": "PICANHA-1KG",
  "measurement_unit_key": "kg",
  "available_quantity": "24.000",
  "reserved_quantity": "2.000",
  "low_stock_threshold": "4.000",
  "status": "available",
  "notes": "Estoque inicial"
}
```

Regra:

```text
Product e ProductVariant precisam pertencer a request.organization.
Variant, quando enviada, precisa pertencer ao Product.
MeasurementUnit vem do Catalog/seed da organization.
Sem variant_sku, o estoque e controlado no nivel do Product.
```

### GET /api/v1/inventory/admin/items/:id/

Objetivo:

```text
detalhar item de estoque da request.organization
```

Permissao:

```text
inventory.read
```

### POST /api/v1/inventory/admin/items/:id/adjust/

Objetivo:

```text
ajustar quantidade disponivel/reservada e registrar InventoryMovement
```

Permissao:

```text
inventory.manage
```

Request:

```json
{
  "quantity_delta": "-4.000",
  "reserved_delta": "1.000",
  "movement_type": "manualAdjustment",
  "reason": "Ajuste manual"
}
```

Validacao:

```text
available_quantity nao pode ficar negativa
reserved_quantity nao pode ficar negativa
reserved_quantity nao pode passar available_quantity
status e recalculado como available, limited ou unavailable, exceto disabled
```

Erros principais:

```text
variant_product_mismatch
organization_mismatch
negative_available_quantity
negative_reserved_quantity
reserved_exceeds_available
```

### GET /api/v1/inventory/admin/items/:id/movements/

Objetivo:

```text
listar movimentos auditaveis de um item de estoque
```

Permissao:

```text
inventory.read
```

## Orders

### GET /api/v1/orders/config/

Objetivo:

```text
retornar kinds e status definitions da request.organization
```

Auth:

```text
requer usuario autenticado pelo default atual da API
```

### GET /api/v1/orders/me/

Objetivo:

```text
listar pedidos do Customer ligado ao usuario autenticado
```

Auth:

```text
requer usuario autenticado
```

### POST /api/v1/orders/me/

Objetivo:

```text
criar pedido do cliente autenticado
calcular preco no backend
reservar estoque quando OrderKind.requiresInventory for true
criar Delivery automaticamente quando OrderKind.createsDelivery for true
gerar codigo por CodeSequence da organization
```

Request:

```json
{
  "kind_key": "delivery",
  "items": [
    {
      "product_key": "picanha",
      "variant_sku": "PICANHA-1KG",
      "quantity": "1.000"
    }
  ],
  "notes": ""
}
```

Response inclui:

```json
{
  "code": "RP-000001",
  "kind_key": "delivery",
  "status_key": "received",
  "total_cents": 8990,
  "items": [],
  "status_history": []
}
```

### GET /api/v1/orders/me/:id/

Objetivo:

```text
detalhar pedido do Customer autenticado
```

### GET /api/v1/orders/admin/orders/

Objetivo:

```text
listar pedidos da request.organization para operacao/admin
```

Permissao:

```text
orders.read
```

### POST /api/v1/orders/admin/orders/

Objetivo:

```text
criar pedido administrativo para um Customer da request.organization
```

Permissao:

```text
orders.manage
```

### GET /api/v1/orders/admin/orders/:id/

Objetivo:

```text
detalhar pedido da request.organization para operacao/admin
```

Permissao:

```text
orders.read
```

### POST /api/v1/orders/admin/orders/:id/transition/

Objetivo:

```text
mudar status do pedido validando allowedNextKeys do OrderStatusDefinition atual
```

Permissao:

```text
orders.manage
```

Request:

```json
{
  "status_key": "approved",
  "note": "Pedido aprovado"
}
```

Erros principais:

```text
order_reference_not_found
order_status_not_found
order_status_transition_not_allowed
order_status_terminal
inventory_item_not_found
reserved_exceeds_available
```

Regra:

```text
backend valida transicao por OrderStatusDefinition.allowedNextKeys.
OrderKindDefinition define commercialMode, requiresInventory, createsDelivery e
codeSequenceKey.
CodeSequence define prefixo, padding e template por organization.
Quando createsDelivery=true, Orders cria a Delivery inicial sem regra hardcoded
por nome comercial.
```

## Deliveries

### GET /api/v1/deliveries/config/

Objetivo:

```text
retornar delivery status definitions da request.organization
```

### GET /api/v1/deliveries/me/

Objetivo:

```text
listar entregas do Customer autenticado
```

### GET /api/v1/deliveries/me/:id/

Objetivo:

```text
detalhar entrega do Customer autenticado
```

### GET /api/v1/deliveries/admin/deliveries/

Objetivo:

```text
listar entregas da request.organization para operacao/admin
```

Permissao:

```text
deliveries.read
```

### POST /api/v1/deliveries/admin/deliveries/

Objetivo:

```text
criar entrega basica para Order existente
gerar codigo por CodeSequence da organization
copiar snapshot simples do endereco do pedido
```

Permissao:

```text
deliveries.manage
```

Request:

```json
{
  "order_id": 1,
  "confirmation_code": "1234",
  "notes": ""
}
```

### POST /api/v1/deliveries/admin/deliveries/:id/transition/

Objetivo:

```text
mudar status da entrega validando allowedNextKeys do DeliveryStatusDefinition atual
```

Permissao:

```text
deliveries.manage
```

### POST /api/v1/deliveries/admin/deliveries/:id/confirm/

Objetivo:

```text
registrar confirmacao de entrega
se existir status terminal com effects.confirmDelivery=true, transicionar para ele
```

Permissao:

```text
deliveries.manage
```

Scheduling:

```text
fora da Fase 5 atual.
Entrega recorrente, janela de entrega, capacidade e calendario ficam para kit
futuro de Delivery Scheduling.
```

## Regra De Evolucao

Antes de criar novo endpoint:

```text
1. identificar app dono da regra
2. definir serializer/DTO
3. definir service ou selector
4. definir permissao por organizationId
5. documentar neste arquivo
6. so entao implementar view/url
```
