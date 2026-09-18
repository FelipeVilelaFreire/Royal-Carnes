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

### Regioes fixas e modulo ativo

O Perfil nao e uma pagina longa com secoes independentes. Ele possui uma
casca estavel e uma unica regiao que muda quando o cliente seleciona uma aba:

```text
Desktop
  fixed/ ActivePlanNavigation
  fixed/ AccountProfileSummary
  modules/ modulo da aba selecionada

Web mobile e Native
  ScreenHeader
  resumo da conta
  navegacao compacta
  modules/ modulo da aba selecionada
```

As abas nao carregam dados localmente. `useClientCustomer` e seus view-models
no shared-core sao donos de estado ativo, dados e acoes. Cada modulo recebe
somente props prontas para renderizar.

```text
modules/
  OverviewModule/       -> uso da assinatura e pedidos recentes
  SubscriptionModule/   -> minha assinatura
  OrdersModule/         -> pedidos e entregas
  PersonalDataModule/   -> dados pessoais
  AddressesModule/      -> enderecos
  PaymentModule/        -> pagamento
  PreferencesModule/    -> preferencias
  SecurityModule/       -> seguranca
```

Regra de evolucao: ao melhorar uma aba, alterar somente a pasta do modulo e,
quando necessario, o view-model/shared-core correspondente. Nao misturar
componentes de um modulo dentro de outro e nao devolver condicoes de negocio
para `PerfilView`.

### Dados autoritativos do Perfil

```text
Uso e Capacidade da Assinatura
  -> GET /subscriptions/me/cycles/current devolve `capacity`
  -> backend cruza entitlements do plano e itens validos do ciclo
  -> cada grupo devolve label, unidade, uso/limite e, opcionalmente,
     selecoes usadas/limite
  -> Web e Native apenas apresentam esse resumo; nao inferem grupo pelo key
     da entitlement nem recalculam cotas
  -> seed Pro: Cortes 1/10, Carnes 2kg/12kg e Carvao 0 saco/1 saco

Pedidos Recentes
  -> precisa consumir o mesmo orders view-model de Meus Pedidos
  -> nao exibir kind/status tecnicos, valor sem moeda ou previsao vazia
  -> imagem principal vem do pedido/catalogo; sem imagem, usar fallback
     visual centralizado do ProductItemCard
```

O plano ativo deve vir de `/api/v1/subscriptions/me/`; nao usar `plans[0]`
como substituto de uma assinatura inexistente. Precos permanecem em centavos
no contrato e so sao formatados na camada de view-model.

### Corte entregue: assinatura, pedidos e enderecos do Perfil

```text
/subscriptions/me/ + /subscriptions/plans/
  -> useClientCustomer
  -> createClientCustomerPlans
  -> Minha Assinatura (Web e Native)

/orders/me/ + /orders/config/
  -> createClientOrdersViewModel
  -> Pedidos Recentes

POST /customers/me/addresses/
  -> useClientCustomer.createAddress
  -> Enderecos do Perfil
```

- `Minha Assinatura` renderiza os entitlements reais de cada plano: alvo
  (colecao, produto ou variante), quantidade, unidade e `maxSelections` quando
  existir. O plano retornado pela assinatura entra como fonte mesmo quando nao
  constar na lista publica de planos.
- A troca de plano simulada foi removida do Portal. Nao existe endpoint Client
  para alterar/cancelar assinatura; isso continua uma operacao do Admin.
- Pedidos Recentes usa tipo, status, moeda, previsao quando presente e imagem
  principal do contrato de pedidos; imagem ausente usa o fallback visual.
- A lateral desktop de Perfil e `sticky` abaixo do AppShell e rola internamente
  quando ultrapassa a viewport. Em mobile permanece estatica.
- O formulario de Enderecos recebe CEP primeiro, formata `00000-000` e, aos
  oito digitos, consulta ViaCEP diretamente no cliente para preencher rua,
  bairro, cidade e UF. Numero, complemento, identificacao e recebedor seguem
  manuais. O endereco continua persistido somente pelo endpoint ja existente.

Limite conhecido: a consulta CEP e uma dependencia publica de leitura no
cliente; o backend ainda nao possui proxy ou servico proprio de enderecos.
Falha ou CEP inexistente deve manter o formulario editavel e mostrar feedback,
nunca inventar dados de entrega.

### Evolucao futura: limite por produto

O contrato de capacidade ja reserva `item_limits` por grupo, mas a primeira
entrega nao ativa essa regra. Quando houver necessidade real, por exemplo
Picanha limitada a 2kg dentro de 12kg de carnes ou camisa de time limitada a
3 unidades dentro de 4 camisetas, o seed/config declara o limite por target e
o backend valida antes de criar o item do ciclo. A tela recebe apenas o
resultado; nao cria `if` por Picanha, camisa ou marca.

## Validacao conhecida

```text
npm run verify:rules -> passa, com dividas legadas ja reportadas
git diff --check    -> passa
```

O typecheck Native tem bloqueios preexistentes em Landing/Home e a dependencia
`react-dom` da Foundation; nao atribuir esses erros ao Perfil sem confirmar a
lista atual do compilador.
