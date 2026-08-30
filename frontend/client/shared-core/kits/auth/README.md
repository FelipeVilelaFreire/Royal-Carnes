# Client Auth Kit

Fluxo de autenticacao visto pelo cliente.

Inclui:

```text
login
refresh
logout
usuario atual
cadastro do cliente
estado autenticado/deslogado
fallback dev quando aplicavel
```

Nao inclui permissao admin nem gestao de usuarios.

Mapa vertical:

```text
docs/kits/kit-01-auth-users-shared-core-map.md
contract.md
flow.md
```

Regra:

```text
reusar tipos globais de identity quando forem comuns
manter login/cadastro/portal do cliente neste escopo
nao criar hook generico com if admin/client
```

Arquivos runtime:

```text
contracts/auth.contract.ts
contracts/session.contract.ts
api/auth.api.ts
hooks/useClientAuthSession.ts
hooks/useClientLogin.ts
hooks/useClientRegister.ts
hooks/useClientLogout.ts
mappers/auth.mapper.ts
view-models/auth.view-model.ts
```
