# 👑 Royal Carnes Prime - Web Client (`@royalprime/client`)

Aplicação Next.js 16 (App Router) da boutique de carnes nobres e clube de assinatura Royal Carnes Prime.

---

## 🗺️ Rotas Mestre Ativas (`src/app/`)

- `http://localhost:3000/hero` (`/`): Landing Page & Marketplace Descoberta
- `http://localhost:3000/cortes`: Catálogo Gourmet de Cortes Nobres
- `http://localhost:3000/minha-caixa`: Royal Box (Assinatura Mensal vs Caixa Avulsa)

---

## 🎨 Biblioteca Design System (`src/design-system/`)

- **`Header.tsx`**: Header Único e Universal (`PortalHeader`) com suporte a recolhimento no scroll (*Shrink Header*), navegação simplificada (**Cortes** | **Royal Box**), alternador de tema e perfil.
- **`Footer.tsx`**: Rodapé corporativo com ano **2026**, 4 colunas de atendimento concierge e margem superior de `112px`.
- **`Button.tsx`**, **`Card.tsx`**, **`Input.tsx`**, **`Badge.tsx`**, **`Icons.tsx`**: Componentes primitivos baseados em Design Tokens da Foundation.

---

## 💾 Persistência de Tema
O tema escolhido pelo usuário (**Light** ou **Dark**) é gravado em `localStorage` sob a chave `"royal_prime_theme"` e sincronizado dinamicamente em tempo real entre todas as abas e navegações.
