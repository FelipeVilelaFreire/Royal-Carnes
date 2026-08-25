# Contrato de Separação de Serviços na Surface do Cliente

Este documento registra o contrato de separacao de servicos no cliente
(`frontend/client/`). O produto evoluiu de um clube de assinatura puro para uma
experiencia comercial com vitrine, catalogo, Royal Box, Royal Delivery e conta
do cliente.

O contrato detalhado de navegacao, Header, BottomTabBar e estado mockado esta em:

```text
docs/contracts/CLIENT_PORTAL_NAVIGATION_AND_AUTH_STATE_CONTRACT.md
```

## Servicos atuais

1. `landing/`: servico publico de apresentacao e vendas.
2. `portal/`: servico comercial do cliente, com loja, configuradores e conta.

---

## 💡 Princípios Canônicos de Organização

```text
┌──────────────────────────────────────────────────────────────────────────┐
│  1. `locales/` (Dicionário Único de Idioma por Surface)                 │
│     • O arquivo de idioma (`locales/pt-BR.ts`) é ÚNICO por surface.     │
│     • Contém todas as chaves organizadas sob namespaces limpos          │
│       (`landing.*`, `portal.*`).                                         │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  2. `navigation.ts` & `appshell.config.jsx`                               │
│     • A navegacao canonica do cliente fica em `manifest/navigation.ts`.   │
│     • O AppShell do Landing continua publico e comercial.                 │
│     • O AppShell do Portal usa Header no desktop e BottomTabBar mobile.   │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 🌳 A Árvore de Diretórios Oficial do Cliente (`frontend/client/`)

```text
frontend/client/
│
├── manifest/                          <-- 💬 DICIONÁRIO DE IDIOMA & MANIFESTOS DO CLIENTE
│   │   ├── routes.ts                  (Registro mestre de rotas: `/`, `/home`, `/cortes`, etc.)
│   │   ├── theme.manifest.ts          (Tokens de cores Gourmet Dark: #0B0908, #FFC665)
│   │   └── locales/
│   │       └── pt-BR.ts               (Contém namespaces: `landing.*` e `portal.*`)
│   │
│   ├── landing/                       <-- 🌐 1. MANIFESTOS DO SERVIÇO DE LANDING PAGE
│   │   ├── appshell.config.jsx        (Header Acoplado Glass + CTA "Seja Sócio" + Footer)
│   │   ├── navigation.ts              (Links: Início, O Clube, A Seleção, Assinaturas, FAQ)
│   │   └── screens.ts                 (Mapeia screenKey: "landing" -> screenType: "landing_page")
│   │
│   └── portal/                        <-- 2. MANIFESTOS DO PORTAL/LOJA DO CLIENTE
│       ├── appshell.config.jsx        (Header desktop, BottomTabBar mobile, auth mock)
│       ├── navigation.ts              (Compatibilidade historica; navegacao canonica em manifest/navigation.ts)
│       └── screens.ts                 (Mapeia screenKey: "portal" -> screenType: "subscriber_portal")
│
└── src/
    │
    ├── views/
    │   ├── landing/                   <-- 🌐 ENGINES VISUAIS DA LANDING PAGE
    │   │   ├── LandingView.tsx        (Engine da Vitrine do Cliente)
    │   │   └── sections/              (HomeHeroSection, HomeDifferentialsSection, HomePlansSection...)
    │   │
    │   └── portal/                    <-- ENGINES VISUAIS DO PORTAL/LOJA DO CLIENTE
    │       ├── PortalView.tsx         (Engine Mestre do Portal)
    │       └── tabs/                  (HomeView, CortesView, MinhaCaixaView, MeuClubeView)
    │
    └── app/                           <-- ROUTING NEXT.JS (App Router)
        ├── page.tsx                   (Rota pública: "/" - Landing Page)
        ├── (portal)/
        │   ├── home/page.tsx          (Rota portal: "/home")
        │   ├── cortes/page.tsx        (Rota portal: "/cortes")
        │   ├── minha-caixa/page.tsx   (Rota portal: "/minha-caixa")
        │   ├── royal-delivery/page.tsx (Rota portal: "/royal-delivery")
        │   └── meu-clube/page.tsx     (Rota portal: "/meu-clube")
```

---

## 📋 Tabela Comparativa de Atribuições

| Característica | Serviço `landing` (Vitrine) | Serviço `portal` (Loja/Conta) |
|---|---|---|
| **Acesso** | Publico | Misto: Home/Cortes publicas; Box/Delivery/Conta protegidas por estado |
| **AppShell Header** | Header comercial | Header desktop; sem Header mobile |
| **AppShell Navigation** | Links comerciais da landing | 5 abas fixas: Home, Cortes, Royal Box, Royal Delivery, Minha Conta |
| **Mobile Experience** | Header/drawer da landing | Somente BottomTabBar |
| **Locales** | Consome `clientPtBR.landing.*` | Consome `clientPtBR.portal.*` |

## Estado atual do portal

O portal nao deve ser tratado como dashboard isolado de assinante. Ele e a
continuidade da loja Royal Prime:

```text
Home -> Cortes -> Royal Box -> Royal Delivery -> Minha Conta
```

No desktop, quando `mockAuthenticated: false`, areas protegidas renderizam
`EmptyState`. No mobile, `mobileMockAuthenticated: true` simula a experiencia
logada para validar a BottomTabBar e o fluxo de app.
