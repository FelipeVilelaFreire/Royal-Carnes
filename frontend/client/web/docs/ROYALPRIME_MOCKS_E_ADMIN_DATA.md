# RoyalPrime - Mocks, Pedidos, Entregas e Visao Admin

## Objetivo

Este documento registra como os mocks do RoyalPrime devem ser separados durante o MVP.

A regra principal:

```text
Pedido e a compra.
Entrega e a execucao operacional do pedido.
Assinatura e o contrato recorrente que pode gerar pedidos/ciclos.
Cliente e a pessoa que possui enderecos, pagamentos, pedidos e assinaturas.
```

O client pode mostrar uma experiencia rica com dados mockados, mas os mocks devem continuar com donos claros para virar backend depois sem reescrever tudo.

## Client mocks

Base:

```text
frontend/client/shared-core/mocks
```

### catalog

Arquivos:

```text
frontend/client/shared-core/mocks/catalog/
```

Dono de produtos, categorias, planos, opcoes comerciais e catalogos.

Uso esperado:

- `/cortes`: vitrine/catalogo.
- `/produtos`: montagem de assinatura, Royal Box ou Royal Delivery.
- cards de produto em `product-components/ecommerce`.

Regra:

- Produto e item vendavel.
- Categoria apenas organiza.
- Plano define limites de assinatura.
- Fluxo comercial define se aparece em assinatura, box ou delivery.

### customer.mock.ts

Dono do cliente mockado logado.

Hoje o cliente principal e `customer-felipe-vilela`.

Contem:

- dados pessoais;
- enderecos;
- metodos de pagamento;
- notificacoes;
- assinatura ativa.

Regra:

- Dados de pessoa ficam aqui.
- Pedido nao deve duplicar telefone, CPF ou endereco completo; deve referenciar `customerId` e `addressId`.
- Novos clientes para cenarios de admin devem nascer com ids estaveis e reaproveitaveis.

### orders/

Dono dos pedidos do cliente.

Tipos atuais:

- `royalDelivery`: pedido avulso.
- `subscriptionCycle`: pedido ou ciclo vinculado a assinatura.

Status atuais:

- `sentToStore`;
- `approved`;
- `preparing`;
- `outForDelivery`;
- `delivered`;
- `cancelled`.

Campos importantes:

- `customerId`: liga pedido ao cliente.
- `subscriptionId`: liga ciclo a assinatura.
- `delivery.addressId`: liga a entrega ao endereco do cliente.
- `delivery.deliveryCode`: codigo de finalizacao quando aplicavel.
- `payment.totalLabel`: valor ou texto de assinatura.
- `cycleUsage`: uso acumulado do ciclo da assinatura.
- `timeline`: acompanhamento do pedido.

Regra:

- Pedido de assinatura pode ter `totalLabel: "Incluido na assinatura"`.
- Pedido avulso deve ter valor real.
- O resumo de uso da assinatura deve vir de `cycleUsage`, nao de JSX hardcoded.
- A tela `/produtos` pode mostrar o ciclo atual do cliente logado usando os pedidos mockados.

### freight.mock.ts

Dono das opcoes e politicas de frete.

Uso:

- Royal Delivery calcula ou escolhe frete.
- Assinatura e Royal Box podem ter frete incluido.

Regra:

- Frete nao deve ser hardcoded no componente.
- Se o fluxo exigir frete novo, adicionar no mock e consumir por chave.

### payment.mock.ts

Dono dos metodos de pagamento do checkout.

Metodos atuais:

- Pix;
- cartao;
- pagar na entrega;
- WhatsApp.

Regra:

- Metodo define disponibilidade por fluxo.
- Assinatura deve preferir metodos recorrentes quando o fluxo ficar real.

## Admin mocks

Base:

```text
frontend/admin/shared-core/mocks
```

O admin precisa de visao operacional. Ele nao deve ser apenas uma copia visual dos pedidos do cliente.

### dashboard.mock.ts

Dono dos agregados executivos:

- receita;
- assinantes ativos;
- entregas pendentes;
- churn;
- historico de receita.

Regra:

- Dashboard usa dados agregados, mesmo que no MVP sejam mockados.
- Nao misturar lista detalhada de pedido dentro do dashboard quando ela pertence a pedidos ou entregas.

### customers.mock.ts

Dono da lista administrativa de clientes.

Uso esperado:

- tela de usuarios/clientes;
- detalhe futuro do cliente;
- filtro por status, plano e dados cadastrais.

Regra:

- Deve compartilhar ids conceitualmente compativeis com client, como `customer-felipe-vilela`.
- Dados sensiveis continuam mockados, mas devem parecer realistas.

### subscribers.mock.ts

Dono da visao simplificada de assinantes.

Uso:

- listas rapidas de socios/assinantes;
- metricas de assinatura.

Observacao:

Este mock pode ser reduzido futuramente quando `subscriptions.mock.ts` estiver maduro.

### subscriptions.mock.ts

Dono das assinaturas operacionais.

Uso esperado:

- tela de assinaturas;
- renovacoes;
- ciclo atual;
- status de plano.

Regra:

- Assinatura nao e pedido.
- Assinatura gera ciclos/pedidos.
- Admin deve conseguir ver status da assinatura sem precisar abrir cada pedido.

### orders.mock.ts

Dono da visao administrativa de pedidos.

Uso esperado:

- tela de pedidos;
- status comercial;
- origem do pedido;
- cliente, email, valor e resumo.

Regra:

- Pedido responde: "o que foi comprado?".
- Pedido nao deve tentar resolver rota, entregador ou janela operacional completa.

### deliveries.mock.ts

Dono da execucao de entrega.

Uso esperado:

- tela de deliveries/entregas;
- calendario de entregas;
- separacao;
- despacho;
- status logistico;
- endereco e itens que serao entregues.

Regra:

- Entrega responde: "quando, onde e como vai ser entregue?".
- Deve referenciar pedido por id quando o contrato amadurecer.
- Pode ter status operacional diferente do status comercial do pedido.

## Separacao recomendada por entidade

```text
customers.mock.ts
  -> pessoa, contato, endereco principal, status cadastral

subscriptions.mock.ts
  -> contrato recorrente, plano, ciclo, renovacao

orders.mock.ts
  -> compra, codigo, itens, pagamento, status comercial

deliveries.mock.ts
  -> execucao, agenda, janela, endereco, separacao, despacho, codigo

payments.mock.ts
  -> metodos, invoices, cobrancas

catalog/
  -> produtos, categorias, planos e regras comerciais

dashboard.mock.ts
  -> numeros agregados para decisao
```

## Regra para novas telas

Comecar pela tela real.

Se a tela precisa mostrar compra do cliente:

```text
usar orders
```

Se a tela precisa mostrar rota, agenda ou operacao:

```text
usar deliveries
```

Se a tela precisa mostrar contrato recorrente:

```text
usar subscriptions
```

Se a tela precisa mostrar pessoa, endereco ou contato:

```text
usar customers/customer
```

Se o mesmo dado aparece no client e no admin, alinhar ids e semantica antes de duplicar.

## Estado atual e proximos ajustes

O client ja tem pedidos ricos para Felipe Vilela, incluindo Royal Delivery e ciclos de assinatura.

O admin ja comecou a separar:

- clientes;
- assinaturas;
- pedidos;
- deliveries;
- dashboard.

Ainda falta amadurecer:

- alinhar todos os nomes/planos do admin com o catalogo oficial do client;
- fazer `deliveries.mock.ts` referenciar `orderId`;
- evitar divergencia entre `subscribers.mock.ts` e `subscriptions.mock.ts`;
- criar contratos TypeScript explicitos para os mocks do admin;
- documentar quais telas consomem cada mock.

## Filtro para ServiceOS

Nada disso sobe cru para ServiceOS.

Antes de promover:

- provar uso em tela real;
- manter ids e contratos estaveis;
- separar dado comercial de copy de UI;
- garantir que pedido, entrega, cliente e assinatura tenham donos distintos;
- transformar o contrato em ecommerce generico apenas quando outro produto tambem precisar.
