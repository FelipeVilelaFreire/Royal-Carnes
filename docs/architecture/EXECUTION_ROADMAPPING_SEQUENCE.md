# Sequência de Execução & Status do Roadmap - PrimeCutClub

Este documento fixa a **Sequência Oficial de Execução Bottom-Up** e o **Status Atual de Progresso** do **ROYAL PRIME / PrimeCutClub**.

---

## 📐 A Sequência de Execução em 5 Passos

```text
┌────────────────────────────────────────────────────────────────────────┐
│ PASSO 1: Theme + Semi-Composed + UI Primitives                         │ [✅ CONCLUÍDO]
│  ↳ Tokens (--theme--*), receitas e componentes UI (Button, Text, Card) │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ PASSO 2: AppShell Architecture                                         │ [✅ CONCLUÍDO]
│  ↳ Header acoplado glass, slots, navegação declarativa e Footer       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ PASSO 3: Regras de Landing Page & Manifesto Declarativo                 │ [✅ CONCLUÍDO]
│  ↳ Matriz de 20 colunas, paridade MeatClubPage, assets e locales/pt-BR │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ PASSO 4: Landing Blocks, ScrollToAppear & Portal (Cliente Next.js)     │ [✅ CONCLUÍDO]
│  ↳ HeroSection, Differentials, Showcase, Plans, Gift, FAQ, Portal Tab  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ PASSO 5: Admin Operational Engine & Integração Django                  │ [🔄 EM ANDAMENTO]
│  ↳ Métricas MRR, tabela de assinantes, expedição de lotes e API        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Detalhamento dos Passos & Checklists

### 🎨 PASSO 1: Theme + Semi-Composed + UI Primitives (✅ Concluído)
- **Theme Tokens (`frontend/foundation/tokens/`)**:
  - Variáveis `--theme--color-bg`, `--theme--color-surface`, `--theme--color-primary`, `--theme--color-text`.
  - Distinção clara: Gourmet Dark no Cliente (`#0B0908`, `#FFC665`) vs Operational Slate no Admin (`#080F1E`, `#00E5FF`).
- **UI Primitives (`frontend/foundation/ui/`)**:
  - Componentes tokenizados sem emojis hardcoded: `<Button>`, `<Text>`, `<Card>`, `<Input>`, `<Badge>`, `<Select>`, `<ScrollToAppear>`.

---

### 🏛️ PASSO 2: AppShell Architecture (✅ Concluído)
- **Header Structuring (`frontend/foundation/shells/appshell/`)**:
  - Modos de layout: `attached` (acoplado full-width) vs `floating`.
  - Transição de desfoque de vidro (`backdrop-filter: blur(20px)`).
- **Footer & Drawer**:
  - Roda pé estrutural e menu mobile off-canvas sem emojis.

---

### 🗺️ PASSO 3 & 4: Landing Page & Portal do Cliente (✅ Concluído)
- **Paridade 100% com o `MeatClubPage`**:
  - Texto integral do catálogo `pt-BR.ts` sem simplificações.
  - Imagem de fundo em tela cheia no Hero com gradiente sobreposto.
  - Seções em vidro e carvão com 20 colunas e amplitude de 1440px.
  - Acordeão expansível fluído com transição CSS Grid (`0.45s cubic-bezier`).
  - Animação de entrada ao rolar a página (`<ScrollToAppear>`).
- **Rotas e Portal**:
  - Separação entre a Landing (`/`) e o Portal do Sócio (`/home`, `/cortes`, `/minha-caixa`, `/meu-clube`).

---

### 🛡️ PASSO 5: Admin Operational Engine & Backend Django (🔄 Próximo Foco)
- **Engine Operacional do Admin (`frontend/admin/`)**:
  - Painéis de métricas MRR, tabela de alta densidade de assinantes e expedição de lotes.
- **Backend Django (`backend/`)**:
  - API de assinatura recorrente e comando `python manage.py seed_data`.
