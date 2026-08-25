# 👑 ROYAL PRIME — Regras Invioláveis de Desenvolvimento

## 1. Regra Inviolável: Proibição Absoluta de Emojis na UI
É RIGOROSAMENTE PROIBIDO o uso de caracteres de emoji Unicode soltos em componentes JSX, TSX, strings de UI, manifestos ou ícones da interface (por exemplo: 🥩, 📦, 🔥, 🚚, ⭐, 🔍, ✏️, 🚪, 💰, 🎯, 🗑️, ⚙️). 
Toda a interface deve utilizar EXCLUSIVAMENTE componentes de Ícones SVG da Foundation (`@foundation/ui/Icon/AppIcons` ou o contrato equivalente do ServiceOS) para garantir a estética gourmet, sóbria e premium de produto executivo.

## 2. Regra ServiceOS-first
O `ServiceOS` e a `Foundation` são as fontes primárias de capacidades reutilizáveis. Antes de criar UI, AppShell, componentes de produto genéricos, builders ou primitives locais, verifique se a capacidade já existe.

## 3. Regra i18n-first para Textos de Interface
Todo texto novo de interface deve nascer em arquivos de strings/locales (`locales/pt-BR.ts`) e ser consumido por chave. Não criar copy de UI hardcoded diretamente em JSX/TSX/JS.

## 4. Contrato AppShell: Header Multi-Layout & Surface Replacement
O AppShell é o dono único das capacidades genéricas da casca (Header desktop/mobile, Drawer, Sidebar, Footer, Bottom TabBar). O Header é regido por 2 dimensões:
- **Vestuário de Superfície**: Consome 100% das variáveis `--semicomposed--surface--*` ou `clientThemeManifest.colors`.
- **Modos de Layout**: `attached` (acoplado full-width) ou `floating` (flutuante).

## 5. Grid Math de 20 Colunas e Delimitações Úteis
A Matriz Global é regida por 20 colunas. Seções amplas utilizam 20/17 colunas úteis e seções de leitura/sanfona usam 14 colunas úteis.

## 6. Regra Inviolável de Consumo de Mocks & Data-Driven UI
Todas as telas, widgets, listas, tabelas e seções do sistema devem OBRIGATORIAMENTE consumir seus dados e registros a partir dos arquivos de Mocks (`client/shared-core/mocks/` ou `admin/shared-core/mocks/`) e Manifestos (`manifest/pages/*.config.jsx`). É RIGOROSAMENTE PROIBIDO hardcodar registros fictícios de dados do usuário, planos, valores financeiros ou linhas de tabelas diretamente dentro dos componentes JSX/TSX.
