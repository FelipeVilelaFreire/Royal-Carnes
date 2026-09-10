# Dashboard Audit - 2026-09-10

Status: auditoria do screen type dashboard antes do proximo corte visual.

## Veredito

```text
nota atual: 8/10
```

O Dashboard esta no caminho correto porque ja usa:

```text
DashboardScreen
  -> useAdminDashboard
  -> dashboard.api
  -> backend /api/v1/admin/dashboard/summary/
  -> dashboard.view-model
  -> DashboardPage render-only
```

Mas ainda nao e 10/10 porque parte das metricas continua sendo derivada no
frontend a partir de listas brutas.

## Arquivos Conferidos

```text
backend/apps/core/views.py
backend/apps/core/tests/test_dashboard_api.py
frontend/admin/shared-core/manifest/pages/dashboard.config.jsx
frontend/admin/shared-core/contracts/dashboard.contract.ts
frontend/admin/shared-core/api/dashboard.api.ts
frontend/admin/shared-core/hooks/useAdminDashboard.ts
frontend/admin/shared-core/view-models/dashboard.view-model.ts
frontend/admin/web/src/engines/rendering/screen-types/dashboard/DashboardScreen.tsx
frontend/admin/web/src/engines/rendering/screen-types/dashboard/DashboardPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/dashboard/DashboardPage.module.css
```

## O Que Esta Certo

```text
sem style inline no screen type
sem emoji Unicode solto
sem mock direto no DashboardPage/DashboardScreen
sem fetch direto no render
copy vem de locales
config declara widgets por key/title/icon
hook centraliza loading/error/fallback
backend tem endpoint agregado real e teste de permissao
```

Scan executado no recorte dashboard:

```text
rg -n "style=\{\{|React\.CSSProperties|#[0-9a-fA-F]{3,8}|rgba\(|rgb\(|emoji|mock|TODO"
```

Resultado:

```text
sem ocorrencias no recorte auditado
```

## Gaps Para 10/10

### 1. KPI Ainda Nasce Como Calculo De Frontend

Hoje:

```text
dashboard.api busca summary
dashboard.view-model calcula MRR, assinantes ativos, entregas pendentes e retencao
```

Melhor:

```text
backend retorna metrics ja resolvidas:
  mrr
  activeSubscribers
  pendingDeliveries
  paymentPendingAmount
  failedPayments
  ordersInProgress
  deliveriesLate
```

O frontend deve formatar e apresentar, nao ser fonte final de metrica
financeira/operacional.

### 2. Dashboard Ainda Nao Usa Pagamentos

Depois do corte de Pagamentos, o Dashboard deveria enxergar:

```text
pagamentos pendentes
pagamentos falhos
valor pendente
valor pago no periodo
```

Hoje os widgets continuam focados em:

```text
MRR estimado
assinantes
entregas
retencao
```

### 3. Copy Do CTA Esta Desalinhada

Hoje o botao usa:

```text
dashboard.viewAllBoxes
```

mas navega para:

```text
Pedidos
```

Melhor:

```text
Ver pedidos
```

ou trocar o destino para Entregas se a intencao for boxes/expedicao.

### 4. Tabela Recente E Boa, Mas Pode Ser Mais Operacional

Hoje:

```text
Pedido
Socio
Plano
Box
Status
Data
```

Melhor para V1:

```text
Pedido
Cliente
Tipo
Pagamento
Entrega
Status
Total
Data
```

Assim ela vira um resumo real do fluxo fechado:

```text
pedido -> entrega -> pagamento -> assinatura quando recorrente
```

### 5. CSS Esta Aceitavel, Mas Nao E Maximo ServiceOS

O CSS usa tokens e module, mas ainda possui alguns escapes comuns:

```text
fallbacks como 1px, 40px, 760px
color-mix direto em screen CSS
```

Nao quebrou as regras atuais do admin, mas para 10/10 a tela deveria reduzir
fallback solto e depender mais das receitas Foundation/Semi-Composed.

## Dashboard Ideal Para RoyalPrime V1

```text
Linha 1 - KPIs
  Receita mensal
  Pagamentos pendentes
  Pedidos em andamento
  Entregas pendentes

Linha 2 - Operacao
  Ultimos pedidos
  Entregas em rota/pendentes

Linha 3 - Financeiro e Clube
  Pagamentos com falha
  Assinaturas ativas/past_due
```

Nao precisa virar uma tela gigante. O Dashboard deve responder:

```text
o que entrou
o que falta cobrar
o que falta entregar
o que esta travado
```

## Ordem Recomendada Do Proximo Corte

```text
1. backend dashboard summary retornar metrics prontas
2. incluir payments no contrato do dashboard
3. ajustar widgets para fluxo RoyalPrime real
4. trocar CTA "Ver boxes" para "Ver pedidos" ou destino correto
5. enriquecer ultimos pedidos com pagamento/entrega
6. revisar CSS para diminuir escapes e ficar mais Foundation-first
7. validar no browser desktop/mobile
```
