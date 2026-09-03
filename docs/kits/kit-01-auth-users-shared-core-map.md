# Kit 01 - Auth & Users Shared-Core Map

Data: 2026-08-29

## Objetivo

Definir como o Kit 01 - Auth & Users deve ser dividido entre:

```text
frontend/shared-core
frontend/client/shared-core
frontend/admin/shared-core
```

A meta e reduzir duplicacao ao maximo, mas sem jogar no global o que ainda tem
comportamento diferente entre cliente, admin e futuro mobile.

## Regra Principal

```text
global recebe contrato base realmente comum
client recebe fluxo de autenticacao do cliente
admin recebe fluxo operacional, roles, permissoes e gestao de usuarios
```

## Decisao De Organizacao Fisica

O shared-core nao deve ficar fragmentado por kit no runtime.

Regra:

```text
contracts ficam em contracts/
types auxiliares ficam em types/
API clients ficam em api/
hooks ficam em hooks/
mappers ficam em mappers/
view-models ficam em view-models/
mocks ficam em mocks/
kits ficam em kits/ apenas como documentacao de leitura e fronteira
```

O kit documenta onde cada arquivo mora, qual arquivo ler primeiro e qual papel
ele exerce. Ele nao cria uma arvore paralela de implementacao.

Exemplo:

```text
docs/kits/kit-01-auth-users-shared-core-map.md
  -> mapa do Kit 01
  -> diz para ler backend/apps/accounts, contracts/auth, api/auth, hooks/auth
  -> explica o que e global, client, admin e render-only

frontend/client/shared-core/hooks/useClientAuthSession.ts
  -> runtime real do hook

frontend/client/shared-core/kits/auth/README.md
  -> nota curta da capacidade auth dentro do escopo client
  -> aponta para os arquivos reais
```

Maximizar global e bom quando o contrato e igual.

Maximizar global e ruim quando:

```text
obriga client a conhecer permissao admin
obriga admin a conhecer copy/fluxo de cadastro do cliente
mistura tela/login com regra de role
faz um hook generico cheio de if surface == client/admin
```

## Visao Vertical Do Kit

```text
Kit 01 - Auth & Users

backend
  -> User, Role, Permission, OrganizationMember, Customer
  -> login, register, logout, refresh, me
  -> validacao de permissao e organization

frontend/shared-core
  -> tipos base e helpers puros compartilhados

frontend/client/shared-core
  -> sessao do cliente, login/cadastro do cliente, current customer

frontend/admin/shared-core
  -> sessao admin, permissoes, usuarios, roles, membros da organization

frontend/client/web, mobile e admin/web
  -> render-only: formularios, botoes, modais e estados visuais
```

## O Que Vai Para Global Shared-Core

Local:

```text
frontend/shared-core/kits/identity
frontend/shared-core/kits/organization
frontend/shared-core/contracts
frontend/shared-core/config.ts
```

Pode morar no global:

```text
UserId
OrganizationId
OrganizationSlug
RoleKey
PermissionKey
AuthTokenShape
AuthSessionBase
CurrentUserBase
AuthErrorCode
ApiErrorEnvelope
buildOrganizationHeaders()
buildAuthHeaders()
```

Exemplo de contrato global:

```ts
export type UserId = string | number;
export type OrganizationId = string | number;
export type OrganizationSlug = string;
export type RoleKey = string;
export type PermissionKey = string;

export interface AuthTokenShape {
  accessToken: string;
  refreshToken?: string;
}

export interface CurrentUserBase {
  id: UserId;
  email: string;
  name?: string;
}

export interface AuthSessionBase {
  user: CurrentUserBase;
  token: AuthTokenShape;
  organizationSlug?: OrganizationSlug;
}
```

Global nao deve ter:

```text
useClientLogin
useAdminLogin
AuthModal state
register customer flow
admin user table filters
permission UI copy
localStorage direto
router/navigation direto
```

Motivo:

```text
global deve ser puro e copiavel
global nao deve depender de React Web, Admin ou Mobile
```

## O Que Vai Para Client Shared-Core

Local:

```text
frontend/client/shared-core/kits/auth
frontend/client/shared-core/kits/customer
frontend/client/shared-core/types
frontend/client/shared-core/contracts
frontend/client/shared-core/api
frontend/client/shared-core/hooks
frontend/client/shared-core/mappers
frontend/client/shared-core/view-models
frontend/client/shared-core/locales
```

Responsabilidades:

```text
login do cliente
cadastro do cliente
logout do cliente
usuario atual do cliente
customer vinculado
enderecos e preferencias do cliente quando fizer sentido
estado autenticado/deslogado para portal
fallback dev explicito
labels/erros do fluxo do cliente
```

Contratos esperados:

```text
ClientLoginInput
ClientRegisterInput
ClientAuthSession
ClientCurrentUser
ClientCustomerProfile
ClientAuthViewModel
```

API/hook esperados:

```text
clientAuthApi.login(input)
clientAuthApi.register(input)
clientAuthApi.logout()
clientAuthApi.me()
clientAuthApi.refresh(input)

useClientAuthSession()
useClientLogin()
useClientRegister()
useClientLogout()
useRequireClientAuth()
```

Nao deve conter:

```text
admin role management
admin users table
admin permission matrix
operator-only actions
```

## O Que Vai Para Admin Shared-Core

Local:

```text
frontend/admin/shared-core/kits/auth
frontend/admin/shared-core/kits/users
frontend/admin/shared-core/types
frontend/admin/shared-core/contracts
frontend/admin/shared-core/api
frontend/admin/shared-core/hooks
frontend/admin/shared-core/mappers
frontend/admin/shared-core/view-models
frontend/admin/shared-core/locales
frontend/admin/shared-core/manifest
```

Responsabilidades:

```text
login admin
logout admin
usuario admin atual
organization atual
roles e permissoes do usuario
guard/permission display helpers
listar usuarios
criar usuario
editar usuario
ativar/desativar usuario
atribuir role
filtrar usuarios
view-model de tabela/detalhe/form admin
```

Contratos esperados:

```text
AdminLoginInput
AdminAuthSession
AdminCurrentUser
AdminRole
AdminPermission
AdminOrganizationMember
AdminUserListItem
AdminUserDetail
AdminUserFormInput
```

API/hook esperados:

```text
adminAuthApi.login(input)
adminAuthApi.logout()
adminAuthApi.me()
adminAuthApi.refresh(input)

adminUsersApi.list(params)
adminUsersApi.create(input)

useAdminAuthSession()
useAdminPermissions()
useAdminUsers()
useAdminUserDetail(id)
useAdminUserForm()
```

Nao deve conter:

```text
cadastro publico do cliente
portal customer profile flow
copy de landing/login cliente
```

## Como Evitar Duplicacao

Preferir global para:

```text
tipos base
envelopes de erro
token shape
ids
role/permission key
helpers puros de header
formatacao sem dependencia de surface
```

Manter separado em client/admin:

```text
hooks React
storage adapter concreto
copy da surface
rotas
navigation
view-models de tela
formularios
permissoes operacionais
```

Regra de decisao:

```text
se client e admin importariam sem if e sem campos sobrando, pode ser global
se precisa de if client/admin, fica no escopo especifico
se envolve UI/copy/rota, fica no escopo especifico ou manifest da surface
```

## Tree Exata Do Kit 01

Esta e a tree alvo antes de implementar o Kit 01. Criar arquivos somente quando
o contrato daquele arquivo estiver sendo usado ou documentado no passo atual.

```text
frontend/shared-core/
  README.md
  config.ts
  kits/
    README.md
    identity/
      README.md
    organization/
      README.md
  types/
    identity.types.ts
    organization.types.ts
    api.types.ts
  contracts/
    identity.contract.ts
    organization.contract.ts
    auth.contract.ts
  api/
    headers.api.ts
    errors.api.ts
  mappers/
    api-error.mapper.ts

frontend/client/shared-core/
  README.md
  kits/
    README.md
    auth/
      README.md
      contract.md
      flow.md
    customer/
      README.md
  types/
    auth.types.ts
    customer.types.ts
  contracts/
    auth.contract.ts
    customer.contract.ts
    session.contract.ts
  api/
    auth.api.ts
    customer.api.ts
  hooks/
    useClientAuthSession.ts
    useClientLogin.ts
    useClientRegister.ts
    useClientLogout.ts
    useCurrentCustomer.ts
  mappers/
    auth.mapper.ts
    customer.mapper.ts
  view-models/
    auth.view-model.ts
    customer.view-model.ts
  mocks/
    customer.mock.ts
  locales/
    pt-BR.ts
  manifest/
  navigation/

frontend/admin/shared-core/
  README.md
  kits/
    README.md
    auth/
      README.md
      contract.md
      flow.md
    users/
      README.md
      contract.md
      flow.md
  types/
    auth.types.ts
    user.types.ts
    permission.types.ts
  contracts/
    auth.contract.ts
    user.contract.ts
    permission.contract.ts
    session.contract.ts
  api/
    auth.api.ts
    users.api.ts
    permissions.api.ts
  hooks/
    useAdminAuthSession.ts
    useAdminLogin.ts
    useAdminLogout.ts
    useAdminPermissions.ts
    useAdminUsers.ts
    useAdminUserDetail.ts
  mappers/
    auth.mapper.ts
    users.mapper.ts
    permissions.mapper.ts
  view-models/
    auth.view-model.ts
    users.view-model.ts
    permissions.view-model.ts
  mocks/
    users.mock.ts
    subscribers.mock.ts
  locales/
    pt-BR.ts
  manifest/
  navigation/
```

## Matriz De Arquivos

| Camada | Pasta | Papel | Pode importar | Nao pode importar |
| --- | --- | --- | --- | --- |
| Global | `frontend/shared-core/types` | tipos pequenos e universais | nada de React | client/admin/web |
| Global | `frontend/shared-core/contracts` | contratos comuns de identidade, organizacao e auth base | `types` global | hooks, UI, mocks |
| Global | `frontend/shared-core/api` | headers, envelopes e helpers HTTP puros | `types`, `contracts` globais | React, router, localStorage direto |
| Global | `frontend/shared-core/mappers` | normalizacao pura de erro/API comum | contratos globais | copy de UI |
| Client | `frontend/client/shared-core/contracts` | DTOs e contratos do cliente | global contracts/types | admin contracts |
| Client | `frontend/client/shared-core/api` | chamadas HTTP do cliente | client contracts, global api | React, JSX, tela |
| Client | `frontend/client/shared-core/hooks` | estado React e actions do cliente | client api/mappers/view-models | fetch direto em tela, admin |
| Client | `frontend/client/shared-core/mappers` | DTO -> model de cliente | contracts/types | regra real de negocio |
| Client | `frontend/client/shared-core/view-models` | formato pronto para render do portal | contracts, locales quando necessario | chamada HTTP |
| Admin | `frontend/admin/shared-core/contracts` | DTOs e contratos admin | global contracts/types | client contracts |
| Admin | `frontend/admin/shared-core/api` | chamadas HTTP admin | admin contracts, global api | React, JSX, tela |
| Admin | `frontend/admin/shared-core/hooks` | estado React e actions admin | admin api/mappers/view-models | fetch direto em tela, client |
| Admin | `frontend/admin/shared-core/mappers` | DTO -> model admin | contracts/types | regra real de permissao |
| Admin | `frontend/admin/shared-core/view-models` | tabela, detalhe, form e permissoes para render | contracts, locales quando necessario | chamada HTTP |
| Docs | `docs/kits/*.md` | mapa de leitura e fronteira de reuso | paths reais | runtime funcional |
| Docs | `*/shared-core/kits/**` | README/contract/flow da capacidade no escopo | paths reais | runtime duplicado |

## Roteiro De Leitura Do Kit 01

Antes de implementar Auth & Users, ler nesta ordem:

```text
1. AGENTS.md
2. ROYALPRIME_CODEX_RULES.md
3. ROYALPRIME_ARCHITECTURE_CONTRACT.md
4. docs/CODEX_ENTRYPOINTS.md
5. docs/kits/README.md
6. docs/kits/SHARED_CORE_ARCHITECTURE_MATRIX.md
7. docs/kits/SHARED_CORE_KIT_RESET_PLAN.md
8. docs/kits/SHARED_CORE_KIT_RESET_RESULT.md
9. docs/kits/auth-users-kit.md
10. docs/kits/kit-01-auth-users-shared-core-map.md
11. backend/API_CONTRACTS.md
12. backend/apps/accounts/
13. backend/apps/organizations/
14. backend/apps/customers/
15. frontend/shared-core/README.md
16. frontend/client/shared-core/README.md
17. frontend/admin/shared-core/README.md
```

Depois da leitura:

```text
1. confirmar o que ja existe fisicamente
2. criar somente pastas/README faltantes necessarios
3. criar contratos globais minimos
4. criar client auth no escopo client
5. criar admin auth/users no escopo admin
6. conectar telas apenas depois dos contratos e hooks
```

## Exemplo Pratico: Login

Global:

```text
AuthTokenShape
CurrentUserBase
AuthErrorCode
buildAuthHeaders(token)
```

Client:

```text
ClientLoginInput
clientAuthApi.login
useClientLogin
ClientAuthViewModel
clientPtBR.authModal
```

Admin:

```text
AdminLoginInput
adminAuthApi.login
useAdminLogin
AdminAuthViewModel
adminPtBR.auth
permission helpers
```

Backend:

```text
valida credenciais
emite token
retorna usuario atual
retorna roles/permissoes conforme endpoint/surface
```

Tela:

```text
renderiza input
onSubmit chama hook
mostra loading/erro
navega depois do sucesso
```

Nunca fazer:

```text
formulario chamar fetch direto
client login decidir permissao admin
admin login reutilizar copy/modal do cliente por conveniencia
global hook com if surface == "admin"
```

## Exemplo Pratico: Permission Check

Global:

```text
PermissionKey
hasPermission(userPermissions, permissionKey)
```

Admin:

```text
useAdminPermissions()
canManageOrders
canManageUsers
menu items permitidos
acoes de tabela permitidas
```

Client:

```text
normalmente nao precisa de permission matrix admin
pode ter account capabilities simples vindas do backend
```

Backend:

```text
continua sendo autoridade real
frontend so esconde/mostra UI
```

Nunca fazer:

```text
frontend permitir acao real so porque hasPermission retornou true
backend confiar em permissao enviada pelo frontend
```

## Exemplo De Reuso: Assinatura De Camisa

Ao criar outro produto:

```text
copiar/adaptar global identity contracts
copiar/adaptar client auth hooks/API
copiar/adaptar admin auth/users hooks/API
trocar seed de organization/roles
trocar locale/tema/manifest
manter backend como autoridade de permissao
```

O que nao copiar:

```text
copy Royal Carnes
usuarios dev do RoyalPrime
permissoes especificas de carnes se nao existirem no novo produto
rotas visuais do portal RoyalPrime
```

## Ordem Recomendada Para Implementar

Este documento e primeiro um mapa. Nao implementar tudo de uma vez.

Ordem segura:

```text
1. Criar contratos globais base de identity/organization se ainda nao existirem.
2. Criar auth API client/hook do client apenas quando a tela for conectar login real.
3. Criar auth API client/hook do admin apenas quando admin login real entrar.
4. Criar users admin shared-core quando a tela de usuarios for prioridade.
5. Manter mocks/fallbacks explicitamente marcados como dev.
```

## Criterio De Pronto Do Kit 01 Shared-Core

```text
global contem apenas tipos/helpers puros comuns
client auth nao conhece admin users
admin auth/users nao conhece portal customer
hooks nao chamam fetch direto fora de API client
UI nao transforma DTO manualmente
permissoes reais continuam no backend
copy fica em locale/manifest da surface
```

## Fechamento Do Primeiro Corte Shared-Core

Status em 2026-08-30:

```text
Kit 01 fechado no nivel shared-core para os endpoints backend que existem hoje.
Telas render-only ainda ficam para o proximo marco.
```

Endpoints cobertos:

```text
POST /api/v1/auth/login/
POST /api/v1/auth/refresh/
POST /api/v1/auth/register/
POST /api/v1/auth/logout/
GET  /api/v1/accounts/me/
GET  /api/v1/accounts/users/
POST /api/v1/accounts/users/
```

Nao coberto por escolha tecnica:

```text
adminUsersApi.detail/update/setRole ainda nao existem porque o backend atual
nao publica esses endpoints em backend/apps/accounts/views.py.
Quando o backend publicar, ampliar users.api.ts e o contract do kit.
```

Critério para seguir ao Kit 02:

```text
global permanece minimo
client auth/session/customer inicial nao conhece admin
admin auth/users/permissions nao conhece portal customer
hooks chamam API clients
API clients batem nos endpoints reais
mappers normalizam DTO do Django
view-models entregam formato de render
client/admin builds passam
backend check passa
```
