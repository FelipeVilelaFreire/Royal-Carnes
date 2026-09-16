# Continuacao 2 - RoyalPrime Client

## Atualizacao de Consolidacao - 2026-09-11

O corte de consolidacao removeu residuos confirmados sem consumidores e reduziu
divergencias entre o Portal Web e Mobile:

```text
Home Mobile
  -> deixou de montar sections: []
  -> usa useClientCatalog e apresenta produtos, loading, vazio e erro reais

Home Web
  -> nao troca falha do catalogo por vitrine configurada
  -> produtos, preco e midia somente aparecem quando vierem da API

Mobile AppShell
  -> client/mobile/src/shell/AppShell/AppShell.tsx removido
  -> PortalView consome NativeAppShell da Foundation diretamente

Locale
  -> ClientStringsProvider + resolvedor de locale
  -> pt-BR e fallback explicito; en-US/de-DE iniciam com cobertura da vitrine
  -> manifests recebem as strings ativas no consumidor, sem importar pt-BR fixo

Limpeza
  -> home.model vazio, diretorios mocks/ vazios e screens/legacy vazio removidos
  -> nomes/tipos/configuracoes de mock mortos removidos ou renomeados
```

O checkout continua dependente dos contratos backend de endereco, frete/prazo
e pagamento; nao representa uma capacidade concluida ate esses endpoints e a
cobranca real existirem.

## Atualizacao de Paridade de Tree - 2026-09-11

`frontend/client/AGENTS.md` declara a paridade obrigatoria de produto entre
Web e Mobile. A tree canonica atual das surfaces e:

```text
screens/
  landing/
  portal/
    Home/
    Catalogo/
    MontarBox/
    MeusPedidos/
    Perfil/
```

`web/src/app` e `mobile/src/app` continuam adaptadores de plataforma. Eles nao
criam screens, regras, strings ou contratos paralelos. A implementacao Native
da Landing esta em `mobile/src/screens/landing/LandingView.tsx`; Portal Web e
Mobile usam as mesmas cinco pastas canonicas acima.

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

### Gramatica de pagina Client

Este e o padrao para continuar Portal Client sem recriar casca local:

```text
Web desktop
  AppShell Header fixo -> ScreenHeader -> conteudo -> Footer por config

Portal mobile/native
  ScreenHeader fixo/recolhivel -> conteudo -> BottomTabBar por config
```

`ScreenHeader` deve ser o primeiro filho real da screen e ficar fora de
`main.appear-on-scroll` ou outro ancestral com `transform`. AppShell continua
dono de Header, Footer e BottomTabBar; Landing e Access sao composicoes
declaradas, nao excecoes locais. Antes de alterar uma nova aba, mapear essa
ordem e o manifest que ativa a casca.

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
frontend/client/mobile/src/screens/portal/
frontend/product-components/ecommerce/
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
hosts React Native. As primitives Mobile ficam em
`frontend/foundation/native/client-ui/`; Client nao mantem uma biblioteca UI
paralela.

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

`catalogo.view-model.ts` nao importa mais `cuts.mock`,
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

## Atualizacao Mais Recente - Montar Box e ScreenHeader (2026-09-12)

O foco mais recente foi alinhar a cabeca de `/montar-box` ao contrato visual do
Catalogo, sem criar uma hero ou header local paralelo.

```text
Web e Native
  -> ScreenHeader e o primeiro filho real da tela
  -> titulo mobile usa a chave curta "Pedido"
  -> Surface, gutter interno e transicao no scroll usam a capacidade Foundation
  -> esta tela nao ativa borda progressiva no scroll

MontarBox Web
  -> PedidoHero foi removido, inclusive o CSS legado associado
  -> ScreenHeader foi movido para fora de main.appear-on-scroll
```

O ultimo ponto e estrutural e nao deve ser revertido: `appear-on-scroll` aplica
`transform`; qualquer ancestral transformado passa a ser a referencia de um
descendente `position: fixed`. Portanto o `ScreenHeader` precisa ficar fora de
wrappers de animacao de entrada, e somente o conteudo subsequente pode animar.
Assim a cabeca permanece fixa no viewport enquanto realiza a transicao de
scroll esperada.

Arquivos diretamente envolvidos neste corte:

```text
frontend/client/web/src/screens/portal/MontarBox/MontarBoxView.tsx
frontend/client/web/src/screens/portal/MontarBox/MontarBoxView.module.css
frontend/client/web/src/screens/portal/MontarBox/pedido/PedidoHero.tsx (removido)
frontend/client/mobile/src/screens/portal/MontarBox/MontarBoxView.tsx
frontend/client/mobile/src/screens/portal/MontarBox/pedido/styles.ts
frontend/foundation/product-components/screens/web/ScreenHeader/ScreenHeader.tsx
frontend/foundation/product-components/screens/web/ScreenHeader/ScreenHeader.module.css
frontend/foundation/product-components/screens/native/ScreenHeader/ScreenHeader.tsx
frontend/foundation/product-components/screens/README.md
```

Validacoes executadas durante o corte:

```text
git diff --check -> passou
npm run verify:foundation -> passou
node scripts/verify-code-rules.mjs --base 06ffc08 -> sem violacoes novas
```

Limite atual: ainda falta abrir `/montar-box` no navegador real e confirmar a
fixacao no viewport e a transicao em desktop e mobile. O typecheck nao foi
conclusivo neste ambiente porque `node_modules/react` estava ausente. Nao fazer
commit, reset ou limpeza: este corte e parte da worktree compartilhada na branch
`feature/shared-core-kit-reset`.

## Atualizacao - Paridade de ScreenHeader nas screens Portal (2026-09-13)

As tres screens principais do Portal agora consomem o mesmo contrato
`ScreenHeader` em Web e Native:

```text
Cortes       -> Web + Native
Montar Box   -> Web + Native
Meus Pedidos -> Web + Native
```

No Native, `MeusPedidosView` segue a mesma composicao de `CortesView` e
`MontarBoxView`: `ScreenHeader` como indice `0` de um `ScrollView` sticky,
progresso normalizado de scroll e modo mobile `collapsible`. A copy de eyebrow
e titulo mobile continua vindo de `shared-core/locales`, incluindo o titulo
completo `Meus Pedidos`; nao criar uma cabeca local nesta tela.

Validacao estrutural: `git diff --check` deve continuar limpo. O typecheck
Native alcancou a tela sem erro proprio, mas o checkout ainda possui erros
anteriores em `LandingView`, `HomeView` e na resolucao de `react-dom`; fazer QA
em runtime Native quando o ambiente estiver disponivel.

## Atualizacao - Conteudo Catalogo separado por responsabilidade (2026-09-13)

`Catalogo` e a feature e rota publica. A screen deixou de concentrar filtros,
estados e cards em um unico arquivo; a arvore atual e:

```text
client/shared-core/features/catalogo/
  useCatalogoContent.ts        estado, carga real, busca, filtros e ordenacao

client/web/src/screens/portal/Catalogo/
  CatalogoView/
    CatalogoView.tsx           ScreenHeader + Container + composicao
    CatalogoView.module.css
  content/
    CatalogoContent/
      CatalogoContent.tsx
      CatalogoContent.module.css
    CatalogoCategoryRail/
      CatalogoCategoryRail.tsx
      CatalogoCategoryRail.module.css
    CatalogoToolbar/
      CatalogoToolbar.tsx
      CatalogoToolbar.module.css
    CatalogoFeedback/
      CatalogoFeedback.tsx
      CatalogoFeedback.module.css
    CatalogoProductGrid/
      CatalogoProductGrid.tsx
      CatalogoProductGrid.module.css

client/mobile/src/screens/portal/Catalogo/
  CatalogoView/
    CatalogoView.tsx           Scroll sticky + ScreenHeader + composicao
    styles.ts
  content/
    CatalogoContent/
      CatalogoContent.tsx
      styles.ts
    CatalogoToolbar/
      CatalogoToolbar.tsx
      styles.ts
    CatalogoFeedback/
      CatalogoFeedback.tsx
      styles.ts
    CatalogoProductFeed/
      CatalogoProductFeed.tsx
      styles.ts
```

Web e Native consomem o mesmo controller de `shared-core`, portanto categoria,
busca, ordenacao, carga, erro e vazio continuam com o mesmo fluxo real. Cada
plataforma conserva somente sua composicao visual: grid no Web e feed no
Native. `ProductItemCard` permanece o componente reutilizado para os cards.

## Atualizacao - Catalogo como nome e rota canonicos (2026-09-13)

`Catalogo` e o nome de feature, screen e rota para a vitrine inteira. `Cortes`
permanece apenas como palavra de dominio dentro da copy e como alias legado de
URL; nao usar esse nome para criar novos arquivos, imports ou route keys.

```text
Web screen:    frontend/client/web/src/screens/portal/Catalogo/CatalogoView/CatalogoView.tsx
Native screen: frontend/client/mobile/src/screens/portal/Catalogo/CatalogoView/CatalogoView.tsx
Shared model:  frontend/client/shared-core/view-models/catalogo.view-model.ts
Feature state: frontend/client/shared-core/features/catalogo/
Official URL:  /catalogo
Legacy alias:  /cortes -> a mesma screen Catalogo
```

A chave `catalogo` e a usada por `clientRoutes`, navegacao Portal, AppShell,
Home e Landing. A pagina Next de `/cortes` existe somente para compatibilidade;
qualquer novo link deve usar `/catalogo`.

### CatalogoCategoryRail - contrato Web e Native

O trilho de categorias e um componente proprio nas duas plataformas, alimentado
somente por `catalogo.categories` do controller real. Esse controller consulta
`GET /api/v1/catalog/categories/` na organizacao ativa; portanto, nao deriva a
lista a partir de cards nem mantem categorias hardcoded. Uma categoria ativa
criada no Admin aparece no proximo carregamento do catalogo, inclusive se ainda
nao possuir produtos. `Todos` e a unica opcao virtual de interface, fornecida
pelas strings ativas. O rail fica antes de busca e ordenacao:

```text
Web:    content/CatalogoCategoryRail/CatalogoCategoryRail.tsx + .module.css
Native: content/CatalogoCategoryRail/CatalogoCategoryRail.tsx + styles.ts
```

No Web, o rail oculta a barra do browser e preserva pills compactas, com estado
ativo da Foundation em cobre. No Native, ele usa `ScrollView` horizontal sem
indicador e um controle Foundation com icone semantico `next`; o controle avanca
o carrossel e desaparece ao chegar ao fim. Nao voltar a colocar categorias
dentro de `CatalogoToolbar` ou expor uma barra horizontal de rolagem.

## Atualizacao Mais Recente - Catalogo, Toolbar e ScreenHeader (2026-09-14)

Checkpoint publicado desta sequencia:

```text
3405b46 feat: consolidate catalog and local development flows
branch: feature/shared-core-kit-reset
remote: origin/feature/shared-core-kit-reset
```

O corte consolidou a rota e a composicao do Catalogo. A fonte de dados continua
real e centralizada; esta etapa organizou e refinou somente a camada
render-only de Web e Native.

### Catalogo: contrato visual e responsabilidade

```text
API catalogo
  -> client/shared-core/features/catalogo/useCatalogoContent.ts
  -> categoria, busca, ordenacao, loading, vazio e erro
  -> CatalogoContent Web ou Native
  -> rail -> toolbar -> grid/feed -> feedback
```

`CatalogoCategoryRail` recebe as categorias do controller. `CatalogoToolbar`
recebe a mesma instancia e apenas dispara `setSearchQuery` e `setSortBy`; nao
filtra, ordena, cria categorias nem calcula preco localmente. No Web, o
`DropdownPicker` da Foundation e o unico seletor de ordenacao: abre junto ao
controle, fecha por clique externo ou Escape e destaca a opcao selecionada.
Nao criar um segundo menu de ordenacao especifico do Catalogo.

O visual do toolbar segue a referencia Stitch sem impor bordas pesadas:

```text
superficie externa baixa e discreta
  -> campo de busca em superficie interna
  -> contador compacto
  -> seletor "Ordenar" com label e valor atual
```

Arquivos de composicao:

```text
Web
  frontend/client/web/src/screens/portal/Catalogo/content/CatalogoToolbar/

Native
  frontend/client/mobile/src/screens/portal/Catalogo/content/CatalogoToolbar/
```

`ProductItemCard` foi configurado para aceitar os slots visuais que variam por
produto (badge, categoria, detalhes, rotulo de preco, favorito e acao de
carrinho), sem tornar preco, estoque ou regra de carrinho uma decisao do card.
No Web, a foto ocupa o topo do card, badge e favorito ficam sobre a imagem, e
a acao de carrinho vira um controle compacto de quantidade. O feed Native usa
a mesma informacao de produto e a mesma tree de Catalogo, mas conserva o layout
de uma coluna proprio do host.

```text
frontend/product-components/ecommerce/product-item-card.config.ts
frontend/product-components/ecommerce/web/ProductItemCard.tsx
frontend/product-components/ecommerce/web/ProductItemCard.module.css
frontend/product-components/ecommerce/native/ProductItemCard.tsx
frontend/product-components/ecommerce/native/ProductItemCard.styles.ts
```

### ScreenHeader: titulo e subtitulo durante o scroll

O contrato compartilhado passou a tratar `collapsible` como cabeca contextual
completa no inicio da tela:

```text
compact      -> somente titulo
full         -> titulo e subtitulo estaticos
collapsible  -> titulo e subtitulo; o subtitulo reduz, sobe e desaparece
                progressivamente conforme a tela rola
```

Isso vale nos adaptadores Web e Native. As tres screens que usam o contrato
no Portal ja fornecem titulo e subtitulo pelas strings ativas:

```text
Catalogo
Montar Box
Meus Pedidos
```

Arquivos que definem a capacidade:

```text
frontend/foundation/product-components/screens/shared/ScreenHeader.contract.ts
frontend/foundation/product-components/screens/web/ScreenHeader/ScreenHeader.tsx
frontend/foundation/product-components/screens/web/ScreenHeader/ScreenHeader.module.css
frontend/foundation/product-components/screens/native/ScreenHeader/ScreenHeader.tsx
frontend/foundation/product-components/screens/README.md
```

Nao adicionar titulo ou subtitulo hardcoded em uma screen. Quando uma nova rota
usar `ScreenHeader`, ela deve fornecer `title`, `mobileTitle` quando necessario
e `description` pelo locale ativo. A posicao estrutural continua inviolavel:
primeiro filho real da screen e fora de ancestrais com `transform`.

### Validacao deste checkpoint

```text
npm run verify:rules
  -> passou: 136 arquivos verificados, 0 violacoes novas

git diff --check
  -> passou antes do commit; apenas avisos existentes de LF/CRLF

tsc Native
  -> Catalogo/ScreenHeader sem erro proprio
  -> continua bloqueado por erros preexistentes em LandingView, HomeView
     (prop padding de Surface) e por react-dom ausente em ModalFrame Web
```

Nao houve QA visual por screenshot nesta sessao. Portanto, o resultado deve
ser visto em `/catalogo` antes de declarar fidelidade final ao Stitch, sobretudo
em desktop, Web mobile e host Native real.

### Proxima sequencia recomendada

```text
1. Abrir /catalogo e revisar visualmente rail, busca, ordenacao e cards
   em desktop e mobile; ajustar por screenshot, nao por suposicao.
2. Confirmar busca, categoria e ordenacao contra a API real com dados seed.
3. Fazer o mesmo refinamento visual de conteudo para Meus Pedidos e Montar Box,
   preservando o ScreenHeader compartilhado.
4. Antes de ampliar renderer generico de icones Native, explicar os consumidores
   reais e pedir aprovacao; nao improvisar icones locais nem emoji Unicode.
```

## Atualizacao - Kit Montar Box, niveis e separacao Web/Native (2026-09-16)

Este corte organizou o Montar Box por responsabilidade e caso de uso antes da
adaptacao visual do Stitch. O Catalogo nao foi alterado neste corte; mudancas
de Catalogo que coexistem na worktree pertencem a outra sequencia.

### Kit e referencias

```text
docs/kits/client/montar-box/
  README.md
  implementacao-atual.md
  nivel-01-selecao/
    README.md
    stitch-desktop.md
    stitch-mobile.md
    stitch-mobile-selecao-vazia.md
```

As referencias existentes cobrem apenas o nivel 01, selecao. Elas descrevem a
entrada, a modalidade escolhida e a selecao vazia/ativa; nao ha referencia
propria para entrega, pagamento ou revisao.

### Estado e ownership

```text
selectedMode
  -> caso de uso: Assinatura, Royal Box ou Royal Delivery

currentStep
  -> progressao: montagem, entrega, pagamento e resumo

shared-core
  -> useClientCheckout, config, view-model, contratos, API, preco e regras

Web/Native
  -> somente composicao visual, interacao e callbacks do hook
```

Modalidade e etapa sao estados diferentes. Nenhuma screen calcula total,
estoque, frete, elegibilidade ou cria pedido localmente.

### Tree aplicada

```text
Web pedido/
  flow/       ModeSelector, CheckoutStepTracker, usePedidoRuntime
  selection/  ActivePlanPanel, ProductCatalogStep, ProductFilterModal
  delivery/   DeliveryStep
  payment/    PaymentStep
  review/     ReviewStep
  summary/    StickyOrderSummary, SummaryRow

Native pedido/
  flow/       ModeSelector, CheckoutStepTracker
  selection/  ActivePlanPanel, ProductCatalogStep
  delivery/   DeliveryStep
  payment/    PaymentStep
  review/     ReviewStep
  summary/    MobileSelectionSummary
```

`MontarBoxView` permanece orquestrador de plataforma. ScreenHeader continua
primeiro filho real e AppShell/BottomTabBar continuam donos da casca.

### Paridade real e gap aberto

Web e Native usam o mesmo `useClientCheckout`, mas a apresentacao ainda nao e
equivalente:

```text
Web
  -> resumo lateral sticky e composicao desktop existentes

Native
  -> modalidades e categorias em trilhos horizontais
  -> tracker compacto rolavel
  -> resumo mostra itens e estimativa reais
  -> resumo fixo seguro ainda nao foi implementado: requer confirmar safe area
     e BottomTabBar no host antes de criar overlay local
```

Inspecao do runtime Native: `NativeAppShell` hoje monta a tab bar como regiao
flex ao fim da casca e ainda nao oferece slot/offset para um resumo fixo. Nao
criar overlay local em `MontarBoxView`; se essa capacidade for necessaria em
mais de um fluxo, ela deve nascer no AppShell/Foundation e ser ativada por
config, com aprovacao previa para ampliar a capacidade compartilhada.

Tambem foi criada a guarda `requestClientCheckoutStep` no shared-core. Web e
Native agora solicitam acesso antes de avancar uma etapa protegida, em vez de
divergirem no comportamento de sessao. O proximo corte e validar a mesma jornada
em Web, webIsMobile e host Native real. Antes de criar a barra fixa, confirmar
area segura, teclado e BottomTabBar no contrato do host.

### Validacao

```text
npm run verify:rules -> passou, 0 violacoes novas
git diff --check     -> passou; avisos LF/CRLF existentes
tsc Mobile           -> Montar Box sem erro proprio
```

O TypeScript completo continua bloqueado por erros preexistentes em
`LandingView`/`HomeView` (`Surface.padding`) e por `react-dom` ausente em
`ModalFrame` Web. Ainda falta QA visual real; nao declarar fidelidade Stitch
concluida sem testar desktop, Web mobile e Native.

### Meus Pedidos: estado vazio como tela

O estado sem pedidos nao usa mais o card de historico nem os cards de
estatisticas. Web e Native agora bifurcam a composicao por `hasOrders`:

```text
sem pedidos
  -> ScreenHeader
  -> area util inteira centralizada
  -> icone Foundation + titulo + descricao localizada

com pedidos
  -> metricas, pedido atual, proxima caixa e historico
```

No Web, `emptyViewport` ocupa a altura disponivel depois do AppShell usando
`--app-shell-header-height`; o `EmptyState` e transparente, sem borda e sem
container visual. No Native, a mesma ramificacao remove as superficies de
metricas/historico e centraliza o feedback na area rolavel. Erro de
sincronizacao continua visivel como descricao do estado, sem duplicar copy.

Arquivos: `frontend/client/web/src/screens/portal/MeusPedidos/MeusPedidosView.tsx`,
`frontend/client/web/src/screens/portal/MeusPedidos/meus-pedidos/styles.module.css`
e `frontend/client/mobile/src/screens/portal/MeusPedidos/MeusPedidosView.tsx`.

Quando a rota e protegida e a sessao ainda nao existe, quem aparece nao e essa
screen: e o gate de autenticacao em `PortalView`. Ele tambem foi removido da
superficie enquadrada (`framed`), ocupa a area util de forma transparente e a
BottomTabBar e desativada pelo config ja suportado do AppShell durante esse
gate. Assim, `Meus Pedidos` sem sessao nao deixa nem card nem barra inferior
competindo com o feedback de acesso.

### Feedback vazio: card versus tela

O produto agora trata os dois casos como composicoes distintas, sem transformar
o primitive da Foundation em uma condicional de pagina:

```text
Foundation
  ui/web/EmptyState/
    -> EmptyStateCard: vazio local, dentro de uma area que ainda possui contexto

Client Web Portal
  screens/portal/feedback/
    EmptyStateScreen/
      EmptyStateScreen.tsx
      EmptyStateScreen.module.css
    -> vazio de rota: area util inteira, sem Surface, borda ou raio
```

`CatalogoFeedback` continua usando o feedback em card porque busca, filtros e
o restante da tela permanecem presentes. O gate de autenticacao em
`PortalView` usa `EmptyStateScreen`, pois a rota protegida inteira foi
substituida pelo acesso. Textos, icone e acao continuam sendo fornecidos pelo
consumidor e pelas locales ativas; a composicao nao conhece regra de sessao.

### Montar Box: nivel 01.0, entrada neutra da selecao

O primeiro estado de `/montar-box` foi separado do Stitch que ja trazia Royal
Box selecionada. A nomenclatura do kit agora e:

```text
nivel 01: selecao
  -> 01.0: entrada neutra, selectedMode = null
  -> 01.1: modalidade escolhida, sem itens
  -> 01.2: selecao ativa, com produtos reais
```

Web e Native ganharam `pedido/flow/ModeSelectionIntro.tsx`; ele apresenta a
copy localizada `pedido.modeSelection` e envolve o `ModeSelector`. Enquanto
nao ha modalidade, nao se renderiza tracker, catalogo, resumo, total ou card
generico vazio. As tres opcoes foram reduzidas ao essencial na entrada. Desktop
mantem grade editorial; Web mobile e Native usam trilho horizontal tatil. O
estado 01.1 e o proximo a comparar com a referencia Stitch mobile vazia; ele
nao deve ser confundido com a entrada neutra.

Revisao visual posterior: a primeira versao duplicava o titulo do
`ScreenHeader` com um segundo titulo no intro de modalidades e deixava a leitura
compactada. O `ModeSelectionIntro` agora e somente cabecalho de secao; o Web
ganhou separacao vertical, cards mais altos e acao visual no rodape. A fonte de
comparacao segue sendo `docs/kits/client/montar-box/nivel-01-selecao/stitch-desktop.md`.

### Montar Box: autoridade de cota da assinatura

O limite de uma assinatura deixou de depender apenas do preview do
`useClientCheckout`. A criacao de `subscription-cycle` agora passa pelo mesmo
dominio de ciclos no backend:

```text
POST /api/v1/orders/me/
  -> create_order()
  -> reserve_cycle_order_items()
  -> lock no ciclo aberto
  -> resolve o entitlement mais especifico do plano
  -> valida produto, variante, unidade, disponibilidade e atributos
  -> soma selecoes ja reservadas + lote inteiro enviado
  -> somente entao reserva inventario e cria o pedido
```

Com isso, alterar a interface, repetir requests ou enviar dois itens que juntos
ultrapassam a cota retorna `quantity_exceeded`; nao e possivel transformar uma
cota de 1 kg em um pedido de 5 kg pelo cliente. Quando alvos de entitlement se
sobrepoem, a prioridade e variante, produto, categoria e colecao, nesta ordem.

O contrato de checkout tambem passou a preservar `productKey` e `variantSku`
separadamente. O frontend nao envia mais o SKU da variante como chave do
produto, permitindo ao backend aplicar a unidade correta.

Validacao deste corte:

```text
py manage.py test apps.orders.tests.test_api apps.subscriptions.tests.test_api
-> 26 testes, passou

git diff --check
-> passou; somente avisos LF/CRLF da worktree
```

O preview de saldo no cliente ainda deve ser remodelado para vir do resumo de
ciclo calculado pelo backend, em vez de contar itens localmente. A seguranca da
confirmacao do pedido ja esta no servidor; a proxima etapa e expor esse resumo
autoritativo para Web e Native.

### Montar Box: paridade de tree Web e Native

As duas plataformas agora seguem a mesma arvore de casos de uso:

```text
pedido/
  flow/       ModeSelectionIntro, ModeSelector, CheckoutStepTracker, usePedidoRuntime
  selection/  ActivePlanPanel, ProductCatalogStep
  delivery/   DeliveryStep
  payment/    PaymentStep
  review/     ReviewStep
  summary/    resumo de selecao por plataforma
  index.ts    exports da plataforma
```

`usePedidoRuntime` foi extraido tambem no Native. A guarda de acesso a etapas
nao fica mais embutida em `MontarBoxView`; Web e Native solicitam a mesma regra
do shared-core. O `ModeSelector` Native tambem recebe a assinatura/plano ativo
e usa a mesma semantica do Web para distinguir uma assinatura existente da
entrada de contratacao. O resumo permanece especificamente mobile, pois o
AppShell Native ainda nao oferece um slot seguro para reproduzir o `sticky`
desktop acima da BottomTabBar.

### ProductItemCard: card unico e grids por screen

`ProductItemCard` e o unico componente de item de produto para Catalogo e
Checkout. Nao existe preset `montarBox`, card local ou JSX paralelo. As duas
screens consomem `preset="catalogo"`; suas grades definem a densidade da tela.

```text
CatalogoProductGrid  -> ProductItemCard -> descoberta e carrinho
CheckoutProductGrid  -> ProductItemCard -> adicionar, menos, quantidade, mais
```

No Checkout Web, `actionPresentation="label"` mostra `Adicionar` antes da
primeira selecao e o stepper no canto inferior direito depois dela. O Native
tem a mesma sequencia no adapter nativo. Preco pode ser ocultado na assinatura
sem deslocar a acao. Elegibilidade, limite e estado desabilitado sao decisoes
do shared-core/backend, nunca do card.

### Montar Box: composicao de checkout (2026-09-16)

O diretório local deixou de usar o nome especifico `pedido/`. As duas
plataformas agora organizam a composicao sob `Checkout/`, com
responsabilidades reutilizaveis por fluxo:

```text
acquisition/ -> modalidades de aquisicao
cycle/       -> plano ativo e saldo do ciclo
catalog/     -> busca, filtro, ProductCatalogStep e CheckoutProductGrid
progress/    -> etapas do checkout
runtime/     -> guarda de etapa do host
summary/     -> resumo da selecao
```

Na montagem, aquisicao e uma regiao propria. Abaixo dela, ciclo e catalogo
ocupam a coluna principal e o resumo permanece lateral no Web. O Native usa a
mesma tree e callbacks, adaptados para uma coluna e o host mobile. O contrato
completo esta em `docs/kits/client/montar-box/checkout-composicao.md`.

Filtro atual: Web e Native usam rascunho de categoria e so alteram a lista ao
aplicar. O mapper preserva todas as categorias associadas a cada produto e o
view-model filtra por tags; nao reduz mais o seletor a `Carnes` e
`Acompanhamentos`. A pendencia permanece no backend: entitlement de produto por
plano ainda precisa chegar como dado autoritativo, pois o mapper atual ainda nao
recebe essa matriz real.
