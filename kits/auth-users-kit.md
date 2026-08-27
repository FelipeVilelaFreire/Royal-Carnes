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
