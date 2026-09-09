# Continuacao 2 - RoyalPrime Client

> Status: handoff paralelo focado somente em Client.
> Use `continuacao.md` para o fluxo geral/admin/backend e este arquivo para
> landing, portal web, mobile, AppShell de client, shared-core client e UI.

## Objetivo Deste Arquivo

Este arquivo existe para permitir dois chats simultaneos sem perder o fluxo:

```text
continuacao.md   -> visao geral, admin, backend, seeds, contratos globais
continuacao2.md  -> client web/mobile, landing, portal, AppShell e UI render-only
```

Antes de mexer em Client, leia tambem:

```text
ROYALPRIME_ARCHITECTURE_CONTRACT.md
docs/CODEX_ENTRYPOINTS.md
docs/architecture/RENDER_APPS_RULES.md
docs/architecture/SHARED_CORE_RULES.md
docs/contracts/MOCK_AND_ENV_ARCHITECTURE.md
backend/API_CONTRACTS.md
frontend/AGENTS.md
frontend/client/web/AGENTS.md
frontend/client/mobile/AGENTS.md
frontend/foundation/AGENTS.md
docs/handoff/12-style-hardcode-audit.md
docs/kits/KITS_RUNTIME_LEDGER.md
```

## Contrato Client

Regra curta:

```text
web ou native
  -> render-only
  -> sem regra de negocio local
  -> sem mock direto quando existe shared-core
  -> sem fetch direto quando existe API client
  -> sem texto novo hardcoded
  -> sem emoji Unicode solto
  -> sem style={{ ... }}
  -> Foundation UI/AppShell para primitives e casca

client/shared-core
  -> contracts
  -> api clients
  -> data-sources/fallbacks
  -> mappers
  -> hooks
  -> view-models
  -> locales
  -> manifests/navigation/assets

backend
  -> verdade de dominio
  -> persistencia
  -> permissao
  -> status/transicoes/precos/estoque
```

Se uma tela sabe demais, calcula regra de negocio, inventa dados comerciais ou
desenha visual estatico inline, ela precisa ser corrigida.

## Estado Atual Do Client

Checkpoint anterior publicado:

```text
060ee55 feat: harden portal render-only styling
origin/feature/shared-core-kit-reset
```

Depois desse checkpoint houve trabalho adicional de Client ainda em worktree:

```text
landing modularizada
landing usando AppShell Foundation direto
landing real com imagem/produto/fluxo do cliente
limpeza de style={{ ... }} em client web
docs/kits atualizados
```

Preservar a worktree. Nao fazer reset, checkout destrutivo ou limpeza de
arquivos sem confirmar o estado real.

## Entrypoints Principais

Rotas publicas:

```text
frontend/client/web/src/app/page.tsx
frontend/client/web/src/app/hero/page.tsx
```

Ambas usam:

```text
frontend/foundation/shells/app-shell/web/AppShellRuntime.tsx
frontend/client/shared-core/manifest/landing/appshell.config.jsx
frontend/client/shared-core/navigation/landing.navigation.ts
frontend/client/web/src/screens/landing/LandingView.tsx
```

Portal/client:

```text
frontend/client/web/src/screens/portal/
frontend/client/web/src/screens/portal/tabs/
frontend/client/web/src/screens/portal/screenTypes/
frontend/client/web/src/product-components/ecommerce/
frontend/client/mobile/src/screens/portal/tabs/
```

Shared-core client:

```text
frontend/client/shared-core/api/
frontend/client/shared-core/contracts/
frontend/client/shared-core/data-sources/
frontend/client/shared-core/hooks/
frontend/client/shared-core/mappers/
frontend/client/shared-core/view-models/
frontend/client/shared-core/locales/
frontend/client/shared-core/manifest/
frontend/client/shared-core/navigation/
frontend/client/shared-core/types/
```

## Landing Atual

`LandingView` virou orquestrador render-only. As sections moram por pasta:

```text
frontend/client/web/src/screens/landing/sections/HeroSection/
frontend/client/web/src/screens/landing/sections/DifferentialsSection/
frontend/client/web/src/screens/landing/sections/ShowcaseSection/
frontend/client/web/src/screens/landing/sections/StepsSection/
frontend/client/web/src/screens/landing/sections/PlansSection/
frontend/client/web/src/screens/landing/sections/GiftSection/
frontend/client/web/src/screens/landing/sections/FaqSection/
frontend/client/web/src/screens/landing/sections/index.ts
```

Cada pasta deve manter somente:

```text
SectionName.tsx
SectionName.module.css
index.ts
```

Sem `HomeHeroSection`, `HomePlansSection` etc. Os nomes devem ser genericos da
section porque a pasta `landing/sections` ja da o contexto.

Ordem/ids atuais da landing:

```text
top
clube
selecao
como-funciona
assinaturas
royal-box
faq
```

O Header da landing nao e local. Ele e AppShell Foundation configurado em:

```text
frontend/client/shared-core/manifest/landing/appshell.config.jsx
```

Comportamento esperado:

```text
desktop
  -> logo esquerda
  -> navegacao central
  -> acoes finais: Dark, Entrar no Portal

mobile
  -> header real na largura toda
  -> hamburger/drawer no proprio AppShell
  -> sem bottom tabbar na landing

navegacao
  -> destino #anchor faz scrollIntoView no AppShell
  -> destino /rota usa roteamento normal
```

## Landing Real

A primeira tela da landing ja foi puxada para uma experiencia mais real:

```text
HeroSection
  -> duas colunas
  -> texto institucional por locale
  -> CTAs
  -> estatisticas
  -> painel visual com foto de produto
  -> logo
  -> mini fluxo do cliente
```

Midias ficam centralizadas em:

```text
frontend/client/shared-core/manifest/assets.js
```

Chaves atuais de landing:

```text
landing.heroBackground
landing.heroProduct
landing.showcaseMostOrdered
landing.showcaseFamily
landing.showcasePremium
landing.royalBoxGift
```

Copy de UI fica em:

```text
frontend/client/shared-core/locales/pt-BR.ts
```

Gap conhecido: PT-BR foi avancado, mas `en-US` e `de-DE` ainda precisam de uma
passada dedicada se o seletor de idioma for usado de verdade.

## Legacy Ja Cortado

Nao restaurar estes caminhos:

```text
frontend/client/web/src/screens/landing/LandingAppShell.tsx
frontend/client/web/src/screens/landing/LandingAppShell.module.css
frontend/client/web/src/screens/landing/HeroMarketplaceView.tsx
frontend/client/web/src/screens/landing/landingPrimitives.tsx
frontend/client/web/src/screens/landing/public-shell/
frontend/client/web/src/transitional/
frontend/client/web/src/legacy/
```

O caminho correto e evoluir AppShell/Foundation/SectionContainer e consumir por
manifest/config, nunca criar um header/drawer/shell paralelo da landing.

## Portal Atual

Fluxos ja trabalhados no corte render-only:

```text
MeusPedidosView
  -> usa useClientOrders()
  -> usa shared-core orders
  -> web/mobile alinhados

MinhaCaixaView
  -> usa hooks/view-models de subscriptions/current cycle
  -> usa Badge Foundation onde estado precisa destaque visual
  -> web/mobile alinhados

MeuClubeView
  -> saiu de imports diretos de clientPtBR/mocks
  -> consome shared-core de customer/subscription

screenTypes do portal
  -> usam useClientStrings()
  -> CSS module para visual estatico
```

Componentes que receberam limpeza de `style={{ ... }}` ou migracao para CSS:

```text
frontend/client/web/src/product-components/ecommerce/PlanBenefitCard.tsx
frontend/client/web/src/product-components/ecommerce/PlanBenefitCard.module.css
frontend/client/web/src/screens/library/LibraryView.tsx
frontend/client/web/src/screens/portal/components/AccountProgress.tsx
frontend/client/web/src/screens/portal/components/DeliveryStep.tsx
```

O scan mais recente esperado para client web:

```text
rg -n "style=\\{\\{" frontend/client/web/src -g "*.tsx"
```

Resultado esperado: sem ocorrencias.

## Kits Client Ja Mapeados

Ver ledger principal:

```text
docs/kits/KITS_RUNTIME_LEDGER.md
```

Kits relevantes para Client:

```text
Kit 01 - Auth & Users
  -> auth/session/login/register/logout
  -> AuthModal ainda deve seguir Foundation/render-only

Kit 02 - Catalog
  -> catalog API/hooks/view-models
  -> Cortes e Home nao devem inventar produto/preco/origem na tela

Kit 03 - Subscriptions
  -> planos, assinatura atual, ciclo atual, itens do ciclo
  -> MinhaCaixaView web/mobile

Kit 05 - Orders
  -> pedidos, detalhe, criacao e fallback
  -> MeusPedidosView web/mobile

Kit 06 - Deliveries
  -> acompanhamento de entrega
  -> cliente apenas visualiza status e historico permitido

Kit 07 - Landing Public Experience
  -> AppShell Foundation por config
  -> LandingView modular
  -> assets/locales/navigation no shared-core
```

Exemplo importante:

```text
Acem
Produto de melhor custo-beneficio...
Cortes do dia a dia - 1 kg | Origem: Brasil
R$ 39,90
```

Isso nao deve nascer hardcoded na tela. O caminho correto e:

```text
backend
  -> produto/variante/preco/origem/categoria
client shared-core
  -> API client
  -> contract
  -> mapper
  -> hook
  -> view-model
web/native
  -> render-only
```

## Validacoes

Validacoes ja executadas no ciclo de Client:

```text
npm run build:client
npm run verify:foundation
git diff --check
curl.exe -I http://localhost:3000/
curl.exe -I http://localhost:3000/hero
```

Resultados registrados:

```text
build client passou
verify:foundation passou
/ retornou HTTP 200
/hero retornou HTTP 200
git diff --check passou com avisos LF/CRLF
```

Browser visual ainda e gap. Tentativas falharam porque:

```text
CUA: Browser is not available: iab/chrome
Playwright: pacote @playwright/test nao encontrado
```

Nao declarar visual "10/10" ou aprovado em desktop/mobile ate fazer screenshot
real da landing e das telas principais.

## Comandos Uteis Para O Proximo Chat Client

```text
git status --short
npm run build:client
npm run verify:foundation
git diff --check
rg -n "style=\\{\\{" frontend/client/web/src -g "*.tsx"
rg -n "Home(Hero|Differentials|Showcase|Steps|Plans|Gift|Faq)Section|HeroMarketplaceView|landingPrimitives|transitional" frontend/client/web/src frontend/client/shared-core -g "*.tsx" -g "*.ts" -g "*.jsx" -g "*.js"
rg -n "clientPtBR|@/mocks|../mocks|../../mocks" frontend/client/web/src/screens frontend/client/web/src/product-components -g "*.tsx" -g "*.ts"
rg -n "🥩|📦|🔥|🚚|⭐|🔍|✏️|🚪|💰|🎯|🗑️|⚙️" frontend/client frontend/foundation -g "*.tsx" -g "*.ts" -g "*.jsx" -g "*.js"
curl.exe -I http://localhost:3000/
curl.exe -I http://localhost:3000/hero
```

## Proximos Passos Client

Prioridade recomendada:

```text
1. Fazer QA visual real da landing em desktop/mobile.
2. Ajustar HeroSection/Showcase/Plans/Gift com screenshot aberto, sem voltar a inline style.
3. Auditar i18n completo em client web/mobile, incluindo en-US/de-DE.
4. Revisar /home e /cortes para garantir que produto/preco/origem venham do backend via shared-core.
5. Revisar /montar-box e fluxo de pedido para extrair regra de dominio para shared-core/backend.
6. Revisar /meus-pedidos e /minha-caixa contra backend real/autenticacao real, reduzindo fallback silencioso.
7. Revisar /perfil/minha-conta como Kit 01 + customer profile, sem regra de auth local.
8. Verificar paridade webIsMobile/native para as telas oficiais.
```

Regra de ouro para continuar:

```text
primeiro contrato real
depois render-only
depois validacao automatica
depois screenshot
depois refinamento visual fino
```

