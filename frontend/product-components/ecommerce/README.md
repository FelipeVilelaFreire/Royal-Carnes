# Ecommerce product components

Esta pasta e a camada canonica atual para componentes reutilizaveis de
ecommerce do RoyalPrime.

Regra:

```text
product-components/ecommerce
  -> componentes React de produto, plano, pedido e checkout

foundation
  -> primitives visuais usadas por esses componentes

shared-core
  -> contratos, hooks, mappers, view-models e manifests de dados

render-apps
  -> telas que escolhem composicao, passam dados e disparam callbacks
```

O componente de produto nao decide regra comercial. Ele recebe estado e
callbacks do fluxo consumidor.

## ProductItemCard

Arquivos:

```text
frontend/product-components/ecommerce/ProductItemCard.tsx
frontend/product-components/ecommerce/ProductItemCard.module.css
frontend/product-components/ecommerce/product-item-card.manifest.ts
```

Responsabilidade:

```text
renderizar produto, media, meta, preco, favorito, estado selecionado,
acao primaria e quantidade
```

Nao e responsabilidade:

```text
preco final
estoque real
limite de plano
permissao
persistencia
checkout
```

O card compoe Foundation:

```text
Card
Button
Text
Icon
Layout
```

Os caminhos antigos em `frontend/client/web/src/product-components/ecommerce`
continuam como facade de compatibilidade enquanto as telas migram.
