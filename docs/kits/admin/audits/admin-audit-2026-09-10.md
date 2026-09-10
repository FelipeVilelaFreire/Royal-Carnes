# Admin Audit - 2026-09-10

Status: registro de auditoria; nao e contrato ativo.

## Objetivo

Verificar se o Admin atual respeita a regra operacional:

```text
backend valida
admin/shared-core prepara
admin/web renderiza
```

e identificar onde ainda existe divida contra:

```text
sem mock direto quando existe dataSource real
sem style inline em tela/screen type novo
sem emoji Unicode solto
sem copy nova hardcoded em TSX
sem AppShell paralelo para capacidade ja existente na Foundation
```

## Escopo Conferido

```text
frontend/admin/shared-core/manifest/pages
frontend/admin/shared-core/data-sources/standard.data-source.ts
frontend/admin/shared-core/contracts
frontend/admin/shared-core/api
frontend/admin/shared-core/mappers
frontend/admin/shared-core/view-models
frontend/admin/shared-core/hooks
frontend/admin/web/src/engines/rendering/screen-types/standard
frontend/admin/web/src/transitional
backend/apps/orders
backend/seeds/royalprime/kits/orders.seed.json
backend/API_CONTRACTS.md
```

## Resultado Geral

```text
standard engine: bom para continuar
admin shared-core: bom, com dividas pontuais documentadas
Pedidos: base real pronta antes da tela visual
transitional: removido do recorte ativo apos auditoria
configs inativos: caixas/socios removidos
browser runtime: ainda nao validado neste corte
```

## Telas E Fluxos Bons Para Continuar

Estes recursos estao no caminho correto `manifest -> dataSource -> api ->
backend` e devem ser a base dos proximos cortes:

```text
Clientes
Categorias
Colecoes
Produtos
Planos
Assinaturas
Pagamentos
Pedidos
Entregas
Usuarios
```

Observacao atual:

```text
Usuarios segue com screen/dataSource preparado, mas saiu do sidebar por ora
para manter o admin focado no fluxo operacional fechado.
```

Evidencia estrutural:

```text
frontend/admin/shared-core/manifest/screens.ts
frontend/admin/shared-core/navigation/admin.navigation.ts
frontend/admin/shared-core/data-sources/standard.data-source.ts
frontend/admin/web/src/engines/rendering/screen-types/standard/
```

## Pedidos - Estado Atual

Pedidos agora cobre a base real antes da tela:

```text
pedido avulso
pedido Royal Box
pedido recorrente de assinatura
visao 360 com entrega e pagamento no detalhe
```

Backend:

```text
backend/apps/orders/services.py
  -> subscription-cycle exige subscription e subscription_cycle
  -> valida customer/organization/cycle/subscription

backend/apps/orders/serializers.py
  -> expoe subscription_plan_* e subscription_cycle_*

backend/apps/orders/tests/test_api.py
  -> cobre seed recorrente e erro de subscription-cycle sem cycle
```

Seed:

```text
backend/seeds/royalprime/kits/orders.seed.json
  -> pedido-assinatura-pro-setembro tem subscriptionCycleKey

backend/apps/core/seed_loader.py
  -> resolve subscriptionKey e subscriptionCycleKey
  -> atualiza pedidos seedados antigos que ainda nao tinham cycle
```

Admin shared-core:

```text
frontend/admin/shared-core/manifest/pages/pedidos.config.jsx
  -> sem mock direto
  -> List/Detail/Add declarados
  -> campos de assinatura/ciclo presentes

frontend/admin/shared-core/data-sources/standard.data-source.ts
  -> pedidos list/detail/create reais
  -> sources tiposPedido, assinaturas e ciclosAssinatura
  -> carrega deliveries/payments para compor a visao 360
```

UX decidida para Pedidos:

```text
ListPage deve ser enxuta: codigo, cliente, tipo, status do pedido, entrega,
pagamento e total.

DetailPage deve concentrar o caso individual: dados, assinatura/ciclo, itens,
entrega, pagamento e historico.

Tela Entregas continua sendo fila logistica geral.
Tela Pagamentos continua sendo fila financeira geral.
```

## Pagamentos - Estado Atual

Pagamentos agora cobre a fila financeira geral:

```text
ListPage enxuta para referencia, cliente, origem, vinculo, status, valor e vencimento
DetailPage com Dados, Valores, Pedido, Assinatura e Historico
AddPage permite vincular cliente, assinatura e pedido
```

Backend/seed:

```text
backend/seeds/royalprime/kits/payments.seed.json
  -> cria pagamento pago de assinatura/pedido, pendente de pedido avulso e falho

backend/apps/core/seed_loader.py
  -> aplica payments por customerKey, subscriptionKey e orderKey

backend/apps/payments/views.py
  -> valida referencias da mesma organization/customer
```

Admin shared-core:

```text
frontend/admin/shared-core/data-sources/standard.data-source.ts
  -> pagamentos carrega payments + orders + subscriptions

frontend/admin/shared-core/view-models/payments.view-model.ts
  -> monta origem, pedido vinculado, assinatura/ciclo e eventos basicos

frontend/admin/shared-core/manifest/pages/pagamentos.config.jsx
  -> standard screen sem mock direto
```

## Achados Bons

Scans no recorte standard/manifest/data-source/view-model:

```text
sem style={{ ... }}
sem React.CSSProperties
sem hex/rgba/rgb locais no recorte auditado
sem emoji Unicode solto
sem mock direto nos screens navegaveis com dataSource real, exceto dividas
inativas caixas/socios
```

Tambem foi removido mock direto de:

```text
frontend/admin/shared-core/manifest/pages/deliveries.config.jsx
frontend/admin/shared-core/manifest/pages/usuarios.config.jsx
```

## Dashboard - Proxima Frente

Auditoria dedicada:

```text
docs/kits/admin/audits/dashboard-audit-2026-09-10.md
```

Resumo:

```text
Dashboard ja usa endpoint real, hook e view-model.
Nao ha style inline, emoji, mock direto ou fetch no render no recorte auditado.
Para chegar em 10/10, precisa receber metricas prontas do backend, incluir
pagamentos e ajustar a tabela recente para pedido + entrega + pagamento.
```

## Dividas Encontradas

Atualizacao do fechamento 10/10:

```text
as dividas abaixo foram encontradas na primeira varredura.
o legado transitional, configs caixas/socios e mocks admin antigos foram
removidos do recorte ativo depois dessa auditoria.
```

### 1. Transitional AppShell

Arquivos:

```text
frontend/admin/web/src/transitional/app-shell/*
```

Problemas:

```text
style inline
React.CSSProperties
emoji/simbolos soltos como menu/fechar/coroa
Header/Drawer/Footer/Sidebar paralelos
cores/bordas/sombras hardcoded
```

Regra:

```text
nao usar transitional como precedente
nao criar recurso novo nele
migrar/remover somente com corte proprio de AppShell admin
```

### 2. Transitional Product Components

Arquivos:

```text
frontend/admin/web/src/transitional/product-components/MetricKpiCard/MetricKpiCard.tsx
frontend/admin/web/src/transitional/product-components/DataGridTable/DataGridTable.tsx
```

Problemas:

```text
style inline
cores hardcoded
tabela/card paralelo ao standard/Foundation
```

Regra:

```text
nao usar para telas novas
Dashboard deve migrar para view-model + screen type real antes de ser tratado
como completo
```

### 3. Configs Inativos Com Mock

Arquivos:

```text
frontend/admin/shared-core/manifest/pages/caixas.config.jsx
frontend/admin/shared-core/manifest/pages/socios.config.jsx
```

Estado:

```text
nao aparecem em manifest/screens.ts
nao aparecem em admin.navigation.ts
continuam com rows mockadas
```

Regra:

```text
se voltarem ao mapa real, migrar para dataSource antes de expor
se nao voltarem, remover em corte de limpeza
```

## Evidencias Executadas

```text
py manage.py seed_backend --seed royalprime
  -> passou; orders=4; deliveries=4

py manage.py shell
  -> RP-000001 subscription-cycle True True 1

py manage.py check
  -> passou

py manage.py test apps.orders apps.subscriptions
  -> 24 tests OK

py manage.py makemigrations --check --dry-run
  -> No changes detected

npm run build:admin
  -> passou

npm run verify:rules
  -> 0 violations no diff

git diff --check
  -> passou; avisos LF/CRLF do Windows
```

## Proxima Continuacao Natural

```text
1. abrir Admin em browser
2. validar Pedidos list/detail/add com seed real
3. criar pedido avulso
4. criar pedido subscription-cycle com assinatura/ciclo
5. confirmar erro real quando subscription-cycle nao tiver ciclo
6. expor action de transition no standard ou no detalhe de Pedidos
7. validar que Entrega e Pagamento aparecem dentro do detalhe do Pedido
8. so depois migrar/limpar transitional AppShell ou Dashboard
```

## Nao Fazer Agora Sem Corte Proprio

```text
refatorar todo frontend/admin/web/src/transitional
reescrever AppShell admin
promover Admin para ServiceOS
tratar caixas/socios como tela ativa sem recolocar no map real
afirmar qualidade visual sem browser
```
