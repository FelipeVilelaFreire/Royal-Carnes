# Ecommerce product components

Esta pasta guarda componentes de produto do RoyalPrime que podem amadurecer para um futuro `services/ecommerce`.

Para a intencao da rota `/library`, ver `LIBRARY.md`.

Regra atual:

- componente real e reutilizavel fica aqui;
- manifest local declara contrato, capacidades e exemplos de chamada;
- telas consomem o componente e nao decidem sozinhas todas as variacoes;
- promocao para ServiceOS acontece depois de uso real e filtragem.

## ProductItemCard

Status: real, `level-1`, manifestado.

Arquivo:

```text
frontend/client/web/src/product-components/ecommerce/ProductItemCard.tsx
frontend/client/web/src/product-components/ecommerce/product-item-card.manifest.ts
```

Uso previsto:

- catalogo de produtos;
- etapa de montagem do pedido;
- listas de favoritos;
- referencias compactas de produto.

O manifest controla as variacoes principais:

- mostrar ou esconder imagem;
- mostrar ou esconder titulo;
- mostrar ou esconder descricao;
- mostrar ou esconder metadata do produto;
- mostrar ou esconder badge;
- mostrar ou esconder favorito;
- com ou sem preco;
- com ou sem preco original/oferta;
- com ou sem acao;
- modo de metadata: categoria + detalhe, somente categoria ou somente detalhe;
- modo de badge: nenhum, componente, categoria, oferta, estoque ou custom;
- tom de badge: oferta ou limitado;
- modo de preco: unitario, a partir de, estimado, incluso ou escondido;
- modo de acao: nenhum, selecionar, adicionar, quantidade, detalhes ou configurar;
- modo de favorito: nenhum ou toggle;
- modo de quantidade: nenhum, stepper ou leitura;
- com estado selecionado;
- com quantidade;
- com favorito;
- com acao bloqueada por regra do fluxo consumidor;
- com preco original/oferta.

Na `/library`, os exemplos deste card devem ser interativos. O manifest define quais handlers cada exemplo ativa, e a tela de library mantem apenas o estado runtime necessario para simular clique, incremento, decremento e favorito.

`compositions` e o contrato principal por modo de uso. A tela escolhe uma composicao como `catalog`, `checkout`, `compact`, `readonly` ou `includedInPlan`; depois o card recebe os `show*` e os modos daquela composicao.

O manifest nao controla estetica fina. Raio do card, escala tipografica, espacamento, estilo do botao, desenho de icones, cor e receita de superficie pertencem ao Design System/Foundation. No RoyalPrime MVP isso ainda passa pelo `legacy/design-system`, mas o contrato futuro deve tratar essas decisoes como Foundation/AppShell, nao como regra do `ProductItemCard`.

Composicao do `ProductItemCard`:

- media: imagem do produto;
- header: badge, favorito e indicador de selecao;
- body: nome, descricao e metadata;
- commerce: preco, preco original e label de preco;
- actions: acao primaria ou stepper de quantidade.

O card deve responder a opcoes de chamada. Exemplo: uma tela pode esconder preco, outra pode esconder acao, outra pode ativar favorito, outra pode mostrar quantidade. O visual do botao usado por essas opcoes deve vir do Design System, como um futuro `Button` com tipo/receita de acao comercial.

Exemplo de consumo alvo:

```tsx
<ProductItemCard
  product={product}
  composition={productItemCardManifest.compositions.catalog}
/>
```

Convencao importante:

- `name`, `image`, `description`, `categoryLabel`, `detailLabel`, `price`, `originalPrice` e labels sao dados;
- `showName`, `showImage`, `showDescription`, `showMeta`, `showPrice`, `showOriginalPrice`, `showAction`, `showBadge` e `showFavorite` sao opcoes booleanas de composicao;
- `metaMode`, `badgeMode`, `priceMode`, `actionMode`, `favoriteMode`, `quantityMode` e `selectionMode` sao opcoes de modo e devem aparecer como `select` no manifesto;
- `selected`, `quantity`, `favorite` e `actionDisabled` sao estado do fluxo consumidor.

`actionDisabled` nao decide regra comercial dentro do card. A screen calcula se o produto ainda cabe no plano, no ciclo ou no estoque, e o card apenas apresenta o botao bloqueado com `actionDisabledLabel` e `disabledHint`.

No manifest, `optionGroups` e a fonte para a `/library` mostrar todas as opcoes funcionais do componente. Cada opcao declara o controle esperado e o dono:

- `product-component`: composicao e capacidade do card;
- `consumer-state`: estado mantido pela tela/fluxo que usa o card;
- `foundation`: reservado para quando a opcao for resolvida por primitive ou receita visual.

Enquanto estivermos no RoyalPrime MVP, evitar adicionar opcoes de aparencia no manifest do card. Se aparecer uma necessidade como raio, sombra, tipografia ou visual do botao, documentar como pendencia de Foundation/design system.

## PlanBenefitCard

Status: real, `level-1`, manifestado.

Arquivo:

```text
frontend/client/web/src/product-components/ecommerce/PlanBenefitCard.tsx
frontend/client/web/src/product-components/ecommerce/plan-benefit-card.manifest.ts
```

Uso previsto:

- resumo de plano;
- beneficios inclusos;
- comparacao entre Basic, Premium e Pro.

O manifest controla:

- mostrar ou esconder nome, descricao, preco, ciclo, beneficios, economia, badge, destaque, estado selecionado e acao;
- modo de preco: mensal, anual, incluso ou escondido;
- modo de beneficios: resumo, lista, contagem ou escondido;
- modo de promocao: nenhuma, economia anual, oferta limitada ou recomendado;
- modo de acao: nenhum, selecionar, upgrade, gerenciar ou ver detalhes;
- modo de layout: compacto, padrao ou comparacao.

Convencao importante:

- `name`, `description`, `monthlyPrice`, `annualMonthlyPrice`, `benefits`, `savingsLabel` e labels sao dados;
- `showName`, `showDescription`, `showPrice`, `showBillingCycle`, `showBenefits`, `showSavings`, `showBadge`, `showAction`, `showSelectedState` e `showHighlight` sao opcoes booleanas de composicao;
- `priceMode`, `benefitsMode`, `promotionMode`, `actionMode` e `layoutMode` sao opcoes de modo e devem aparecer como `select` no manifesto;
- `selected`, `disabled` e `onAction` sao estado do fluxo consumidor.

## PaymentMethodCard

Status: candidato, `level-1`, precisa de manifest.

Arquivo esperado:

```text
frontend/client/web/src/product-components/ecommerce/PaymentMethodCard.tsx
frontend/client/web/src/product-components/ecommerce/payment-method-card.manifest.ts
```

Uso previsto:

- Pix;
- cartao;
- pagar na entrega;
- finalizar pelo WhatsApp.

## OrderSummaryCard

Status: candidato, `level-1`, precisa de manifest.

Arquivo esperado:

```text
frontend/client/web/src/product-components/ecommerce/OrderSummaryCard.tsx
frontend/client/web/src/product-components/ecommerce/order-summary-card.manifest.ts
```

Uso previsto:

- resumo do pedido;
- itens selecionados;
- plano escolhido;
- pagamento escolhido;
- total estimado.

## OrderDetailModal

Status: real, `level-1`, ainda sem manifest proprio.

Arquivo:

```text
frontend/client/web/src/product-components/ecommerce/OrderDetailModal.tsx
```

Uso atual:

- detalhe de pedido em `MeusPedidosView`;
- detalhe de pedido em `MinhaContaView`;
- modal desktop via Design System;
- bottom modal mobile via Design System.

Responsabilidade:

- renderizar resumo, total, entrega, pagamento, codigo de entrega, itens e acompanhamento do pedido;
- manter status com cores semanticamente tokenizadas;
- exibir a sequencia de acompanhamento de forma compacta e horizontal, sem ocupar altura excessiva no modal.

Ainda fica local no RoyalPrime porque o contrato de pedidos esta em mocks locais. Promocao para ServiceOS so deve acontecer depois que a tela de pedidos, conta e futuro admin confirmarem o mesmo contrato de `RoyalCustomerOrder`.
