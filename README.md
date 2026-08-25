# 👑 Royal Carnes Prime

Boutique autônoma de carnes nobres e sistema de assinatura gourmet com arquitetura desacoplada e suporte ao ServiceOS Standard 2026.

---

## 🗺️ Arquitetura de Navegação & Roteamento Ativo

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

### 🌐 As 3 Páginas Mestre do Cliente:

1. **`http://localhost:3000/hero` (ou `/`)**:
   - **Marketplace de Descoberta / Landing Page**: Banner Hero imersivo com fotografia gourmet, vinheta de alto contraste, selos de rastreabilidade e 4 seções em múltiplos estilos de cards (*Ofertas*, *Kits Curados*, *Wagyu A5 Raro*, *Acessórios & Harmonização*).

2. **`http://localhost:3000/cortes`**:
   - **Catálogo Gourmet de Cortes Nobres**: Pílulas de categorias arredondadas sem barra de rolagem lateral (`flex-wrap`), botão de carregamento dinâmico *"Carregar mais cortes"* e filtros de ordenação.

3. **`http://localhost:3000/minha-caixa`**:
   - **Royal Box**: Seletor em pílula para alternar entre **Assinatura Mensal** (R$ 875/mês com timeline de entrega de 5 passos e resumo na direita) e **Caixa Avulsa** (montagem pontual sem fidelidade).

---

## 🎨 Design System (`src/design-system/`)

- **`Header.tsx` (`PortalHeader`)**: Header Único e Universal com efeito de recolhimento no scroll (*Shrink Header*), alternador de tema persistente no `localStorage`, alinhamento óptico em baseline e navegação simplificada (**Cortes** | **Royal Box**).
- **`Footer.tsx`**: Rodapé corporativo gourmet com ano **2026**, 4 colunas institucionais, selo de atendimento Concierge e margem de separação superior de `112px`.
- **`Button.tsx`**, **`Card.tsx`**, **`Input.tsx`**, **`Badge.tsx`**, **`Icons.tsx`**: Componentes primitivos sem emojis soltos em estrita conformidade com os Design Tokens da Foundation (`themeColorsDefault`).

---

## 🚀 Comandos de Build & Execução

```bash
# Executar a aplicação Web Cliente (Next.js 16)
npm run dev:client

# Executar a aplicação Web Admin (Vite + React)
npm run dev:admin

# Build de Produção do Cliente
npm run build:client

# Build de Produção do Admin
npm run build:admin
```
