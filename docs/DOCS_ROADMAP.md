# 🗺️ Roadmap & Índice Mestre de Documentação (`docs/`)

Este documento é o **Índice Mestre e Guia de Navegação** de toda a documentação de arquitetura, contratos e padrões do **ROYAL PRIME / PrimeCutClub**.

---

## 📌 Visão Geral do Sistema de Documentação

A documentação está dividida em duas categorias estritas para garantir clareza, previsibilidade e paridade total com o **ServiceOS**:

```text
PrimeCutClub/
├── AGENTS.md                                 <-- 🛑 Regras Universais e Invioláveis na RAIZ
└── docs/
    ├── DOCS_ROADMAP.md                        <-- 📍 Este Índice Mestre
    ├── README.md                              <-- Apresentação rápida da pasta docs/
    │
    ├── contracts/                             <-- 📜 1. CONTRATOS ATIVOS DE CÓDIGO & FLUXO
    │   ├── CLIENT_SURFACE_SERVICES_CONTRACT.md
    │   ├── CLIENT_PORTAL_NAVIGATION_AND_AUTH_STATE_CONTRACT.md
    │   ├── SCREENTYPE_MANIFEST_PIPELINE_CONTRACT.md
    │   └── MOCK_AND_ENV_ARCHITECTURE.md
    │
    ├── product/                               <-- 🧭 2. ESCOPO DE PRODUTO DO MVP
    │   └── ROYAL_CARNES_MVP_PRODUCT_SCOPE.md
    │
    └── architecture/                          <-- 📐 3. VISÃO DE ARQUITETURA & DESIGN SYSTEM
        ├── STITCH_PROMPTS_AND_DESIGN_SYSTEM.md
        ├── EXECUTION_ROADMAPPING_SEQUENCE.md
        ├── PHASE_1_COMPATIBILITY_CONTRACT.md
        └── TARGET_ARCHITECTURE_DREAM_TREE.md
```

---

## 📜 1. Contratos Ativos (`docs/contracts/`)

Documentos que regem o código e a estrutura em tempo de execução:

| Documento | Função & Responsabilidade | Estado |
|---|---|---|
| [`CLIENT_SURFACE_SERVICES_CONTRACT.md`](contracts/CLIENT_SURFACE_SERVICES_CONTRACT.md) | Regra de separação entre o serviço público de vendas (`landing/`) e o portal do cliente (`portal/`). | 🟢 Ativo |
| [`CLIENT_PORTAL_NAVIGATION_AND_AUTH_STATE_CONTRACT.md`](contracts/CLIENT_PORTAL_NAVIGATION_AND_AUTH_STATE_CONTRACT.md) | Contrato atual do portal: 5 abas fixas, Header desktop, BottomTabBar mobile, auth mock e EmptyState para áreas privadas. | 🟢 Ativo |
| [`SCREENTYPE_MANIFEST_PIPELINE_CONTRACT.md`](contracts/SCREENTYPE_MANIFEST_PIPELINE_CONTRACT.md) | Regra de ouro da montagem por ScreenTypes (`routes.ts ➔ navigation.ts ➔ screens.ts ➔ pages/*.config.jsx ➔ views/`). | 🟢 Ativo |
| [`MOCK_AND_ENV_ARCHITECTURE.md`](contracts/MOCK_AND_ENV_ARCHITECTURE.md) | Padrão de mocks isolados por surface (`client/` e `admin/`), `.env` e duplo uso dos dados fictícios como SEED no backend. | 🟢 Ativo |

---

## 🧭 2. Escopo de Produto (`docs/product/`)

Documentos que registram o combinado de negocio e fluxo do MVP:

| Documento | Função & Responsabilidade | Estado |
|---|---|---|
| [`ROYAL_CARNES_MVP_PRODUCT_SCOPE.md`](product/ROYAL_CARNES_MVP_PRODUCT_SCOPE.md) | Escopo atual do MVP: Landing, Home vitrine, Catalogo, Produtos, Assinatura fechada, Royal Box recorrente mensal e Royal Delivery avulso. | 🟢 Ativo |

---

## 📐 3. Visão de Arquitetura & Design System (`docs/architecture/`)

Documentos que guiam o design, a evolução das UIs e a integração com o ServiceOS:

| Documento | Função & Responsabilidade | Estado |
|---|---|---|
| [`STITCH_PROMPTS_AND_DESIGN_SYSTEM.md`](architecture/STITCH_PROMPTS_AND_DESIGN_SYSTEM.md) | Guia do Design System (Gourmet Dark vs Operational Slate) e biblioteca de prompts do Stitch AI por aba. | 🟢 Ativo |
| [`EXECUTION_ROADMAPPING_SEQUENCE.md`](architecture/EXECUTION_ROADMAPPING_SEQUENCE.md) | Roadmap em 5 passos para a construção bottom-up da plataforma. | 🟢 Em Evolução |
| [`PHASE_1_COMPATIBILITY_CONTRACT.md`](architecture/PHASE_1_COMPATIBILITY_CONTRACT.md) | Contrato de compatibilidade conceitual e transição sem fricção com o ServiceOS. | 🟢 Ativo |
| [`TARGET_ARCHITECTURE_DREAM_TREE.md`](architecture/TARGET_ARCHITECTURE_DREAM_TREE.md) | Árvore de alvos e arquitetura dos módulos do sistema. | 🟢 Visão de Futuro |

---

## 🔄 Ordem de Leitura Recomendada para Desenvolvedores & Agentes

1. **`AGENTS.md`** *(Raiz)*: Entender as regras estritas (zero emojis, SVG icons, i18n-first, 20 colunas).
2. **`docs/DOCS_ROADMAP.md`**: Mapeamento geral.
3. **`docs/product/ROYAL_CARNES_MVP_PRODUCT_SCOPE.md`**: Entender o produto antes de alterar telas, mocks ou fluxos.
4. **`docs/contracts/SCREENTYPE_MANIFEST_PIPELINE_CONTRACT.md`**: Como criar ou alterar telas sem hardcode.
5. **`docs/contracts/CLIENT_SURFACE_SERVICES_CONTRACT.md`**: Como funciona a separação entre Landing e Portal.
6. **`docs/architecture/STITCH_PROMPTS_AND_DESIGN_SYSTEM.md`**: Regras visuais e geração de interfaces.
