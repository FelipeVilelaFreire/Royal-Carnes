# Montar Box: fluxos comerciais e matriz de testes

Status: mapa de validacao. Ele descreve o comportamento implementado em
2026-09-20; nao substitui testes de navegador, dispositivo ou homologacao.

## 1. Os tres modos

O Checkout separa a decisao comercial da etapa visual:

```text
selectedMode -> assinatura | Royal Box | Royal Delivery
currentStep  -> montagem | entrega | pagamento | resumo
```

| Modo no Portal | Tipo de pedido no backend | Para que serve | Estado atual |
| --- | --- | --- | --- |
| Assinatura | `subscription-cycle` | Cliente com assinatura e ciclo abertos monta os itens permitidos daquele ciclo. | Parcialmente integrado |
| Royal Box | `royal-box` | Cliente monta uma caixa avulsa com os produtos que escolher. | Integrado para criacao de pedido |
| Royal Delivery | `delivery` | Cliente faz um pedido avulso para entrega. | Integrado para criacao de pedido |

Os tres tipos de pedido sao configurados no seed por `OrderKindDefinition`.
Todos calculam preco e reservam estoque no backend; todos criam uma Entrega
quando o tipo estiver configurado com `createsDelivery`.

## 2. Fluxo de cada modo

### Assinatura

```text
Admin cria plano
  -> Admin vincula assinatura ao cliente
  -> backend abre ciclo
  -> Cliente escolhe Assinatura
  -> Client le assinatura e ciclo atual
  -> Cliente monta itens dentro das capacidades
  -> POST pedido subscription-cycle com subscription_id e cycle_id
  -> backend valida capacidade, estoque e cria Pedido + Entrega
```

O backend exige `subscription_id` e `subscription_cycle_id` coerentes para
`subscription-cycle`. Portanto, o Checkout atual nao contrata uma assinatura
nova: ele apenas monta o pedido de um ciclo ja existente. A contratacao pelo
cliente e uma lacuna funcional, pois o Client possui leitura de planos, mas
nao possui endpoint de criacao de assinatura/ciclo.

### Royal Box

```text
Cliente escolhe Royal Box
  -> seleciona produtos e quantidades
  -> escolhe endereco, pagamento e revisa
  -> POST pedido royal-box
  -> backend calcula preco, reserva estoque e cria Pedido + Entrega
  -> Portal abre Meus Pedidos
  -> Admin opera o Pedido; Entrega espelha seu status
```

Royal Box e avulsa: nao envia assinatura nem ciclo e nao aplica capacidades de
plano. O servidor continua validando produto, variante, modalidade e estoque.

### Royal Delivery

```text
Cliente escolhe Royal Delivery
  -> seleciona produtos e quantidades
  -> escolhe endereco, frete e meio de pagamento permitido
  -> POST pedido delivery
  -> backend calcula preco, reserva estoque e cria Pedido + Entrega
  -> Portal abre Meus Pedidos
  -> Admin opera o Pedido; Entrega espelha seu status
```

No V1, Pix e contato por WhatsApp podem ser apresentados conforme a
configuracao do backend; pagar na entrega depende de permissao na configuracao.
Nao existe autorizacao automatica de cartao ou cobranca recorrente neste fluxo.

## 3. Camadas de teste

Cada modo deve atravessar as mesmas camadas. Passar numa camada nao prova a
proxima.

| Camada | Pergunta que responde | Evidencia esperada |
| --- | --- | --- |
| Seed e configuracao | Os modos, produtos, variantes, estoque e planos existem e se relacionam? | `seed_backend --seed royalprime` e leitura dos registros criados |
| Backend | O servidor aceita o payload valido e rejeita o invalido? | testes de Orders, Inventory e Subscriptions; resposta HTTP e efeito no banco |
| Shared-core | O payload enviado corresponde ao modo escolhido? | `kindKey`, itens, endereco e, na assinatura, IDs de assinatura/ciclo corretos |
| Portal Web | O usuario consegue concluir sem estado falso? | teste manual desktop e webIsMobile, pedido aparece em Meus Pedidos |
| Portal Native | O mesmo contrato funciona no renderer nativo? | teste em dispositivo ou emulador, sem assumir paridade por build |
| Admin | O pedido criado aparece, pode ter status alterado e sincroniza a entrega? | Pedido + Entrega vinculada, historico do pedido e status espelhado |
| Regressao | Erros nao viram sucesso visual? | estoque insuficiente, capacidade excedida, endereco ausente e permissao negada exibem erro real |

## 4. Roteiro de homologacao

### Royal Box e Royal Delivery

1. Entrar com cliente que possua endereco salvo.
2. Selecionar o modo e adicionar uma variante com estoque.
3. Definir endereco e um meio de pagamento permitido.
4. Finalizar e conferir codigo retornado e redirecionamento para Meus Pedidos.
5. Abrir o mesmo pedido no Admin e conferir tipo, itens, total, endereco e
   entrega vinculada.
6. Alterar o status no Pedido e confirmar que a Entrega apenas o espelha.
7. Repetir com estoque insuficiente; nenhum Pedido, Entrega ou reserva parcial
   pode ser persistido.

### Assinatura de ciclo existente

1. Criar no Admin uma assinatura ativa e um ciclo aberto para o cliente.
2. Conferir no Portal que assinatura, ciclo e capacidades foram carregados.
3. Selecionar produtos dentro da capacidade e finalizar.
4. Conferir Pedido `subscription-cycle` com assinatura e ciclo corretos.
5. Tentar exceder capacidade e conferir rejeicao real no backend e feedback no
   Portal.
6. Repetir com produto sem estoque; o ciclo e a reserva nao podem ficar
   parcialmente alterados.

### Contratacao de nova assinatura

Nao homologar como fluxo pronto. O teste esperado hoje e de lacuna: selecionar
um plano no Checkout nao deve ser apresentado como assinatura criada, porque
nao existe comando Client -> API -> backend para criar a assinatura e seu
ciclo. O proximo corte precisa definir pagamento, criacao da assinatura,
primeiro ciclo e retorno ao cliente antes de expor essa promessa como concluida.

## 5. Donos do fluxo

```text
backend
  -> regras de pedido, preco, estoque, capacidade, assinatura, ciclo e Entrega

client/shared-core
  -> contrato, APIs, useClientCheckout, mapper e estado de loading/erro

checkout.config.ts
  -> mapeia modo para kindKey e declara etapas

Portal Web e Native
  -> renderizam estado e disparam callbacks

Admin
  -> opera Pedido; Entrega e leitura logistica vinculada
```

Arquivos de referencia:

```text
frontend/client/shared-core/manifest/checkout.config.ts
frontend/client/shared-core/hooks/useClientCheckout.ts
frontend/client/shared-core/api/subscriptions.api.ts
backend/apps/orders/services.py
backend/apps/subscriptions/urls.py
backend/API_CONTRACTS.md
```

## 6. Proximo corte recomendado

1. Homologar Royal Box e Royal Delivery ponta a ponta, incluindo Admin.
2. Homologar Assinatura apenas para cliente com assinatura e ciclo existentes.
3. Especificar e implementar separadamente a contratacao de assinatura nova.
4. Depois, executar o roteiro completo em Web, webIsMobile e Native e registrar
   evidencias por modo.
