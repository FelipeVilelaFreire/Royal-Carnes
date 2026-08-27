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
```

Carrega mas ainda pula como planned:

```text
subscriptions
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
      "unit_quantity": 1,
      "weight_grams": 1000,
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

## Endpoints Planejados Proximos

```text
GET  /api/v1/catalog/plans/
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
