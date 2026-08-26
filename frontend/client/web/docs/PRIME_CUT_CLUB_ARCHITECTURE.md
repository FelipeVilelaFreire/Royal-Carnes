# 🥩 PRIME CUT CLUB: ARQUITETURA OFICIAL DE PASTAS

Documento mestre de arquitetura do **Prime Cut Club**, estruturado rigorosamente por namespaces e contextos para evitar redundâncias ou pastas soltas.

---

## 🏛️ Árvore de Diretórios Oficial (Next.js 16 Route Groups)

```text
frontend/client/
├── docs/
│   └── PRIME_CUT_CLUB_ARCHITECTURE.md     # Documento Mestre de Arquitetura
├── manifest/                               # Manifestos Fonte Única de Verdade
│   ├── landing/
│   │   └── appshell.config.jsx             # Config do AppShell da Landing Page
│   ├── portal/
│   │   └── appshell.config.jsx             # Config do AppShell do Portal (Sidebar 20 cols)
│   ├── locales/
│   │   └── pt-BR.ts                        # Catálogo de Idiomas (i18n)
│   ├── navigation.ts                       # Rotas & Abas da Landing e do Portal
│   └── routes.ts                           # Definição estrita das URLs
└── src/
    ├── app/                                # Next.js 16 App Router
    │   ├── layout.tsx
    │   ├── page.tsx                        # Rota "/" -> Landing Page Pública
    │   └── (portal)/                       # ROUTE GROUP DO PORTAL (Organização em app/)
    │       ├── minha-assinatura/
    │       │   └── page.tsx                # Rota "/minha-assinatura" -> Portal (Home)
    │       ├── cortes/
    │       │   └── page.tsx                # Rota "/cortes" -> Portal (Cortes)
    │       ├── minha-caixa/
    │       │   └── page.tsx                # Rota "/minha-caixa" -> Portal (Minha Caixa)
    │       └── meu-clube/
    │           └── page.tsx                # Rota "/meu-clube" -> Portal (Meu Clube)
    └── screens/                            # Camada Visual Organizada por Dominio
        ├── landing/
        │   ├── LandingView.tsx             # Orquestrador da Landing Page pública
        │   └── sections/                   # Seções Modulares da Landing Page
        └── portal/                         # Contexto Exclusivo do Portal do Assinante
            ├── PortalView.tsx              # Orquestrador Mestre do Portal (AppShell + Sidebar)
            └── tabs/                       # As 4 Abas do Portal agrupadas
                ├── HomeView.tsx            # Aba 1: Home (Banner + Destaques)
                ├── CortesView.tsx          # Aba 2: Cortes (Boutique de Carnes)
                ├── MinhaCaixaView.tsx      # Aba 3: Minha Caixa (Box & Timeline)
                └── MeuClubeView.tsx        # Aba 4: Meu Clube (Perfil & Conta)
```

---

## 📌 Garantias da Estrutura Refatorada:

1. **Route Group em `app/` (`(portal)`)**:
   - As rotas do portal estão agrupadas isoladamente dentro da pasta `src/app/(portal)/`.
   - O Next.js preserva as URLs limpas (`/minha-assinatura`, `/cortes`, `/minha-caixa`, `/meu-clube`), mas limpa a raiz de `src/app/`.
2. **Encapsulamento Visual em `screens/` (`portal/tabs/`)**:
   - Todas as 4 abas do portal pertencem a pasta `src/screens/portal/tabs/`.
