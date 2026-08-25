# 👑 Royal Carnes Prime — Design System Specification

O **Royal Carnes Prime Design System** é o guia mestre de marca e interface para o **ROYAL CARNES PRIME**. Ele combina **Minimalismo** e **Luxo Editorial** ("Modern Steakhouse"), tratando cortes gourmet com a mesma precisão e reverência de uma alta joalheria.

---

## 🗺️ 1. Arquitetura de Navegação Única

```text
                         ROYAL CARNES (Marca -> Home /hero)
                              │
           ┌──────────────────┼──────────────────┐
           │                  │                  │
         HOME               CORTES          ROYAL BOX (Assinatura vs Avulso)
      (Descoberta)        (Catálogo)             │
                                          MINHA CONTA (Perfil / Felipe)
                                                 │
                                  ┌──────────────┼─────────────┐
                                  │              │             │
                              Assinatura      Histórico     Pedidos
```

---

## 🎨 2. Paleta de Cores Mestre & Tokens

### ☀️ A. Light Mode (Editorial Luxury — "Papel & Nanquim")
- **Ivory (`#FCFBF7`)**: Fundo principal (canvas quente de papel nobre).
- **Charcoal (`#1A1A1A`)**: Tipografia principal, títulos, bordas estruturais e botões primários.
- **Copper (`#B87333`)**: Cobre metálico para ações de destaque, botões e preços.
- **Graphite (`#4A4A4A`)**: Tipografia secundária (gramaturas, descrições e metadados).
- **Linen (`#F2F1ED`)**: Superfície de containers secundários e filtros.
- **Edge (`#D1D1D1`)**: Borda arquitetônica sutil de 1px em cards de produto.

### 🌙 B. Dark Mode (Gourmet Velvet — "Private Tasting Room")
- **Carvão Profundo (`#0B0908`)**: Canvas escuro de carvão nobre.
- **Vidro Carvão (`#151312`)**: Cards e superfícies elevadas.
- **Linen Escuro (`#221E1B`)**: Containers e inputs de busca.
- **Texto Marfim (`#FCFBF7`)**: Texto de alto contraste sobre fundo escuro (Zero texto preto em fundo escuro).
- **Flame Gold (`#FFC665`)**: Dourado brasa de destaque para preços no dark mode.

---

## ✒️ 3. Tipografia Editorial

Combinação clássica de Serif (**Playfair Display**) e Sans-Serif (**Inter**):

- **Playfair Display**: Alma editorial utilizada para nomes de produtos, headlines H1/H2 e storytelling.
  - `display-lg`: 56px / 700 / lineHeight 1.1 / letterSpacing -0.02em
  - `headline-md`: 32px / 600 / lineHeight 1.25
  - `headline-sm`: 24px / 600 / lineHeight 1.3
- **Inter**: Motor funcional para preços, pesos ("500g"), especificações e labels.
  - `body-lg`: 18px / 400 / lineHeight 1.6
  - `body-md`: 16px / 400 / lineHeight 1.5
  - `label-caps`: 12px / 600 / lineHeight 1.3 / letterSpacing 0.1em (Uppercase)

---

## 📐 4. Componentes Chave da Interface (`src/design-system/`)

1. **`PortalHeader` (`Header.tsx`)**:
   - Header Único e Universal com suporte a recolhimento no scroll (*Shrink Header*).
   - Largura máxima de **1600px**.
   - Navegação simplificada: **Cortes** | **Royal Box**.
   - Ações no canto direito: **Alternador Dark/Light** + **Perfil (Felipe / Minha Conta)**.
   - Alternância de tema persistente salva no `localStorage` sob a chave `"royal_prime_theme"`.

2. **`Footer` (`Footer.tsx`)**:
   - Rodapé corporativo com ano **2026**, 4 colunas de links úteis, atendimento Concierge e margem de separação superior de **112px**.

3. **`MinhaCaixaView` (`/minha-caixa`)**:
   - Página da **Royal Box** com seletor em pílula para alternar entre **Assinatura Mensal** (caixa recorrente de R$ 875/mês com timeline e resumo na direita) e **Caixa Avulsa** (compra pontual sem fidelidade).

---

## 🛑 5. Regras do Sistema na UI
- 🚫 **Zero Emojis Unicode**: Usar EXCLUSIVAMENTE Ícones SVG da Foundation (`@foundation/ui/Icon/AppIcons` ou `design-system/Icons.tsx`).
- 🌐 **i18n-first**: Todas as strings de UI vem de catalogos de locales.
- 🥩 **Mocks-first**: Dados de cortes e assinaturas vem de `client/shared-core/mocks/`.
