# Continuacao 3 - RoyalPrime Client Portal

## Escopo deste handoff

Este corte consolida a evolucao do Portal Client em Web e Native, com foco em
Montar Box, Meus Pedidos e o inicio estrutural de Perfil.

## Contrato que permanece obrigatorio

```text
Web e Native -> render-only
shared-core  -> API, contratos, mappers, hooks, view-models, strings e acoes
backend      -> verdade de dominio e persistencia
```

Nao colocar fetch, DTO mapping, regras de plano/pedido ou copy hardcoded nas
screens de plataforma. `webIsMobile` segue a mesma semantica do Native.

## Meus Pedidos

```text
useClientOrders
  -> GET /orders/me/
  -> pedidos reais mesmo se /orders/config falhar
  -> view-model centralizado
  -> Web e Native renderizam os mesmos estados
```

- Loading, vazio e erro usam tela inteira centralizada, sem `ScreenHeader`.
- O erro tem acao localizada de nova tentativa.
- Quando existem pedidos, o header e o historico sao renderizados.
- O bloco `Pedido atual` aparece apenas para pedido nao terminal; sem pedido
  ativo, a tela segue naturalmente para o historico.
- O seed `cliente@royalprime.local` tem pedidos reais para validacao local.

## Perfil: composicao alvo

```text
Perfil
  fixed/
    -> plano ativo e navegacao
    -> identidade e resumo da conta
  modules/
    -> resumo, assinatura, pedidos, dados, enderecos,
       pagamento, preferencias e seguranca
```

Desktop nao usa um cabecalho textual duplicado na lateral. O Web mobile e o
Native usam `ScreenHeader`; a lateral desktop inicia no plano ativo.

O item ativo da navegacao de Perfil permanece `transparent`; ele muda somente
para o token dourado do tema:

```text
--theme--color-accent
  dark  -> #FFC665
  light -> #B87333
```

`PerfilView` deve continuar sendo apenas a orquestradora de regioes fixas e do
modulo ativo. A separacao fisica dos modulos deve prosseguir sem recriar dados
ou regras locais.

## Validacao conhecida

```text
npm run verify:rules -> passa, com dividas legadas ja reportadas
git diff --check    -> passa
```

O typecheck Native tem bloqueios preexistentes em Landing/Home e a dependencia
`react-dom` da Foundation; nao atribuir esses erros ao Perfil sem confirmar a
lista atual do compilador.
