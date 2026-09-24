# Montar Box - implementacao atual e limites

Este documento registra o corte estrutural iniciado em 2026-09-15. Ele nao
declara fidelidade visual concluida. O objetivo foi preparar o Montar Box para
evoluir cada nivel de caso de uso sem duplicar checkout, dados ou casca.

## Fonte de verdade

```text
backend
  -> catalogo, endereco, frete, pagamento e pedido

client/shared-core
  -> clientCheckoutConfig
  -> useClientCheckout
  -> checkout.view-model
  -> contracts, mappers, formatters e locales

Web e Native
  -> somente composicao, callbacks e estados visuais de cada host
```

`selectedMode` resolve o caso de uso (`subscription`, `royalBox` ou
`royalDelivery`). `currentStep` resolve a progressao dentro dele (`montagem`,
`entrega`, `pagamento` e `resumo`). Os componentes de tela nao calculam preco,
frete, estoque, elegibilidade ou pedido.

## Arvore aplicada

```text
web/src/screens/portal/Checkout/
  acquisition/
    AcquisitionIntro.tsx
    AcquisitionModeGrid.tsx
  cycle/
    ActiveCycleSummary.tsx
  catalog/
    ProductCatalogStep.tsx
    CheckoutProductGrid.tsx
    ProductFilterModal.tsx
  progress/CheckoutStepTracker.tsx
  runtime/useCheckoutRuntime.ts
  delivery/DeliveryStep.tsx
  payment/PaymentStep.tsx
  review/ReviewStep.tsx
  summary/
    StickyOrderSummary.tsx
    SummaryRow.tsx
  layout/CheckoutPanel.tsx

mobile/src/screens/portal/Checkout/
  acquisition/
    AcquisitionIntro.tsx
    AcquisitionModeGrid.tsx
  cycle/
    ActiveCycleSummary.tsx
  catalog/
    ProductCatalogStep.tsx
    CheckoutProductGrid.tsx
  progress/CheckoutStepTracker.tsx
  runtime/useCheckoutRuntime.ts
  delivery/DeliveryStep.tsx
  payment/PaymentStep.tsx
  review/ReviewStep.tsx
  summary/MobileSelectionSummary.tsx
  checkout.styles.ts
```

As duas trees usam os mesmos grupos de ownership: `acquisition`, `cycle`,
`catalog`, `progress`, `runtime`, `delivery`, `payment`, `review` e `summary`.
O Web usa
`StickyOrderSummary`; o Native usa `MobileSelectionSummary`. A diferenca de
nome representa o host, nao uma segunda regra de checkout.

`CheckoutProductGrid` e responsavel pela lista visual e pelos callbacks de
quantidade; ele nunca cria outro card. Web e Native consomem o mesmo
`ProductItemCard` de ecommerce com `preset="catalogo"`. O Web o apresenta em
tres colunas no desktop; o Native em uma coluna com alvos de toque confortaveis.

O filtro usa rascunho nas duas plataformas: categoria somente e confirmada ao
aplicar. A lista de categorias nasce de todas as tags associadas aos produtos,
e nao somente de `Carnes` e `Acompanhamentos`.

No Web, `StickyOrderSummary` representa `currentStep` com quatro circulos
numerados e conectores. A sequencia e `montagem -> entrega -> pagamento ->
resumo`; os estados visuais sao derivados do indice da etapa e nao recebem
regra comercial local.

`DeliveryStep` Web mantem o formulario de novo endereco antes da grade de
enderecos salvos quando `isAddingAddress` esta ativo. A mudanca e apenas de
ordem visual: submissao, persistencia e selecao continuam em
`useClientCheckout` e no shared-core.

## Nivel 01 - selecao

```text
entrada
  -> nenhuma modalidade selecionada
  -> 01.0: AcquisitionIntro contextualiza e AcquisitionModeGrid recebe as tres
     modalidades reais
  -> nao renderiza tracker, catalogo, resumo ou painel vazio antes da decisao

modalidade selecionada
  -> CheckoutStepTracker reflete o currentStep
  -> 01.1: modalidade selecionada, sem itens
  -> ciclo usa ActiveCycleSummary e a montagem usa ProductCatalogStep
  -> resumo recebe quantidade e total do view-model real

produtos selecionados
  -> 01.2: selecao ativa
  -> somente useClientCheckout altera quantidades
  -> proximo passo segue os callbacks reais do checkout
```

As referencias em `nivel-01-selecao/` guiam somente a hierarquia visual. Elas
nao autorizam inserir dados de demonstracao, promessas comerciais, frete,
minimo de peso, certificacao, endereco ou pagamento ficticios.

### Corte visual aplicado em 01.0

O estado neutro agora tem uma regiao propria de decisao, `AcquisitionIntro`,
em Web e Native. A copy vem de `pedido.modeSelection` nas locales ativas. As
modalidades mostram somente icone Foundation, marcador curto, titulo e uma
descricao; detalhes operacionais continuam fora da entrada. No desktop a grade
permanece editorial; no Web mobile e Native a mesma lista vira um trilho
horizontal tatil. O Native tambem deixou de renderizar o painel generico de
selecao vazia antes de `selectedMode` existir.

O `ScreenHeader` e a unica abertura da rota. Portanto o intro de modalidade nao
repete titulo: ele usa apenas o rotulo da secao e a instrucao curta, com espaco
editorial antes dos cards. No desktop, cada card tem area interna ampla e uma
acao visual no rodape; a acao nao muda a regra de dominio, pois o clique do
card continua sendo o unico evento de selecao de modalidade.

No caso de assinatura ativa, `AcquisitionModeCard` recebe o estado real e
exibe o badge de plano ativo sem abrir ou aumentar o card. O card permanece
orientado por strings e tokens da Foundation.

## Paridade Web e Native

Paridade significa mesmo caso de uso, modalidades, etapas, dados, copy, estados
de erro/vazio e callbacks. Ela nao exige a mesma grade: o Web usa resumo lateral;
o Native deve usar trilho horizontal, coluna unica e resumo inferior seguro.

```text
Web
  -> estrutura separada e resumo lateral existente
  -> QA visual do Stitch ainda pendente

Native
  -> mesma fonte de dados e mesma estrutura de etapas
  -> nivel 01 agora usa trilho horizontal para modalidades e categorias
  -> tracker compacto rolavel e resumo com itens/estimativa reais
  -> resumo fixo acima da BottomTabBar ainda nao foi implementado: depende de
     confirmar o contrato de safe area do host, nao de CSS local improvisado
```

Inspecao adicional: `NativeAppShell` hoje monta a tab bar como regiao flex ao
fim da casca e nao expoe um slot/offset de resumo fixo. Portanto uma barra
local sobreposta dentro de `CheckoutView` quebraria a regra de ownership da
AppShell. Quando houver necessidade real de dois ou mais fluxos, a capacidade
deve nascer no AppShell/Foundation e ser ativada por config; ela nao foi criada
neste corte.

Tambem foi criada a guarda pura `requestClientCheckoutStep` no shared-core.
Web e Native usam a mesma regra: ao tentar avancar sem sessao, solicitam o
acesso em vez de mudar a etapa localmente.

## Validacao deste corte

```text
npm run verify:rules
  -> executado; apenas a violacao preexistente de Skeleton permanece

git diff --check
  -> passou; avisos LF/CRLF existentes no worktree

tsc Mobile
  -> Montar Box sem erro proprio depois da reorganizacao
  -> bloqueios preexistentes: padding de Surface em Landing/Home e react-dom
     ausente em ModalFrame Web
```

## Proximo corte correto

1. Confirmar o contrato de safe area/BottomTabBar no host Native antes de
   implementar o resumo fixo; depois fazer QA com teclado e rolagem.
2. Comparar Web, webIsMobile e Native contra as referencias do nivel 01.
3. Separar `SelectionEmptyState` de `ProductCatalogStep` somente quando o
   estado real de selecao vazia for implementado, sem criar estado ficticio.
4. Somente depois abrir nivel de entrega, pagamento e revisao.
