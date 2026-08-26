# Ecommerce product components

Esta pasta guarda componentes de produto do RoyalPrime que podem amadurecer para um futuro `services/ecommerce`.

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
- mostrar ou esconder categoria;
- mostrar ou esconder detalhe;
- mostrar ou esconder badge;
- mostrar ou esconder favorito;
- com ou sem preco;
- com ou sem preco original/oferta;
- com ou sem acao;
- com badge de componente ou categoria;
- com estado selecionado;
- com quantidade;
- com favorito;
- com preco original/oferta.

Na `/library`, os exemplos deste card devem ser interativos. O manifest define quais handlers cada exemplo ativa, e a tela de library mantem apenas o estado runtime necessario para simular clique, incremento, decremento e favorito.

O manifest nao controla estetica fina. Raio do card, escala tipografica, espacamento, estilo do botao, desenho de icones, cor e receita de superficie pertencem ao Design System/Foundation. No RoyalPrime MVP isso ainda passa pelo `legacy/design-system`, mas o contrato futuro deve tratar essas decisoes como Foundation/AppShell, nao como regra do `ProductItemCard`.

Composicao do `ProductItemCard`:

- media: imagem do produto;
- header: badge, favorito e indicador de selecao;
- body: nome, descricao, categoria e detalhe;
- commerce: preco, preco original e label de preco;
- actions: acao primaria ou stepper de quantidade.

O card deve responder a opcoes de chamada. Exemplo: uma tela pode esconder preco, outra pode esconder acao, outra pode ativar favorito, outra pode mostrar quantidade. O visual do botao usado por essas opcoes deve vir do Design System, como um futuro `Button` com tipo/receita de acao comercial.

Convencao importante:

- `name`, `image`, `description`, `categoryLabel`, `detailLabel`, `price`, `originalPrice` e labels sao dados;
- `showName`, `showImage`, `showDescription`, `showCategory`, `showDetail`, `showPrice`, `showOriginalPrice`, `showAction`, `showBadge` e `showFavorite` sao opcoes de composicao;
- `selected`, `quantity` e `favorite` sao estado do fluxo consumidor.

No manifest, `optionGroups` e a fonte para a `/library` mostrar todas as opcoes funcionais do componente. Cada opcao declara o controle esperado e o dono:

- `product-component`: composicao e capacidade do card;
- `consumer-state`: estado mantido pela tela/fluxo que usa o card;
- `foundation`: reservado para quando a opcao for resolvida por primitive ou receita visual.

Enquanto estivermos no RoyalPrime MVP, evitar adicionar opcoes de aparencia no manifest do card. Se aparecer uma necessidade como raio, sombra, tipografia ou visual do botao, documentar como pendencia de Foundation/design system.

## PlanBenefitCard

Status: candidato, `level-1`, precisa de manifest.

Arquivo esperado:

```text
frontend/client/web/src/product-components/ecommerce/PlanBenefitCard.tsx
frontend/client/web/src/product-components/ecommerce/plan-benefit-card.manifest.ts
```

Uso previsto:

- resumo de plano;
- beneficios inclusos;
- comparacao entre Basic, Premium e Pro.

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
