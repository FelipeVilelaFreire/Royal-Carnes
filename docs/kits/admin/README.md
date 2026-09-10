# Admin Kits

Esta pasta organiza a leitura do Admin em paralelo com os kits gerais.

Os kits gerais em `docs/kits/*.md` continuam explicando a capacidade completa:

```text
backend
client shared-core
admin shared-core
render apps
seeds
reuso futuro
```

Os kits desta pasta explicam a mesma capacidade pela lente do Admin:

```text
o que o admin precisa operar
quais endpoints admin usa
quais hooks/view-models admin devem existir
quais screen types renderizam
qual manifest/locales controla copy, colunas, filtros e acoes
o que nao pode ficar no TSX
```

## Regra Curta

```text
backend valida
admin/shared-core prepara
admin/web renderiza
```

## Ordem De Leitura

```text
1. admin-operations-kit.md
2. admin-screen-types-kit.md
3. customers-kit.md
4. catalog-kit.md
5. subscriptions-kit.md
6. payments-kit.md
7. orders-kit.md
8. fulfillment-delivery-kit.md
9. inventory-kit.md
10. auth-users-kit.md
11. audits/dashboard-audit-2026-09-10.md
```

## Como Trabalhar Em Paralelo

```text
Chat admin
  -> usa docs/kits/admin/*
  -> mexe em frontend/admin/shared-core
  -> mexe em frontend/admin/web
  -> valida npm run build:admin

Chat client
  -> usa docs/kits/*.md e docs/handoff/client
  -> mexe em frontend/client/shared-core
  -> mexe em frontend/client/web e frontend/client/mobile
  -> valida build client/mobile
```

Nao misturar os dois no mesmo corte, salvo ajuste de contrato global pequeno e
explicitamente necessario.

## Tree Admin Que Deve Ser Conferida

Antes de mexer em qualquer tela admin, abrir a sequencia abaixo:

```text
frontend/admin/shared-core/manifest/routes.ts
  -> paths e routeKeys

frontend/admin/shared-core/navigation/admin.navigation.ts
  -> grupos do SidebarMenu/BottomTabBar

frontend/admin/shared-core/manifest/adminAppShell.config.jsx
  -> AppShell Foundation, sidebar desktop e bottomTabBar mobile

frontend/admin/shared-core/manifest/screens.ts
  -> screen ativa por route/resource

frontend/admin/shared-core/manifest/pages/<recurso>.config.jsx
  -> columns, filters, tabs, sections, fields, options e sources

frontend/admin/web/src/engines/rendering/screenRegistry.tsx
  -> resolve screenKey em Dashboard, Settings ou Standard sem poluir App.tsx

frontend/admin/shared-core/data-sources/standard.data-source.ts
  -> carrega list/detail/add/update do backend

frontend/admin/shared-core/data-sources/standard-option-sources.ts
  -> carrega sources de selects/tabelas relacionais do backend

frontend/admin/shared-core/data-sources/standard-data-source.types.ts
  -> contratos publicos do data-source standard

frontend/admin/shared-core/contracts/<recurso>.contract.ts
frontend/admin/shared-core/api/<recurso>.api.ts
frontend/admin/shared-core/mappers/<recurso>.mapper.ts
frontend/admin/shared-core/view-models/<recurso>.view-model.ts
  -> contrato, HTTP, normalizacao e exibicao

frontend/admin/shared-core/locales/pt-BR.ts
  -> copy de UI

frontend/admin/web/src/engines/rendering/screen-types/standard/
  -> render generico
```

Regra de mudanca:

```text
se e campo/coluna/tab/source -> manifest
se e texto de UI -> locales
se e dado formatado/status/badge -> view-model
se e DTO/payload -> contract + mapper
se e HTTP -> api
se e regra/persistencia/permissao -> backend
se e so apresentacao generica -> screen-type standard
```

## Kits Admin

| Kit | Status | Papel |
| --- | --- | --- |
| Admin Operations | planned -> local foundation | Visao operacional geral do admin |
| Admin Screen Types | planned -> local foundation | Dashboard, List, Detail e Add por manifest |
| Customers | local foundation | Operar clientes, contato, documento, enderecos e relacionamento |
| Catalog | local foundation | Operar produtos, categorias, precos e disponibilidade |
| Subscriptions | local foundation | Operar planos, assinaturas e ciclos |
| Payments | local foundation + admin 360 real | Operar cobrancas manuais, status financeiro e vinculos com cliente/assinatura/pedido |
| Orders | local foundation + admin base real | Operar pedidos avulsos, Royal Box e ciclos de assinatura |
| Fulfillment & Delivery | local foundation | Operar entregas, status e confirmacao |
| Inventory | local foundation, fora da V1 imediata | Operar estoque simples, ajustes e movimentos |
| Auth & Users | local scaffold | Sessao admin, usuarios e permissoes internas |

## Navigation Map V1

Este e o mapa funcional inicial do SidebarMenu do Admin. As telas podem nascer
vazias como `standard` ate cada kit ganhar contrato/API/hook/view-model real.

```text
Visao geral
  Dashboard

Operacao
  Pedidos
  Entregas

Catalogo
  Produtos
  Categorias
  Colecoes
  Planos

Clientes
  Clientes
  Assinaturas
  Pagamentos

Sistema
  Configuracoes

Depois da V1
  Estoque
  Usuarios
```

Regra deste mapa:

```text
Dashboard resume depois que os fluxos reais existem
Clientes e a base do relacionamento
Catalogo define o que vende
Planos definem o que uma assinatura cobre
Assinaturas conectam cliente, plano, ciclo, pedidos e pagamentos
Pagamentos registra receita e pendencia
Pedidos executam compra/box/ciclo
Entregas executam expedicao
Sistema configura parametros globais
Usuarios fica oculto por enquanto para nao competir com o fechamento operacional
Estoque entra depois da V1 imediata para nao competir com a fundacao comercial
```

## Auditoria Admin 2026-09-10

Registro detalhado:

```text
docs/kits/admin/audits/admin-audit-2026-09-10.md
```

Resumo:

```text
standard screen type e manifests principais estao sem style inline/emoji no
recorte auditado

Clientes, Categorias, Colecoes, Produtos, Planos, Assinaturas, Pagamentos,
Pedidos, Entregas e Usuarios usam dataSource real

Pedidos agora tem base backend/shared-core/manifest para pedido recorrente de
assinatura antes da tela visual

Pagamentos agora tem seed real, ListPage financeiro enxuto e DetailPage com
abas Dados, Valores, Pedido, Assinatura e Historico

legado frontend/admin/web/src/transitional foi removido do admin real

configs inativos caixas/socios e mocks admin antigos foram removidos para
manter o recorte principal sem fallback visual paralelo

Dashboard tem auditoria propria em docs/kits/admin/audits/dashboard-audit-2026-09-10.md.
Ele ja usa endpoint/hook/view-model real, mas precisa incluir pagamentos e
metricas resolvidas pelo backend para chegar em 10/10.
```

## Criterio Para Completar Um Kit Admin

```text
endpoint admin real conferido em backend/API_CONTRACTS.md
api client admin alinhado ao endpoint
hook admin com loading/error/data/actions
mapper isolando DTO -> view-model
view-model preparando tabela/detalhe/badges
manifest definindo columns/filters/actions/copy estrutural
locale cobrindo copy de UI
screen type sem regra de negocio local
npm run build:admin passa
git diff --check passa
```
