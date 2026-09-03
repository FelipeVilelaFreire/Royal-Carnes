# 03 - Client Landing Manifest Copy

Objetivo:

```text
mover copy comercial e arrays de showcase/FAQ/steps da landing para locale ou
manifest, sem redesenhar a landing.
```

## Arquivos Prioritarios

```text
frontend/client/web/src/screens/landing/HeroMarketplaceView.tsx
frontend/client/web/src/screens/landing/LandingView.tsx
frontend/client/web/src/screens/landing/sections/*.tsx
frontend/client/shared-core/locales/pt-BR.ts
frontend/client/shared-core/manifest/landing/
```

## Exemplos Encontrados

```text
VAGAS LIMITADAS PARA NOVOS SOCIOS
A Experiencia Suprema do Churrasco em sua Casa
showcaseCuts
faqItems
cards/steps/facts locais
```

## Meta Do Corte

```text
hero copy vem de locale/manifest
CTA labels vem de locale/manifest
showcaseCuts vem de manifest ou mock catalog-ready
FAQ vem de locale/manifest
sections continuam render-only
```

## Regra

```text
copy comercial pode continuar RoyalPrime
copy comercial nao deve ficar espalhada em JSX
manifest define estrutura
locale define texto
screen renderiza
```

## Prompt Para Outra IA

```text
Execute o corte 03-client-landing-manifest-copy.md.

Nao altere visual. Mova copy e arrays locais da landing para
frontend/client/shared-core/locales ou manifest. A tela deve importar config e
renderizar o mesmo conteudo. Evite mexer em backend, admin ou foundation.

Rode npm run build em frontend/client/web.
```
