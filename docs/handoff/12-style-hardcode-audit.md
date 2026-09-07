# Audit de styles hardcoded nas telas

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
