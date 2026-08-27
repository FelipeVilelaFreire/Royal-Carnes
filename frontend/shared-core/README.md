# Frontend Shared-Core Global

Esta pasta guarda somente contratos, manifests base e referencias realmente
comuns entre Client, Admin e Mobile.

Nao e dona de runtime visual.

```text
Foundation executa Design System, AppShell e Product Components.
shared-core global descreve contratos/configs comuns.
client/admin shared-core guardam fluxos de cada surface.
```

Pertence aqui:

- tipos base comuns;
- contratos serializaveis de manifest/config;
- referencias globais de assets;
- identidade comum do produto.

Nao pertence aqui:

- strings exclusivas do client;
- strings exclusivas do admin;
- navegacao exclusiva de uma surface;
- hooks exclusivos do cliente ou admin;
- API clients exclusivos de uma surface;
- runtime visual como Button, AppShell, Header ou Sidebar.

As pastas antigas `client/` e `admin/` dentro deste shared-core sao legado de
transicao. Novos fluxos devem nascer em `frontend/client/shared-core` ou
`frontend/admin/shared-core`.
