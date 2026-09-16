# Nivel 01 - Selecao

Este e o unico nivel com referencias Stitch no estado atual. Ele cobre o inicio
real do checkout, desde a escolha da modalidade ate a primeira adicao de um
produto.

```text
entrada
  -> selectedMode = null
  -> 01.0: cliente escolhe Assinatura, Royal Box ou Royal Delivery

Royal Box vazia
  -> selectedMode = royalBox
  -> currentStep = montagem
  -> 01.1: modalidade escolhida, sem itens
  -> nenhum item selecionado
  -> estado vazio orienta a abrir catalogo ou categoria real

selecao ativa
  -> 01.2: produtos selecionados
  -> cliente pesquisa, filtra categoria e adiciona produtos reais
  -> resumo reflete itens/total reais
  -> proximo passo permitido segue o contrato de checkout
```

## Referencias

- [Desktop](stitch-desktop.md)
- [Mobile](stitch-mobile.md)
- [Mobile - Royal Box selecionada e vazia](stitch-mobile-selecao-vazia.md)

## Limites

`AcquisitionModeGrid` e `selectedMode` resolvem o caso de uso. `ProductCatalogStep`
e `currentStep = montagem` resolvem a etapa de selecao. Produtos, categorias,
preco e disponibilidade devem permanecer no `useClientCheckout` e shared-core.

### 01.0 - entrada neutra

Este e o primeiro estado visto em `/montar-box`, tambem chamado de `nivel 0`
na conversa de produto. Ele apresenta apenas a decisao de modalidade: contexto
curto, titulo, instrucao e as tres opcoes reais. Antes de `selectedMode` existir,
nao renderizar stepper, catalogo, resumo, total, progresso ou empty state em
card. A proxima composicao so nasce depois da escolha real do cliente.
