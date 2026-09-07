# Audit de styles hardcoded nas telas

> Status: registro historico de auditoria, nao contrato ativo.
> A regra vigente esta na secao TSX e CSS Modules do
> [contrato arquitetural](../../ROYALPRIME_ARCHITECTURE_CONTRACT.md).
> As excecoes inline registradas abaixo descrevem a transicao daquela etapa;
> nao autorizam style inline nem hardcode em codigo web novo.

Data: 2026-09-07
Branch: `feature/shared-core-kit-reset`

## Regra

Para web, visual estatico de tela deve ficar em CSS module, Foundation ou AppShell. A tela nao deve desenhar cor, fonte, borda, sombra ou espacamento estrutural com `style={{ ... }}`.

Para mobile, `style` ainda e o mecanismo normal do React Native, mas a tela nao deve definir tipografia e cor na mao. A tela deve usar primitives semanticas (`Text variant/tone/weight`, `Surface appearance/tone`, `Stack gap`) e deixar tokens/descriptor resolverem os valores.

Excecoes aceitaveis:

- valor dinamico calculado em runtime, como `width: `${value}%``;
- CSS custom property condicional que controla uma receita;
- layout host do React Native sem primitive madura ainda, como `justifyContent`;
- dimensoes diretamente ligadas a dado/estado quando nao ha primitive pronta.

## Resultado do scan

Comando usado:

```powershell
rg --count-matches "style=\{\{|fontSize:|fontWeight:|color: theme\.|backgroundColor: theme\.|#[0-9A-Fa-f]|rgba\(" frontend\client\web\src\screens frontend\client\mobile\src\screens frontend\foundation\ui frontend\foundation\shells
```

Maiores focos encontrados:

- `frontend/client/web/src/screens/landing/LandingView.tsx`: 314 ocorrencias.
- `frontend/client/web/src/screens/landing/HeroMarketplaceView.tsx`: 281 ocorrencias.
- `frontend/client/web/src/screens/portal/tabs/HomeView.tsx`: 179 ocorrencias.
- `frontend/client/web/src/screens/landing/sections/HomePlansSection.tsx`: 146 ocorrencias.
- `frontend/client/web/src/screens/portal/tabs/HomeVitrineViewLegacy.tsx`: 125 ocorrencias.
- `frontend/client/web/src/screens/portal/tabs/MeuClubeView.tsx`: 67 ocorrencias.
- `frontend/client/web/src/screens/cuts/HeroCortesView.tsx`: 62 ocorrencias.
- `frontend/client/web/src/screens/portal/NovoPortalHomeView.tsx`: 45 ocorrencias.
- `frontend/client/web/src/screens/portal/screenTypes/SubscriptionScreenType.tsx`: 38 ocorrencias.
- `frontend/client/web/src/screens/portal/screenTypes/TrackingScreenType.tsx`: 29 ocorrencias.
- `frontend/client/web/src/screens/portal/screenTypes/CatalogScreenType.tsx`: 27 ocorrencias.
- `frontend/foundation/ui/Avatar/AvatarCell.tsx`: 17 ocorrencias.
- `frontend/client/mobile/src/screens/portal/tabs/MinhaContaView.tsx`: 14 ocorrencias.

## Corrigido neste corte

### Recorte das rotas do portal

Rotas auditadas neste corte:

- `http://localhost:3000/home`
- `http://localhost:3000/cortes`
- `http://localhost:3000/montar-box`
- `http://localhost:3000/meus-pedidos`
- `http://localhost:3000/perfil`

Mapa real de runtime:

- `/home` renderiza `HomeVitrineView`, nao `HomeView`.
- `/cortes` renderiza `CortesView`.
- `/montar-box` renderiza `PedidoView`.
- `/meus-pedidos` renderiza `MeusPedidosView`.
- `/perfil` renderiza `MinhaContaView`.

Resultado especifico:

- `PortalView` nao usa mais `portalSurfaceStyles.ts`; os estilos de empty state,
  CTA, tema e perfil foram movidos para `PortalView.module.css`.
- `HomeVitrineView` nao importa mais `clientPtBR` diretamente; resolve as chaves
  por `useClientStrings()`.
- `CortesView` nao injeta mais paleta inteira por `style={{ ... }}`;
  superficie, texto, borda, estado ativo de categoria e empty state ficam em
  `CortesView.module.css`.
- `ProductItemCard` removeu o `quantityButtonStyle` duplicado; o stepper usa a
  classe `.quantityButton`.
- `PedidoView` nao injeta mais variaveis de pagina por inline style e nao cria
  mais `cardSurface`.
- `PedidoHero`, `ModeSelector`, `CheckoutPanel`, `CheckoutStepTracker`,
  `ActivePlanPanel`, `PaymentStep`, `DeliveryStep`, `ReviewStep` e
  `ProductFilterModal` tiveram a vestimenta principal movida para CSS module.
- `MeusPedidosView`, `MinhaCaixaView` e `MinhaContaView` continuam no corte
  render-only ja documentado; no scan atual nao apareceram `clientPtBR`,
  `Dados demonstrativos` nem `style={{ ... }}` visual estatico nos entrypoints
  dessas rotas.

Saldo intencional no recorte:

- `minha-conta/primitives.tsx` mantem `width: `${normalizedValue}%`` porque e
  valor dinamico de barra de metrica.
- `DeliveryStep.tsx` mantem `gridColumn: field.gridColumn` porque vem do config
  de campos.
- `usePedidoRuntime.ts` ainda entrega `tokens` para contratos antigos usados por
  `ProductItemCard`, `SummaryRow` e partes do checkout. A remocao total deve ser
  feita depois migrando esses contratos para classes/receitas, para nao quebrar
  o fluxo de checkout de uma vez.

## Corte legacy apos checkpoint `060ee55`

Depois do commit/push `060ee55 feat: harden portal render-only styling`, foi
iniciado um corte destrutivo controlado para reduzir `legacy/`:

- `PortalView` e `PedidoView` usam `screens/portal/AuthModal.tsx`, construido
  com Foundation `Modal`, `BottomModal`, `Button`, `Input`, `Surface` e
  `Text`.
- `OrderDetailModal` foi migrado para Foundation e CSS module; saiu de
  `@/legacy/design-system`.
- `CortesView` e `PedidoView` nao possuem mais modo standalone com
  `PortalHeader`, `BottomTabBar` e `Footer` legados. O AppShell oficial e o
  unico dono da casca nas rotas do portal.
- `app/layout.tsx` usa `runtime/AppearOnScrollRuntime.tsx`, nao mais
  `legacy/app-shell/AppearOnScrollRuntime`.
- Foram removidos arquivos mortos de portal antigo: `HomeView.tsx`,
  `HomeVitrineViewLegacy.tsx`, `NovoPortalHomeView.tsx`,
  `LegacyPortalView.tsx`, `screens/HomeView.tsx` e `HeroCortesView.tsx`.
- Foram removidos modulos mortos de `legacy/app-shell`: `Header.tsx`,
  `AuthModal.tsx` e `AppearOnScrollRuntime.tsx`.
- Foram removidos modulos mortos de `legacy/design-system`: `Icons.tsx`,
  `Input.tsx`, `Modal.tsx` e `Select.tsx`.

Atualizacao do saldo legacy:

- `LandingView` e `HeroMarketplaceView` nao importam mais `legacy/`.
- `PublicHeader`, `Footer` e `BottomTabBar` publicos foram movidos para
  `screens/landing/public-shell`.
- `screens/landing/landingPrimitives.tsx` adapta `Badge`, `Button` e `Card`
  para Foundation enquanto a landing publica nao e reescrita em secoes/config.
- `frontend/client/web/src/legacy` foi removido.
- O saldo real passou a ser divida interna da landing publica: muito
  `style={{...}}`, copy hardcoded e layout manual. Isso deve virar um corte de
  Landing/AppShell/SectionContainer, nao restaurar `legacy/`.

## Corte i18n e shared-core types

Depois do corte legacy, foi feito um ajuste incremental no client para subir a
nota de i18n/shared-core sem reescrever tudo:

- `MeuClubeView` saiu de `clientPtBR`, `catalogSubscriptionPlansMock` e
  `royalCustomerMock` diretos.
- `MeuClubeView` agora consome `useClientStrings().meuClube` e
  `useClientCustomer()`, mantendo a tela como render-only sobre o shared-core.
- `MeuClubeView.module.css` recebeu a vestimenta estrutural da tela do clube.
- `ClientCustomerTabKey` e `ClientCustomerProfileDraft` foram movidos de
  `hooks/useClientCustomer.ts` para `types/customer.types.ts`; o hook reexporta
  temporariamente esses tipos para compatibilidade.
- `CatalogScreenType`, `SubscriptionScreenType`, `TrackingScreenType` e
  `SettingsScreenType` trocaram `clientPtBR` direto por `useClientStrings()`.
- Simbolos/emoji soltos nos `screenTypes` foram trocados por icones Foundation.
- `OrderDetailModal` e `orderDisplayModel` deixaram de importar tipos/mocks de
  `@/mocks/orders`; o contrato do modal agora e `ClientOrderRowViewModel`.
- `PortalScreenTypes.module.css` concentra a vestimenta de
  `CatalogScreenType`, `SubscriptionScreenType`, `TrackingScreenType` e
  `SettingsScreenType`; esses componentes ficaram sem `style={{...}}` visual.
- `screens/landing/public-shell/PublicShell.module.css` concentra a vestimenta
  de `PublicHeader`, `Footer` e `BottomTabBar`.
- `PublicHeader`, `Footer` e `BottomTabBar` passaram a consumir
  `useClientStrings().landing.publicShell`; navegacao, footer e bottom tabs
  nao mantem mais copy local.
- As secoes antigas em `screens/landing/sections/*` e `HeroMarketplaceView`
  trocaram `clientPtBR` direto por `useClientStrings()`.
- Checks visuais soltos da landing (`✓`) foram trocados por `CheckIcon` da
  Foundation.

Scans relevantes apos o corte:

```powershell
rg -n "clientPtBR|catalogSubscriptionPlansMock|royalCustomerMock|@/mocks|../mocks|../../mocks" frontend/client/web/src/screens/portal frontend/client/web/src/product-components/ecommerce -g "*.tsx" -g "*.ts"
# sem resultados

rg -n "ð|âœ|🧩|🥩|📍|💳|🚚|🔥|⭐|🔍|✏️|⚙️" frontend/client/web/src/screens/portal frontend/client/web/src/product-components/ecommerce frontend/client/shared-core -g "*.tsx" -g "*.ts"
# sem resultados

rg -n "clientPtBR|style=\{\{|#[0-9A-Fa-f]|rgba\(|ð|âœ|🥩|📍|💳" frontend/client/web/src/screens/landing/public-shell frontend/client/web/src/screens/portal/screenTypes -g "*.tsx" -g "*.ts"
# sem resultados

rg -n "clientPtBR" frontend/client/web/src/screens/landing -g "*.tsx"
# sem resultados

rg -n "ð|âœ|âž|✓|🥩|📍|💳|🚚|🔥|⭐|🔍|✏️|⚙️" frontend/client/web/src/screens/landing -g "*.tsx"
# sem resultados
```

- `frontend/client/web/src/screens/portal/tabs/MeusPedidosView.tsx`
  - removeu overrides visuais via `surfaceStyles.ts`;
  - cards agora vestem classes CSS module;
  - status usa `Badge` Foundation.

- `frontend/client/web/src/screens/portal/tabs/MinhaCaixaView.tsx`
  - removeu overrides visuais via `surfaceStyles.ts`;
  - cards agora vestem classes CSS module;
  - categorias/ciclo/resumo usam `Badge` Foundation.

- `frontend/client/mobile/src/ui/Text/Text.tsx`
  - `variant`, `tone` e `weight` agora resolvem tokens nativos.

- `frontend/client/mobile/src/ui/Layout/Layout.tsx`
  - `gap` agora resolve tokens nativos.

- `frontend/client/mobile/src/screens/portal/tabs/MinhaCaixaView.tsx`
  - removeu tipografia/cor inline dos textos principais.

- `frontend/client/mobile/src/screens/portal/tabs/MeusPedidosView.tsx`
  - removeu tipografia/cor inline dos textos principais.

- `frontend/foundation/ui/Field/Field.tsx`
  - passou a usar `Field.module.css`;
  - usa `resolveFieldRecipe()` para gap e slots de texto;
  - removeu `gap: "6px"`, `fontWeight: "600"`, `opacity: 0.7` e `#EF4444` inline.

- `frontend/foundation/ui/SegmentedControl/SegmentedControl.tsx`
  - passou a usar `SegmentedControl.module.css`;
  - usa `resolveSegmentedControlRecipe()`, `Surface` e `Button`;
  - removeu `rgba`, radius, padding, fonte e cores hardcoded.

- `frontend/foundation/ui/Avatar/AvatarCell.tsx`
  - passou a usar `AvatarCell.module.css`;
  - removeu dimensoes, fontes, cores, bordas e fallbacks hex/rgba inline.

- `frontend/foundation/ui/SectionContainer/SectionContainer.tsx`
  - passou a usar `SectionContainer.module.css`;
  - removeu grid, padding, background, blur, borda e altura inline;
  - mantem inline somente `--ui-section-background-image` quando vem imagem dinamica.

- `frontend/foundation/ui/core/field/variations/color-field/resolver.ts`
  - passou a usar `DEFAULT_COLOR_FIELD_CONFIG`, semi-composed, tokens de spacing,
    dimensions, Surface e Text;
  - removeu `contentGap: 8`, `previewHeight: 24`, `rgba(...)`, fonte e pesos literais.

## Proxima ordem recomendada

## Corte adicional - public shell e HomePlansSection

- `frontend/client/web/src/screens/landing/sections/HomePlansSection.tsx`
  - removeu `clientThemeManifest` e todos os objetos `style={{ ... }}` visuais;
  - passou a usar `HomePlansSection.module.css`;
  - variacoes dinamicas ficaram em `data-active`, `data-featured` e `data-emphasis`;
  - badges de plano/desconto/destaque passaram para `Badge` Foundation;
  - `R$`, `/mes`, `Economia`, `Brinde` e `Garantia` foram movidos para `landing.plans`.

- `frontend/client/web/src/screens/landing/public-shell/*`
  - header/footer foram ajustados para uma composicao mais premium e menos solta;
  - brand mark do header/footer passou a usar `FlameIcon` dentro de uma marca tokenizada;
  - CSS trocou nomes de tokens antigos/duvidosos por tokens emitidos pela Foundation
    (`--theme--typography-*`, `--theme--spacing-space*`, `--theme--borders-hairline`,
    `--theme--elevation-*`);
  - sem `style={{ ... }}` nos componentes do public shell.

Checks deste corte:

```powershell
rg -n "style=\{\{" frontend/client/web/src/screens/landing/sections/HomePlansSection.tsx frontend/client/web/src/screens/landing/public-shell -g "*.tsx"
# sem resultados

npm run build:client
# passou

npm run verify:foundation
# passou, 93 checks

git diff --check
# passou; apenas avisos LF -> CRLF

curl.exe -I http://localhost:3000/
# HTTP 200
```

Observacao: a inspecao visual real em navegador nao foi feita neste corte porque
o browser interno da sessao retornou `Browser is not available: iab`.

## Corte adicional - landing usa AppShell Foundation direto

- `frontend/client/web/src/app/page.tsx` e `frontend/client/web/src/app/hero/page.tsx`
  - montam `@foundation/shells/app-shell` diretamente;
  - passam `landingAppShellConfig` e `landingNavigation`;
  - nao existe mais adapter `LandingAppShell`.

- `frontend/client/shared-core/navigation/landing.navigation.ts`
  - itens de landing agora usam `type: "scroll"` e `targetId`;
  - header/drawer/footer consomem a mesma lista;
  - rotas e scroll nao ficam mais hardcoded na surface.

- `frontend/client/shared-core/manifest/landing/appshell.config.jsx`
  - landing passou a declarar header/footer/drawer/acoes no contrato do AppShell;
  - bottom tab da landing fica desabilitado;
  - nativeTabBar permanece desabilitado porque o verificador Foundation atual exige
    landing sem nativeTabBar.

- `frontend/foundation/shells/app-shell/web/AppShellRuntime.tsx`
  - `onNavigate` do AppShell agora entende `#anchor` como scroll;
  - rotas continuam sendo enviadas para o callback/app router;
  - troca de tema pode ser configurada por `theme.modeStorageKey` e
    `theme.modeChangeEvent`.

- `frontend/foundation/shells/app-shell/web/AppShellHeader.tsx`
  - renderiza actions declaradas em `header.actions`;
  - suporta action `themeToggle`, `route` e `scroll`;
  - suporta `drawerTrigger: "mobile"` e `navAlignment: "center"`.

- `frontend/client/web/src/screens/landing/public-shell/`
  - removido; nao ha mais `PublicHeader`, `Footer` ou `BottomTabBar` local para a landing.

Checks deste corte:

```powershell
rg -n "public-shell|PublicHeader|BottomTabBar|PublicShell" frontend/client/web/src/screens/landing frontend/client/web/src/app -g "*.tsx" -g "*.ts"
# sem resultados

npm run build:client
# passou

npm run verify:foundation
# passou, 93 checks
```

## Ajuste - landing header em tres regioes

- `frontend/client/shared-core/manifest/landing/appshell.config.jsx`
  - bottom tab da landing foi desabilitado no config;
  - header voltou para `layoutMode: "attached"` para ocupar 100% da largura;
  - `drawerTrigger: "mobile"` declara que o hamburger/drawer pertence apenas ao
    header mobile;
  - `navAlignment: "center"` declara navegacao no meio do header;
  - `Ver Produtos` saiu do slot final da landing.

- `frontend/foundation/shells/app-shell/web/AppShellHeader.tsx`
  - AppShell passou a respeitar `drawerTrigger: "mobile"`;
  - AppShell passou a aplicar classe declarativa quando `navAlignment: "center"`.

- `frontend/foundation/shells/app-shell/AppShell.module.css`
  - adicionou composicao de header em inicio/meio/fim;
  - hamburger mobile fica oculto no desktop e aparece no header mobile;
  - nav central fica posicionada no meio sem criar header paralelo.

- `frontend/client/web/src/screens/landing/LandingAppShell.tsx`
  - removido depois que scroll, theme toggle e header actions subiram para o
    AppShell Foundation.

Checks deste ajuste:

```powershell
npm run build:client
# passou

npm run verify:foundation
# passou, 93 checks
```

## Corte adicional - tree modular/tokenizada da landing

As sections reutilizaveis da landing foram reorganizadas de arquivos soltos para
pastas por section e renomeadas sem prefixo `Home`:

```text
frontend/client/web/src/screens/landing/sections/
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
  index.ts
```

`LandingView` deixou de ser a tela monolitica com centenas de estilos inline e
passou a orquestrar `SectionContainer` + sections modulares. `/hero` tambem usa
o mesmo runtime modular.

Arquivos legacy removidos:

```text
frontend/client/web/src/screens/landing/HeroMarketplaceView.tsx
frontend/client/web/src/screens/landing/landingPrimitives.tsx
frontend/client/web/src/transitional/
```

O `PlanBenefitCard` tambem foi extraido para CSS module tokenizado:

```text
frontend/client/web/src/product-components/ecommerce/PlanBenefitCard.tsx
frontend/client/web/src/product-components/ecommerce/PlanBenefitCard.module.css
```

Check:

```powershell
npm run build:client
# passou

rg -n "style=\\{\\{" frontend/client/web/src -g "*.tsx"
# sem resultados
```

## Corte adicional - landing real de produto

Depois da modularizacao, a landing recebeu uma primeira dobra mais completa:

```text
HeroSection
  -> headline + CTAs
  -> metricas
  -> painel visual com foto de produto
  -> mini fluxo do cliente
```

As imagens da landing foram centralizadas no catalogo:

```text
frontend/client/shared-core/manifest/assets.js
```

Sections que consomem assets declarados:

```text
LandingView
HeroSection
ShowcaseSection
GiftSection
```

Copy nova do hero foi adicionada no locale:

```text
frontend/client/shared-core/locales/pt-BR.ts
```

Checks:

```powershell
npm run build:client
# passou

npm run verify:foundation
# passou, 93 checks

curl.exe -I http://localhost:3000/
# 200

curl.exe -I http://localhost:3000/hero
# 200
```

Limite de validacao: browser visual interno indisponivel e Playwright nao
instalado localmente, entao nao houve screenshot real nesta sessao.

1. `MeuClubeView`: proxima tela de portal mais importante e ainda visualmente hardcoded.
2. `HomeView`: grande bloco antigo; deve ser extraido por secoes/componentes com CSS module.
3. `NovoPortalHomeView`: provavelmente obsoleto ou substituivel; confirmar antes de refatorar.
4. `screenTypes/*`: trocar previews hardcoded por render real/Foundation ou documentar como legado.
5. Landing antiga: migracao separada, pois o volume e muito maior e pode afetar primeira impressao publica.
6. `ColorField` ainda usa `style` para CSS variables dinamicas de valor; isso e aceitavel, mas o restante deve continuar sem visual literal.

## Sobre types no shared-core

Separar `types` melhora, mas deve ser incremental. O corte ideal:

- `contracts/`: DTOs e contratos API/back-end;
- `view-models/`: formato que tela renderiza;
- `data-sources/`: fallback temporario e adapters de origem;
- `hooks/`: orquestracao client;
- `types/`: tipos compartilhados que nao sao contrato API nem view-model.

Isso nao precisa ser um refactor grande se for feito por kit/tela. A regra e mover tipos quando tocar no kit, nao reordenar tudo de uma vez.
