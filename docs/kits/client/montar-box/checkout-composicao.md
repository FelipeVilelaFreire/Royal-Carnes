# Montar Box - composicao do checkout

Este documento define a composicao do nivel de montagem. Ele nao cria regra de
negocio nem uma segunda fonte de dados: `useClientCheckout` continua sendo a
fonte de interacao, e o backend continua sendo a autoridade de limite, preco,
estoque e criacao do pedido.

## Hierarquia visual

Depois que o cliente escolhe uma modalidade, a pagina e formada por quatro
regioes claras:

```text
1. aquisicao
   -> modalidades de compra
   -> Assinatura, Royal Box e Royal Delivery

2. ciclo
   -> plano ativo, renovacao e saldos do ciclo
   -> aparece quando a modalidade e assinatura

3. catalogo
   -> busca, filtros, ordenacao e grade de produtos elegiveis

4. resumo
   -> selecao atual, limites, total e proxima etapa
   -> lateral sticky no Web; composicao mobile segura no Native
```

No Web, ciclo e catalogo ocupam a coluna principal. O resumo ocupa a coluna
lateral e acompanha o checkout enquanto houver espaco de viewport. No Native,
as mesmas regioes seguem em uma unica coluna; o resumo respeita o contrato do
host e da BottomTabBar, sem sobreposicao local.

O resumo lateral Web mostra a etapa por uma timeline compacta: circulos
numerados conectados, com a trilha concluida ate a etapa atual. Ela consome
somente `currentStep`; a navegacao e a guarda de autenticacao continuam nos
callbacks do runtime.

Na entrega Web, o formulario de novo endereco vem antes da grade de enderecos
salvos quando solicitado. Essa ordem nao substitui a escolha do endereco ativo
nem cria estado local para persistencia.

## Produto no configurador

O Catalogo e o Checkout usam o mesmo `ProductItemCard`. Nao existe
`MontarBoxProductCard` paralelo nem um preset de negocio para alterar a face do
card. Cada screen possui somente a sua grade e regras de interacao:

```text
CatalogoProductGrid -> ProductItemCard preset="catalogo"
CheckoutProductGrid -> ProductItemCard preset="catalogo"
```

O Checkout conserva imagem, nome, descricao, categoria, preco quando aplicavel
e a anatomia editorial do catalogo. A screen informa somente a acao: antes da
selecao, botao `Adicionar`; depois, controle `menos - quantidade - mais` no
canto inferior direito. O preco pode ser ocultado em assinatura sem deslocar a
acao. Limites e indisponibilidade continuam decisao do shared-core/backend.

## Filtro e categorias

`ProductFilterModal` Web e o modal nativo mantem uma categoria em rascunho.
Escolher uma opcao nao altera a lista ate `Aplicar`; fechar descarta o rascunho.
A busca filtra por nome, descricao e tags. A categoria filtra pelas tags reais
do produto, nao apenas pela categoria raiz. Assim o checkout expõe Bovinos,
Aves, Suinos, Carvao e outras categorias associadas ao catalogo.

## Tree de responsabilidade

`checkout/` e um nome de composicao reutilizavel dentro da screen. Ele nao e
uma biblioteca nova e nao move regra de dominio para o renderizador.

```text
Checkout/
  acquisition/  escolha e contexto da modalidade
  cycle/        resumo do plano e ciclo ativo
  catalog/      busca, filtro e CheckoutProductGrid
  progress/     tracker de etapas
  runtime/      guarda visual de etapa e runtime do host
  delivery/     composicao de entrega
  payment/      composicao de pagamento
  review/       confirmacao visual
  summary/      resumo por plataforma
  layout/       painel estrutural Web das etapas posteriores
```

Uma futura configuracao de assinatura ou qualquer outro fluxo de compra pode
seguir essas responsabilidades sem copiar o nome ou a estrutura de Montar Box.
Somente uma necessidade comprovada em dois consumidores autoriza extrair uma
capacidade para fora da screen.

## Paridade

Web e Native preservam os mesmos grupos de ownership, nomes de componentes,
dados e callbacks. A adaptacao permitida e de host: grade responsiva e resumo
lateral no Web, trilhos e coluna unica no Native.

`/montar-box` continua sendo apenas a rota do produto. Ela aponta para
`Checkout/CheckoutView`; o diretorio da implementacao nao carrega o nome da
rota e pode ser reaproveitado como composicao por outros fluxos de compra.
