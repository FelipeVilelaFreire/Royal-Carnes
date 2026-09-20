# HomeView: vitrine dirigida por colecoes

Status: direcao de produto aprovada em 2026-09-20. A `HomeView` foi esvaziada
intencionalmente para ser reconstruida a partir desta direcao. Este arquivo e
guia local da screen, nao contrato global e nao prova implementacao visual.

## Intencao

A Home do Portal RoyalPrime e uma vitrine editorial que usa produtos e colecoes
reais. Ela deve parecer uma loja premium viva, proxima da progressao comercial
de uma acougue premium online: descoberta por ocasiao, colecoes fotografadas e
prateleiras de produto. Ela nao e dashboard, Landing duplicada ou copia total
do Catalogo.

```text
Home
  -> escolhe e apresenta a curadoria

Catalogo
  -> busca, filtros, todas as categorias e profundidade da oferta

Montar Box / Meus Pedidos / Minha Conta
  -> executam os fluxos especificos
```

## Fonte de verdade

Colecoes sao administradas em `/colecoes/detalhes` e sao a fonte da vitrine.
Cada colecao real possui:

```text
nome + descricao + imagem + texto alternativo + status + ordem + produtos vinculados
```

O backend expoe somente colecoes ativas em `GET /api/v1/catalog/collections/`.
Produtos vinculados ja chegam por `product_ids` e cada produto tambem carrega
`collection_keys`. A Home nao cria colecoes, produtos, imagens, preco,
disponibilidade ou ordem localmente.

Colecoes atuais do seed RoyalPrime:

```text
Churrasco
Cortes para preparar
Essenciais
Para compartilhar
Selecao da churrasqueira
```

## Composicao alvo

```text
AppShell
  -> Home
    -> Hero com a colecao principal
    -> trilho de cards de colecao fotografados
    -> prateleira de produtos da colecao selecionada
    -> banner editorial de uma segunda colecao
    -> nova prateleira ou grade de descoberta
    -> acao para Catalogo completo
```

O hero e a ordem das secoes leem `sortOrder`, nao uma sequencia fixada em JSX.
A Home mostra poucas colecoes e poucos produtos por vez para criar curadoria;
o Catalogo continua dono da listagem completa, busca e filtros.

## Visitante e cliente

A vitrine-base e identica para visitante e cliente: fotos, colecoes e produtos
sao o centro da pagina. O login nunca transforma a Home em dashboard.

Quando houver fato autoritativo, o cliente pode receber uma faixa discreta entre
as secoes editoriais, como `Continuar sua Box` ou `Acompanhar pedido`. Sem dado
real de pedido, ciclo ou assinatura, essa faixa nao existe. Nunca simular
entrega, saldo ou pedido em andamento.

## Lacuna a resolver antes da primeira composicao

O endpoint ja entrega `image_url` e `image_alt`, mas o contrato e mapper de
colecoes do Client ainda precisam preserva-los no `CollectionBase`. Esta e uma
adaptacao pequena de shared-core; sem ela a Home nao pode usar a imagem definida
no Admin. Tambem e necessario que o Admin configure `sortOrder` distinto para
expressar a curadoria da vitrine.

## Limites de implementacao

- Usar `useClientCatalog` ou um view-model compartilhado equivalente; a screen
  continua render-only.
- Reutilizar cards de produto e primitives Foundation ja existentes.
- Strings da UI pertencem aos locales ativos; imagens e textos editoriais vem
  das colecoes reais.
- Web e Native compartilham os mesmos dados, colecoes e intencao; apenas a
  composicao fisica muda.
- Header, Footer e BottomTabBar continuam pertencendo ao AppShell.
