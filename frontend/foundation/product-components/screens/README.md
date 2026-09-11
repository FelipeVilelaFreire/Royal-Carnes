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

## Modos mobile

- `full`: titulo, eyebrow e descricao.
- `compact`: titulo reduzido.
- `collapsible`: titulo e espacamento acompanham continuamente a rolagem.

No Web, o componente atualiza seu progresso interno em cada frame de scroll.
No Native, o adapter da tela calcula o mesmo progresso com a distancia de
rolagem baseada em token de spacing. Padding e tipografia interpolam apenas
tokens do tema; a superficie permanece visivel por `Surface` e somente a borda
inferior aparece gradualmente com o progresso.
