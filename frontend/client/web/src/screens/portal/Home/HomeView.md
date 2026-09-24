# HomeView: vitrine dirigida por colecoes

Status: Hero e destaque de colecoes ativos. Este arquivo e guia local da screen,
nao contrato global e nao prova implementacao visual em navegador ou aparelho.

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

## Niveis da experiencia

A Home usa linguagem visual de Landing, mas continua uma vitrine de dados
reais. Cada nivel tem uma unica funcao: criar impacto, permitir descoberta ou
conduzir a uma acao real. Nem todo nivel e uma secao da screen: a navegacao
global continua no AppShell.

| Nivel | Dono visual | Papel |
| --- | --- | --- |
| 0 | AppShell | Header, busca, conta e carrinho; nao pertence a `HomeView`. |
| 1 | Hero | Apresenta a colecao principal com imagem, titulo, descricao e CTA para a colecao. |
| 2 | Destaque de colecoes | Mostra uma colecao principal larga e tres secundarias fotografadas. |
| 3 | Prateleira principal | Mostra poucos produtos reais da colecao principal ou selecionada. |
| 4 | Destaque editorial | Muda o ritmo com uma segunda colecao em formato de banner visual. |
| 5 | Descoberta | Mostra uma segunda curadoria curta de produtos reais. |
| 6 | CTA de catalogo | Leva para a exploracao completa, que continua pertencendo ao Catalogo. |

Carrossel e uma ferramenta, nao a estrutura inteira da pagina. O primeiro
destaque de colecoes tem hierarquia fixa pela ordem administrativa: uma
principal e tres secundarias; o Hero pode ter no maximo poucas campanhas reais,
sem rotacao excessiva. As prateleiras preservam contexto e nao tentam copiar a
grade completa do Catalogo.

## Composicao alvo

```text
AppShell
  -> Home
    -> Hero com a colecao principal
    -> destaque: uma colecao principal e tres colecoes secundarias fotografadas
    -> prateleira de produtos da colecao selecionada
    -> banner editorial de uma segunda colecao
    -> nova prateleira ou grade de descoberta
    -> acao para Catalogo completo
```

O hero e a ordem das secoes leem `sortOrder`, nao uma sequencia fixada em JSX.
A Home mostra poucas colecoes e poucos produtos por vez para criar curadoria;
o Catalogo continua dono da listagem completa, busca e filtros.

## Estrutura de arquivos proposta

`HomeView` so orquestra o estado e a ordem das secoes. Cada secao possui seu
TSX, CSS Module e skeleton correspondente quando representa dados ainda
desconhecidos. Os nomes descrevem a intencao de produto, nao a posicao
numerica na pagina.

```text
Home/
  HomeView.tsx
  HomeView.module.css
  HomeView.md
  sections/
    HomeHero/
      HomeHero.tsx
      HomeHero.module.css
      HomeHeroSkeleton.tsx
    CollectionRail/
      CollectionRail.tsx
      CollectionRail.module.css
      CollectionRailSkeleton.tsx
    CollectionProductShelf/
      CollectionProductShelf.tsx
      CollectionProductShelf.module.css
      CollectionProductShelfSkeleton.tsx
    EditorialCollectionFeature/
      EditorialCollectionFeature.tsx
      EditorialCollectionFeature.module.css
      EditorialCollectionFeatureSkeleton.tsx
    DiscoveryProductShelf/
      DiscoveryProductShelf.tsx
      DiscoveryProductShelf.module.css
      DiscoveryProductShelfSkeleton.tsx
    CatalogDiscoveryCta/
      CatalogDiscoveryCta.tsx
      CatalogDiscoveryCta.module.css
```

`ClientContinuityStrip` e opcional e fica entre secoes somente quando o
shared-core fornecer um fato autoritativo de Box, ciclo ou pedido. Ela nao faz
parte do primeiro corte e nao pode usar estado simulado.

## Modelo de dados da vitrine

Antes de renderizar a primeira secao, o shared-core deve preparar um modelo
pequeno e deterministico a partir do snapshot real de colecoes e produtos:

```text
backend Collections e produtos vinculados
  -> ClientCollectionDto
  -> mapClientCollectionDto
  -> createHomeVitrineViewModel(snapshot)
  -> HomeView Web e HomeView Native
```

O view-model deve expor `heroCollection`, `featuredCollection`,
`secondaryCollections`,
`primaryProductShelf`, `editorialCollection`, `discoveryProductShelf` e o
destino do Catalogo. A selecao e a ordem derivam de `sortOrder` administrativo,
nunca de chaves de colecao ou condicionais no JSX. Se for necessario escolher
explicitamente posicoes como Hero ou destaque editorial, isso sera uma
capacidade administrativa futura, nao uma convencao escondida na tela.

## Hero: primeiro corte e evolucao administrativa

O primeiro corte do Hero usa uma unica colecao ativa: a primeira devolvida na
ordem administrativa. A imagem ocupa todo o fundo; sobre ela entram nome,
descricao e uma acao de colecoes vinda da colecao. A segunda acao leva ao fluxo
real de assinatura/montagem; a copy institucional dessa acao vem do locale.
Durante o carregamento, a Hero ja aparece
com o fallback central e sem skeleton; quando os dados chegam, somente o
conteudo autoritativo e preenchido. A screen nao cria campanha, imagem, preco
ou copy editorial local.

No seed RoyalPrime, `Selecao da churrasqueira` possui a primeira `sortOrder`
e, por isso, e o Hero inicial. Ela usa inicialmente o asset editorial
`home-churrasqueira-hero-v1.png`, em um Hero de viewport: a imagem ocupa o
fundo da secao e o conteudo continua na grade central da loja. Quando qualquer
colecao nao tiver imagem, o view-model usa o mesmo
fallback do catalogo de assets; a screen nao conhece esse caminho. O catalogo
possui uma imagem local distinta para cada colecao inicial, enquanto uma imagem
configurada pelo Admin sempre tem precedencia sobre esse fallback.

```text
Collection existente
  name + description + imageUrl + imageAlt + status + sortOrder
  -> HomeVitrineViewModel.heroCollection
  -> HomeHero render-only
```

O estilo do Hero continua fixado nas receitas e tokens RoyalPrime. O Admin
deve poder alterar conteudo e curadoria, nunca valores livres de cor,
tipografia, espacamento ou sombra que quebrariam a consistencia da marca.

Uma evolucao futura e explicita, depois de o primeiro Hero ser validado, pode
adicionar uma apresentacao editorial administrada pelo backend:

```text
HomeCollectionPresentation
  collectionId
  placement: hero | rail | editorial | shelf
  slotOrder
  active
  eyebrow
  marketingTitle
  marketingDescription
  mediaFocalPoint
```

Com essa capacidade, o Admin escolhe quais colecoes aparecem no Hero, no
trilho e nos destaques, alem de seus textos editoriais. Um carrossel de Hero
so sera introduzido quando houver mais de uma apresentacao `hero` real;
ele respeitara `slotOrder` e nao tera campanhas fixadas no JSX.

## Paridade web mobile e native

Web mobile e Native consomem `useHomeVitrine` e o mesmo
`HomeVitrineViewModel`. Ambos exibem imediatamente o fallback correspondente a
cada colecao, sem skeleton de copy, e usam os mesmos destinos para Catalogo e
assinatura/montagem.
O renderer Web usa `SectionContainer` com `background-image`; o adapter Native
usa `Image` posicionada como fundo, overlay e a mesma ordem de conteudo. No
Web mobile, o conteudo fica na base da foto e as acoes ocupam linhas separadas
acima da barra inferior. A aparencia final em aparelho ainda exige validacao em
runtime nativo.

## Visitante e cliente

A vitrine-base e identica para visitante e cliente: fotos, colecoes e produtos
sao o centro da pagina. O login nunca transforma a Home em dashboard.

Quando houver fato autoritativo, o cliente pode receber uma faixa discreta entre
as secoes editoriais, como `Continuar sua Box` ou `Acompanhar pedido`. Sem dado
real de pedido, ciclo ou assinatura, essa faixa nao existe. Nunca simular
entrega, saldo ou pedido em andamento.

## Contrato de colecoes usado pela Hero

O endpoint entrega `image_url` e `image_alt`, e o contrato e mapper de
colecoes do Client os preservam no `CollectionBase`. Esta e uma
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
