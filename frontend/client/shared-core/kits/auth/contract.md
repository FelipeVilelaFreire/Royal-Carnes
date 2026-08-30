# Client Auth Contract

Runtime real:

```text
frontend/client/shared-core/contracts/auth.contract.ts
frontend/client/shared-core/contracts/session.contract.ts
frontend/client/shared-core/api/auth.api.ts
frontend/client/shared-core/mappers/auth.mapper.ts
frontend/client/shared-core/hooks/useClientAuthSession.ts
```

Endpoints backend consumidos:

```text
POST /api/v1/auth/login/
POST /api/v1/auth/refresh/
POST /api/v1/auth/register/
POST /api/v1/auth/logout/
GET  /api/v1/accounts/me/
```

Contrato fechado neste kit:

```text
ClientLoginInput
ClientRegisterInput
ClientAuthSession
ClientRefreshInput
ClientRefreshResult
ClientRegisterResult
ClientSessionState
```

Garantias:

```text
auth do cliente nao conhece admin users
API client monta headers e fala com endpoint real
hook controla loading, erro, sessao e persistencia opcional
mapper converte DTO do Django para session/view model do cliente
tela futura apenas chama hook e renderiza estado
```

Limite atual:

```text
current customer detalhado depende de customerId/session enriquecida ou endpoint futuro.
Neste corte, login/me retornam usuario e memberships, mas customer permanece null.
```
