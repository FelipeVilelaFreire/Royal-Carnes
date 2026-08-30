# Admin Auth Kit

Fluxo de autenticacao visto pelo admin.

Inclui:

```text
login admin
refresh
logout
usuario atual
organization atual
estado de permissao
```

Nao inclui telas de gestao de usuarios.

Mapa vertical:

```text
docs/kits/kit-01-auth-users-shared-core-map.md
contract.md
flow.md
```

Regra:

```text
reusar tipos globais de identity quando forem comuns
manter sessao admin e permissao operacional neste escopo
nao reutilizar copy/modal do cliente por conveniencia
```

Arquivos runtime:

```text
contracts/auth.contract.ts
contracts/session.contract.ts
api/auth.api.ts
hooks/useAdminAuthSession.ts
hooks/useAdminLogin.ts
hooks/useAdminLogout.ts
mappers/auth.mapper.ts
view-models/auth.view-model.ts
```
