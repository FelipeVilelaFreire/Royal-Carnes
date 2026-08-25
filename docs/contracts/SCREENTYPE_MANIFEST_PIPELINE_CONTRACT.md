# Contrato de Montagem Declarativa por ScreenTypes, Manifestos & Rotas (Client & Admin)

Este documento registra a **Regra Canônica de Montagem por ScreenTypes, Manifestos e o Registro Único de Rotas (`routes.ts`)** compartilhada entre o **Client (`frontend/client/`)** e o **Admin (`frontend/admin/`)** no **PrimeCutClub**.

---

## 💡 Princípio de Separação Estrita & Registro de Rotas (Zero Fricção)

```text
┌──────────────────────────────────────────────────────────────────────────┐
│  1. `routes.ts` (O Registro Único e Central de Rotas)                   │
│     • NENHUM botão, link, item de menu ou config hardcida URLs soltas.    │
│     • Declara o mapa mestre: `routeKey` -> `path` (ex: `mySubscription`   │
│       -> `/minha-assinatura`).                                           │
│     • Permite trocar qualquer URL no sistema alterando 1 linha no         │
│       `routes.ts` sem quebrar nenhum botão ou navegação.                  │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  2. `src/` (Peças de Renderização / Engines Visualmente Burras)          │
│     • Apenas fornece as engines por ScreenType (HomeView, DashboardView,│
│       TableView, DetailView) vestindo os componentes de `foundation/`. │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  3. `manifest/` (O Cérebro da Montagem Declarativa)                     │
│     • Declara quais seções aparecem, títulos, textos, `routeKey` e      │
│       qual `screenType` deve ser acionado para renderizar aquela chave.  │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 🏛️ Estrutura do Client e Admin com `routes.ts`

### 🌐 1. Aplicação do Cliente (`frontend/client/`)

```text
frontend/client/
│
├── manifest/                             <-- 📍 O CÉREBRO DA MONTAGEM DO CLIENTE
│   ├── routes.ts                         (📌 Registro Único de Rotas: home, plans, checkout, mySubscription)
│   ├── navigation.ts                     (Itens de menu declarando routeKey: "mySubscription")
│   ├── screens.ts                        (Mapeia screenKey: "home" -> screenType: "home_page")
│   ├── locales/pt-BR.ts                  (Strings de UI em PT-BR)
│   ├── appshell.config.jsx               (Config do AppShell do cliente)
│   └── pages/
│       └── home.config.jsx               (Ficha técnica declarativa das seções da Home)
│
└── src/
    ├── views/                            (Engine por ScreenType: HomeView.tsx, PlansView.tsx)
    └── app/
        ├── layout.tsx                    (Layout raiz Next.js)
        └── page.tsx                      (Renderiza a HomeView envelopada no AppShell)
```

---

### 🛡️ 2. Aplicação da Empresa (`frontend/admin/`)

```text
frontend/admin/
│
├── manifest/                             <-- 📍 O CÉREBRO DA MONTAGEM DO ADMIN
│   ├── routes.ts                         (📌 Registro Único de Rotas: dashboard, subscribers, deliveries)
│   ├── navigation.ts                     (Itens do painel declarando routeKey: "subscribers")
│   ├── screens.ts                        (Mapeia screenKey: "dashboard" -> screenType: "dashboard_page")
│   ├── locales/pt-BR.ts                  (Strings de UI do back-office em PT-BR)
│   ├── appshell.config.jsx               (Config do AppShell do admin)
│   └── pages/
│       ├── dashboard.config.jsx          (Ficha técnica declarativa das métricas MRR)
│       ├── subscribers.config.jsx        (Ficha técnica declarativa da tabela de assinantes)
│       └── deliveries.config.jsx         (Ficha técnica declarativa da expedição de carnes)
│
└── src/
    ├── views/                            (Engine por ScreenType: DashboardView.tsx, TablePageView.tsx)
    └── app/
        ├── layout.tsx                    (Layout do SPA)
        └── page.tsx                      (Renderiza as telas do Admin envelopadas no AppShell)
```

---

## 🔄 O Pipeline de Resolução de Tela sem Fricção

```text
Etapa 1: `routes.ts` ─────> Mantém o dicionário mestre de rotas (`mySubscription` -> `/minha-assinatura`).
Etapa 2: `navigation.ts` ──> Declara itens referenciando `routeKey: "mySubscription"`.
Etapa 3: `screens.ts` ────> Resolve `screenKey: "home"` para o tipo de tela (`screenType: "home_page"`).
Etapa 4: `pages/*.jsx` ───> Entrega o manifesto declarativo (título, subtítulo, seções, botões).
Etapa 5: `src/views/` ────> A engine do ScreenType recebe o manifesto e renderiza usando os componentes de `foundation/`.
```
