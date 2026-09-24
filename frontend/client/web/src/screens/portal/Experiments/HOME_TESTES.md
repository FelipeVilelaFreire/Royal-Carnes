# Testes de Home do Portal

## Objetivo

Estas rotas sao estudos visuais isolados para decidir uma secao por vez da Home
do Portal RoyalPrime. Elas existem para comparar a hierarquia da vitrine sem
alterar a Home oficial, o Catalogo, o backend ou os fluxos de compra.

Abra cada uma no ambiente local:

| URL | Secao 2 | Secao 3 | Secao 4 | Secao 5 | Secao 6 | Secao 7 |
| --- | --- | --- | --- | --- | --- | --- |
| `http://localhost:3000/home-teste-1` | Mosaico assimetrico. | Setas sobrepostas. | Tres cards verticais. | Cards escuros em amarelo. | Foto grande e depoimento. | CTA central em foto sutil. |
| `http://localhost:3000/home-teste-2` | Faixa de colecoes. | Setas no cabecalho. | Royal Box em destaque. | Catalogo claro. | Tres cartoes de feedback. | Foto grande e CTA lateral. |
| `http://localhost:3000/home-teste-3` | Quatro colecoes. | Setas nas laterais. | Tres faixas horizontais. | Cards fotograficos. | Mosaico de mesas. | Fechamento amarelo direto. |
| `http://localhost:3000/home-teste-4` | Dois banners editoriais. | ProductItemCard e controles abaixo. | Foto e lista editorial. | Tiles por arraste. | Trilho de depoimentos. | Fechamento editorial claro. |
| `http://localhost:3000/home-teste-5` | Lista por forma de servir. | Progresso e botoes. | Secao de referencia. | Catalogo editorial. | Frase central em fundo escuro. | Tres caminhos finais. |
| `http://localhost:3000/home-teste-6` | Home de cliente recorrente: contexto pessoal, atalhos, recompra e uma selecao curta. | — | — | — | — | — |
| `http://localhost:3000/home-teste-7` | WebIsMobile visitante: descoberta curta, ocasiao, duas portas de entrada e acesso. | — | — | — | — | — |
| `http://localhost:3000/home-teste-8` | WebIsMobile cliente: entrega, atalhos, recompra e uma unica acao para a Box. | — | — | — | — | — |

A Secao 5 agora compara cinco apresentacoes do mesmo catalogo de complementos:
carvao, sal e temperos, utensilios, acompanhamentos e presentes. A Secao 6
agora compara cinco leituras estaticas de feedback. A Secao 7 tambem compara
cinco fechamentos que levam ao Catalogo ou a Royal Box.

`/home-teste-6` e um estudo separado de Home dentro do AppShell para cliente
recorrente. Ele deliberadamente nao repete a narrativa das secoes 1 a 7:
prioriza proximo ciclo, atalhos, recompra e uma unica descoberta editorial.

`/home-teste-7` e `/home-teste-8` comparam a mesma ideia no enquadramento
WebIsMobile: o 7 trata a pessoa como visitante e nao tenta reproduzir a
Landing desktop; o 8 trata a pessoa como cliente recorrente e comprime o
contexto de uso em entrega, atalhos e recompra. Sao molduras de comparacao
responsivas, nao novas telas oficiais ou um segundo contrato mobile.

## Regra da comparacao

Secao 1 esta congelada em todas as rotas: uma colecao com imagem de fundo e
texto sobreposto. As opcoes boas da Secao 2 foram restauradas para comparacao
em cada rota, junto com as variacoes da Secao 3. As secoes seguintes sao
intencionalmente iguais em todas as rotas:

1. Secao 2: descoberta por colecao.
2. Secao 3: prateleira de produtos.
3. Secao 4: destaque editorial secundario.
4. Secao 5: acao para o Catalogo.

Nesta rodada, a Secao 3 tem `min-height` explicito de 760px no desktop e 700px
no mobile em todas as cinco rotas, alem do limite fluido. As Homes 1, 3, 4 e 5
agora comparam carrosseis reais com navegacao diferente. Cada carrossel tem oito
opcoes estaticas, quatro cards inteiros e parte do quinto visivel no desktop,
com snap e rolagem horizontal sem barra aparente. Alem do arraste ou trackpad,
as rotas 1, 3 e 5 oferecem seus controles proprios.

## Limites importantes

- Sao prototipos estaticos Web-only: imagens, textos, produtos e links nao
  representam dados reais.
- Todo novo estudo neste laboratorio deve continuar hardcoded de proposito.
  Nao conectar backend, shared-core, manifest de produto, preco, estoque ou
  regras comerciais enquanto a direcao visual ainda estiver em comparacao.
- A prioridade desta etapa e rapidez para testar layout, ordem e aparencia das
  secoes. Somente depois de uma direcao ser aprovada ela deve ser transformada
  em tela oficial com dados reais, locales, Foundation e paridade Web/Mobile.
- Nao ha preco, estoque, autenticacao, pedido ou navegacao comercial real.
- A Home oficial continua em `/home` e nao foi substituida por estes estudos.
- O Catalogo oficial continua em `/catalogo` e nao foi alterado por eles.
- Os testes reutilizam o AppShell/Header do Portal apenas para manter a
  comparacao dentro da casca visual real.

## Proximo passo

Comparar a Secao 5 de complementos nas cinco rotas e, em seguida, criar cinco
alternativas para a Secao 6 de reviews. A Secao 7 continua como fechamento
para o Catalogo.
