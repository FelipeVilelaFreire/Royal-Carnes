# Shared-Core Architecture Matrix

Data: 2026-08-29

## Objetivo

Definir a organizacao dos tres shared-cores do RoyalPrime antes de continuar o
Kit 01 - Auth & Users.

Este documento fixa a regra geral:

```text
backend reutiliza por seed/config
shared-core reutiliza por kit e por escopo
web/mobile/admin renderizam e disparam actions
```

O RoyalPrime deve funcionar como produto real para varias empresas e
assinaturas, mas sem virar uma plataforma abstrata cedo demais.

## Decisao Central

Kits se conversam. Eles nao viram mini-aplicacoes isoladas.

Exemplo:

```text
Auth & Users
  -> fornece User, Customer, OrganizationMember e permission context

Subscriptions
  -> usa Customer e Organization do Kit 01

Orders
  -> usa Customer, Subscription, Catalog e Inventory

Deliveries
  -> usa Order, Address e status seedado

Admin Operations
  -> usa permissions, users, orders, deliveries, inventory e dashboard
```

Mesmo com kits conversando, o runtime continua organizado por responsabilidade:

```text
types/
contracts/
api/
hooks/
mappers/
view-models/
mocks/
locales/
manifests/
navigation/
kits/
```

`kits/` documenta a capacidade, a ordem de leitura e os arquivos reais. Ele nao
e a pasta principal de implementacao.

## Os Tres Shared-Cores

```text
frontend/shared-core
  -> global pequeno
  -> contratos e helpers que client, mobile e admin usam igual

frontend/client/shared-core
  -> fluxo do cliente final
  -> compartilhado por client web e futuro client mobile

frontend/admin/shared-core
  -> fluxo operacional da empresa
  -> usado pelo admin web e por futuros consoles administrativos
```

Regra:

```text
se client web e mobile usam igual, fica em frontend/client/shared-core
se admin usa diferente, fica em frontend/admin/shared-core
se todos usam igual sem if, pode subir para frontend/shared-core
```

## Matriz Global

Local:

```text
frontend/shared-core/
```

Papel:

```text
identidade base
organization/tenant base
erros de API
headers puros
tipos comuns pequenos
contratos realmente iguais entre client, mobile e admin
```

Pode conter:

```text
types/identity.types.ts
types/organization.types.ts
types/api.types.ts
contracts/identity.contract.ts
contracts/organization.contract.ts
contracts/auth.contract.ts
api/headers.api.ts
api/errors.api.ts
mappers/api-error.mapper.ts
kits/identity/README.md
kits/organization/README.md
```

Exemplos de conceitos globais:

```text
UserId
OrganizationId
OrganizationSlug
CustomerId
RoleKey
PermissionKey
AuthTokenShape
CurrentUserBase
AuthSessionBase
ApiErrorEnvelope
TenantHeaders
```

Nao pode conter:

```text
hooks React
JSX
rotas
storage concreto
copy de UI
modal de login
cadastro de cliente
tabela de usuarios admin
orders/checkout/subscriptions completos antes de prova real de reuso global
```

## Matriz Client

Local:

```text
frontend/client/shared-core/
```

Papel:

```text
contratos e fluxos do cliente final
base compartilhada entre web e mobile
portal, conta, assinatura, pedidos, entregas e checkout do cliente
```

Pode conter:

```text
types/
contracts/
api/
hooks/
mappers/
view-models/
mocks/
locales/
manifests/
navigation/
kits/
```

Kits client esperados:

```text
auth
customer
catalog
subscriptions
orders
deliveries
checkout
account
```

Regra web/mobile:

```text
frontend/client/shared-core nao deve depender de Next, DOM ou CSS
web e mobile devem conseguir consumir os mesmos contracts/api/mappers
hooks podem existir quando forem React-compatible entre web e mobile
storage e navegacao concreta devem entrar por adapter quando diferirem
```

Exemplo:

```text
client web
  -> usa useClientAuthSession()
  -> renderiza AuthModal ou pagina de conta

client mobile futuro
  -> usa o mesmo contrato de sessao
  -> renderiza tela nativa diferente
```

Nao pode conter:

```text
admin users CRUD
permission matrix operacional
sidebar admin
screen type admin
regra real de assinatura, estoque, preco ou pedido
```

## Matriz Admin

Local:

```text
frontend/admin/shared-core/
```

Papel:

```text
contratos e fluxos operacionais da empresa
auth admin, users, permissions, customers, orders, inventory, deliveries e dashboard
```

Pode conter:

```text
types/
contracts/
api/
hooks/
mappers/
view-models/
mocks/
locales/
manifests/
navigation/
kits/
```

Kits admin esperados:

```text
auth
users
customers
catalog
subscriptions
inventory
orders
deliveries
dashboard
settings
```

Regra:

```text
admin shared-core organiza operacao
admin web renderiza listas, detalhes, forms e dashboards
backend continua autorizando de verdade
```

Nao pode conter:

```text
cadastro publico do cliente
modal do portal
copy da landing
checkout visual do cliente
regra real decidida no frontend
```

## Como Os Kits Conversam

Kits devem depender de contratos, nao de telas.

Fluxo correto:

```text
orders contract importa tipos base de identity/organization
orders hook chama orders api
orders api recebe IDs e DTOs
orders view-model pode exibir labels/tokens vindos de locale/manifest
screen renderiza o view-model
```

Fluxo ruim:

```text
orders hook importar componente de tela
subscriptions hook chamar funcao interna de PedidoView
admin users depender de modal do client
global shared-core ter if surface == "admin"
```

Dependencias naturais:

```text
Kit 01 Auth & Users
  -> base para todos os outros kits

Catalog
  -> usado por Subscriptions, Orders, Inventory e Checkout

Subscriptions
  -> usado por Client Account, Orders e Admin Operations

Inventory
  -> usado por Orders e Admin Catalog

Orders
  -> usado por Deliveries, Payments, Dashboard e Client Account

Deliveries
  -> usado por Dashboard, Orders e Client Tracking

Payments
  -> usado por Orders, Subscriptions, Wallet e Dashboard
```

Regra:

```text
um kit pode depender do contrato de outro kit
um kit nao deve depender da tela de outro kit
um kit nao deve conhecer copy ou seed especifico de Royal Carnes como regra
```

## Kit 01 Como Primeiro Corte

Kit 01 deve preparar a base multiempresa:

```text
User
Organization
OrganizationMember
Role
Permission
Customer
Session
```

Modelo conceitual:

```text
User e identidade global
Organization e a empresa/tenant
OrganizationMember e acesso operacional do User em uma Organization
Customer e o cliente comercial dentro de uma Organization
Subscription pertence a Customer + Organization
Order pertence a Customer + Organization
Admin opera sempre dentro de uma Organization
```

Isso permite:

```text
mesmo backend para RoyalPrime, BikeClub ou CamisaClub
mesmo client shared-core para web e mobile do cliente
admin separado sem duplicar regra de auth base
seeds/configs vestindo cada empresa
```

## Kit 01 - O Que Comecar Agora

Primeiro corte:

```text
1. global minimo
2. client auth/customer
3. admin auth/users/permissions
4. documentacao de kits apontando arquivos reais
5. telas conectadas depois
```

Global minimo:

```text
frontend/shared-core/types/identity.types.ts
frontend/shared-core/types/organization.types.ts
frontend/shared-core/types/api.types.ts
frontend/shared-core/contracts/identity.contract.ts
frontend/shared-core/contracts/organization.contract.ts
frontend/shared-core/contracts/auth.contract.ts
frontend/shared-core/api/headers.api.ts
frontend/shared-core/api/errors.api.ts
frontend/shared-core/mappers/api-error.mapper.ts
```

Client Auth/Customer:

```text
frontend/client/shared-core/contracts/auth.contract.ts
frontend/client/shared-core/contracts/customer.contract.ts
frontend/client/shared-core/contracts/session.contract.ts
frontend/client/shared-core/api/auth.api.ts
frontend/client/shared-core/api/customer.api.ts
frontend/client/shared-core/hooks/useClientAuthSession.ts
frontend/client/shared-core/hooks/useClientLogin.ts
frontend/client/shared-core/hooks/useClientRegister.ts
frontend/client/shared-core/hooks/useClientLogout.ts
frontend/client/shared-core/hooks/useCurrentCustomer.ts
frontend/client/shared-core/mappers/auth.mapper.ts
frontend/client/shared-core/mappers/customer.mapper.ts
frontend/client/shared-core/view-models/auth.view-model.ts
frontend/client/shared-core/view-models/customer.view-model.ts
```

Admin Auth/Users:

```text
frontend/admin/shared-core/contracts/auth.contract.ts
frontend/admin/shared-core/contracts/user.contract.ts
frontend/admin/shared-core/contracts/permission.contract.ts
frontend/admin/shared-core/contracts/session.contract.ts
frontend/admin/shared-core/api/auth.api.ts
frontend/admin/shared-core/api/users.api.ts
frontend/admin/shared-core/api/permissions.api.ts
frontend/admin/shared-core/hooks/useAdminAuthSession.ts
frontend/admin/shared-core/hooks/useAdminLogin.ts
frontend/admin/shared-core/hooks/useAdminLogout.ts
frontend/admin/shared-core/hooks/useAdminPermissions.ts
frontend/admin/shared-core/hooks/useAdminUsers.ts
frontend/admin/shared-core/hooks/useAdminUserDetail.ts
frontend/admin/shared-core/mappers/auth.mapper.ts
frontend/admin/shared-core/mappers/users.mapper.ts
frontend/admin/shared-core/mappers/permissions.mapper.ts
frontend/admin/shared-core/view-models/auth.view-model.ts
frontend/admin/shared-core/view-models/users.view-model.ts
frontend/admin/shared-core/view-models/permissions.view-model.ts
```

## Referencias De Telas Boas

HobbyMap e Syrax podem orientar experiencia, densidade e fluxo, mas nao devem
ser copiados como arquitetura.

Usar como referencia:

```text
HobbyMap
  -> admin denso, sidebar, topbar, tabelas, filtros, formularios, badges
  -> bom para pensar operacao e acabamento visual

Syrax
  -> web/mobile/admin separados visualmente
  -> bons exemplos de auth, admin screens, route map e view-models
```

Nao repetir:

```text
shared-core unico misturando admin, mobile e client
dominio antigo vazando para RoyalPrime
copy/rotas/modelos especificos de outro produto
codigo visual copiado sem passar por Foundation/AppShell/manifest
```

Regra:

```text
aproveitar padrao de experiencia
nao copiar arquitetura antiga sem adaptar para os tres shared-cores
```

## Regras Inviolaveis

```text
backend decide regra real
frontend nao calcula permissao, estoque, limite, preco ou status final
screen nao chama endpoint direto para fluxo reutilizavel
hook chama API client
API client fala com backend
mapper transforma DTO
view-model prepara render
copy nova vai para locale/manifest
emoji Unicode solto nao entra na UI
client shared-core deve servir web e mobile
admin shared-core nao deve entrar no client
global shared-core deve ficar pequeno
kits documentam e conectam, nao duplicam runtime
```

## Criterio Para Prosseguir

Antes de implementar o Kit 01:

```text
1. ler este documento
2. ler docs/kits/auth-users-kit.md
3. ler docs/kits/kit-01-auth-users-shared-core-map.md
4. conferir backend/API_CONTRACTS.md
5. conferir backend/apps/accounts, organizations e customers
6. criar so o menor runtime necessario
7. validar que client web e futuro mobile continuam considerados
```

Resultado esperado do proximo marco:

```text
global minimo documentado e criado
client auth/customer iniciado no escopo client
admin auth/users iniciado no escopo admin
kits apontando arquivos reais
nenhuma tela com regra de negocio nova
builds passando se houver codigo funcional
```
