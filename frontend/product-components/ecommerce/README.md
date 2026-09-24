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
frontend/product-components/ecommerce/web/ProductItemCard.tsx
frontend/product-components/ecommerce/web/ProductItemCard.module.css
frontend/product-components/ecommerce/web/product-item-card.manifest.ts
frontend/product-components/ecommerce/native/ProductItemCard.tsx
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

## Loading composition

Todo componente ecommerce que representa dados assincronos possui um skeleton
co-localizado com sua implementacao e CSS Module. O skeleton reproduz a
geometria e a densidade do componente real, mas nao recebe dados comerciais,
nao executa callbacks e nao simula persistencia.

Para `ProductItemCard`, a fronteira e:

```text
ProductItemCard
  -> ProductItemCardSkeleton
       -> Image/Text/Price skeletons
       -> ButtonSkeleton quando a composicao real exibe Button
```

`ProductItemCardSkeleton` compoe primitives Foundation; nao desenha versoes
locais de botao, texto ou imagem. A screen consumidora decide se renderiza a
grade real, seu skeleton, erro ou vazio. Erro e vazio nao sao skeletons.

As render surfaces importam o card pela variante da propria plataforma;
nenhuma delas mantem uma copia local do componente.

O Checkout usa o mesmo preset visual `catalogo`. Sua grade e regras de selecao
ficam na screen consumidora; limites, disponibilidade e callbacks nunca criam
uma variante visual nova do card.

`actionPresentation="label"` e uma capacidade visual generica do adapter Web:
ela troca o icone isolado pelo botao textual quando o consumidor precisar.
Depois da primeira adicao, o mesmo card mostra o stepper de quantidade. A
screen decide quando permitir a acao; o card nao conhece assinatura, checkout
ou entitlement.

## OrderSummaryItem

Linha compacta para produtos já escolhidos em um resumo ou revisão de pedido.
Recebe somente media, nome, detalhe, preço opcional e uma ação secundária que o
consumidor decide expor. O componente não agrupa itens, não calcula limites e
não decide se um produto pode ser removido.
