# Client Kits

Os arquivos desta pasta documentam as surfaces Client Web e Mobile: Portal,
Landing, composicao de pagina e referencias visuais. Eles nao substituem o
contrato principal; ajudam uma IA ou desenvolvedor a retomar uma aba sem
duplicar a casca.

## Regra de composicao

```text
Web desktop
  AppShell Header fixo -> ScreenHeader -> conteudo -> Footer por config

Portal mobile/native
  ScreenHeader fixo/recolhivel -> conteudo -> BottomTabBar por config
```

AppShell e o dono unico de Header, Footer, BottomTabBar, navegacao e slots.
`ScreenHeader` apresenta somente o contexto da rota. A screen apresenta dados,
controles e estados vindos do shared-core. Landing e Access usam composicao
propria apenas quando isso esta declarado por manifest.

## Referencias atuais

```text
cortes-stitch-reference.md
  -> referencia Stitch do catalogo /cortes e traducao segura para Foundation

cortes-stitch-mobile-reference.md
  -> referencia Stitch Mobile do catalogo /cortes e traducao segura para Native
```

## Como usar

Antes de alterar uma screen Client:

1. Ler `frontend/client/AGENTS.md` e o contrato principal.
2. Conferir AppShell/config e a ordem fisica da pagina.
3. Rastrear screen -> hook -> API client -> backend.
4. Manter Web/Mobile na mesma arvore de produto.
5. Validar estados reais, responsividade e i18n.
