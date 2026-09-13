# Referencia visual Stitch Mobile - Catalogo de Cortes Client

Status: referencia visual Mobile recebida do usuario em 2026-09-13 para a
rota Client `/cortes`. Complementa a referencia desktop; nao e codigo de
producao e nao autoriza Tailwind, fontes remotas, Material Symbols, CSS fisico,
dados demonstrativos ou AppShell paralelo.

## Origem preservada

O usuario enviou no chat um HTML completo produzido pelo Stitch para Mobile.
Ele usa Tailwind CDN, Google Fonts, Material Symbols, scripts `onclick`,
produtos comerciais inventados e navegacao paralela. O documento preserva a
direcao visual e a traducao para o contrato real do RoyalPrime; o HTML bruto
nao deve ser executado ou importado.

## Composicao Mobile correta

```text
Portal mobile
  ScreenHeader fixo/recolhivel
    -> trilho horizontal de categorias
    -> busca e ordenacao
    -> feed de ProductItemCard em uma coluna
    -> estados reais: loading, erro e vazio
  BottomTabBar Foundation fixa
```

O Header/brand mostrado pelo Stitch e uma sugestao visual, mas nao entra como
componente local: AppShell e o unico dono do header global e da BottomTabBar.

## Anatomia proposta pelo Stitch

| Regiao | Composicao Stitch Mobile | Traducao RoyalPrime |
| --- | --- | --- |
| Header global | Marca, subtitulo e avatar fixos | Nao copiar como screen local; ajustar apenas AppShell/config se uma capacidade generica for necessaria. |
| Screen header | Eyebrow com marcador pequeno, titulo "Catalogo" e descricao curta | Usar `ScreenHeader` Foundation existente com `mobileMode="collapsible"` e strings ativas. |
| Categorias | Rail horizontal de pills de altura compacta | Usar categorias reais do `useClientCatalog`; rail rola horizontalmente. |
| Busca | Campo unico, largura total, icone interno | Usar `Input` Foundation e o estado de busca existente. |
| Ordenacao e contador | Linha compacta: ordenacao a esquerda, quantidade a direita | Usar `DropdownPicker`/controle Foundation e contador do view-model; nao criar texto ou criterio novo. |
| Feed | Uma coluna de cards, midia 16:10, metadados em pills e CTA destacado | Adaptar `ProductItemCard`/grade real sem inventar CTA de carrinho, unidade ou preco. |
| Estados | Skeleton, vazio e erro em paineis de demonstracao | Estados permanecem condicionais a API e renderizados por `EmptyState`, sem uma secao fixa de showcase. |
| Bottom tabbar | Quatro destinos de exemplo fixos | Nao copiar labels/destinos. AppShell renderiza a navegacao declarada do Portal. |

## Elementos visuais a aproveitar

1. Cabeca compacta e editorial, com hierarquia clara antes do feed.
2. Gutter mobile constante e rail de categorias confortavel ao toque.
3. Busca em largura total; ordenacao e contador em uma linha secundaria.
4. Uma coluna de cards com imagem panoramica, leitura tranquila e CTA de toque
   sem depender de hover.
5. Metadados de peso/origem compactos, desde que venham do contrato real do
   catalogo.
6. BottomTabBar persistente do AppShell com espaco seguro reservado no conteudo.

## Elementos que nao entram no produto

| Elemento Stitch | Motivo |
| --- | --- |
| Header, avatar e marca locais | AppShell e dono da casca publicada. |
| BottomTabBar com "Vault", "Cuts", "Allocations" e "Client" | Rotas e labels reais vem da navigation/config do Portal. |
| Tailwind, fontes externas e Material Symbols | Foundation resolve tokens, fontes e AppIcons SVG. |
| Produtos, BMS, origem, precos, badges e copy de exemplo | Dados comerciais vem do backend via `useClientCatalog`. |
| Botao "Adicionar" e carrinho local | Fluxo de compra precisa respeitar o contrato existente de Montar Box/checkout. |
| Painel fixo de simulacao de estados e scripts | Loading, erro e vazio sao reacoes reais da API. |

## Contrato de adaptacao

```text
backend catalog API
  -> client shared-core: catalog API, mapper, useClientCatalog, view-model
  -> CortesView Mobile: filtros visuais e callbacks
  -> Foundation Native: ScreenHeader, Layout, Input, Picker, EmptyState,
     ProductItemCard e NativeAppShell/BottomTabBar
```

O Web e Mobile compartilham produto, strings, hooks, contratos e estados. A
diferenca permitida e apenas a composicao do host: grade desktop nao autoriza
dados, regras ou navegacao diferentes no Mobile.

## Ordem de implementacao futura

1. Conferir o consumidor Native real e o contrato de `ScreenHeader`.
2. Aplicar primeiro header, gutter e rail de categorias.
3. Em seguida busca, ordenacao e contador em uma linha touch-friendly.
4. Adaptar o card real para a densidade Mobile sem criar um segundo modelo.
5. Testar loading, erro e vazio reais, safe area e BottomTabBar.
