# Client Auth Kit

Fluxo de autenticacao visto pelo cliente.

Inclui:

```text
login
logout
usuario atual
estado autenticado/deslogado
fallback dev quando aplicavel
```

Nao inclui permissao admin nem gestao de usuarios.

Mapa vertical:

```text
docs/kits/kit-01-auth-users-shared-core-map.md
```

Regra:

```text
reusar tipos globais de identity quando forem comuns
manter login/cadastro/portal do cliente neste escopo
nao criar hook generico com if admin/client
```
