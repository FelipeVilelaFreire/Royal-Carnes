# Frontend Shared-Core Global

Esta pasta guarda somente contratos, manifest base e referencias realmente
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
- kits globais pequenos em `kits/`.

Status atual:

```text
Kits 01-06 recriados por contrato real de backend
global contem apenas tipos/contratos base e helpers comuns
fluxos client/admin ficam fora do global
```

Nao pertence aqui:

- strings exclusivas do client;
- strings exclusivas do admin;
- navegacao exclusiva de uma surface;
- hooks exclusivos do cliente ou admin;
- API clients exclusivos de uma surface;
- runtime visual como Button, AppShell, Header ou Sidebar.

As pastas antigas `client/` e `admin/` dentro deste shared-core foram removidas.
Novos fluxos devem nascer em `frontend/client/shared-core` ou
`frontend/admin/shared-core`.

## Mentalidade de Kit

```text
frontend/shared-core/kits
  -> capacidades realmente globais

frontend/client/shared-core/kits
  -> capacidades do cliente

frontend/admin/shared-core/kits
  -> capacidades do admin
```

Regra:

```text
promover para global somente tipos/contratos base usados por mais de um escopo
nao colocar fetch, hooks, mappers client/admin ou view-models de tela no global
```

Leia tambem:

```text
docs/architecture/OWNERSHIP_TREE.md
docs/architecture/SHARED_CORE_RULES.md
docs/kits/SHARED_CORE_KITS_01_06_HANDOFF.md
```
