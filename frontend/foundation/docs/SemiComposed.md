# Semi-composed Standard

Tipo: guia pratico copiavel
Owner: `platform/foundation/design-system/semi-composed`

## Ideia central

Semi-composed e a camada de receita.
Ela pega tokens do Theme e transforma em receitas reutilizaveis para UI:

```text
Theme token bruto
  -> Semi-composed recipe
    -> UI primitive
```

## As 12 Familias Hierarquicas:

1. `Text`
2. `Icon`
3. `Stroke`
4. `OuterElevation`
5. `InnerElevation`
6. `StateLayer`
7. `FocusRing`
8. `Motion`
9. `Disabled`
10. `Glass`
11. `Gradient`
12. `Surface` (Compoe as receitas anteriores)

## Regra de Ouro

UI nao decide visual complexo sozinha.
Button usa Surface, Text, Icon, StateLayer, FocusRing, Motion, Disabled.
Nenhum CSS de UI possui `#hex`, `rgba`, `px` solto ou shadow local.
