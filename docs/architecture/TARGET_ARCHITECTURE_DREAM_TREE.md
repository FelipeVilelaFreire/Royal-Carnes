# Arquitetura Alvo Definitiva: A Tree Perfeita - PrimeCutClub

Este documento registra a **Arquitetura Alvo Oficial e Definitiva ("Tree Perfeita")** do **PrimeCutClub**, desenhada e aprovada em conjunto.

Ele serve como fonte mestre e guia inviolável de organização do projeto.

---

## 🌳 A Tree Perfeita Completa

```text
PrimeCutClub/
│
├── TARGET_ARCHITECTURE_DREAM_TREE.md     <-- Este Mapa Mestre da Arquitetura Perfeita
├── EXECUTION_ROADMAPPING_SEQUENCE.md     <-- Roteiro de Execução Bottom-Up
├── PHASE_1_COMPATIBILITY_CONTRACT.md     <-- Contrato de Meio-Termo da Fase 1
├── SCREENTYPE_MANIFEST_PIPELINE_CONTRACT.md <-- Contrato de Montagem por ScreenTypes e Rotas
├── CLIENT_SURFACE_SERVICES_CONTRACT.md   <-- Contrato de Separação Landing vs Portal no Cliente
│
├── backend/                               <-- 🐍 BACKEND DJANGO (Modular Monolith Multitenant)
│   ├── config/                            (settings.py, urls.py, wsgi.py)
│   └── apps/                              (core, plans, subscriptions, billing, deliveries)
│
├── bats/                                  <-- ⚡ AUTOMAÇÃO DE INICIALIZAÇÃO
│   ├── dev-web.bat                        (Inicia a Surface do Cliente na porta 3000 em 1 clique)
│   ├── setup.bat                          (Instala requisitos e roda migrações)
│   ├── start-backend.bat                  (Inicia servidor Django na porta 8000)
│   └── migrate.bat                        (Executa migrações no banco SQL)
│
└── frontend/                              <-- 🌐 FRONTEND COMPACTO & AUTÔNOMO
    │
    ├── foundation/                        <-- 🎨 1. A FUNDAÇÃO DE PRIMITIVOS & SHELLS
    │   ├── docs/                          (Theme.md, SemiComposed.md, UI.md - Manuais canônicos)
    │   ├── tokens/                        (theme.tokens.ts, resolver.ts)
    │   ├── semi-composed/                 (surface.css)
    │   ├── ui/                            (Button, Card, Field, Select, Layout, Text, Surface)
    │   │
    │   ├── shells/                        <-- 🏛️ SHELLS REUTILIZÁVEIS DA PLATAFORMA
    │   │   └── appshell/                  (Header/, SidebarMenu/, Drawer/, BottomTabBar/,
    │   │                                   ScreenContent.tsx, AppShellRuntime.tsx)
    │   │
    │   └── product-components/            (PlanCard, DeliveryTracker, MetricKpiCard, DataGridTable)
    │
    ├── shared-core/                       <-- 🧠 2. COMPARTILHADO REAL (CLIENT & ADMIN)
    │   ├── public/                        <-- 📁 PASTA FÍSICA MESTRE DE ASSETS
    │   │   └── assets/                    (brand/ logo, images/ fotos de carnes, icons/ vetorizados)
    │   │
    │   ├── manifest/                      <-- 📍 MANIFESTOS COMPARTILHADOS Tipados
    │   │   ├── assets.ts                  (📌 Mapa Mestre Tipado de Assets: sharedAssets.brand, client, admin)
    │   │   └── design-system/             (theme, semi-composed, ui)
    │   │
    │   ├── contracts/                     (Interfaces DTO)
    │   ├── providers/                     (Switch Mocks vs API)
    │   └── identity.ts                    (Identidade da marca)
    │
    ├── client/                            <-- 🌐 3. APLICAÇÃO DO CLIENTE (WEB / MOBILE)
    │   │
    │   ├── manifest/                      <-- MANIFESTOS EXCLUSIVOS DO CLIENTE
    │   │   ├── locales/pt-BR.ts           (Dicionário i18n centralizado: landing.* e portal.*)
    │   │   ├── landing/                   (appshell.config.jsx, navigation.ts, pages/landing.config.jsx)
    │   │   └── portal/                    (appshell.config.jsx, navigation.ts, pages/my-subscription.config.jsx)
    │   │
    │   └── src/                           <-- CÓDIGO FONTE DO CLIENTE
    │       ├── views/
    │       │   ├── landing/               (LandingView.tsx, PlansView.tsx, CheckoutView.tsx)
    │       │   └── portal/                (SubscriberPortalView.tsx, DeliveryTrackerView.tsx)
    │       └── app/                       (Routing Next.js: (public)/, (portal)/)
    │
    └── admin/                             <-- 🛡️ 4. APLICAÇÃO DA EMPRESA (ADMIN / BACK-OFFICE)
        │
        ├── manifest/                      <-- MANIFESTOS EXCLUSIVOS DO ADMIN
        │   ├── locales/pt-BR.ts           (Dicionário i18n do back-office)
        │   ├── appshell.config.jsx        (Header Acoplado, SidebarMenu On)
        │   ├── navigation.ts              (Placements: sidebar)
        │   ├── routes.ts                  (Registro mestre de rotas do admin)
        │   └── pages/                     (dashboard.config.jsx, subscribers.config.jsx)
        │
        └── src/                           <-- CÓDIGO FONTE DO ADMIN
            ├── views/                     (DashboardView.tsx, TablePageView.tsx, DetailPageView.tsx)
            └── app/                       (Routing do SPA)
```

---

## 🏛️ Os Pilares Fundamentais da Tree Perfeita

1. **`shared-core/public/assets/`**: Repositório físico central de mídias (JPG, PNG, SVG).
2. **`shared-core/manifest/assets.ts`**: Mapa mestre tipado que conecta o código com os caminhos em `public/assets/`.
3. **`foundation/shells/appshell`**: O AppShell pertence ao diretório de `shells/` da Fundação.
4. **`client/` (Aplicação do Cliente)**: Módulo autocontido dividido em `landing/` (público) e `portal/` (restrito).
5. **`admin/` (Aplicação do Admin)**: Módulo autocontido com suas próprias rotas, manifestos e views operacionais.
