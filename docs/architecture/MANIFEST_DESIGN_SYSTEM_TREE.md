# Manifest Design System Tree

## Decisao

O design system do RoyalPrime deve ser organizado em tres camadas dentro de
`manifest/`:

```text
Theme -> Semi-Composed -> UI
```

Essa divisao vale para:

```text
frontend/shared-core/manifest
frontend/client/shared-core/manifest
frontend/admin/shared-core/manifest
```

## Tree Canonica

```text
manifest/
  theme/
    colors.ts
    tokens.ts
    index.ts

  semi-composed/
    background.ts
    button.ts
    card.ts
    icon.ts
    surface.ts
    text.ts
    index.ts

  ui/
    button.ts
    card.ts
    defaults.ts
    icon.ts
    layout.ts
    surface.ts
    text.ts
    index.ts

  capabilities/
    app-shell.ts
    product-components.ts
    index.ts
```

## Responsabilidades

`theme/` guarda os tokens brutos e a fisica global: cores, modos, typography,
spacing, dimensions, radius, borders, elevation, opacity, glass, gradient,
motion, layout, blur e z-index.

`semi-composed/` guarda receitas: Surface, Button, Card, Text, Icon e
Background. Essa camada e o lugar correto para dizer como um componente veste
uma superficie, sempre lendo Theme.

`ui/` guarda defaults e contratos publicos dos primitives. Essa camada diz como
o render-app chama Button, Card, Text, Icon, Surface, Container, Grid e Inline
sem conhecer a fisica interna.

`capabilities/` guarda capacidades ainda em transicao, como AppShell e
product-components. Esse manifesto declara estado, owner atual e destino futuro;
ele nao e runtime.

## Global, Client E Admin

```text
frontend/shared-core/manifest
  -> base global

frontend/client/shared-core/manifest
  -> herda global e sobrescreve somente cliente

frontend/admin/shared-core/manifest
  -> herda global e sobrescreve somente admin
```

Client e admin podem ter overrides de theme, semi-composed e ui. O default
continua vindo do global.

## Regra De Limpeza

Client e admin usam somente `frontend/*/shared-core/manifest` como origem fora
do web.

Nao ha uma quarta pasta de design-system dentro do manifest. A separacao
oficial e sempre `theme`, `semi-composed`, `ui` e `capabilities`.

Aliases antigos podem existir somente dentro do render-app e devem resolver
para `shared-core/manifest`.

## Product Components

Product-components nao entram em Foundation por previsao. Hoje ficam nos
render-apps em `transitional/product-components` ou em areas locais existentes.

O manifesto declara a intencao:

```text
manifest/capabilities/product-components.ts
```

A extracao para `foundation/product-components` so acontece quando o contrato
estiver provado em uso real e sem dependencia hardcoded de tela.
