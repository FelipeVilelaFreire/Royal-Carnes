# Especificação de Design System & Prompts do Stitch - PrimeCutClub

Este documento define a **Guia Global de Design System** do **PrimeCutClub** e entrega os **Prompts Prontos para Gerar cada Tela/Aba no Stitch (Stitch AI)**.

---

## 🎨 Parte 1: Guia Global do Design System (ServiceOS Standard)

### 1. Paleta de Cores e Atmosfera

#### A. Surface do Cliente (Web / Mobile - Experiência Gourmet Dark)
- **Fundo Principal (`--theme--color-bg`)**: `#121212` (Charcoal Nobre / Preto Quente)
- **Superfície dos Cards (`--theme--color-surface`)**: `#1E1E1E` (Grafite Elevado)
- **Acento Primário (`--theme--color-primary`)**: `#D4AF37` (Dourado Champagne / Ouro Nobre)
- **Texto Principal (`--theme--color-text`)**: `#F5F5F5` (Branco Marfim High-Contrast)
- **Texto Secundário (`--theme--color-text-muted`)**: `#A0A0A0` (Cinza Muted)
- **Receitas de Superfície (`--semicomposed--surface--*`)**:
  - `solid`: Fundo `#1E1E1E` com borda sutil `#2A2A2A` e raio `16px`.
  - `glass`: Fundo `rgba(30, 30, 30, 0.75)` com `backdrop-blur: 16px` e borda dourada translucida.
  - `gourmet-badge`: Fundo sutil dourado `rgba(212, 175, 55, 0.15)` com texto `#D4AF37`.

#### B. Surface do Admin (Painel Operacional - Alta Densidade)
- **Fundo Principal**: `#0F172A` (Slate Dark)
- **Superfície dos Cards**: `#1E293B` (Slate Elevado)
- **Acento Primário**: `#2563EB` (Azul Elétrico Operacional)
- **Texto Principal**: `#F8FAFC`
- **Badges de Status**: Verde `#22C55E` (Ativo/Pago), Amarelo `#F59E0B` (Pausado/Pendente), Vermelho `#EF4444` (Cancelado/Atrasado).

---

## 📱 Parte 2: Prompts do Stitch por Aba (Cliente: Web + Mobile)

---

### 🖥️ Aba 1 (Cliente): Landing Page & Hero Vitrine
> **Objetivo**: Encantar o cliente, apresentar a experiência do clube de carnes nobres e introduzir a proposta de valor.

```text
STITCH PROMPT: PRIMECUT_CLIENT_LANDING_PAGE

Role & Context:
Design a luxury, high-end e-commerce landing page for 'Prime Cut Club' - a premium meat subscription service delivering dry-aged Wagyu, Picanha, and gourmet BBQ cuts monthly.

Design System Requirements:
- Theme: Dark Gourmet (#121212 background, #1E1E1E cards, #D4AF37 gold primary accent, #F5F5F5 text).
- Layout Math: 20-Column Matriz Math. Hero Section uses 17 useful columns with Fold Peeking (hero-peek min-height calc(90vh - headerOffset)).
- Header: Attached floating glass header with brand logo on left, nav links (Início, Planos, Como Funciona, Minha Assinatura) in center, and "Assinar Agora" gold CTA button on right.

Key Sections to Render:
1. HERO SECTION:
   - Left (10.5 cols): H1 "As Melhores Carnes do Mundo Entregues na Sua Porta", P "Receba mensalmente kits exclusivos com cortes de maturação perfeita, frete refrigerado VIP e guia do assador.", CTA "Escolher Meu Plano" (Gold Solid Button) + "Ver Cortes da Estação" (Outline Glass Button).
   - Right (6.5 cols): High-res showcase card with a sizzling Wagyu A5 steak on a wooden board with gold accent badge "Selo de Origem A5".
2. BENEFIT CARDS (3-Grid):
   - Card 1: "Maturação Dry-Aged 45 dias" (Icon: Snowflake/Sparkles).
   - Card 2: "Cortes Embalados a Vácuo & Refrigerados" (Icon: ShieldCheck).
   - Card 3: "Flexibilidade Total: Pause ou Troque Quando Quiser" (Icon: Calendar).
3. HOW IT WORKS (3 Steps):
   - Step 1: Escolha seu plano (Essencial, Master, Wagyu).
   - Step 2: Personalize o dia da entrega mensal.
   - Step 3: Receba em caixa térmica especial na sua porta.
```

---

### 🥩 Aba 2 (Cliente): Seletor de Planos & Comparativo
> **Objetivo**: Permitir a escolha clara entre os 3 planos de assinatura com toggle de pagamento Mensal / Anual.

```text
STITCH PROMPT: PRIMECUT_CLIENT_PLANS_SELECTOR

Role & Context:
Design a clean, high-conversion Plan Selector UI for 'Prime Cut Club' meat subscription.

Design System Requirements:
- Theme: Dark Gourmet (#121212 background, #D4AF37 gold accents).
- Toggle Bar: Centered Pill Toggle switch between "Mensal" and "Anual (15% OFF)".

Cards Layout (3 Cards Grid):
1. PLAN 1: "Essencial Barbecue"
   - Price: R$ 199/mês
   - Tagline: "Cortes nobres essenciais para o seu churrasco mensal"
   - Features Checkmark List: 4kg de cortes selecionados, Picanha e Ancho maturados, Frete Grátis, Vídeos com Dicas.
   - CTA: "Assinar Essencial" (Outline Button).

2. PLAN 2 (RECOMMENDED / FEATURED): "Master Churrasco"
   - Gold Glowing Border with "Mais Popular" Top Badge.
   - Price: R$ 349/mês
   - Tagline: "A experiência completa de churrascaria no conforto de casa"
   - Features Checkmark List: 7kg de cortes nobres, Prime Rib, Chorizo e Picanha Premium, Kit de Sais de Parrilla e Carvão Ecológico, Atendimento Prioritário.
   - CTA: "Assinar Master Churrasco" (Gold Solid Button with hover shine).

3. PLAN 3: "Exclusive Wagyu"
   - Price: R$ 699/mês
   - Tagline: "Para apreciadores do mais alto nível do churrasco mundial"
   - Features Checkmark List: 10kg de cortes super nobres com Wagyu A5, Degustações exclusivas e eventos, Caixa Térmica VIP Agendada, Sommelier de Churrasco dedicado.
   - CTA: "Assinar Exclusive Wagyu" (Gold Glass Button).
```

---

### 💳 Aba 3 (Cliente): Checkout Recorrente
> **Objetivo**: Fluxo focado de finalização de compra, cartão de crédito/PIX e endereço de entrega.

```text
STITCH PROMPT: PRIMECUT_CLIENT_CHECKOUT

Role & Context:
Design a secure, streamlined Checkout page for 'Prime Cut Club' subscription.

Layout (2-Column Grid: 12 cols left form, 8 cols right order summary):
- LEFT FORM (12 cols):
  - Step 1: Dados Pessoais (Nome Completo, E-mail, CPF, Telefone).
  - Step 2: Endereço de Entrega das Carnes (CEP, Rua, Número, Complemento, Bairro, Cidade, Estado).
  - Step 3: Forma de Pagamento Recorrente (Tabs: Cartão de Crédito com renovação automática vs PIX Recorrente). Campos: Número do Cartão, Nome no Cartão, Validade, CVV.
- RIGHT ORDER SUMMARY (8 cols Glass Card):
  - Resumo do Plano Escolhido: "Master Churrasco (7kg/mês)".
  - Frequência: Cobrança Mensal R$ 349,00.
  - Primeiras Carnes na Caixa de Estreia: Picanha Premium (2kg), Chorizo (2kg), Ancho (2kg), Prime Rib (1kg) + Kit Parrilla Grátis.
  - Subtotal: R$ 349,00. Frete: GRÁTIS. Total Hoje: R$ 349,00.
  - Security Badges: "Pagamento Criptografado", "Cancele Quando Quiser Sem Multa".
  - CTA Button: "Finalizar Assinatura & Agendar 1ª Entrega" (Large Gold Button).
```

---

### 👤 Aba 4 (Cliente): Portal do Assinante ("Minha Assinatura")
> **Objetivo**: Dashboard do cliente para gerenciar a assinatura, ver a próxima caixa de carne e código de rastreio.

```text
STITCH PROMPT: PRIMECUT_CLIENT_SUBSCRIBER_PORTAL

Role & Context:
Design a Subscriber Dashboard for 'Prime Cut Club' active members.

Top Header Bar:
- Welcome message: "Olá, Felipe! Sua próxima caixa chega em 10 de Setembro."
- Account Badge: Status "Assinatura Ativa" (Green Badge), Plano "Master Churrasco".

Dashboard Widgets (Grid Layout):
1. PRÓXIMA ENTREGA (Featured Card):
   - Status Progress Tracker: [Pedido Confirmado -> Seleção de Cortes -> Embalagem a Vácuo -> Em Transporte].
   - Cortes Inclusos na Caixa do Mês: Picanha Maturada (2kg), Chorizo (2kg), Prime Rib (1.5kg), Fraldinha (1.5kg).
   - Botão de Ação: "Trocar um Corte desta Caixa" ou "Pausar Entrega deste Mês".
2. HISTÓRICO DE ENTREGAS:
   - Tabela com caixas dos meses anteriores (Agosto, Julho, Junho), status "Entregue" e código de rastreio com link.
3. DADOS DE COBRANÇA:
   - Cartão cadastrado (**** 4892), Próxima cobrança (10/09 - R$ 349,00), Botão "Alterar Cartão".
```

---

## 🛠️ Parte 3: Prompts do Stitch por Aba (Admin Operacional)

---

### 📊 Aba 1 (Admin): Dashboard Geral de Comando
> **Objetivo**: Visão executiva das métricas da empresa (MRR, assinantes, expedição, churn).

```text
STITCH PROMPT: PRIMECUT_ADMIN_DASHBOARD

Role & Context:
Design a high-density Operational Admin Dashboard for 'Prime Cut Club' back-office management.

Design System Requirements:
- Theme: Operational Slate (#0F172A background, #1E293B cards, #2563EB primary blue accent).

Top KPI Stat Cards (4-Grid):
- Stat 1: "MRR (Faturamento Recorrente)" -> R$ 45.890,00 (+12.4% este mês).
- Stat 2: "Assinantes Ativos" -> 128 assinantes (+8 novos este mês).
- Stat 3: "Caixas na Fila de Envio" -> 34 caixas para despachar nesta semana.
- Stat 4: "Taxa de Retenção" -> 98.8% (Churn baixíssimo de 1.2%).

Charts & Detailed Widgets:
- Chart 1 (Recharts Area Chart): Crescimento do Faturamento Mensal (Últimos 6 meses).
- Chart 2 (Donut Chart): Distribuição de Assinantes por Plano (45% Master Churrasco, 35% Essencial, 20% Exclusive Wagyu).
- Widget: Fila Urgente de Atendimento (Assinaturas pendentes de confirmação de pagamento).
```

---

### 👥 Aba 2 (Admin): Gestão de Assinantes & Contratos
> **Objetivo**: Tabela completa para filtrar, visualizar e gerenciar os contratos de assinatura de cada cliente.

```text
STITCH PROMPT: PRIMECUT_ADMIN_SUBSCRIBERS_MANAGEMENT

Role & Context:
Design an Admin Data Table View for managing subscriber contracts.

Header Actions:
- Title: "Gestão de Assinantes"
- Search Bar: Filter by Customer Name, Email, CPF or Subscription ID.
- Status Filter Tabs: [Todos (128), Ativos (115), Pausados (8), Inadimplentes (3), Cancelados (2)].
- CTA: "Exportar Relatório CSV".

Data Table Columns:
- Col 1: Cliente (Avatar + Nome + E-mail).
- Col 2: Plano (Badge: Essencial / Master / Wagyu).
- Col 3: Valor Mensal (R$).
- Col 4: Status (Badges coloridas: Verde = Ativo, Amarelo = Pausado, Vermelho = Inadimplente).
- Col 5: Data de Início & Próxima Renovação.
- Col 6: Ações (Menu Kebab com opções: Ver Perfil, Pausar Assinatura, Alterar Plano, Enviar Lembrete de Cobrança).
```

---

### 📦 Aba 3 (Admin): Central de Logística & Fila de Entregas
> **Objetivo**: Gerenciar os lotes de envio de carne do mês, montagem de caixas e códigos de rastreio.

```text
STITCH PROMPT: PRIMECUT_ADMIN_DELIVERIES_LOGISTICS

Role & Context:
Design a Dispatch & Logistics Management Screen for meat box shipments.

Header:
- Title: "Central de Expedição & Lotes de Entrega"
- Active Batch Banner: "Lote da 2ª Semana de Setembro (34 Caixas)" -> Status "Em Embalagem".

Interactive Dispatch Workflow:
- Left Column (Fila de Caixas para Montar):
  - Card de Caixa #901 (Felipe Vila Nova - Plano Exclusive Wagyu): Lista de cortes a incluir (1.5kg Wagyu A5, 2kg Picanha Maturada, 1.5kg Prime Rib). Botão "Marcar como Embalada".
  - Card de Caixa #902 (Lucas Dias - Plano Master Churrasco): Lista de cortes a incluir.
- Right Column (Etiquetas & Rastreio):
  - Tabela de Caixas Embaladas prontas para a transportadora.
  - Campo de input rápido para inserir Código de Rastreio da Transportadora Refrigerada.
  - Botão "Disparar Notificação com Rastreio para o WhatsApp/Email do Cliente".
```

---

### ⚙️ Aba 4 (Admin): Catálogo & Edição de Planos
> **Objetivo**: Interface para criar ou modificar planos de carne, definir preços e itens inclusos.

```text
STITCH PROMPT: PRIMECUT_ADMIN_PLANS_CONFIGURATOR

Role & Context:
Design a Plan Configurator & Pricing Management screen.

Layout:
- Left (Lista de Planos Cadastrados): Cards dos planos (Essencial, Master, Wagyu) com chave de liga/desliga (Ativo na Vitrine).
- Right (Formulário de Edição do Plano Selecionado):
  - Campo Nome do Plano, Key técnica (`wagyu-a5`).
  - Preço Mensal (R$) e Preço Anual (R$).
  - Tipo de Cumprimento (`physical_delivery`).
  - Lista de Recursos & Cortes Inclusos (Adicionar/Remover itens dinamicamente).
  - Configuração de Mídias (Upload da Foto principal do plano para a Landing Page).
  - Botão "Salvar Alterações e Atualizar Vitrine".
```
