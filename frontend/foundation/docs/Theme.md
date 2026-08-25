# Theme Standard

Tipo: guia pratico copiavel
Owner: `platform/foundation/design-system/theme`

## Ideia central

Theme e a base fisica do Design System.
Ele descreve os valores que poderiam virar CSS, Android, iOS ou qualquer outro runtime visual:

```text
cores
fontes
tamanhos
espacamentos
raios
bordas
opacidade
blur
elevacao
movimento
layout
breakpoints
```

Theme nao sabe que existe Button, Select, SidebarMenu, Header ou Builder. Ele apenas fornece valores nomeados, seguros e resolvidos.

Fluxo obrigatorio:

```text
Value Scale
  -> Theme Token Scale
    -> Semi-composed Recipe
      -> UI Component
        -> AppShell / Screen / Product
```

## Regra de ouro

Theme nunca guarda comportamento de componente.

Correta:
```ts
theme.tokens.radius.md = "8px"
theme.tokens.spacing.md = "12px"
theme.tokens.typography.bodySize = "16px"
theme.tokens.depth.shadowMd.blur = "20px"
```

Errada:
```ts
theme.button.primary.background = "#1769aa"
theme.sidebar.padding = "16px"
theme.select.dropdownBorder = "1px solid #d9e1ea"
```

## Layout Global

Theme e dono da matriz global de layout:
```ts
layout: {
  desktop: {
    columns: 20,
    gutterX: "24px",
    gutterY: "24px",
    columnGap: "12px",
  },
  tablet: {
    columns: 8,
    gutterX: "16px",
    gutterY: "20px",
    columnGap: "10px",
  },
  mobile: {
    columns: 4,
    gutterX: "12px",
    gutterY: "16px",
    columnGap: "8px",
  },
}
```
