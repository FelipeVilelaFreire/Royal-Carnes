# Referencia visual Stitch - Montar Box Mobile, etapa 1 vazia

Status: referencia visual recebida do usuario em 2026-09-15. Ela descreve o
estado mobile apos escolher uma modalidade e antes de adicionar o primeiro
produto. Complementa `stitch-mobile.md`; nao e codigo de
producao e nao autoriza Tailwind, fontes remotas, Material Symbols, CSS literal,
dados demonstrativos ou uma casca paralela ao AppShell.

## Leitura de caso de uso

Esta referencia nao e a entrada neutra de `/montar-box`. Ela representa o
estado `01.1` do nivel de selecao: `Royal Box` ja esta selecionada e a etapa
`montagem` ainda nao tem itens.

```text
nivel 01.0: entrar em /montar-box
  -> escolher uma das tres modalidades reais

nivel 01.1: modalidade escolhida
  -> Assinatura: plano/ciclo e selecao permitida pelo contrato
  -> Royal Box: selecao livre de produtos para a caixa
  -> Royal Delivery: pedido avulso conforme a modalidade real

nivel 01.2: produtos selecionados
  -> entrega -> pagamento -> revisao -> pedido real
```

Modalidade e etapa sao estados diferentes. A escolha de modalidade pertence a
`selectedMode`; a progressao do checkout pertence a `currentStep`. Nao usar uma
etapa visual para substituir ou esconder a regra de modalidade.

## Anatomia visual a adaptar

| Regiao | Intencao | Limite RoyalPrime |
| --- | --- | --- |
| Cabeca contextual | titulo, descricao e contexto curto | usar `ScreenHeader` compartilhado e strings ativas |
| Modalidades | trilho horizontal tactil com uma escolha inequivoca | usar `AcquisitionModeGrid` e modalidades reais do checkout |
| Stepper | Selecao ativa antes de Entrega/Revisao | refletir `currentStep` do manifest, sem alterar transicoes reais |
| Estado vazio | convidar a iniciar a selecao | aparece somente quando os dados reais estiverem vazios |
| Atalhos de categoria | acelerar a primeira escolha | categorias devem vir da API/controller real, nunca ser uma lista fixa |
| Barra inferior | total/itens e proxima acao em mobile | adaptar o resumo real, acima da BottomTabBar e safe area |
| Bloco de confianca | leitura premium e compacta | somente usar promessas e atributos existentes no contrato/dados reais |

## Elementos que nao entram automaticamente

Nao introduzir desconto, frete, capacidade minima, faixa termica, embalagem,
certificacao, produtos, preco, endereco, prazo ou texto comercial que nao
existam no backend/shared-core. Header, BottomTabBar, avatar, icones e scripts
do HTML de origem tambem nao entram: pertencem ao AppShell e a Foundation.

## Implementacao futura

O ponto de extensao atual ja e `Checkout/`:

```text
acquisition/AcquisitionIntro.tsx         -> nivel 01.0, contexto da escolha
acquisition/AcquisitionModeGrid.tsx      -> nivel 01.0, escolha da modalidade
catalog/ProductCatalogStep.tsx           -> nivel 01.1/01.2, selecao e vazio
progress/CheckoutStepTracker.tsx         -> progressao entre etapas
summary/StickyOrderSummary.tsx           -> resumo desktop/mobile conforme host
```

So criar uma subpasta de selecao se a etapa realmente se dividir em componentes
com responsabilidades proprias, por exemplo `SelectionEmptyState` e atalhos
de categorias. Nao criar uma segunda screen ou um checkout paralelo.
