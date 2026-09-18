# Referência Stitch — resumo lateral

Status: direção visual recebida em 18/09/2026. Este arquivo registra o recorte aprovado; não é fonte de implementação nem especificação funcional.

## Recorte para o Montar Box

Aplicar somente ao resumo persistente da direita no desktop e ao mesmo bloco de informações quando ele aparecer no mobile:

- superfície escura, sóbria e premium, com contraste quente apenas nos estados e detalhes importantes;
- cabeçalho compacto: `Resumo`, badge pequeno da modalidade e os níveis `1 2 3 4` logo abaixo;
- produtos organizados por tipo, por exemplo `Carnes` e `3 kg / 29 kg`;
- cada produto como uma linha curta: miniatura, nome, quantidade/medida, preço somente quando a modalidade o usa e ação `Remover` discreta;
- total e ação principal ficam no fim do resumo, sem textos promocionais ou explicações repetidas.

## Preservar no RoyalPrime

- Foundation, tokens e CSS Modules já usados pelo checkout;
- strings ativas do shared-core, contratos e cálculos atuais;
- diferença comercial entre Assinatura, Royal Box e Royal Delivery;
- a composição `CheckoutView -> flow -> right` criada para Web e Mobile.

## Não copiar do HTML recebido

- Tailwind, fontes, cores, sombras, medidas, imagens e markup gerados pelo Stitch;
- navegação, catálogo, logística, footer ou qualquer outra parte da página de referência;
- copy fictícia, preços demonstrativos ou regras de pedido.

O Stitch serve aqui apenas como referência de hierarquia e densidade: o resumo deve tornar a seleção legível sem competir com o fluxo de montagem.
