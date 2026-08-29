# Auth & Users Kit

Status inicial: `local scaffold`

Fase principal: Fase 1 - Backend Base Real

## Objetivo

Este kit documenta a capacidade de autenticacao, usuarios, clientes, admins, sessao e permissoes.

Ele deve servir como referencia para futuros produtos que precisem de login e usuarios sem refazer tudo do zero.

Exemplos de produtos que poderiam reutilizar:

- RoyalPrime;
- barbearia com agendamentos;
- restaurante com tablet de pedido;
- assinatura de bicicleta;
- ecommerce simples;
- painel operacional interno.

## Regra Central

```text
Backend valida identidade, permissao e sessao.
Shared-core expoe contratos, API clients e hooks.
Tela apenas renderiza login, cadastro, perfil e estados.
```

## Escopo Backend

Responsabilidades:

- criar usuario;
- autenticar usuario;
- encerrar sessao;
- emitir/validar token ou sessao;
- recuperar usuario atual;
- associar usuario a organization;
- associar usuario a customer;
- diferenciar cliente, admin e operador;
- validar permissoes;
- proteger endpoints por organizationId;
- auditar login, falha e alteracoes sensiveis.

Entidades esperadas:

- `User`;
- `UserIdentity`;
- `Session`;
- `Role`;
- `Permission`;
- `OrganizationMember`;
- `Customer`;
- `AdminUser` ou perfil administrativo equivalente;
- `PasswordResetToken` ou fluxo equivalente.

Endpoints esperados:

- `POST /auth/login`;
- `POST /auth/register`;
- `POST /auth/logout`;
- `GET /auth/me`;
- `POST /auth/password/forgot`;
- `POST /auth/password/reset`;
- `GET /users/me`;
- `PATCH /users/me`;

Regras:

- nunca confiar em `organizationId` vindo solto do frontend sem validar permissao;
- senha nunca volta em DTO;
- erros de API devem retornar codigo/chave, nao copy final de UI;
- cliente e admin podem compartilhar `User`, mas perfis e permissoes devem ser separados.

## Escopo Shared-Core

Local inicial recomendado:

```text
frontend/client/shared-core
  -> auth do cliente web/mobile

frontend/admin/shared-core
  -> auth/admin session quando o admin tiver fluxo separado

frontend/shared-core
  -> somente tipos realmente comuns como UserId, AuthSession, RoleKey
```

Mapa detalhado do Kit 01 entre global/client/admin:

```text
docs/kits/SHARED_CORE_ARCHITECTURE_MATRIX.md
docs/kits/kit-01-auth-users-shared-core-map.md
```

Regra:

```text
global recebe contrato base realmente comum
client recebe fluxo de autenticacao do cliente
admin recebe fluxo operacional, roles, permissoes e gestao de usuarios
```

## Como Comecar O Kit 01

Comecar pequeno, mas com a tree certa. O primeiro marco nao e conectar todas as
telas; e deixar a base de Auth & Users nascer no lugar correto.

Ordem recomendada:

```text
1. confirmar o contrato real do backend
2. criar o global minimo
3. criar o client auth/customer
4. criar o admin auth/users
5. so depois conectar telas render-only
```

Status do primeiro corte:

```text
global minimo criado
client auth/customer criado
admin auth/users/permissions criado
telas ainda nao conectadas
```

## O Que Fica Geral

Geral significa: client web, futuro mobile e admin poderiam importar sem if,
sem campos sobrando e sem conhecer a tela um do outro.

Local:

```text
frontend/shared-core/
```

Entram aqui:

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
```

Responsabilidades gerais:

```text
UserId
OrganizationId
OrganizationSlug
RoleKey
PermissionKey
AuthTokenShape
CurrentUserBase
AuthSessionBase
ApiErrorEnvelope
buildAuthHeaders()
buildOrganizationHeaders()
normalizeApiError()
```

Nao entram no geral:

```text
hook React
localStorage concreto
rota
modal
copy de login
cadastro de cliente
tabela de usuarios admin
permissao operacional de menu
regra de negocio
```

Regra pratica:

```text
se precisa perguntar "e client ou admin?", nao e global
```

## O Que Fica Especifico Do Client

Client significa: fluxo do cliente final, portal, conta, cadastro, sessao e
customer atual.

Local:

```text
frontend/client/shared-core/
```

Entram aqui:

```text
types/auth.types.ts
types/customer.types.ts
contracts/auth.contract.ts
contracts/customer.contract.ts
contracts/session.contract.ts
api/auth.api.ts
api/customer.api.ts
hooks/useClientAuthSession.ts
hooks/useClientLogin.ts
hooks/useClientRegister.ts
hooks/useClientLogout.ts
hooks/useCurrentCustomer.ts
mappers/auth.mapper.ts
mappers/customer.mapper.ts
view-models/auth.view-model.ts
view-models/customer.view-model.ts
```

Responsabilidades do client:

```text
login do cliente
cadastro do cliente
logout do cliente
sessao do portal
usuario atual do cliente
customer vinculado ao user
estado autenticado/deslogado
fallback dev explicito enquanto a tela ainda nao usa API real
```

Nao entram no client:

```text
gestao de usuarios admin
role matrix admin
criar operador
ativar/desativar membro da loja
filtros de tabela operacional
```

## O Que Fica Especifico Do Admin

Admin significa: fluxo operacional da loja, sessao admin, roles, permissoes e
gestao de usuarios.

Local:

```text
frontend/admin/shared-core/
```

Entram aqui:

```text
types/auth.types.ts
types/user.types.ts
types/permission.types.ts
contracts/auth.contract.ts
contracts/user.contract.ts
contracts/permission.contract.ts
contracts/session.contract.ts
api/auth.api.ts
api/users.api.ts
api/permissions.api.ts
hooks/useAdminAuthSession.ts
hooks/useAdminLogin.ts
hooks/useAdminLogout.ts
hooks/useAdminPermissions.ts
hooks/useAdminUsers.ts
hooks/useAdminUserDetail.ts
mappers/auth.mapper.ts
mappers/users.mapper.ts
mappers/permissions.mapper.ts
view-models/auth.view-model.ts
view-models/users.view-model.ts
view-models/permissions.view-model.ts
```

Responsabilidades do admin:

```text
login admin
logout admin
usuario admin atual
roles e permissoes da organization
listar usuarios
criar usuario
editar usuario
ativar/desativar usuario
atribuir role
view-model de tabela/detalhe/form
```

Nao entram no admin:

```text
cadastro publico de cliente
modal do portal
perfil comercial do customer final
copy da landing ou do login do cliente
```

## O Papel Dos Kits

Os kits nao sao o lugar principal do runtime. Eles sao o mapa.

```text
docs/kits/auth-users-kit.md
  -> explica a capacidade inteira

docs/kits/kit-01-auth-users-shared-core-map.md
  -> mostra a tree exata e a matriz de arquivos

frontend/client/shared-core/kits/auth/
  -> documenta o auth do client e aponta para contracts/api/hooks reais

frontend/admin/shared-core/kits/users/
  -> documenta users admin e aponta para contracts/api/hooks reais
```

Regra:

```text
runtime fica em api/hooks/contracts/types/mappers/view-models
kit diz onde esta o runtime e como ler/copiar/adaptar
```

Contratos esperados:

- `AuthSession`;
- `CurrentUser`;
- `LoginInput`;
- `RegisterInput`;
- `PasswordResetInput`;
- `AuthErrorCode`;
- `RoleKey`;
- `PermissionKey`;

API clients esperados:

- `authApi.login(input)`;
- `authApi.register(input)`;
- `authApi.logout()`;
- `authApi.me()`;
- `authApi.forgotPassword(input)`;
- `authApi.resetPassword(input)`;

Hooks esperados:

- `useAuthSession`;
- `useCurrentUser`;
- `useLogin`;
- `useRegister`;
- `useLogout`;
- `useRequireAuth`;

Mappers esperados:

- API user DTO -> view model de usuario;
- API error code -> chave de locale;
- role/permissao -> estado permitido para UI.

## Escopo Render

Frontend web/mobile/admin deve apenas renderizar:

- modal de auth;
- tela de login;
- tela de cadastro;
- perfil;
- empty state de conta deslogada;
- botoes de entrar/sair quando existirem;
- feedback de loading/erro via hook.

Proibido na tela:

- validar permissao real;
- decidir role efetivo;
- persistir token manualmente fora do contrato escolhido;
- montar payload complexo fora do hook/client;
- duplicar regra de cliente/admin.

## Arquivos Fonte no RoyalPrime

O scaffold inicial ja existe para a primeira parte do kit.

Backend atual:

```text
backend/apps/accounts/
backend/apps/customers/
backend/apps/organizations/
backend/api/v1/urls.py
backend/API_CONTRACTS.md
```

Arquivos principais:

```text
backend/apps/accounts/models.py
backend/apps/accounts/selectors.py
backend/apps/accounts/services.py
backend/apps/accounts/serializers.py
backend/apps/accounts/views.py

backend/apps/customers/models.py
backend/apps/customers/selectors.py
backend/apps/customers/services.py
backend/apps/customers/serializers.py
backend/apps/customers/views.py

backend/apps/organizations/models.py
backend/apps/organizations/selectors.py
backend/apps/organizations/services.py
backend/apps/organizations/serializers.py
backend/apps/organizations/views.py
```

Backend futuro:

```text
backend/api/v1/auth/
```

Shared-core futuro:

```text
frontend/client/shared-core/contracts/auth.contract.ts
frontend/client/shared-core/api/auth.api.ts
frontend/client/shared-core/hooks/useAuthSession.ts
frontend/client/shared-core/mappers/auth.mapper.ts

frontend/admin/shared-core/contracts/auth.contract.ts
frontend/admin/shared-core/api/auth.api.ts
frontend/admin/shared-core/hooks/useAdminAuthSession.ts
```

Render atual/futuro:

```text
frontend/client/web/src/legacy/app-shell/AuthModal.tsx
frontend/client/web/src/screens/portal/tabs/MinhaContaView.tsx
frontend/client/web/src/screens/portal/tabs/MeusPedidosView.tsx
```

## Checklist Para Copiar/Adaptar em Outro Produto

1. Copiar/adaptar entidades backend de auth/users.
2. Ajustar seed/config de organization inicial.
3. Copiar/adaptar contratos compartilhados.
4. Copiar/adaptar API clients.
5. Copiar/adaptar hooks.
6. Renderizar telas/modais no visual do novo produto.
7. Trocar copy/locale/tema/imagens.
8. Validar permissoes por organizationId.
9. Rodar testes/builds do produto novo.

## Seeds Esperados

### Seed principal: Royal Carnes

Organization:

```text
slug: royalprime
name: RoyalPrime
businessName: Royal Carnes
locale: pt-BR
timezone: America/Sao_Paulo
currency: BRL
```

Roles:

```text
owner
admin
operator
customer
```

Permissoes iniciais:

```text
orders.read
orders.approve
orders.updateStatus
products.manage
customers.read
customers.manage
deliveries.manage
payments.markPaid
```

Users de desenvolvimento:

```text
admin@royalprime.local -> owner/admin
operador@royalprime.local -> operator
cliente@royalprime.local -> customer + Customer
```

Customers de desenvolvimento:

```text
Felipe Vilela
Lucas Dias
```

### Seed exemplo: BikeClub

Organization:

```text
slug: bikeclub
name: BikeClub
businessName: BikeClub Assinaturas
locale: pt-BR
timezone: America/Sao_Paulo
currency: BRL
```

Roles:

```text
owner
admin
mechanic
customer
```

Permissoes:

```text
orders.read
orders.updateStatus
products.manage
customers.read
deliveries.manage
```

Objetivo deste seed:

```text
provar que User, OrganizationMember e Customer nao dependem de Royal Carnes
```

## Criterio Para Virar Kit-Ready

Este kit vira `kit-ready` quando:

- backend real de auth existir;
- cliente e admin usarem contratos claros;
- ao menos um fluxo de login/cadastro/me estiver conectado;
- permissao por organizationId estiver validada;
- os arquivos fonte estiverem listados aqui;
- a UI estiver separada do fluxo por hooks.

## Criterio Para ServiceOS Candidate

Este kit vira `serviceos-candidate` somente quando:

- for reutilizado fora do RoyalPrime;
- o contrato nao depender de Royal Carnes;
- houver fronteira clara entre auth generico e regras do produto;
- a extracao reduzir complexidade real.
