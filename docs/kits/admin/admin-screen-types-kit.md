# Admin Screen Types Kit

Status:

```text
planned -> local foundation em andamento
```

## O Que Este Kit Faz

Define como o Admin renderiza telas reutilizaveis sem criar uma tela artesanal
para cada recurso.

Screen types principais:

```text
DashboardPage
ListPage
DetailPage
AddPage
HistoryPage
SettingsPage
TrashPage
```

## Dono De Cada Parte

```text
manifest/pages/*.config.jsx
  -> titulo, subtitulo, colunas, filtros, acoes, secoes e campos

locales/pt-BR.ts
  -> copy de UI

view-models/*.view-model.ts
  -> linhas, cards, badges, status label/tone/icon, detalhes prontos

hooks/useAdmin*.ts
  -> data/loading/error/actions

screen-types/*.tsx
  -> renderizacao com Foundation
```

Arquivos reais:

```text
frontend/admin/shared-core/manifest/screens.ts
  -> registra qual screen type cada rota usa

frontend/admin/web/src/engines/rendering/screenRegistry.tsx
  -> resolve a tela ativa e mantem App.tsx sem manifests de recurso

frontend/admin/shared-core/data-sources/standard.data-source.ts
  -> fonte principal de list/detail/add/update do standard

frontend/admin/shared-core/data-sources/standard-option-sources.ts
  -> option sources relacionais usados por forms, tables e selects

frontend/admin/shared-core/data-sources/standard-data-source.types.ts
  -> tipos publicos do data-source standard

frontend/admin/shared-core/view-models/standard.view-model.ts
  -> tipos/modelos genericos de list/detail/add

frontend/admin/web/src/engines/rendering/screen-types/standard/StandardScreen.tsx
  -> runtime do standard

frontend/admin/web/src/engines/rendering/screen-types/standard/pages/ListPage/ListPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/pages/ListPage/ListPage.module.css
  -> lista padrao

frontend/admin/web/src/engines/rendering/screen-types/standard/pages/DetailPage/DetailPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/pages/DetailPage/DetailPage.module.css
  -> detalhe padrao e edit mode

frontend/admin/web/src/engines/rendering/screen-types/standard/pages/AddPage/AddPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/pages/AddPage/AddPage.module.css
  -> criacao padrao

frontend/admin/web/src/engines/rendering/screen-types/standard/components/LineItemsEditor/LineItemsEditor.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/components/LineItemsEditor/LineItemsEditor.module.css
  -> editor de linhas repetiveis como beneficios de plano

frontend/admin/web/src/engines/rendering/screen-types/standard/components/RelatedList/RelatedList.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/components/RelatedList/RelatedList.module.css
  -> lista relacionada como assinantes, pedidos e pagamentos

frontend/admin/web/src/engines/rendering/screen-types/settings/SettingsPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/settings/SettingsPage.module.css
frontend/admin/shared-core/manifest/pages/settings.config.jsx
  -> configuracoes globais por tabs, sections, fields e actions declarativas
```

## Nao Pode

```text
screen type decidir workflow
screen type calcular regra de dominio
screen type chamar endpoint direto
screen type importar mock direto quando existe hook
screen type criar copy nova hardcoded
screen type usar emoji de UI
```

## Estado Atual

O screen type `standard` ja e a base para telas CRUD do admin:

```text
ListPage
  -> titulo/subtitulo por locale
  -> colunas por manifest
  -> busca/filtro visual
  -> empty/error states
  -> sem coluna Acoes obrigatoria

DetailPage
  -> tabs por manifest
  -> fields por manifest
  -> edit mode declarativo por field editable
  -> suporte a input, number, select, multiSelect, currency, datetime, textarea,
     asset, relatedList e lineItems
  -> mantem cabecalho estavel; somente conteudo editavel vira controle

AddPage
  -> sections por manifest
  -> fields por manifest
  -> required/defaultValue/type/source
  -> cria via data-source/shared-core, nao por endpoint direto na tela

SettingsPage
  -> screen type proprio, nao standard
  -> tabs/sections/fields/actions por settings.config.jsx
  -> prepara a futura edicao do manifesto/app config
  -> hoje renderiza configuracoes em modo leitura, com acoes desabilitadas ate
     existir persistencia real
```

Componentes reutilizaveis do standard:

```text
frontend/admin/web/src/engines/rendering/screen-types/standard/components/LineItemsEditor/
frontend/admin/web/src/engines/rendering/screen-types/standard/components/RelatedList/
```

Data-source principal:

```text
frontend/admin/shared-core/data-sources/standard.data-source.ts
frontend/admin/shared-core/data-sources/standard-option-sources.ts
frontend/admin/shared-core/data-sources/standard-data-source.types.ts
```

## Telas Que Ja Usam Standard De Forma Real

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

`Estoque` existe como rota/config, mas deve ficar fora da V1 imediata para nao
roubar prioridade da fundacao comercial.

## Auditoria 2026-09-10

Comando executado no recorte standard/manifest/data-source/view-model:

```text
rg -n 'style=\{\{|React\.CSSProperties|#[0-9a-fA-F]{3,8}|rgba\(|rgb\(|emoji'
```

Resultado:

```text
sem ocorrencias em:
frontend/admin/web/src/engines/rendering/screen-types/standard
frontend/admin/shared-core/manifest/pages
frontend/admin/shared-core/view-models
frontend/admin/shared-core/data-sources
```

Mocks diretos:

```text
deliveries.config.jsx e usuarios.config.jsx tiveram mock direto removido porque
ja usam dataSource real.

caixas.config.jsx, socios.config.jsx e mocks admin antigos foram removidos do
recorte ativo.
```

Divida fora do standard:

```text
access-shell ainda esta fora desta auditoria por decisao do corte atual.
```

O legado transitional do admin web foi removido. Nao recriar AppShell,
Header/Drawer/Sidebar/BottomTabBar ou componentes de produto paralelos.

## Proximo Corte

```text
validar no browser:
  -> criar registro por AddPage
  -> editar registro por DetailPage
  -> confirmar persistencia apos refresh
  -> confirmar selects vindo do backend
  -> confirmar mensagens de erro reais
```

Checklist por novo field type:

```text
manifest declara type/source/options/required/editable
standard.view-model aceita o shape sem any escondendo erro
DetailPage renderiza display e edit mode
AddPage renderiza create mode
data-source converte input para payload real
locale cobre label/placeholder/error quando existir
CSS fica em module ao lado
nao existe style={{ no trecho novo
```
