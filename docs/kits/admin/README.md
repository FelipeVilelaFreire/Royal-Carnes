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
3. auth-users-kit.md
4. catalog-kit.md
5. subscriptions-kit.md
6. inventory-kit.md
7. orders-kit.md
8. fulfillment-delivery-kit.md
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

## Kits Admin

| Kit | Status | Papel |
| --- | --- | --- |
| Admin Operations | planned -> local foundation | Visao operacional geral do admin |
| Admin Screen Types | planned -> local foundation | Dashboard, List, Detail e Add por manifest |
| Auth & Users | local scaffold | Sessao admin, usuarios e permissoes |
| Catalog | local foundation | Operar produtos, categorias, precos e disponibilidade |
| Subscriptions | local foundation | Operar planos, assinaturas e ciclos |
| Inventory | local foundation | Operar estoque simples, ajustes e movimentos |
| Orders | local foundation | Operar pedidos e transicoes |
| Fulfillment & Delivery | local foundation | Operar entregas, status e confirmacao |

## Navigation Map V1

Este e o mapa funcional inicial do SidebarMenu do Admin. As telas podem nascer
vazias como `standard` ate cada kit ganhar contrato/API/hook/view-model real.

```text
Visao geral
  Dashboard

Operacao
  Pedidos
  Entregas
  Estoque

Catalogo
  Produtos
  Categorias
  Planos

Clientes
  Clientes
  Assinaturas
  Pagamentos

Sistema
  Usuarios
  Configuracoes
```

Regra deste mapa:

```text
Dashboard resume
Operacao executa o dia
Catalogo define o que vende
Clientes acompanha relacao e receita
Sistema configura acesso e parametros
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
