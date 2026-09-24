# ScreenHeader

`ScreenHeader` e a cabeca contextual reutilizavel das telas de produto. Ele
pertence a `foundation/product-components/screens`: compoe primitives da
Foundation para uma tela, mas nao substitui Header, Drawer ou navegacao do
AppShell.

## Estrutura obrigatoria

Em Web e Native, `ScreenHeader` deve ser o primeiro filho do conteudo da tela.
Filtros, listas, formularios e cards aparecem depois.

```text
screen
|- ScreenHeader
`- content container
   |- filtros
   `- conteudo da tela
```

No Portal web mobile, o AppShell header esta desativado. Por isso o modo
`collapsible` fixa o `ScreenHeader` em `top: 0`; ele nao deve ser aninhado no
`Container` ou no `Stack` que abriga o conteudo da tela. O componente reserva
a propria altura e a separacao visual para o conteudo seguinte; esse container
nao deve adicionar padding superior no mobile.

O `ScreenHeader` tambem nao pode ficar dentro de um ancestral com `transform`,
incluindo wrappers de animacao de entrada. Esse CSS cria um novo bloco de
referencia e impede que o header seja fixo no viewport; a animacao pertence
somente ao conteudo seguinte.

`mobileGutter` controla somente a borda externa da cabeca no Web mobile:
`none` usa a superficie de ponta a ponta e mantem o texto com o mesmo gutter
interno calculado para a pagina;
`page` alinha a superficie ao gutter da pagina. O padrao de `collapsible` e
`none`, para a cabeca nao parecer um card flutuante.

No Native, a tela fornece um `ScrollView` como raiz, fixa o primeiro filho com
`stickyHeaderIndices={[0]}` e passa `scrollProgress` de `0` a `1` para o
componente.

## Uso

```tsx
<ScreenHeader
  description={strings.description}
  eyebrow={strings.badge}
  mobileMode="collapsible"
  mobileGutter="none"
  mobileTitle={strings.mobileTitle}
  title={strings.title}
/>
```

Todos os textos vem do locale ativo. `mobileTitle` e opcional e reduz somente a
copy exibida no mobile; nao cria uma segunda fonte de texto.

`containerWidth` usa a mesma receita de `Container`. O padrao `wide` preserva
o Portal; uma surface administrativa que ja ocupa a largura total pode declarar
`full` para alinhar o cabecalho ao seu `SectionContainer`, sem CSS local de
compensacao.

`contentWidth` controla a largura da composicao do cabecalho. O
padrao `sm` preserva o Portal; uma surface administrativa pode declarar `md`
quando esse era o ritmo do cabecalho da pagina existente.

Uma lista administrativa com comandos distantes pode declarar `full`: titulo,
subtitulo e `metadata` ficam no inicio, enquanto `actionsAlign="end"` fixa os
comandos no final da largura do cabecalho. `metadata` e o local para contexto
como a contagem de registros; `actions` fica restrito a comandos da rota.
Quando esse contexto pertence diretamente ao titulo, `metadataPosition="title"`
o posiciona ao lado dele. `descriptionVariant="caption"` reduz uma descricao
operacional sem alterar o padrao de leitura do Portal.

`containerInset="sectionFull"` alinha o inicio do texto a uma
`SectionContainer` de 20 colunas. O padrao `page` preserva o gutter normal do
Portal; a receita tambem resolve o inset equivalente no mobile.

`actions` recebe controles operacionais da rota, como contagem, troca de
visualizacao e criacao. No desktop eles ficam alinhados ao titulo; no mobile
acompanham o cabecalho recolhivel, sem uma segunda faixa local.

## Modos mobile

- `full`: titulo, eyebrow e descricao.
- `compact`: titulo reduzido.
- `collapsible`: titulo, subtitulo e espacamento acompanham continuamente a rolagem; o subtitulo reduz e desaparece de forma progressiva, mantendo o contexto no inicio da tela sem ocupar a leitura durante o scroll.

`showScrollBorder` controla a linha inferior progressiva. O padrao e `true`;
telas que precisam de uma cabeca sem divisoria usam `false`.

No Web, o componente atualiza seu progresso interno em cada frame de scroll.
No Native, o adapter da tela calcula o mesmo progresso com a distancia de
rolagem baseada em token de spacing. Padding e tipografia interpolam apenas
tokens do tema; a superficie permanece visivel por `Surface` e somente a borda
inferior aparece gradualmente com o progresso.
