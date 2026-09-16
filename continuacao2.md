# Continuacao 2 - RoyalPrime Client

> Handoff operacional de Client. Atualizado em 2026-09-16.
> `continuacao.md` e reservado ao estado geral, Admin e backend.

## Como retomar

Leia nesta ordem antes de alterar Web, webIsMobile ou Native:

```text
1. docs/CODEX_ENTRYPOINTS.md
2. frontend/AGENTS.md
3. frontend/client/web/AGENTS.md
4. frontend/client/mobile/AGENTS.md
5. docs/kits/client/montar-box/README.md
6. docs/kits/client/montar-box/implementacao-atual.md
7. docs/kits/client/montar-box/checkout-composicao.md
```

Os documentos do kit guardam referencias Stitch, niveis de caso de uso e
decisoes de composicao. Este arquivo guarda somente o estado necessario para
seguir o trabalho sem reler um diario de alteracoes.

## Contrato Client

```text
backend
  -> fatos comerciais, estoque, limites, pedido, frete e pagamento

client/shared-core
  -> API, mappers, view-models, comandos, contratos e locales

Web, webIsMobile e Native
  -> composicao render-only, estados visuais e callbacks do host
```

- UI nova usa locales ativas; nao criar copy visivel hardcoded.
- Nao usar emoji Unicode na interface.
- AppShell e Foundation sao donos da casca e das primitives reutilizaveis.
- Web e Native representam o mesmo fluxo e os mesmos dados. A diferenca e
  somente a fisica da plataforma.
- Nao criar fetch, calculo comercial, mock ou regra de negocio dentro de uma
  screen quando o shared-core deve ser dono.

## Prioridade atual

```text
1. Montar Box / Checkout
2. Meus Pedidos
3. Perfil
4. Home
5. Landing
```

Uma screen so e considerada concluida depois de evidencias funcionais, visuais
e de dados reais. Build e regra estatica nao substituem QA em viewport real.

## Checkout: estado atual

A rota publicada continua `/montar-box`. O nome interno da screen e
`Checkout`, para separar a rota comercial do dominio reutilizavel.

```text
web/src/screens/portal/Checkout/
mobile/src/screens/portal/Checkout/
  acquisition/ -> modalidade de aquisicao
  cycle/       -> plano ativo e saldo do ciclo
  catalog/     -> busca, filtro e produtos
  progress/    -> progresso entre etapas
  runtime/     -> coordenacao local da screen
  summary/     -> resumo por host
  delivery/    -> entrega
  payment/     -> pagamento
  review/      -> revisao
```

O fluxo divide com clareza:

```text
modalidade selecionada
  -> contexto do plano/ciclo
  -> catalogo permitido
  -> resumo da selecao
  -> entrega, pagamento e revisao
```

`selectedMode` define o caso de uso (`subscription`, `royalBox` ou
`royalDelivery`). `currentStep` define a etapa dentro desse caso. Nao misturar
essas duas dimensoes em um unico estado visual.

### Produto e grade

Existe somente um card de produto:

```text
frontend/product-components/ecommerce/
  ProductItemCard

CatalogoProductGrid -> ProductItemCard preset="catalogo"
CheckoutProductGrid -> ProductItemCard preset="catalogo"
```

O Checkout nao cria `MontarBoxProductCard` nem preset comercial exclusivo. Ele
reaproveita imagem e face do Catalogo; a screen decide apenas a grade e a acao
contextual:

```text
sem selecao -> Adicionar
com selecao -> menos, quantidade, mais
```

No Web, `CheckoutProductGrid` usa tres colunas em desktop e reduz de forma
responsiva. No Native, o mesmo contrato aparece em uma coluna, com alvo de
toque apropriado. Quando preco nao se aplicar, a acao continua no canto
inferior direito sem criar outro card.

### Filtro e categorias

Busca e categoria entram pelo shared-core/view-model. O filtro de categoria
trabalha com rascunho no modal e somente atualiza a lista ao aplicar. As
opcoes usam todas as tags/categorias de cada produto, nao apenas a categoria
primaria. Isso evita reduzir a lista indevidamente a `Carnes` e
`Acompanhamentos`.

### Limite comercial pendente

O servidor ja e a autoridade para criar pedido e validar reservas de ciclo.
Ainda falta expor, de modo completo e autoritativo, entitlement por produto,
saldo por grupo e motivo de indisponibilidade para a tela. Ate esse contrato
chegar, nao afirmar que a UI bloqueia corretamente cada produto de cada plano.

O proximo corte de dominio deve seguir:

```text
backend entitlement/saldo
  -> shared-core mapper e view-model
  -> ProductItemCard recebe disabled e motivo
  -> comando de adicao respeita o saldo
  -> criacao de pedido revalida no servidor
```

## Outros estados relevantes

- `Meus Pedidos` distingue vazio local em card de vazio de rota em tela inteira.
  A tela sem pedidos e transparente, centralizada e sem borda; o gate de
  autenticacao tambem nao mostra BottomTabBar.
- A BottomTabBar, Header, Drawer e overlays pertencem ao AppShell. Nao criar
  barra fixa local no Checkout sem capacidade comprovadamente reutilizavel e
  sem respeitar safe area/teclado no host Native.

## Validacao e limites conhecidos

```text
npm run verify:rules -> passou; 5 arquivos alterados, 0 violacoes
git diff --check     -> passou; avisos LF/CRLF sem falha de diff
```

`npm run build:client` chega a compilar o Checkout, mas o typecheck final ainda
para por erros preexistentes de Foundation/Portal: Drawer, `UiLayoutGap` e
tipagens JSX de DropdownPicker/Modal. Nao atribuir essas falhas ao Checkout
sem reproducao isolada.

QA visual permanece pendente: nao havia navegador conectado nesta sessao.
Validar em desktop, webIsMobile e host Native antes de declarar fidelidade
visual das referencias Stitch ou paridade completa.

## Proximo passo seguro

1. Definir e expor no backend o resumo autoritativo de entitlement e saldo.
2. Mapear esse contrato no shared-core, sem regra comercial nas screens.
3. Mostrar indisponibilidade e motivo no card unico do Checkout.
4. Fazer QA visual e interativo do nivel de selecao em Web desktop,
   webIsMobile e Native.
