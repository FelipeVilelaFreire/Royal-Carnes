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

## Atualizacao Mais Recente - Landing Client

Ultimo foco deste chat: landing page do Client, principalmente responsivo,
largura real das sections, fluidez visual, bordas e a section de formas de
compra.

Arquivos centrais alterados/avaliados:

```text
frontend/foundation/ui/Layout/Layout.tsx
frontend/foundation/ui/Layout/Layout.module.css
frontend/foundation/ui/SectionContainer/SectionContainer.module.css
frontend/client/web/src/screens/landing/LandingView.tsx
frontend/client/web/src/screens/landing/sections/HomeSection/
frontend/client/web/src/screens/landing/sections/ProductOptionsSection/
frontend/client/web/src/screens/landing/sections/HowItWorksSection/
frontend/client/web/src/screens/landing/sections/PlansSection/
frontend/client/web/src/screens/landing/sections/ShowcaseSection/
frontend/client/web/src/screens/landing/sections/DifferentialsSection/
frontend/client/web/src/screens/landing/sections/GiftSection/
frontend/client/web/src/screens/landing/sections/FaqSection/
frontend/client/shared-core/locales/pt-BR.ts
```

### Fix estrutural de largura/grid

Problema encontrado:

```text
Layout Grid injetava --ui-layout-columns via inline style
CSS module mobile tentava sobrescrever --ui-layout-columns
inline style vencia o CSS
sections mobile ficavam espremidas/cortadas
```

Correcao aplicada:

```text
frontend/foundation/ui/Layout/Layout.tsx
  -> Grid agora injeta --ui-layout-resolved-columns
  -> CSS de sections pode sobrescrever --ui-layout-columns

frontend/foundation/ui/Layout/Layout.module.css
  -> grid-template-columns usa:
     var(--ui-layout-columns, var(--ui-layout-resolved-columns))
```

Isso desbloqueia todas as sections que ja tinham regras mobile como:

```text
--ui-layout-columns: 1
--ui-layout-columns: 2
--ui-layout-columns: 3
```

Nao reverter esse fix: ele e o motivo de o mobile ter parado de parecer
cortado.

### Fix estrutural de Container full

Problema encontrado:

```text
Container width="full" com gutter="none" ainda calculava largura como se
houvesse gutter virtual de pagina.
```

Correcao aplicada:

```text
frontend/foundation/ui/Layout/Layout.tsx
  -> quando selectedWidth="full" e gutter="none", usa viewportWidth direto
```

Isso preserva containers com `gutter="page"` e melhora surfaces full-width,
incluindo landing.

### SectionContainer

`SectionContainer` agora faz mais da fisica correta da landing:

```text
overflow: visible
scroll-margin-top respeitando header
background explicitamente diferente para solid/glass
separador de section com linha sutil tokenizada
transicao de background/border via tokens
gutter externo mobile equivalente a 20px via tokens
```

O gutter externo pedido foi implementado sem `20px` hardcoded:

```text
--ui-section-external-gutter:
  calc((var(--theme--spacing-spaceMd) + var(--theme--spacing-spaceLg)) / 2);
```

### HomeSection

Estado atual:

```text
frontend/client/web/src/screens/landing/sections/HomeSection/
```

Observacoes:

```text
desktop voltou para composicao anterior: 10/10, max-width antigo e proporcao antiga
mobile agora usa grid-column: 1 / -1 nos blocos principais
hero card mobile fica centralizado, com max-width tokenizado
mediaOverlay/mediaBadge/experienceCard ficam ocultos no mobile para simplificar
stats mobile ficaram menores e em cards compactos
```

Nao mexer em desktop da HomeSection sem pedido explicito. O usuario pediu para
voltar o web desktop como estava e melhorar aos poucos.

### ProductOptionsSection

Section trabalhada por ultimo. Objetivo: deixar menos "lista administrativa" e
mais landing/comercial, com a ideia:

```text
Escolha como quer receber sua selecao RoyalPrime
```

Copy atualizada em:

```text
frontend/client/shared-core/locales/pt-BR.ts
landing.productOptions
```

Resumo da copy nova:

```text
Royal Assinatura
  -> plano pronto, recorrencia, curadoria por categoria

Royal Box
  -> caixa mensal personalizada, composicao definida pelo cliente

Royal Delivery
  -> pedido avulso, sem recorrencia, sob demanda
```

Visual atualizado em:

```text
frontend/client/web/src/screens/landing/sections/ProductOptionsSection/ProductOptionsSection.module.css
```

Mudancas:

```text
cards com linha superior sutil
featured badge menor e mais direto: "Mais flexivel"
descricao com min-height tokenizado em desktop
card destacado com borda mais clara
hover com border/box-shadow/transform tokenizados
mobile preserva 1 coluna agora que Grid foi corrigido
```

### Fluidez, hover e bordas

Passada geral feita nas sections:

```text
DifferentialsSection.module.css
GiftSection.module.css
FaqSection.module.css
ShowcaseSection.module.css
PlansSection.module.css
ProductOptionsSection.module.css
SectionContainer.module.css
```

Padrao aplicado:

```text
sem transition: all
sem ease solto
motion usando --theme--motion-duration* e --theme--motion-easingStandard
hover desktop com deslocamento leve
hover removido/neutralizado no mobile quando faria a tela pular
borders de hover/open/featured mais claras e tokenizadas
```

### LandingView atual

Ordem atual das sections:

```text
top              -> HomeSection
product-options  -> ProductOptionsSection
how-it-works     -> HowItWorksSection
assinaturas      -> PlansSection
catalogos        -> ShowcaseSection
diferenciais     -> DifferentialsSection
royal-box        -> GiftSection
faq              -> FaqSection
```

Atencao: `ProductOptionsSection` esta com `atmosphere="glass"` para criar
transicao visual logo depois da hero.

### Validacoes executadas neste ciclo

Passaram:

```text
npm run verify:foundation
git diff --check
frontend/client/web: ..\..\..\node_modules\.bin\next.cmd build --webpack
```

Scans pontuais tambem passaram no escopo alterado:

```text
rg -n "style=\{\{|#[0-9a-fA-F]{3,8}|rgba\(|\b[0-9]+px\b|\b[0-9]+rem\b|transition: all|\bease\b" frontend/client/web/src/screens/landing frontend/foundation/ui/SectionContainer
```

Observacao importante:

```text
npm run build:client pode falhar se disparar verificacao global por dividas/admin
na worktree. Para validar client isolado, foi usado next build --webpack direto
em frontend/client/web.
```

### Gap ainda aberto

Ainda nao houve screenshot real neste ciclo porque o conector de browser estava
indisponivel:

```text
Browser is not available: chrome
Browser is not available: iab
```

Nao declarar visual final como "10/10" ate alguem abrir `http://localhost:3000/`
ou `http://localhost:3000/home` e revisar desktop/mobile.

### Proximo foco recomendado

Continuar section por section:

```text
1. Abrir a landing no browser real e confirmar HomeSection + ProductOptions.
2. Se ProductOptions estiver boa, seguir para HowItWorksSection.
3. Depois PlansSection, porque ela e comercialmente critica.
4. Depois Showcase/Gift/Differentials/Faq.
5. Em cada section: primeiro largura/grid/mobile, depois copy, depois borda/motion.
```

Regra pratica:

```text
nao redesenhar tudo junto
resolver uma section
validar no navegador
so entao ir para a proxima
```

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
frontend/client/web/src/screens/landing/sections/HomeSection/
frontend/client/web/src/screens/landing/sections/ProductOptionsSection/
frontend/client/web/src/screens/landing/sections/HowItWorksSection/
frontend/client/web/src/screens/landing/sections/PlansSection/
frontend/client/web/src/screens/landing/sections/ShowcaseSection/
frontend/client/web/src/screens/landing/sections/DifferentialsSection/
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
product-options
how-it-works
assinaturas
catalogos
diferenciais
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
HomeSection
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

### Escopo Principal Atual

O Portal Client ativo foi reduzido ao conjunto que existe em Web e Mobile:

```text
/home
/cortes
/montar-box
/meus-pedidos
/perfil
```

O inventario de paridade, fontes de dados e decisoes de limpeza esta em
`docs/CLIENT_PORTAL_SCREEN_MAP.md`. Rotas planejadas, aliases `portal-*`,
`/hero`, `/library`, Minha Caixa, Meu Clube e a rota propria de Royal Delivery
foram removidos do Client. Royal Delivery continua como modalidade dentro de
Montar Box, nao como tela separada.

Validacao da simplificacao: `npm run verify:rules` passou. O build Client
resolveu o Portal, mas a checagem TypeScript final foi bloqueada por mudanca
concorrente em `frontend/foundation/ui/Surface/Surface.tsx` (`appearance`,
`tone` e `level` ausentes no tipo), fora deste corte.

### AccessShell Compartilhado

O acesso deixou de ser uma implementacao local por surface. O dono visual e:

```text
frontend/foundation/shells/access-shell/
```

Capacidades atuais:

```text
web    -> modal, bottomModal e screen
native -> screen via hosts nativos
config -> flow, campos, apresentacao e opcoes visuais
```

No Native, o AccessShell nao monta `Pressable`, `TextInput`, `Text` ou
`View` como controles de acesso diretamente. Ele compoe as primitivas
`Button`, `Input`, `Surface`, `Text` e layouts da Foundation em
`frontend/foundation/native/components/`; essas primitivas
resolvem Theme -> semi-composed -> descriptor nativo antes de falar com os
hosts React Native. Os adapters antigos em `frontend/client/mobile/src/ui/`
sao legado a migrar, e nao uma dependencia do AccessShell.

Consumidores atuais:

```text
Client Web
  -> frontend/client/web/src/screens/portal/PortalView.tsx
  -> useClientAuthSession + createClientAuthApi
  -> config: frontend/client/shared-core/manifest/portal/access-shell.config.jsx

Client Mobile
  -> frontend/client/mobile/src/screens/portal/PortalView.tsx
  -> mesmo config e useClientAuthSession
  -> host fornece storage/API config da plataforma quando disponivel

Admin Web
  -> frontend/admin/web/src/App.tsx
  -> useAdminAuthSession
  -> config: frontend/admin/shared-core/manifest/access-shell.config.jsx
```

Limite de ownership:

```text
AccessShell -> campos, loading, erro, apresentacao e callbacks
Client/Admin shared-core -> session, API, token, mapper e persistencia
backend -> autenticacao, autorizacao e identidade
```

Nao recriar `AuthModal` ou `LoginScreen` localmente. Os arquivos locais antigos
foram removidos. Copy continua em locale; config declara somente capacidade e
composicao, nunca texto, endpoint ou regra de sessao.

### Portal Sem Mock: Cortes

`/cortes` e a primeira rota Client migrada sem fallback de apresentacao nos dois
runtimes, Web e Mobile:

```text
CortesView
  -> useClientApiConfig() via ClientApiProvider
  -> useClientCatalog({ apiConfig })
  -> createClientCatalogApi(apiConfig)
  -> GET /api/v1/catalog/collections/
  -> GET /api/v1/catalog/commercial-modes/
  -> GET /api/v1/catalog/products/
  -> catalogo seed/backend real
```

`cortes-catalog.view-model.ts` nao importa mais `cuts.mock`,
`mockCutsCatalog` ou `mockCutCategories`. Loading, vazio e erro sao estados
reais da API; erro nao troca silenciosamente para dados demonstrativos.

O `CortesView` Mobile segue o mesmo `useClientApiConfig()` ->
`useClientCatalog({ apiConfig })` -> `createCortesCatalogViewModel()`. O antigo
`cortes.model.ts`, que criava snapshot local vazio, foi removido. A partir daqui,
uma rota Client somente e marcada como sem mock apos revisar Web e Mobile no
mesmo contrato e eliminar fallback nos dois; uma migracao unilateral nao vale
como concluida.

### Auditoria Atual: Montar Box

`/montar-box` usa um unico `useClientCheckout` nos dois runtimes, portanto a
regra esta centralizada no shared-core. A auditoria detalhada esta em
`docs/CLIENT_PORTAL_SCREEN_MAP.md`.

Estado confirmado:

```text
pedido final       -> POST /api/v1/orders/me/ ja e backend real
catalogo/planos    -> backend ja possui endpoints, mas Checkout ainda usa fallback
endereco           -> modelo existe; falta API self-service do cliente
frete/prazo        -> falta contrato/backend publicado
pagamento/parcelas -> falta contrato/backend publicado
```

O Mobile agora recebe as strings pelo `PortalView`, como as demais telas, e nao
importa `clientPtBR` diretamente. Ele ainda e visualmente mais compacto que o
Web; isso e um gap de paridade de apresentacao, nao deve resultar em uma regra
separada de checkout.

Nao declarar Montar Box como sem mock antes de substituir o
`checkoutFallbackDataSource` por um snapshot de checkout real nos dois
runtimes. O contrato correto continua:

```text
backend -> shared-core API/mapper/hook/view-model -> PedidoView Web/Mobile
```

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
  -> AccessShell Foundation por config, sem modal/tela local por surface

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
curl.exe -I http://localhost:3000/home
```

Resultados registrados:

```text
build client passou
verify:foundation passou
/ retornou HTTP 200
/home retornou HTTP 200
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
rg -n "HeroMarketplaceView|landingPrimitives|transitional|LandingAppShell" frontend/client/web/src frontend/client/shared-core -g "*.tsx" -g "*.ts" -g "*.jsx" -g "*.js"
rg -n "clientPtBR|@/mocks|../mocks|../../mocks" frontend/client/web/src/screens frontend/client/web/src/product-components -g "*.tsx" -g "*.ts"
rg -n "🥩|📦|🔥|🚚|⭐|🔍|✏️|🚪|💰|🎯|🗑️|⚙️" frontend/client frontend/foundation -g "*.tsx" -g "*.ts" -g "*.jsx" -g "*.js"
curl.exe -I http://localhost:3000/
curl.exe -I http://localhost:3000/home
```

## Proximos Passos Client

Prioridade recomendada:

```text
1. Fazer QA visual real da landing em desktop/mobile.
2. Ajustar HomeSection/ProductOptions/HowItWorks com screenshot aberto, sem voltar a inline style.
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

## Atualizacao Client: Portal Sem Mocks

Estado desta atualizacao:

```text
escopo: Portal Client Web + Mobile
rotas: /cortes, /montar-box, /meus-pedidos e /perfil
objetivo concluido: remover dados demonstrativos e fallback executavel do client
```

O Client nao possui mais os data-sources de fallback nem a pasta
`frontend/client/shared-core/mocks`. Uma falha de API agora preserva o estado
real vazio/erro; ela nao troca silenciosamente para pedidos, planos, produtos,
enderecos ou pagamentos demonstrativos.

Fluxos atuais:

```text
/cortes
  -> catalog API -> useClientCatalog -> Web/Mobile

/montar-box
  -> catalog, orders/config, subscriptions/plans, subscriptions/me,
     subscriptions/me/cycles/current e customers/me
  -> useClientCheckout -> PedidoView Web/Mobile
  -> endereco novo persiste em customers/me/addresses
  -> pedido final usa orders/me

/meus-pedidos
  -> orders/config + orders/me autenticados
  -> useClientOrders resolve a configuracao de API do Portal
  -> MeusPedidosView Web/Mobile apenas renderiza loading, vazio, erro ou API

/perfil
  -> customers/me, payments/me, subscriptions e orders/me
  -> useClientCustomer -> MinhaContaView Web/Mobile
```

Limites dos dados reais:

```text
pagamento salvo depende de provider/gateway e pode aparecer vazio
troca de plano e acoes de seguranca ainda exigem concluir os callbacks de UI
limites do checkout refletem entitlements, mas a regra autoritativa continua no backend
```

Validacoes desta atualizacao:

```text
rg de mocks/fallback no frontend/client -> sem ocorrencias
npm run verify:rules -> passou, sem violacoes novas
git diff --check -> passou
Next dev reiniciado em http://localhost:3000
```

O build do Client compilou o codigo deste corte, mas a etapa TypeScript segue
bloqueada por erros concorrentes da Foundation em `UiBackgroundConfig` e
props de `Surface`. A validacao Django nao rodou porque `python.exe` estava
inacessivel neste ambiente.

## Proximo Corte

Agora o foco deixa de ser remover mocks. A sequencia recomendada e:

```text
1. Testar login real e /meus-pedidos com uma conta seed no navegador.
2. Testar /montar-box: catalogo, endereco, frete, pagamento e POST de pedido.
3. Testar /perfil: salvar dados, preferencias e enderecos.
4. Ajustar loading, vazio, erro e feedback de salvamento nas duas plataformas.
5. Fazer QA visual Web/Mobile e melhorar cada tela com screenshot real.
```
