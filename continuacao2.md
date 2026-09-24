# Continuacao 2 - RoyalPrime Client

> Handoff operacional de Client. Atualizado em 2026-09-24.
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
  flow/
    left/      -> tracker e conteudo da etapa atual
    right/     -> resumo persistente no Web e resumo contextual no Native
  cycle/       -> plano ativo e saldo do ciclo
  catalog/     -> busca, filtro e produtos
  progress/    -> progresso entre etapas
  runtime/     -> coordenacao local da screen
  summary/     -> composicao visual do resumo por host
  delivery/    -> endereco, recorrencia e frete quando aplicavel
  payment/     -> pagamento
  review/      -> revisao
```

O fluxo divide com clareza:

```text
modalidade selecionada
  -> contexto do plano/ciclo
  -> catalogo permitido e limite por capacidade
  -> resumo da selecao e capacidades do ciclo
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

### Dados de planos, catalogo e inventario local

`/montar-box` nao deve usar vazio como substituto para uma falha de dados. A
montagem consome planos em `/api/v1/subscriptions/plans/` e o snapshot de
catalogo em categorias, colecoes, modalidades e produtos. Se seletor de plano
e catalogo ficarem vazios ao mesmo tempo, conferir primeiro os endpoints reais
antes de ajustar a tela.

Em 2026-09-21, o banco local estava sem a coluna `subscriptions_plan.accent_color`.
Isso fazia o endpoint de planos retornar 500 e impedia a montagem de receber os
planos. A migration `subscriptions.0003_plan_accent_color` foi aplicada com
`py manage.py migrate`; depois disso, planos e os quatro endpoints do catalogo
retornaram 200 localmente.

O pedido deve encontrar inventario para a variante realmente escolhida. O seed
de inventario recebeu `ACEM-1KG` e `ACENDEDOR-ECO-24UN`, alem do ja existente
`ALCATRA-BIFE-500G`, e foi sincronizado com:

```text
py manage.py seed_backend --seed royalprime
```

Uma criacao de Royal Box com esses tres SKUs foi validada dentro de transacao
revertida: tres itens foram aceitos sem `Inventory item not found`, sem gravar
um pedido de teste no banco local.

### Filtro e categorias

Busca e categoria entram pelo shared-core/view-model. O filtro de categoria
trabalha com rascunho no modal e somente atualiza a lista ao aplicar. O modal
mostra somente categorias-pai; cada produto recebe no mapper a cadeia completa
de categorias, entao uma escolha como `Carnes` tambem encontra produtos em
suas subcategorias. Isso vale para Web e Native.

### Plano, ciclo e capacidades

`ClientCheckoutSubscriptionPlan.capacity` e `ClientCheckoutCycleUsage.capacity`
carregam chave, label, limite, unidade e uso atual. O resumo mostra os grupos
reais configurados pelo Admin/seed, por exemplo `Carnes`, `Acompanhamentos`,
`Carvao`, `Acendedores`, `Utensilios` e `Brindes`.

O shared-core calcula a quantidade pendente pela chave de capacidade e pelas
tags hierarquicas do produto. `canAddProduct` usa a mesma regra para bloquear
o incremento de todo produto pertencente ao grupo quando o limite do ciclo
foi atingido. Assim, se `Acendedores` esta em `2/2 un`, nenhum acendedor pode
receber mais quantidade; o botao de reduzir continua disponivel.

O resumo do Web e do Native mantem a mesma informacao: modalidade/plano,
etapas numericas, capacidades e itens escolhidos. No Web ele ocupa
`flow/right` como resumo persistente; no Native aparece na mesma fronteira de
responsabilidade, depois do fluxo principal.

No resumo Web, endereco e frete usam a mesma grade de duas colunas: rotulo e
icone na esquerda, valor alinhado a direita. O endereco usa elipse quando nao
cabe; no frete de Royal Delivery, o nome do servico e o preco ficam em linhas
separadas no mesmo alinhamento. O resumo nao mostra frete pendente: a linha so
aparece depois da escolha no passo de entrega.

No resumo persistente Web, as quatro etapas sao uma timeline horizontal: os
circulos `1 -> 2 -> 3 -> 4` possuem conectores e estados `done`, `current` e
`pending`. Isso e somente representacao de `currentStep`; nao cria navegacao
paralela nem altera a regra de avance.

### Entrega e endereco

O passo `entrega` possui um formulario de endereco separado da escolha de
endereco ja salvo. A grade e declarada em
`client/shared-core/manifest/checkout.config.ts` e deve continuar usando a
matriz Foundation de 20 colunas:

```text
linha 1 -> CEP (4) | Rua (11) | Numero (5)
linha 2 -> Bairro (6) | Cidade (6) | Complemento (8)
mobile  -> um campo por linha
```

`DeliveryStep` usa `GridItem` como filho direto de `Grid`. Nao colocar o span
como `data-*` no `Input`: nesse caso o atributo vai para o elemento `input` e
nao muda a grade. O CEP aceita somente numeros, aplica a mascara `00000-000`
e declara `autocomplete="postal-code"`.

Ha uma capacidade compartilhada de consulta em
`client/shared-core/api/brazilian-postal-code.api.ts`, hoje consumida pelo
Perfil. Ela ainda nao esta ligada ao Checkout; antes de conectar, decidir se a
consulta ViaCEP deve continuar como capacidade client-side ou ser mediada pelo
backend. Nao dizer que rua, bairro, cidade ou frete ja sao calculados pelo CEP
nesta tela.

O endereco novo agora e persistido de verdade pelo fluxo Client:

```text
DeliveryStep
  -> useClientCheckout.submitNewAddress
  -> client/shared-core customer API
  -> endpoint de endereco do cliente
  -> resposta mapeada para ClientCheckoutAddress
  -> endereco selecionado para este ciclo
```

O formulario exige nome do endereco (`Casa`, `Trabalho` etc.), CEP, rua,
cidade e UF. Ao salvar com sucesso, ele fecha, entra na lista de enderecos e
fica selecionado. Nao trocar esse fluxo por estado local ou fechar o formulario
sem a resposta do backend.

Na composicao Web, o rotulo redundante `Endereco de entrega` foi removido da
cabeca da secao. Quando aberto, o formulario de novo endereco fica acima dos
cards de enderecos salvos; a lista existente e seus callbacks de selecao nao
mudam de dono.

### Pagamento V1

O checkout recebe os meios de pagamento configurados no backend e filtra cada
opcao pela modalidade escolhida. A primeira versao trabalha com:

```text
Pix                 -> disponivel no fluxo atual
Falar pelo WhatsApp -> abre a URL configurada pelo backend
Pagar na entrega    -> somente quando Royal Delivery permitir
```

Cartao e cobranca recorrente automatica pertencem a uma fase posterior. A tela
nao deve simular autorizacao de cartao, recorrencia, parcelamento ou sucesso de
cobranca. O usuario escolhe a intencao; a confirmacao operacional continua no
backend/atendimento enquanto nao existir um provedor contratado.

### Criacao de pedido e retorno

`Finalizar pedido` envia um payload real para `POST /api/v1/orders/me/` usando
`useClientCheckout.submitOrder`. O shared-core monta modalidade, endereco,
itens, ciclo/assinatura quando aplicavel e identificadores de produto/variante.
O backend continua validando autenticacao, estoque, capacidade e pedido.

Quando a criacao retorna sucesso, o Portal navega para `Meus Pedidos`; nao ha
uma etapa morta de "pedido enviado" no Checkout. O pedido novo aparece pela
API no acompanhamento e tambem na operacao Admin.

Diagnostico historico relevante: `Inventory item not found` para Alcatra em
bifes 500 g foi causado por seed/catalogo sem modalidade de assinatura e sem
inventario correspondente. O seed local foi ajustado e `seed_backend` foi
executado localmente. Se o erro reaparecer, conferir primeiro produto, SKU,
modalidade e inventario no backend; nao esconder a falha no Client.

### Meus Pedidos

`Meus Pedidos` foi refinado para apresentar dados compreensiveis do pedido:

- data formatada em PT-BR, em vez de ISO crua;
- item com quantidade e peso, sem expor `subscription` como categoria tecnica;
- pedido de ciclo identificado como incluso na assinatura, sem sugerir cobranca
  avulsa do item;
- pagamento, previsao e codigo de entrega usam estado humano de aguardando
  confirmacao quando o backend ainda nao forneceu o dado;
- o card do pedido atual oferece `Ver detalhes` no modal existente.

O titulo da rota e somente `Meus Pedidos`; o eyebrow visual `Acompanhamento`
foi removido. Historicos separados de assinatura, pedido e pagamento tambem
nao devem voltar como navegacao local nesta tela.

### Aquisição: modalidade de compra

O modulo Web agora possui fronteiras visuais explicitas:

```text
web/src/screens/portal/Checkout/acquisition/
  CheckoutAcquisition.tsx          -> composicao e loading real
  AcquisitionIntro.tsx/.module.css -> espacamento externo
  AcquisitionModeGrid.tsx/.module.css
                                 -> ordem e grade responsiva
  AcquisitionModeCard.tsx/.module.css
                                 -> um card selecionavel
  AcquisitionModeSkeleton.tsx/.module.css
                                 -> loading com Foundation Skeleton
  README.md                        -> ownership e checklist
```

O card mostra somente strings reais de modalidade: eyebrow, titulo, descricao
e acao. A leitura foi aproximada da referencia editorial Stitch sem copiar
Tailwind, Google Fonts, Material Symbols, header/footer locais, beneficios ou
promessas comerciais demonstrativas.

Com `selectedMode === null`, os tres cards exibem a descricao completa. Depois
da escolha, todos recolhem com transicao de altura, espacamento e descricao;
icone, titulo e CTA permanecem visiveis. O ativo recebe linha superior e
superficie destacada por tokens. Essa transicao libera espaco para o fluxo sem
apagar a escolha do usuario.

Para uma assinatura ja ativa, `AcquisitionModeCard` mostra o badge compacto
`Plano ativo` no canto superior direito. Ele nao expande o card nem substitui
o CTA de configuracao de ciclos.

O skeleton espelha a geometria final (linha superior, icone, copy e CTA) e usa
`Skeleton` da Foundation. Nao desenhar carregamento falso com divs locais.

### Referencia Stitch e ScreenHeader

`docs/kits/client/montar-box/nivel-01-selecao/stitch-desktop.md` concentra as
referencias visuais recebidas. O HTML do Stitch e material de estudo, nunca
runtime. A versao enviada em 2026-09-19 inspira canvas claro, cards editoriais,
hierarquia central e estado selecionado legivel.

`ScreenHeader` Foundation ganhou a capacidade publica:

```tsx
<ScreenHeader align="center" />
```

Ela existe em Web e Native; `/montar-box` usa `align="center"`. Nao centralizar
o conteudo alterando internals do ScreenHeader por CSS local. Qualquer futura
troca de fonte deve nascer no Theme e ter disponibilidade real nas plataformas,
nunca em import de Google Fonts na screen.

### Limite comercial e autoridade do servidor

O servidor continua sendo a autoridade para criar pedido e validar reservas do
ciclo. A tela agora recebe capacidade por grupo e bloqueia o incremento antes
de ultrapassar o limite exibido. Isso nao substitui a revalidacao no servidor,
nem prova que todos os motivos de indisponibilidade ja foram expostos pelo
contrato.

O proximo corte de dominio deve seguir:

```text
backend entitlement/saldo
  -> shared-core mapper e view-model
  -> ProductItemCard recebe disabled e motivo autoritativo
  -> comando de adicao respeita o saldo
  -> criacao de pedido revalida no servidor
```

### Autenticacao durante a montagem

O cliente pode escolher modalidade e montar a Box antes de autenticar. Login
nao e um reinicio do Checkout: quando uma etapa protegida e solicitada, o
`useClientCheckout` guarda a etapa em `pendingStepAfterAuth`, abre o fluxo de
acesso pelo host e preserva o rascunho atual em memoria. Depois do login, o
hook aplica a etapa pendente sem trocar modalidade, plano, itens, quantidades
ou rota `/montar-box`.

No Web, o submit de acesso fecha apenas o `AccessShell`; ele nao navega para a
Home. No Native, o acesso e apresentado em `Modal` sobre a tela ativa, de modo
que o Checkout nao seja desmontado enquanto o usuario entra. A autenticacao
continua obrigatoria para prosseguir pelas etapas protegidas, carregar enderecos
da conta e criar o pedido; backend continua validando identidade, estoque e
capacidade.

Este corte preserva o rascunho durante a interacao atual de login. Ele ainda
nao persiste a montagem apos recarga da pagina, encerramento do navegador ou
reinicio do aplicativo.

## Outros estados relevantes

- `Meus Pedidos` distingue vazio local em card de vazio de rota em tela inteira.
  A tela sem pedidos e transparente, centralizada e sem borda; o gate de
  autenticacao tambem nao mostra BottomTabBar.
- A BottomTabBar, Header, Drawer e overlays pertencem ao AppShell. Nao criar
  barra fixa local no Checkout sem capacidade comprovadamente reutilizavel e
  sem respeitar safe area/teclado no host Native.
- O AppShell Web possui agora um editor de aparencia aberto pelo icone de
  configuracao no Header. Portal e Landing o ativam por manifest. O editor
  aplica o rascunho localmente a paleta, tipografia, raio, borda e glass;
  ele nao persiste uma preferencia do usuario nem modifica contratos
  comerciais do Checkout.
- A cor de cada plano agora e um dado persistido: `accent_color` aceita um
  hexadecimal valido e usa a cor primaria do tema como padrao. O Admin declara
  o campo no manifesto e usa o `ColorField` da Foundation para abrir o seletor
  nativo e mostrar a pre-visualizacao; nao exibe identificadores tecnicos.
- O resolvedor Semi-composed prioriza `theme.colors` quando a paleta ativa ja
  foi resolvida pelo AppShell. Antes disso, primitives podiam ignorar a paleta
  ativa e voltar a `theme.modes`, deixando superficies escuras indevidamente.

## Validacao e limites conhecidos

```text
npm run verify:foundation -> passou, 94 verificacoes
npm run verify:rules      -> executado; seis violacoes preexistentes no worktree
git diff --check          -> passou nos arquivos do corte de autenticacao; avisos LF/CRLF sem falha
```

Duas violacoes de `verify:rules` pertencem a
`frontend/client/shared-core/manifest/theme.manifest.js`, linhas 8 e 9: as
opcoes de paleta ainda possuem valores que a regra interpreta como copy de UI.
As outras quatro estao em `frontend/foundation/ui/web` (`Button`, `Card`,
`Input` e `Surface`) por estilos inline legados. Nenhuma foi introduzida pelo
corte de autenticacao. `npm run build:client` para no mesmo prebuild. O
typecheck Native tambem permanece bloqueado por erros preexistentes de Landing
e pela ausencia de `react-dom` para `ModalFrame` web.

QA visual permanece pendente: nao havia navegador conectado nesta sessao.
Validar em desktop, webIsMobile e host Native antes de declarar fidelidade
visual das referencias Stitch ou paridade completa.

## Proximo passo seguro

1. Antes de abrir novo modulo, usar
   `docs/kits/client/montar-box/fluxos-comerciais-e-matriz-de-testes.md` para
   homologar Royal Box, Royal Delivery e o ciclo de Assinatura ja existente;
   contratacao nova de assinatura continua uma lacuna separada.
2. Trabalhar o proximo modulo: `catalog/`, com busca, filtros, grade de cortes,
   quantidade e resumo sticky, a partir de uma referencia Stitch e contratos
   reais do catalogo.
3. Fazer QA visual e interativo de modalidade, transicao compacta, skeleton,
   capacidade, filtro, endereco, pagamento, criacao de pedido e Meus Pedidos
   em Web desktop, webIsMobile e Native. Incluir o cenario visitante: montar,
   solicitar etapa protegida, autenticar e confirmar retomada sem perder o
   rascunho.
4. Confirmar no backend o resumo autoritativo de capacidade, indisponibilidade
   e motivo por produto, propagando-os ao card reutilizado sem regra comercial
   na screen.
