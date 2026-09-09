# Continuacao RoyalPrime

> Status: referencia ou registro de estado; nao e contrato ativo.
> Regras e leitura por tarefa: [CODEX_ENTRYPOINTS.md](docs/CODEX_ENTRYPOINTS.md).
> Trees, exemplos, proximos passos e instrucoes antigas abaixo devem ser
> confrontados com os contratos ativos e o codigo; nao autorizam excecoes.

## Contexto

Este arquivo e o ponto de entrada rapido para o proximo chat continuar o
trabalho atual no RoyalPrime.

Leia tambem, nesta ordem, os arquivos obrigatorios do projeto:

```text
ROYALPRIME_ARCHITECTURE_CONTRACT.md
docs/CODEX_ENTRYPOINTS.md
docs/README.md
docs/AGENTS.md
AGENTS.md
frontend/AGENTS.md
frontend/admin/AGENTS.md
frontend/client/web/AGENTS.md
frontend/client/mobile/AGENTS.md
frontend/foundation/AGENTS.md
backend/AGENTS.md
backend/README.md
backend/ARCHITECTURE.md
backend/API_CONTRACTS.md
backend/seeds/README.md
backend/seeds/royalprime/README.md
docs/frontend/TREE.md
docs/frontend/RENDER_ONLY_AUDIT.md
docs/kits/README.md
frontend/client/web/docs/ROYALPRIME_TO_SERVICEOS_ECOMMERCE_DEPARA.md
```

## Checkpoint Atual - 2026-09-09

O corte mais recente fechou a base funcional de Assinaturas e Pagamentos no
admin, com backend real, shared-core e screen-types mantendo a regra:

```text
screen -> shared-core hook/data-source -> api client -> backend
```

O foco continua sendo funcional primeiro. Nao gastar tempo refinando visual fino
antes de confirmar dados reais, salvar edicoes e navegar os fluxos principais.

### O que acabou de ser terminado

```text
Assinaturas
  -> ListPage simplificada para Cliente, Plano, Status e Fim do ciclo
  -> DetailPage com Dados, Operacao, Ciclo atual, Pedidos e Pagamentos
  -> modo de edicao cobrindo cliente/plano/status/datas/cancelamento
  -> campos operacionais editaveis: endereco padrao, dia preferido, janela,
     preferencias de entrega e notas internas
  -> ciclo atual exibindo consumo por item/beneficio, nao apenas um total
  -> aba Pagamentos usando pagamentos reais vinculados a assinatura
  -> AddPage com campos basicos e operacionais

Backend de Assinaturas
  -> Subscription ganhou default_delivery_address, preferred_delivery_day,
     delivery_window, delivery_preferences e internal_notes
  -> PATCH administrativo de assinatura criado
  -> selectors com prefetch/select_related para plano, entitlements, ciclos e
     itens do ciclo
  -> migration local 0002 aplicada

Pagamentos
  -> novo app backend apps.payments
  -> modelo Payment com cliente, assinatura opcional, pedido opcional,
     referencia, status, moeda, valor, vencimento, pagamento e notas
  -> endpoints admin GET/POST/list/detail/PATCH
  -> testes basicos de criar/listar e marcar como pago
  -> nova tela admin Pagamentos em standard config
  -> contracts/api/mapper/view-model no shared-core
  -> data-source standard carrega, cria e atualiza pagamentos reais

Screen-types standard
  -> DetailPage passou a aceitar field type datetime
  -> TextArea foi usado para campos longos
  -> campos editaveis vazios continuam visiveis em modo de detalhe/edicao
```

### Arquivos que devem ser lidos antes de continuar

```text
Regras ativas
  AGENTS.md
  ROYALPRIME_ARCHITECTURE_CONTRACT.md
  docs/CODEX_ENTRYPOINTS.md

Admin standard / shared-core
  frontend/admin/shared-core/manifest/pages/assinaturas.config.jsx
  frontend/admin/shared-core/manifest/pages/pagamentos.config.jsx
  frontend/admin/shared-core/data-sources/standard.data-source.ts
  frontend/admin/shared-core/view-models/subscriptions.view-model.ts
  frontend/admin/shared-core/view-models/payments.view-model.ts
  frontend/admin/shared-core/view-models/standard.view-model.ts
  frontend/admin/shared-core/contracts/payments.contract.ts
  frontend/admin/shared-core/api/payments.api.ts
  frontend/admin/shared-core/mappers/payments.mapper.ts
  frontend/admin/shared-core/locales/pt-BR.ts
  frontend/admin/shared-core/index.ts

Screen-types
  frontend/admin/web/src/engines/rendering/screen-types/standard/pages/ListPage/ListPage.tsx
  frontend/admin/web/src/engines/rendering/screen-types/standard/pages/DetailPage/DetailPage.tsx
  frontend/admin/web/src/engines/rendering/screen-types/standard/pages/AddPage/AddPage.tsx

Backend assinaturas
  backend/apps/subscriptions/models.py
  backend/apps/subscriptions/selectors.py
  backend/apps/subscriptions/serializers.py
  backend/apps/subscriptions/views.py
  backend/apps/subscriptions/urls.py
  backend/apps/subscriptions/tests.py
  backend/apps/subscriptions/migrations/0002_subscription_default_delivery_address_and_more.py

Backend pagamentos
  backend/apps/payments/models.py
  backend/apps/payments/selectors.py
  backend/apps/payments/serializers.py
  backend/apps/payments/views.py
  backend/apps/payments/urls.py
  backend/apps/payments/tests.py
  backend/apps/payments/migrations/0001_initial.py
  backend/config/settings/base.py
  backend/api/v1/urls.py
```

### Validacoes executadas neste corte

```text
cd backend
py manage.py check
  -> passou

py manage.py test apps.payments apps.subscriptions
  -> passou, 17 testes

py manage.py makemigrations --check --dry-run
  -> passou

py manage.py migrate
  -> aplicou subscriptions 0002 e payments 0001 no banco local

npm --prefix frontend/admin/web run build --ignore-scripts
  -> passou

git diff --check
  -> passou, apenas avisos CRLF
```

`npm run verify:rules` ainda falha por dividas ja existentes/dirty em Foundation:

```text
frontend/foundation/ui/Layout/Layout.tsx
  -> inline-style existente

frontend/foundation/ui/SectionContainer/SectionContainer.module.css
  -> violacoes antigas de ui-theme
```

Nao usar essa falha como prova de quebra nova em Assinaturas/Pagamentos sem
auditar o diff. Tambem nao houve verificacao visual/click real em browser nesse
corte.

### Limites conhecidos

```text
Pagamentos
  -> V1 funcional/manual; ainda nao tem gateway, webhook, invoice, recibo,
     conciliacao ou alocacao automatica por ciclo
  -> permissao inicial usa payments.markPaid para leitura/gestao
  -> seed de pagamentos ainda nao foi adicionado, entao a tela pode iniciar
     vazia ate criar um pagamento real

Assinaturas
  -> aba Pedidos ainda e basica/vazia quando nao houver pedidos vinculados
  -> pausar/cancelar/inativar ainda deve virar acao bem definida pelo backend
  -> historico/auditoria ainda nao foi fechado

Locales
  -> existem trechos antigos com encoding ruim; nao fazer refactor global agora
     sem pedido explicito
```

### Proximo passo recomendado

Antes de ir para outra classe grande, validar o fluxo real no admin:

```text
1. abrir Admin
2. criar um pagamento em Pagamentos
3. editar status do pagamento para pago
4. abrir detalhe de uma assinatura
5. confirmar que a aba Pagamentos mostra o pagamento vinculado
6. editar campos operacionais da assinatura
7. dar refresh e confirmar persistencia
```

Depois disso, o proximo nivel funcional recomendado e `Pedidos`, porque agora
Clientes, Catalogo, Planos de Assinatura, Assinaturas e Pagamentos ja tem base
para se conectar a ele.

Se a tela de Pagamentos ou Assinaturas estiver vazia demais para testar rapido,
o proximo micro-passo pode ser adicionar seed de pagamentos demo em
`backend/seeds/royalprime`.

## Proximo Passo Imediato

Antes de continuar novas telas ou fluxos, rodar/aplicar o seed local para nao
se perder no estado do banco.

Comando direto:

```text
cd backend
py manage.py seed_backend --seed royalprime
```

Ou pelo bat:

```text
bats\seed.bat
```

Depois conferir que o seed reporta pelo menos:

```text
applied orders: orders=4
applied deliveries: deliveries=4
```

Isso garante que o admin tera dados reais em Clientes, Catalogo, Assinaturas,
Pedidos, Entregas e Estoque antes de continuar o trabalho funcional.

## Prioridade Atual - Funcional Primeiro

A partir deste ponto, o foco principal do RoyalPrime deve ser funcionalidade real
ponta a ponta. O visual deve ficar limpo, utilizavel e dentro das regras, mas
sem gastar ciclos com refinamento fino antes dos fluxos funcionarem.

Regra de prioridade:

```text
1. funcionalidade real
2. contrato correto
3. validacao automatica
4. visual apresentavel
5. refinamento visual fino somente depois
```

Isto vale para admin e client, mas o proximo foco imediato e o admin. O admin
deve ser construido na mesma ordem de dependencia que o backend nasceu: primeiro
a fundacao do negocio, depois os fluxos derivados.

Ordem obrigatoria por dependencia de negocio:

```text
1. Usuarios / Clientes
2. Catalogo base
3. Assinaturas
4. Pedidos
5. Pagamentos
6. Entregas
7. Estoque
8. Dashboard
```

Justificativa da ordem:

```text
Pagamento nao existe sem cliente.
Pedido nao existe bem sem cliente e sem produto/catalogo.
Assinatura nao existe sem cliente e sem plano/catalogo.
Produto nao existe bem sem categoria.
Entrega nao existe sem pedido.
Estoque depende de produto/variante e deve entrar depois da fundacao comercial.
Dashboard depende dos dados reais das areas anteriores.
```

Sequencia funcional do admin:

```text
Fase 1 - Usuarios / Clientes
  -> listar clientes reais
  -> detalhe do cliente
  -> contato
  -> endereco
  -> status
  -> vinculo com usuario quando existir
  -> usuarios internos, roles e permissoes

Fase 2 - Catalogo Base
  2.1 Categorias
    -> listar categorias reais
    -> criar categoria
    -> editar nome/status
    -> usar categoria como base obrigatoria do produto

  2.2 Colecoes / linhas comerciais
    -> listar colecoes reais
    -> criar colecao
    -> editar nome/descricao/status
    -> relacionar colecao com produtos

  2.3 Unidades de medida
    -> listar unidades reais
    -> kg, g, unidade, saco, servico
    -> usar unidade em produto, variante, estoque e entitlement

  2.4 Modos comerciais
    -> Assinatura
    -> Royal Delivery
    -> Royal Box
    -> usar modo comercial para preco, disponibilidade e tipo de pedido

  2.5 Produtos
    -> listar produtos reais
    -> imagem real do produto
    -> nome/descricao/status
    -> categoria obrigatoria
    -> colecoes
    -> modos comerciais
    -> disponibilidade

  2.6 Variantes
    -> sku
    -> nome
    -> unidade
    -> quantidade da unidade
    -> peso
    -> status ativo/inativo

  2.7 Precos
    -> preco base do produto
    -> preco por variante quando existir
    -> preco por modo comercial
    -> moeda
    -> tipo de preco

  2.8 Planos
    -> listar planos reais
    -> criar/editar plano
    -> preco recorrente
    -> status
    -> intervalo de cobranca
    -> beneficios/entitlements ligados a colecao, categoria, produto ou variante

Fase 3 - Assinaturas
  -> cliente
  -> plano
  -> status
  -> ciclo atual
  -> beneficios/entitlements
  -> itens do ciclo quando existir

Fase 4 - Pedidos
  -> cliente
  -> itens/produtos
  -> assinatura opcional
  -> total
  -> status
  -> historico
  -> transicao permitida pelo backend

Fase 5 - Pagamentos
  -> cliente
  -> pedido ou assinatura
  -> valor
  -> status
  -> vencimento
  -> metodo
  -> registro de falha/reembolso depois

Fase 6 - Entregas
  -> pedido
  -> cliente
  -> endereco/snapshot
  -> status de envio
  -> historico
  -> confirmacao de entrega

Fase 7 - Estoque
  -> produto/variante
  -> disponivel
  -> reservado
  -> limite baixo
  -> ajuste com motivo
  -> relacao com pedidos depois

Fase 8 - Dashboard
  -> resumo real das areas anteriores
  -> KPIs so depois de dados e fluxos reais
```

Nao voltar a polir sidebar, cards, sombras, microespacamentos e outras partes
de design enquanto a fundacao funcional do admin ainda nao estiver fechada.
Tambem nao pular para Estoque, Entregas ou Dashboard antes de Clientes,
Catalogo e Assinaturas estarem minimamente bem feitos, porque isso inverte a
dependencia real do sistema.

## Regra Para Qualquer Frontend Novo

Qualquer coisa nova no frontend precisa atender 100% o contrato atual:

```text
screen/page TSX
  -> render-only
  -> sem regra de negocio local
  -> sem chamada fetch direta se ja existe shared-core API client
  -> sem mock direto se ja existe hook/data-source
  -> sem texto novo hardcoded
  -> sem emoji Unicode solto
  -> sem style={{ ... }}
  -> Foundation UI/AppShell para primitives e casca

shared-core
  -> contracts
  -> api client
  -> mapper
  -> hook/data-source
  -> view-model
  -> locales
  -> manifest/navigation quando for tela/rota

backend
  -> regra real
  -> validacao
  -> permissao
  -> persistencia
  -> testes quando tocar regra/contrato
```

Regra curta para revisao:

```text
se a tela sabe demais, esta errado
se a tela calcula regra, esta errado
se a tela mocka silenciosamente backend real, esta errado
se aparece style={{ em screenTypes/admin/client, corrigir antes de finalizar
se aparece copy nova em JSX/TSX, mover para locale/config
```

## Leitura Obrigatoria Por Area

Antes de continuar qualquer tarefa, ler primeiro:

```text
continuacao.md
docs/CODEX_ENTRYPOINTS.md
ROYALPRIME_ARCHITECTURE_CONTRACT.md
docs/architecture/RENDER_APPS_RULES.md
docs/architecture/SHARED_CORE_RULES.md
docs/architecture/BACKEND_RULES.md
docs/contracts/MOCK_AND_ENV_ARCHITECTURE.md
docs/contracts/SCREENTYPE_MANIFEST_PIPELINE_CONTRACT.md
backend/API_CONTRACTS.md
docs/handoff/12-style-hardcode-audit.md
```

Para admin:

```text
frontend/admin/AGENTS.md
frontend/admin/shared-core/README.md
frontend/admin/shared-core/api/README.md
frontend/admin/shared-core/contracts/README.md
frontend/admin/shared-core/hooks/README.md
frontend/admin/shared-core/view-models/README.md
frontend/admin/shared-core/mappers/README.md
frontend/admin/shared-core/kits/README.md
frontend/admin/shared-core/kits/dashboard/README.md
frontend/admin/shared-core/kits/orders/README.md
frontend/admin/shared-core/kits/orders/contract.md
frontend/admin/shared-core/kits/orders/flow.md
frontend/admin/shared-core/kits/deliveries/README.md
frontend/admin/shared-core/kits/deliveries/contract.md
frontend/admin/shared-core/kits/deliveries/flow.md
frontend/admin/shared-core/kits/catalog/README.md
frontend/admin/shared-core/kits/catalog/contract.md
frontend/admin/shared-core/kits/catalog/flow.md
frontend/admin/shared-core/kits/inventory/README.md
frontend/admin/shared-core/kits/inventory/contract.md
frontend/admin/shared-core/kits/inventory/flow.md
frontend/admin/shared-core/kits/subscriptions/README.md
frontend/admin/shared-core/kits/subscriptions/contract.md
frontend/admin/shared-core/kits/subscriptions/flow.md
frontend/admin/shared-core/kits/users/README.md
frontend/admin/shared-core/kits/users/contract.md
frontend/admin/shared-core/kits/users/flow.md
docs/kits/admin/README.md
docs/kits/admin/admin-screen-types-kit.md
docs/kits/admin/admin-operations-kit.md
docs/kits/admin/orders-kit.md
docs/kits/admin/fulfillment-delivery-kit.md
docs/kits/admin/catalog-kit.md
docs/kits/admin/inventory-kit.md
docs/kits/admin/subscriptions-kit.md
docs/kits/admin/auth-users-kit.md
```

Para client:

```text
frontend/client/web/AGENTS.md
frontend/client/mobile/AGENTS.md
frontend/client/shared-core/README.md
frontend/client/shared-core/api/README.md
frontend/client/shared-core/contracts/README.md
frontend/client/shared-core/hooks/README.md
frontend/client/shared-core/view-models/README.md
frontend/client/shared-core/mappers/README.md
frontend/client/shared-core/kits/README.md
frontend/client/shared-core/kits/auth/README.md
frontend/client/shared-core/kits/catalog/README.md
frontend/client/shared-core/kits/checkout/README.md
frontend/client/shared-core/kits/orders/README.md
frontend/client/shared-core/kits/orders/contract.md
frontend/client/shared-core/kits/orders/flow.md
frontend/client/shared-core/kits/subscriptions/README.md
frontend/client/shared-core/kits/subscriptions/contract.md
frontend/client/shared-core/kits/subscriptions/flow.md
frontend/client/shared-core/kits/deliveries/README.md
frontend/client/shared-core/kits/deliveries/contract.md
frontend/client/shared-core/kits/deliveries/flow.md
frontend/client/web/docs/PRIME_CUT_CLUB_ARCHITECTURE.md
frontend/client/web/docs/ROYALPRIME_TO_SERVICEOS_ECOMMERCE_DEPARA.md
```

Para backend/seed:

```text
backend/AGENTS.md
backend/README.md
backend/ARCHITECTURE.md
backend/API_CONTRACTS.md
backend/seeds/README.md
backend/seeds/royalprime/README.md
backend/apps/accounts/README.md
backend/apps/catalog/README.md
backend/apps/customers/README.md
backend/apps/organizations/README.md
backend/apps/core/README.md
```

Para Foundation/AppShell:

```text
frontend/foundation/AGENTS.md
docs/contracts/CLIENT_SURFACE_SERVICES_CONTRACT.md
docs/contracts/CLIENT_PORTAL_NAVIGATION_AND_AUTH_STATE_CONTRACT.md
docs/contracts/PHASE_1_COMPATIBILITY_CONTRACT.md
docs/kits/README.md
docs/kits/KITS_RUNTIME_LEDGER.md
docs/kits/SHARED_CORE_ARCHITECTURE_MATRIX.md
docs/kits/PHASE_2_RENDER_ONLY_SCREEN_PLAN.md
```

## Estado Atual

RoyalPrime esta seguindo esta direcao:

```text
backend
  -> regra real, persistencia, validacao, autorizacao, calculo e auditoria

shared-core do escopo correto
  -> contratos, DTOs, API clients, hooks, mappers, view-models, manifest,
     navigation, locales e mocks temporarios

foundation
  -> design system, tokens, semi-composed, primitives visuais, AppShell e
     bridges native-ready

client/web e admin/web
  -> render-only, compondo telas com Foundation + shared-core
```

Regra curta:

```text
regra mora no backend
fluxo reutilizavel mora no shared-core correto
tela apresenta e dispara acao
foundation nao conhece regra de produto
```

## Checkpoint 2026-09-06

Ultimo commit publicado antes deste checkpoint:

```text
180152f feat: advance client app shell and render-only flows
branch: feature/shared-core-kit-reset
remote: origin/feature/shared-core-kit-reset
```

Depois desse commit, foram feitos os cortes de `/meus-pedidos` e
`/minha-caixa`:

```text
client/web MeusPedidosView
  -> saiu de legacy/design-system e legacy/app-shell
  -> nao importa mocks diretamente
  -> nao importa clientPtBR diretamente
  -> usa useClientOrders({ fallbackOnError: true })
  -> usa Container, Grid, Stack, Inline, Card, Button, Text, EmptyState,
     Modal e BottomModal da Foundation
  -> modal de detalhe usa BottomModal no webIsMobile

client/mobile MeusPedidosView
  -> usa o mesmo useClientOrders e useClientStrings
  -> espelha o webIsMobile em comportamento: resumo, pedido atual, proximo
     ciclo, historico e modal de detalhe
  -> usa Container, Surface, Stack, Inline, Button, Text e Modal mobile

client/shared-core/orders
  -> orders.fallback.ts centraliza dados mockados temporarios
  -> useClientOrders tenta API/backend e cai em fallback explicito
  -> orders.view-model.ts prepara labels, totais, status, timeline, itens,
     ciclo, pagamento e pedido atual para render

client/web MinhaCaixaView
  -> saiu de legacy/design-system e legacy/app-shell
  -> nao importa mocks diretamente
  -> nao importa clientPtBR diretamente
  -> usa useClientSubscription({ fallbackOnError: true })
  -> usa useClientCurrentCycle({ fallbackOnError: true })
  -> usa Container, Grid, Stack, Inline, Card, Button, Text e EmptyState da
     Foundation

client/mobile MinhaCaixaView
  -> usa os mesmos hooks, strings e fallback do client shared-core
  -> espelha o webIsMobile em comportamento: plano ativo, ciclo, uso,
     selecionados e produtos liberados

client/shared-core/subscriptions
  -> subscriptions.fallback.ts centraliza dados mockados temporarios
  -> hooks de assinatura/ciclo tentam API/backend e caem em fallback explicito
  -> subscriptions.view-model.ts prepara preco do plano, numero/faixa do ciclo,
     itens selecionados e metricas de uso para render

foundation/ui Badge
  -> agora e primitive formal exportada por @foundation/ui/Badge e
     @foundation/ui
  -> consome resolveBadgeRecipe(), Surface e tokens Theme/Semi-Composed
  -> substitui status pills locais em MeusPedidosView
  -> deve ser usado por render-apps para status/source/labels sem cor local

mobile primitives
  -> Text agora aplica variant/tone/weight via tokens nativos
  -> Layout agora aplica gap por token
  -> MeusPedidosView e MinhaCaixaView mobile nao repetem mais color/fontSize/fontWeight
     inline para textos principais

style hardcode audit
  -> docs/handoff/12-style-hardcode-audit.md lista as maiores telas com
     style inline, cores, fontes e sombras hardcoded
  -> Field, SegmentedControl, AvatarCell, SectionContainer e ColorField resolver
     ja foram limpos para usar CSS module/resolvers/tokens
  -> recorte das rotas /home, /cortes, /montar-box, /meus-pedidos e /perfil
     foi auditado; /home renderiza HomeVitrineView, nao HomeView
  -> PortalView, HomeVitrineView, CortesView, ProductItemCard e partes centrais
     do checkout de PedidoView tiveram vestimenta movida para CSS module
  -> saldo controlado no recorte: width percentual de metrica, gridColumn vindo
     de config e tokens ainda usados como ponte em ProductItemCard/SummaryRow
  -> proximo foco recomendado: MeuClubeView, HomeView legado, screenTypes,
     ProductItemCard/SummaryRow sem tokens e landing antiga

checkpoint git
  -> `060ee55 feat: harden portal render-only styling`
  -> pushed em `origin/feature/shared-core-kit-reset`

legacy cleanup apos `060ee55`
  -> client/web nao possui mais imports ativos para `legacy/app-shell` nem
     `legacy/design-system`
  -> `screens/portal/AuthModal.tsx` substitui o AuthModal legado com Foundation
  -> `OrderDetailModal` foi migrado para Foundation e CSS module
  -> `CortesView` e `PedidoView` nao renderizam mais shell standalone legado
  -> `LandingView` e `HeroMarketplaceView` usam `screens/landing/public-shell`
     e `screens/landing/landingPrimitives.tsx` como ponte local para Foundation
  -> arquivos mortos removidos: HomeView antigo, HomeVitrineViewLegacy,
     NovoPortalHomeView, LegacyPortalView, HeroCortesView e modulos mortos de
     legacy app-shell/design-system
  -> `frontend/client/web/src/legacy` foi removido apos migrar as importacoes
     restantes de `/` e `/hero`
  -> saldo: a landing publica ainda tem muita div/style/copy hardcoded; agora
     isso e divida da propria landing, nao dependencia de pacote legacy

i18n/shared-core types apos corte legacy
  -> `MeuClubeView` deixou de importar `clientPtBR`, mocks de planos e mock de
     cliente diretamente
  -> `MeuClubeView` usa `useClientStrings().meuClube` e `useClientCustomer()`
  -> `MeuClubeView.module.css` concentra a vestimenta estrutural da tela
  -> `ClientCustomerTabKey` e `ClientCustomerProfileDraft` moram em
     `client/shared-core/types/customer.types.ts`
  -> `hooks/useClientCustomer.ts` reexporta esses tipos temporariamente para
     compatibilidade dos consumidores antigos
  -> `screenTypes/*` do portal usam `useClientStrings()`, nao `clientPtBR`
     direto
  -> `OrderDetailModal` usa `ClientOrderRowViewModel`, sem tipo vindo de mock
  -> scans de mock direto/clientPtBR direto/emoji no recorte do portal e
     product-components ficaram sem resultados
  -> `screenTypes/*` do portal usam `PortalScreenTypes.module.css` e ficaram
     sem `style={{...}}` visual no scan
  -> `screens/landing/public-shell/*` usa `PublicShell.module.css` e
     `useClientStrings().landing.publicShell`
  -> Header/Footer/BottomTabBar publicos nao mantem mais copy local nem
     importam `clientPtBR` direto
  -> `screens/landing/sections/*` e `HeroMarketplaceView` usam
     `useClientStrings()`, nao `clientPtBR` direto
  -> checks visuais soltos da landing foram trocados por `CheckIcon`
     Foundation
```

Validado neste corte:

```text
npm run build:client -> passou
npm run verify:foundation -> passou, 93 checks
node node_modules\typescript\bin\tsc -p frontend\client\mobile\tsconfig.json -> passou
git diff --check -> passou, apenas warnings LF/CRLF do Windows
curl.exe -I http://localhost:3000/meus-pedidos -> 200 OK
curl.exe -I http://localhost:3000/perfil -> 200 OK
```

Handoff especifico:

```text
docs/handoff/09-meus-pedidos-render-only-audit.md
docs/handoff/10-minha-caixa-render-only-audit.md
docs/handoff/12-style-hardcode-audit.md
docs/kits/KITS_RUNTIME_LEDGER.md
```

## Foundation

Foi criado o corte atual da Foundation:

```text
frontend/foundation/
  tokens/
  semi-composed/
  ui/
  native/
  shells/
    app-shell/
      foundation/
      web/
      native/
```

Responsabilidade:

```text
foundation/ui
  -> primitives visuais web atuais

foundation/semi-composed
  -> recipes visuais reutilizaveis

foundation/native
  -> bridge native-ready de theme, primitives e semi-composed

foundation/shells/app-shell/foundation
  -> contrato, tipos, resolver e modelo visual comum

foundation/shells/app-shell/web
  -> runtime React web: Header, Drawer, Sidebar, BottomTabBar, Footer e content

foundation/shells/app-shell/native
  -> resolver native-ready para app mobile futuro com designSystem
```

Native aqui comecou como `native-ready`, mas agora ja existe uma base mobile
inicial para acompanhar o webIsMobile.

```text
frontend/client/mobile
```

Essa base ainda nao e um app Expo final publicado, mas ja deve consumir os
mesmos manifests, locales, navigation, hooks e view-models do client
shared-core. Nao criar tela mobile conceitualmente diferente da web mobile.

Native Design System agora possui:

```text
frontend/foundation/native/tokens.ts
  -> resolveNativeThemeTokens()

frontend/foundation/native/semi-composed.ts
  -> resolveNativeSemiComposedDescriptor()

frontend/foundation/native/ui.ts
  -> resolveNativeUiManifest()
  -> createNativeFoundationBridge()
```

O contrato native-ready cobre:

```text
Avatar
Badge
Button
Card
Divider
DropdownPicker
EmptyState
Field
Icon
Input
Layout
SegmentedControl
Select
Surface
Text
```

Cada primitive resolve um `NativeStyleDescriptor` a partir de manifest/theme,
semi-composed e ui config. Nao existe cor local native fora do manifest.

## Theme E Design System

A hierarquia atual de tema ficou assim:

```text
frontend/shared-core/manifest/theme/colors.ts
  -> cores globais dark/light de fallback comum

frontend/shared-core/manifest/theme/tokens.ts
  -> tokens fisicos globais e resolveRoyalPrimeThemeMode()

frontend/client/shared-core/manifest/theme/colors.ts
  -> cores reais do portal/client dark/light

frontend/client/shared-core/manifest/theme/tokens.ts
  -> clientThemeTokens e resolveClientThemeMode()

frontend/admin/shared-core/manifest/theme/colors.ts
  -> cores reais do admin dark/light/admin

frontend/admin/shared-core/manifest/theme/tokens.ts
  -> adminThemeTokens e resolveAdminThemeMode()
```

Regra curta:

```text
global shared-core e fallback
client shared-core e design system do portal/client
admin shared-core e design system do admin
surface especifica sobrescreve cor do global por mode
```

O AppShell recebe o `theme` do manifest da surface. Para trocar light/dark no
portal, a tela seleciona `clientThemeManifest.modes[mode]` e injeta esse mode
como `theme.colors` antes de passar para `@foundation/shells/app-shell`.

## AppShell

Novo AppShell oficial:

```text
@foundation/shells/app-shell
```

Entrypoints importantes:

```text
frontend/foundation/shells/app-shell/index.ts
frontend/foundation/shells/app-shell/foundation/index.ts
frontend/foundation/shells/app-shell/web/index.ts
frontend/foundation/shells/app-shell/native/index.ts
```

O AppShell nao decide:

```text
rota real
permissao real
copy de produto
navegacao hardcoded
regra de cliente/admin
estado de pedido/assinatura
```

O AppShell recebe:

```text
navigation declarativa
routesMap
strings/locales
theme/config
slots
callbacks de navegacao
```

Uso de Design System dentro do AppShell:

```text
Header/Sidebar/Drawer/Footer/BottomTabBar
  -> usam Surface como casca visual

itens clicaveis de navegacao
  -> usam Button
  -> inactive: appearance="transparent"
  -> active: appearance="soft"

icones
  -> usam Icon/AppIcons via iconIntent
```

O AppShell nao deve recriar visual local de botao/link quando a Foundation ja
tem primitive. Classes do AppShell podem apenas posicionar a casca e mapear
variaveis `--app-shell-*` para `--ui-surface-*`.

## Navigation Web E Native

A mesma navigation deve alimentar:

```text
Header desktop
Drawer
BottomTabBar do web mobile
NativeTabBar futuro
Footer quando houver
```

Contrato esperado por item:

```text
key
labelKey ou label
groupKey/groupLabelKey quando Sidebar/Drawer precisam de seções
iconIntent ou iconName
routeKey ou routePath
order
auth
placements
```

Placements:

```text
header
sidebar
drawer
bottomTabBar
nativeTabBar
footer
```

Nao criar navegacao separada para desktop, mobile web e native. O que muda e a
apresentacao, nao a intencao.

Sidebar e Drawer agora podem receber grupos declarativos:

```text
navigation item
  -> groupKey
  -> groupLabelKey
  -> groupOrder

appshell.config.jsx
  -> navigationGroups

resolveAppShellModel
  -> sidebarGroups
  -> drawerGroups
```

BottomTabBar e NativeTabBar continuam usando a mesma lista de intencoes, mas
sem virar menu complexo. Grupos existem principalmente para SidebarMenu e
Drawer.

## Layout V1

O corte atual adicionou um contrato de Layout inspirado no ServiceOS, mas menor
e pragmatico para RoyalPrime.

Foundation agora possui:

```text
frontend/foundation/ui/Layout
  -> Box
  -> Flex
  -> Stack
  -> Inline
  -> Grid
  -> GridItem
  -> Container
```

O contrato semantico fica em:

```text
frontend/foundation/ui/core/layout.ts
```

Regra curta:

```text
theme define a matriz fisica
ui layout define nomes reutilizaveis
appShell escolhe regioes por viewport
telas escolhem ocupacao sem CSS solto quando possivel
```

Hoje o AppShell e o primeiro consumidor real desse contrato. A configuracao
nasce em:

```text
frontend/client/shared-core/manifest/portal/appshell.config.jsx
```

Exemplo atual do portal:

```text
layout.viewports.desktop.header
  -> width: "full"
  -> gutter: "page"
  -> align: "between"

layout.viewports.desktop.content
  -> width: "full"
  -> gutter: "none"

layout.viewports.mobile.bottomTabBar
  -> width: "full"
  -> gutter: "page"

layout.viewports.native
  -> inheritFrom: "mobile"
```

Importante sobre `full`:

```text
full nao significa elemento sem regra ocupando a tela de forma solta.
full significa ocupar o span completo da matriz do viewport.

desktop -> 20 colunas
tablet  -> 8 colunas
mobile  -> 4 colunas
```

Quando `gutter: "page"` esta ativo, o Container preserva o gutter externo da
pagina. Entao, no desktop, o Header full do portal ocupa as 20 colunas uteis
com margem externa de pagina, em vez de usar um `max-width` antigo fixo.

O CSS antigo do Header nao deve voltar a forcar:

```text
max-width
margin-inline: auto
```

em `.headerPortalClassic .headerInner`, porque isso quebra o contrato do
Container e faz o manifest perder autoridade.

## Manifests

Caminho correto e singular:

```text
manifest/
```

Nao usar/ressuscitar:

```text
manifests/
```

Client:

```text
frontend/client/shared-core/manifest/
```

Admin:

```text
frontend/admin/shared-core/manifest/
```

Global:

```text
frontend/shared-core/manifest/
```

## Config E Locales

Nova UI/copy/config deve tentar nascer primeiro em:

```text
manifest
config.jsx/config.ts
navigation
locales/strings
view-model
```

Hardcode temporario so dentro de:

```text
frontend/client/web
frontend/admin/web
```

Mesmo assim, nao criar novo design system local e nao crescer `legacy`.

## Estado De Qualidade

Nota atual da Foundation: 9/10.

Motivo:

```text
tokens, semi-composed, UI primitives e AppShell estao organizados
AppShell esta separado em foundation/web/native
native-ready existe sem criar app mobile prematuro
manifest/navigation/locales estao conectados
existe verificador automatico de contrato
build client/admin passou
```

Ainda nao e 10/10 absoluto porque falta provar em uso real:

```text
migrar mais telas antigas para Foundation
reduzir imports de legacy/app-shell
criar runtime React Native real quando existir app native/mobile
```

## Validacoes

Comandos usados e esperados:

```text
npm run verify:foundation
npm run build:client
npm run build:admin
git diff --check
```

Ultimo estado validado:

```text
npm run verify:foundation -> passou, 65 checks
npm run build:client      -> passou
npm run build:admin       -> passou
git diff --check          -> passou, apenas warnings LF/CRLF do Windows
```

## Proximo Corte Recomendado

Continuar pelas telas render-only usando a Foundation nova.

Ordem sugerida:

```text
1. client/web + client/mobile: revisar se MeusPedidosView e MinhaCaixaView
   precisam apenas de ajuste visual pequeno; nao voltar para legacy
2. client/web + client/mobile: MeuClubeView em Fase 1 funcional
3. admin/web: DashboardPage em Fase 1 funcional
4. admin/web: ListPage/DetailPage/AddPage por screen type
```

Regra para cada tela:

```text
screen
  -> shared-core hook
  -> shared-core API client
  -> backend
  -> view-model
  -> Foundation UI/AppShell
```

Nao fazer tela nova importando:

```text
legacy/app-shell
legacy/design-system
mock direto quando ja existe hook
api direto quando ja existe shared-core client
texto novo hardcoded quando pode ir para locale/config
```

## Arquivos Chave Criados/Alterados

```text
frontend/foundation/shells/app-shell/
frontend/foundation/native/
frontend/foundation/docs/NATIVE.md
scripts/verify-foundation-contract.mjs
package.json
docs/architecture/DESIGN_SYSTEM_V1_TREE.md
docs/architecture/FRONTEND_TARGET_TREE_ROADMAP.md
docs/architecture/NEXT_STEPS.md
frontend/client/shared-core/navigation/client.navigation.ts
frontend/admin/shared-core/navigation/admin.navigation.ts
frontend/client/shared-core/manifest/portal/appshell.config.jsx
frontend/client/shared-core/manifest/landing/appshell.config.jsx
frontend/admin/shared-core/manifest/adminAppShell.config.jsx
```

## Observacao Sobre Worktree

O worktree estava sujo antes do commit atual. Nao assumir que toda mudanca do
commit nasceu no ultimo corte; varias mudancas de docs, manifest singular,
Foundation primitives e render-only ja estavam acumuladas no trabalho em curso.

O usuario pediu explicitamente para fazer:

```text
git add .
git commit
git push
```

## Continuacao Amanhã

Se o proximo chat for continuar sem mudar de prioridade, fazer nesta ordem:

```text
1. conferir git status e ultimo commit/push
2. abrir docs/handoff/09-meus-pedidos-render-only-audit.md
3. abrir docs/handoff/10-minha-caixa-render-only-audit.md
4. abrir frontend/client/web/src/screens/portal/tabs/MeusPedidosView.tsx
5. abrir frontend/client/web/src/screens/portal/tabs/MinhaCaixaView.tsx
6. se `/meus-pedidos` e `/minha-caixa` estiverem visualmente aceitaveis, nao
   polir mais detalhes
7. iniciar MeuClubeView com o mesmo roteiro:
   Layout/config -> locales -> mapa de componentes -> shared-core hook/API
   -> render-only web -> webIsMobile -> native
```

Regra pratica para amanha:

```text
prioridade 1: funcional e arquitetura
prioridade 2: webIsMobile == native behavior
prioridade 3: visual apenas ate ficar apresentavel
```

## Atualizacao - Corte de Style Inline na Landing

Depois do checkpoint `060ee55`, foi feito mais um corte no client web:

```text
frontend/client/web/src/screens/landing/sections/HomePlansSection.tsx
frontend/client/web/src/screens/landing/sections/HomePlansSection.module.css
frontend/client/web/src/screens/landing/public-shell/PublicHeader.tsx
frontend/client/web/src/screens/landing/public-shell/Footer.tsx
frontend/client/web/src/screens/landing/public-shell/PublicShell.module.css
frontend/client/shared-core/locales/pt-BR.ts
```

Resultado:

```text
HomePlansSection nao tem mais style={{ ... }} visual.
PublicHeader/Footer continuam sem style inline e agora usam tokens Foundation reais.
Badges/desconto/destaque usam Badge Foundation.
Textos soltos de preco e banner anual foram movidos para landing.plans.
```

Validacao:

```text
npm run build:client passou
npm run verify:foundation passou
git diff --check passou, apenas avisos LF/CRLF
curl / retornou 200
```

Pendente: browser interno indisponivel nesta sessao, entao falta uma checagem
visual real do header/footer em desktop e mobile antes de dizer 10/10 visual.

## Atualizacao - Landing AppShell

A landing deixou de usar casca propria:

```text
frontend/client/web/src/screens/landing/public-shell/
```

foi removido. Agora `/` e `/hero` usam:

```text
frontend/client/web/src/app/page.tsx
frontend/client/web/src/app/hero/page.tsx
  -> @foundation/shells/app-shell
  -> landing/appshell.config.jsx
  -> landing.navigation.ts
```

Navegacao da landing:

```text
type: "scroll" + targetId
```

fica em `landing.navigation.ts`. O proprio AppShell Foundation trata `#anchor`
como scroll e rotas reais como navegacao normal.

Validacao:

```text
npm run build:client passou
npm run verify:foundation passou
rg public-shell/PublicHeader/BottomTabBar/PublicShell na landing sem resultados
```

## Atualizacao - Landing Header

Landing AppShell foi ajustado para o desenho correto:

```text
inicio: brand/logo
meio: navegacao scroll centralizada
fim: Dark/Light + Entrar no Portal
```

Mudancas:

```text
bottom tab da landing desabilitado
header attached em 100% da largura
drawerTrigger: "mobile"
navAlignment: "center"
CTA Ver Produtos removido do fim do header
```

O suporte `drawerTrigger: "mobile"` e `navAlignment: "center"` foi implementado
no AppShell Foundation, entao a landing apenas declara a intencao no config.

## Atualizacao - Remocao do LandingAppShell

`LandingAppShell.tsx` e `LandingAppShell.module.css` foram removidos.

O AppShell Foundation agora e dono tambem de:

```text
scroll por #anchor
theme toggle configurado por manifest
header.actions declarativo
```

A landing apenas declara:

```text
landing/appshell.config.jsx
landing.navigation.ts
```

## Atualizacao - Sections Da Landing Por Pasta

As sections reutilizaveis em `frontend/client/web/src/screens/landing/sections`
foram reorganizadas para uma pasta por section e renomeadas sem prefixo `Home`:

```text
HeroSection/
  HeroSection.tsx
  HeroSection.module.css
  index.ts
DifferentialsSection/
  DifferentialsSection.tsx
  DifferentialsSection.module.css
  index.ts
ShowcaseSection/
  ShowcaseSection.tsx
  ShowcaseSection.module.css
  index.ts
StepsSection/
  StepsSection.tsx
  StepsSection.module.css
  index.ts
PlansSection/
  PlansSection.tsx
  PlansSection.module.css
  index.ts
GiftSection/
  GiftSection.tsx
  GiftSection.module.css
  index.ts
FaqSection/
  FaqSection.tsx
  FaqSection.module.css
  index.ts
```

Tambem existe `sections/index.ts` exportando todas.

`LandingView` agora e somente orquestrador render-only:

```text
LandingView
  -> SectionContainer
  -> HeroSection/DifferentialsSection/ShowcaseSection/StepsSection/PlansSection/GiftSection/FaqSection
```

`HeroMarketplaceView` e `landingPrimitives` foram removidos como legacy. `/hero`
usa o mesmo `LandingView` modular de `/`.

Auditoria deste corte:

```text
rg -n "style=\\{\\{" frontend/client/web/src -g "*.tsx"
# sem resultados

rg -n "Home(Hero|Differentials|Showcase|Steps|Plans|Gift|Faq)Section|HeroMarketplaceView|landingPrimitives|transitional" frontend/client/web/src frontend/client/shared-core -g "*.tsx" -g "*.ts" -g "*.jsx" -g "*.js"
# sem resultados

npm run build:client
# passou
```

## Atualizacao - Landing Real / Primeira Tela

A landing publica deixou de ser apenas uma limpeza estrutural e ganhou primeira
dobra real de produto:

```text
HeroSection
  -> texto principal
  -> CTAs
  -> metricas de compra
  -> painel visual com foto de produto, logo e fluxo do cliente
```

Assets da landing agora ficam declarados em:

```text
frontend/client/shared-core/manifest/assets.js
```

e nao mais espalhados nas sections. `ShowcaseSection` e `GiftSection` consomem
esse catalogo de assets.

Copy nova foi adicionada em:

```text
frontend/client/shared-core/locales/pt-BR.ts
```

Checks:

```text
npm run build:client
# passou

npm run verify:foundation
# passou, 93 checks

curl -I http://localhost:3000/
# 200

curl -I http://localhost:3000/hero
# 200

rg -n "style=\\{\\{" frontend/client/web/src -g "*.tsx"
# sem resultados
```

Pendente: browser visual/CUA indisponivel nesta sessao (`iab` e `chrome`
indisponiveis), e Playwright nao esta instalado no `node_modules` atual.
Portanto, ainda falta screenshot real desktop/mobile antes de declarar nota
visual maxima.
