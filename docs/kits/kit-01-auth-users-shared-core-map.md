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
frontend/admin/shared-core/contracts
frontend/admin/shared-core/api
frontend/admin/shared-core/hooks
frontend/admin/shared-core/mappers
frontend/admin/shared-core/view-models
frontend/admin/shared-core/locales
frontend/admin/shared-core/manifests
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

adminUsersApi.list(params)
adminUsersApi.create(input)
adminUsersApi.update(id, input)
adminUsersApi.setRole(id, roleKey)

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
