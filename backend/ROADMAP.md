# RoyalPrime Backend Roadmap

Este documento registra a virada de foco do RoyalPrime depois da validacao positiva do MVP com o cliente.

O projeto deixa de ser apenas um MVP visual para apresentacao e passa a ser tratado como um produto operacional. A prioridade agora e fazer o RoyalPrime funcionar de ponta a ponta: cliente compra, loja recebe, loja aprova, loja separa, entrega acontece, cliente acompanha e admin controla.

## Decisao de foco

Por enquanto, o RoyalPrime deve ser priorizado acima do ServiceOS.

O ServiceOS continua sendo uma referencia importante de organizacao, contratos, AppShell, shared-core, manifests e separacao de responsabilidades. Ele e um bom espelho arquitetural para manter disciplina. Mas, neste momento, ele nao deve travar a entrega nem puxar abstracoes antes de o produto real provar a necessidade.

Regra atual:

```text
RoyalPrime prova o fluxo real
  -> shared-core organiza contratos, hooks, clients e tipos locais
  -> backend vira dono das regras reais
  -> telas consomem API e estados reais
  -> ServiceOS recebe apenas o que ficar comprovadamente reutilizavel depois
```

O ServiceOS volta como segunda etapa de amadurecimento, puxando capacidades que nasceram de necessidade real no RoyalPrime.

## Branch de trabalho

```text
main
  -> MVP atual estavel, apresentavel e ainda majoritariamente mockado

feature/backend-foundation
  -> MER, backend novo, API, shared-core/hooks e conexao real
```

A evolucao de backend real deve acontecer em `feature/backend-foundation`.

Regra:

```text
Nao quebrar a main com migracao incompleta.
Mudar mocks para API de forma gradual na branch de backend.
```

## Direcao principal

O sistema precisa resolver, nesta ordem:

1. Cliente compra.
2. Loja recebe o pedido.
3. Loja aprova o pedido.
4. Loja separa o pedido.
5. Loja entrega.
6. Cliente acompanha o status.
7. Admin controla pedidos, clientes, produtos e entregas.
8. Dados ficam persistidos.
9. Pagamento entra com seguranca quando o fluxo operacional estiver firme.

## Roadmap por fases

Cada fase deve tambem alimentar a pasta `kits/`.

O objetivo dos kits e facilitar reuso futuro por IA ou desenvolvedor. Quando outro produto precisar de uma capacidade, o agente deve ler o kit, localizar os arquivos fonte e copiar/adaptar com consciencia de escopo.

Regra:

```text
Fase implementa RoyalPrime.
Kit documenta a fronteira reaproveitavel.
Outro produto usa o kit como mapa de copia/adaptacao.
```

Status possiveis:

```text
planned
  -> previsto no roadmap, ainda nao implementado

local
  -> implementado para RoyalPrime, ainda especifico

kit-ready
  -> fronteira clara para copiar/adaptar

serviceos-candidate
  -> provou reuso e pode virar capacidade formal do ServiceOS
```

Mapa inicial:

| Fase | Kits alimentados | Observacao |
| --- | --- | --- |
| Fase 1 | Auth & Users, Organizations, Catalog | Base para qualquer produto novo |
| Fase 2 | Orders | Pedido, detalhe, historico, status |
| Fase 3 | Admin Operations, Scheduling | Painel operacional, filtros, calendario |
| Fase 4 | Inventory | Estoque simples sem ERP |
| Fase 5 | Fulfillment & Delivery, Scheduling | Entrega, retirada, janela, codigo |
| Fase 6 | Payments | Pagamento manual e status |
| Fase 7 | Payments | Gateway, webhooks, conciliacao |
| Fase 8 | Wallet & Vouchers | Credito, saldo, voucher, estorno |

Primeiro kit documentado:

```text
kits/auth-users-kit.md
```

Nota de sequencia backend foundation:

```text
Fase 1 Auth & Users -> fechada
Fase 2 Catalog Runtime Foundation -> fechada
Fase 3 Plans And Subscriptions -> planejada em backend/PHASE_3_SUBSCRIPTIONS.md
```

### Fase 1: Backend Base Real

Objetivo: tirar o app do mock sem tentar resolver tudo de uma vez.

Inclui:

- autenticacao de cliente;
- autenticacao de admin;
- usuarios;
- clientes;
- enderecos;
- produtos;
- planos;
- pedidos;
- itens do pedido;
- assinatura ativa;
- ciclo da assinatura;
- status do pedido;
- painel admin basico.

Dificuldade: media.

Custo de dev: medio.

Risco principal: modelagem errada de pedidos, ciclos e assinatura.

Prioridade: maxima.

Observacao: esta fase e a fundacao. Sem ela, gateway, estoque e delivery viram retrabalho.

### Fase 2: Pedido e Acompanhamento

Objetivo: transformar a experiencia do cliente em fluxo real.

Inclui:

- criar pedido Royal Delivery;
- criar pedido ou selecao do ciclo da assinatura;
- listar meus pedidos;
- abrir detalhe do pedido;
- acompanhar timeline de status;
- gerar ou exibir codigo de entrega;
- avaliar pedido depois de entregue;
- admin aprovar pedido;
- admin alterar status: recebido, aprovado, separando, saiu para entrega e entregue.

Dificuldade: media.

Custo de dev: medio.

Prioridade: maxima.

Esta fase responde diretamente a pergunta do cliente: "o cliente pediu, para onde vai e como acompanha?"

### Fase 3: Admin Operacional

Objetivo: permitir que a loja trabalhe de verdade.

Inclui:

- pedidos recebidos;
- filtros por status;
- filtros por data;
- filtros por tipo de pedido;
- detalhe do pedido;
- atualizar status;
- calendario simples de entregas;
- pedidos de hoje;
- pedidos de amanha;
- pedidos de ciclo de assinatura;
- dados de cliente;
- endereco;
- telefone;
- observacoes operacionais.

Dificuldade: media para alta.

Custo de dev: medio/alto.

Prioridade: alta.

Observacao: aqui o sistema comeca a ser uma ferramenta de operacao, nao apenas vitrine.

### Fase 4: Estoque Simples

Objetivo: controlar disponibilidade sem criar um ERP completo.

Comecar com:

- produto ativo ou inativo;
- quantidade aproximada disponivel;
- produto limitado;
- produto indisponivel;
- bloqueio de venda quando nao houver estoque;
- ajuste manual de estoque pelo admin;
- baixa automatica quando pedido for aprovado.

Nao comecar com:

- lote;
- validade;
- camara fria;
- perda;
- fornecedor;
- nota fiscal;
- custo medio;
- inventario avancado.

Dificuldade: media se for simples; alta se tentar virar ERP.

Custo de dev: medio.

Prioridade: media/alta.

### Fase 5: Delivery Basico

Objetivo: controlar entrega internamente.

Inclui:

- status de entrega;
- previsao;
- responsavel ou entregador opcional;
- codigo de entrega;
- confirmacao de entrega;
- calendario;
- endereco;
- observacoes.

Nao comecar com:

- roteirizacao automatica;
- app do entregador;
- GPS em tempo real;
- calculo logistico avancado.

Dificuldade: media.

Custo de dev: medio.

Prioridade: media/alta.

### Fase 6: Pagamento Manual

Objetivo: permitir operacao financeira simples antes do gateway real.

Comecar com:

- pagar na entrega;
- Pix manual;
- status de pagamento;
- comprovante opcional;
- admin marca como pago;
- historico basico de pagamento.

Dificuldade: baixa/media.

Custo de dev: baixo/medio.

Prioridade: alta antes de gateway.

### Fase 7: Gateway Real

Objetivo: automatizar pagamento quando pedido, admin e status ja estiverem bem modelados.

Possibilidades:

- Mercado Pago;
- Stripe;
- Pagar.me;
- Pix automatico;
- cartao;
- webhooks;
- falha de pagamento;
- reembolso;
- recorrencia de assinatura.

Dificuldade: alta.

Custo de dev: alto.

Riscos:

- webhooks;
- conciliacao;
- falha de pagamento;
- reembolso;
- recorrencia;
- seguranca;
- suporte.

Recomendacao: nao colocar gateway como primeira prioridade. Gateway sem pedido/admin bem modelado gera retrabalho.

### Fase 8: Carteira, Creditos e Vouchers

Objetivo: permitir que o cliente tenha saldo interno na plataforma, semelhante a credito pre-pago, voucher ou carteira.

Ideia de produto:

- cliente adiciona ou recebe credito;
- saldo fica vinculado a conta;
- saldo pode ser usado em Royal Delivery;
- saldo pode ser usado em assinatura;
- saldo pode ser usado em complementos do ciclo;
- admin consegue adicionar credito;
- admin consegue debitar credito;
- admin consegue estornar credito;
- historico financeiro fica auditavel.

Possibilidades:

- carteira interna;
- voucher;
- gift card;
- credito corporativo;
- cortesia;
- cashback;
- credito por estorno;
- saldo promocional.

Entidades planejadas:

- `Wallet`;
- `WalletTransaction`;
- `Voucher`;
- `VoucherRedemption`;
- `CreditAdjustment`;
- `PaymentAllocation`.

Dificuldade: alta.

Custo de dev: medio/alto.

Prioridade: media.

Riscos:

- dinheiro exige auditoria;
- saldo nao pode sumir;
- estorno precisa ser rastreavel;
- admin precisa ter permissao clara;
- relatorios financeiros precisam bater;
- gateway futuro precisa conversar com a carteira.

Recomendacao: colocar no MER e na arquitetura desde o inicio, mas implementar depois que pedido, admin, pagamento manual e status estiverem firmes.

## Principio backend-first com visao completa

A estrategia correta agora e pensar o backend de forma completa antes de voltar forte para o frontend.

Isso nao significa implementar tudo de uma vez. Significa montar um MER e uma arquitetura que ja conhecam todas as ideias importantes que surgiram com o cliente:

- pedidos;
- clientes;
- enderecos;
- assinatura;
- ciclo;
- produtos;
- estoque;
- delivery;
- pagamento;
- gateway;
- carteira;
- vouchers;
- creditos;
- auditoria;
- admin operacional.

Regra:

```text
MER completo o suficiente para o produto real
+ implementacao faseada para controlar custo e risco
```

O backend deve nascer preparado para o futuro, mesmo que os endpoints sejam liberados em etapas. O frontend deve evoluir depois em cima de contratos e hooks, evitando telas com regra propria.

Exemplo:

```text
Modelar Wallet e WalletTransaction no MER
  -> nao precisa lancar carteira no MVP inicial
  -> mas evita redesenhar pagamentos e pedidos depois
```

Esse pensamento vale para estoque, gateway, assinatura e delivery. O produto precisa ser estruturado como sistema real desde o comeco, mesmo com entregas incrementais.

## Principio tenant-ready

O backend do RoyalPrime deve nascer pensando em um futuro multi-organizacao, mas sem virar ServiceOS completo agora.

A ideia e simples:

```text
Hoje existe 1 organizacao: RoyalPrime / Royal Carnes
Futuramente podem existir N organizacoes: assinatura de peixe, ecommerce de camisa, clube de vinho, etc.
```

Por isso, a maioria das entidades operacionais deve ter `organizationId` desde o inicio.

Exemplos:

- cliente;
- endereco;
- produto;
- categoria;
- plano;
- assinatura;
- ciclo;
- pedido;
- item do pedido;
- entrega;
- pagamento;
- estoque;
- carteira;
- voucher;
- usuario admin;
- configuracoes comerciais.

O objetivo nao e construir uma plataforma white-label completa agora. O objetivo e evitar que o backend fique preso demais em "Royal Carnes" e precise ser refeito quando surgir outro produto parecido.

Regra:

```text
Core ecommerce/assinatura generico
+ dados, marca, copy e regras comerciais por organization
+ RoyalPrime como primeira organization
```

Na pratica:

- `Organization` existe desde o MER;
- `organizationId` e obrigatorio nas tabelas de negocio;
- queries sempre filtram por `organizationId`;
- seeds criam `organizationId = royalprime`;
- admin atual trabalha dentro da organization RoyalPrime;
- frontend atual nao precisa escolher organization;
- multi-organization real fica para depois.

O que entra agora:

- modelagem preparada;
- campo `organizationId`;
- ownership claro;
- seeds por organization;
- contratos pensando em organization.

O que nao entra agora:

- painel para criar organizacoes;
- billing de organizacoes;
- permissao complexa multiempresa;
- builder white-label completo;
- marketplace de tenants;
- ServiceOS como runtime obrigatorio.

Essa abordagem permite que o RoyalPrime seja o primeiro produto real e, ao mesmo tempo, deixe o caminho aberto para reutilizar o backend em outros negocios de ecommerce e assinatura.

Frase guia:

```text
RoyalPrime e a primeira organizacao, nao o unico formato possivel do backend.
```

## Principio seed-driven e config-driven

O backend deve ser desenhado para que o comportamento principal venha de entidades genericas e dados configuraveis, nao de classes hardcoded para Royal Carnes.

A ideia e chegar perto deste fluxo:

```text
Amanha surge um ecommerce/assinatura de bicicleta
  -> reaproveita o backend core
  -> cria uma nova organization
  -> popula seeds/configs de bicicleta
  -> ajusta env, banco, dominio e deploy
  -> frontend troca dados/copy/tema aos poucos
```

O ideal nao e que o codigo tenha `Plano Pro`, `Plano Essential`, `Picanha`, `Fraldinha` ou `Royal Pro` como regra tecnica fixa. O ideal e:

```text
Plan e uma entidade
Product e uma entidade
Category e uma entidade
Subscription e uma entidade
Order e uma entidade
Delivery e uma entidade
Wallet e uma entidade
Voucher e uma entidade
```

O que muda por negocio entra como seed/config:

- organizacao;
- marca;
- categorias;
- produtos;
- planos;
- precos;
- limites;
- recorrencia;
- regioes de entrega;
- metodos de pagamento ativos;
- regras comerciais;
- vouchers;
- creditos;
- copy;
- imagens;
- tema;
- dominio;
- variaveis de ambiente.

Exemplo RoyalPrime:

```text
Organization: royalprime
Categories: Cortes do dia a dia, Cortes premium, Carvao, Temperos
Plans: Basic, Premium, Pro
Products: Fraldinha, Maminha, Picanha, Ancho
Rules: limite de cortes, limite de peso, ciclo mensal, delivery refrigerado
```

Exemplo assinatura de bicicleta:

```text
Organization: bikeclub
Categories: Bicicletas, Capacetes, Acessorios, Manutencao
Plans: Urbano, Performance, Pro
Products: Bike urbana, Bike speed, Capacete, Kit reparo
Rules: limite de itens por ciclo, revisao mensal, entrega ou retirada
```

Nesse exemplo, o backend nao muda de conceito. O que muda e o seed/config da organization.

Regra de arquitetura:

```text
Codigo define capacidades genericas
Seed/config define o negocio
Frontend apresenta a organization ativa
```

Isso e diferente de transformar o RoyalPrime em ServiceOS agora. O objetivo e fazer um backend com bom nivel de abstracao de dados, capaz de ser reaproveitado para outro ecommerce/assinatura com pouco retrabalho.

Limite pragmatico:

- backend deve nascer mais abstrato;
- MER deve considerar todas as ideias conhecidas;
- seeds devem carregar o negocio;
- frontend pode continuar mais especifico no inicio;
- frontend vai migrando aos poucos para consumir organization/config;
- ServiceOS completo fica para depois.

Frase guia:

```text
O backend e o corpo reutilizavel; o seed/config veste esse corpo para cada negocio.
```

## Ordem recomendada

```text
1. Backend foundation
2. Cliente: autenticacao, conta e pedidos
3. Admin: pedidos recebidos e mudanca de status
4. Assinatura: ciclo mensal e limites
5. Delivery: calendario, status e codigo
6. Estoque simples
7. Pagamento manual
8. Carteira, creditos e vouchers
9. Gateway real
10. Estoque avancado e logistica avancada
11. Extracao futura para ServiceOS
```

## Tree sugerida

A tree abaixo e pensada para o RoyalPrime, mas usando a organizacao do ServiceOS como espelho. O objetivo nao e copiar o ServiceOS inteiro agora; e manter a mesma disciplina de ownership, contratos e separacao.

```text
backend/
  apps/
    organizations/
    accounts/
    customers/
    catalog/
    orders/
    subscriptions/
    deliveries/
    payments/
    wallets/
    vouchers/
    inventory/
    admin_portal/
  core/
    settings/
    database/
    auth/
    common/
  api/
    v1/

frontend/
  client/
    shared-core/
      api/
      hooks/
      contracts/
      mocks/
      mappers/
    web/
      src/screens/
      src/product-components/ecommerce/

  admin/
    shared-core/
      api/
      hooks/
      contracts/
      mocks/
    web/
```

## Papel do shared-core

O `shared-core` deve deixar de ser apenas deposito de mocks e virar a camada local de contrato do RoyalPrime.

Responsabilidades esperadas:

- tipos compartilhados;
- DTOs;
- contratos de API;
- hooks;
- clients HTTP;
- mappers entre API e UI;
- mocks temporarios enquanto endpoints nao existem;
- seeds alinhadas aos mocks atuais.

Regra:

```text
Screen nao deve conhecer regra de backend.
Screen consome hook/client.
Hook/client fala com API.
API aplica regra real.
```

## Papel do backend

O backend passa a ser o dono das regras reais:

- limite de plano;
- organizacao;
- isolamento por organizationId;
- ciclo da assinatura;
- saldo de cortes;
- saldo de peso;
- status de pedido;
- status de entrega;
- disponibilidade de produto;
- validacao de endereco;
- pagamento;
- carteira interna;
- vouchers;
- creditos;
- transacoes financeiras;
- permissao de admin;
- auditoria;
- historico.

O frontend pode simular durante a transicao, mas a regra final deve sair da screen.

## Custos e dificuldade por bloco

| Bloco | Dificuldade | Custo de dev | Prioridade | Observacao |
| --- | --- | --- | --- | --- |
| Backend foundation | Media | Medio | Maxima | Base para tudo |
| Pedido e acompanhamento | Media | Medio | Maxima | Coracao do fluxo apresentado |
| Admin operacional | Media/alta | Medio/alto | Alta | Loja precisa trabalhar por aqui |
| Assinatura e ciclo | Media/alta | Medio/alto | Alta | Regras de limite e recorrencia |
| Delivery basico | Media | Medio | Media/alta | Sem GPS ou roteirizacao no inicio |
| Estoque simples | Media | Medio | Media/alta | Evitar ERP no MVP |
| Pagamento manual | Baixa/media | Baixo/medio | Alta | Melhor antes do gateway |
| Carteira, creditos e vouchers | Alta | Medio/alto | Media | Modelar cedo, implementar depois |
| Gateway real | Alta | Alto | Media | Fazer depois da modelagem firme |
| Estoque avancado | Alta | Alto | Baixa no inicio | So depois de operacao real |
| Logistica avancada | Alta | Alto | Baixa no inicio | Nao iniciar por aqui |

## Riscos principais

### Tentar plataforma cedo demais

Risco: perder tempo construindo ServiceOS ou Foundation antes do RoyalPrime pagar a necessidade.

Mitigacao: manter tudo local no RoyalPrime ate haver repeticao real.

### Gateway cedo demais

Risco: webhooks, falhas, recorrencia e conciliacao criarem retrabalho se pedido/status/admin ainda nao estiverem bem definidos.

Mitigacao: pagamento manual primeiro; gateway depois.

### Estoque virar ERP

Risco: escopo explodir.

Mitigacao: iniciar com disponibilidade simples e baixa manual/automatica basica.

### Admin virar dashboard bonito sem operacao

Risco: mostrar metricas mas nao permitir trabalhar.

Mitigacao: priorizar lista de pedidos, detalhe, status, calendario e contato do cliente.

## Regra de promocao futura para ServiceOS

Nada deve subir cru para o ServiceOS.

Promover apenas quando:

- a capacidade foi usada em fluxo real;
- a regra nao e especifica do RoyalPrime;
- existe contrato claro;
- existe pelo menos um segundo uso provavel;
- o componente ou hook ja foi simplificado no produto;
- a extracao reduz complexidade, nao aumenta.

Exemplos de candidatos futuros:

- contrato generico de pedido ecommerce;
- timeline de pedido;
- card de produto com limites;
- hooks de catalogo;
- hooks de pedidos;
- AppShell ecommerce;
- padrao de admin para lista/detalhe/status.

## Plano de trabalho imediato

Antes de implementar backend de fato, a proxima rodada deve organizar a base do produto. A ordem recomendada e:

### 1. Rever organizacao e tree do RoyalPrime

Objetivo: decidir onde cada coisa mora agora que o foco e produto real.

Revisar:

- `backend/`;
- `frontend/client/shared-core`;
- `frontend/admin/shared-core`;
- `api/`;
- `hooks/`;
- `contracts/`;
- `mappers/`;
- `mocks/`;
- `modules/`;
- `product-components/ecommerce`.

Resultado esperado:

```text
Tree proposta do produto
+ ownership de cada pasta
+ regra de onde nasce backend, hook, contrato, mock e screen
```

### 2. Definir backend foundation

Objetivo: escolher a base tecnica antes de sair codando.

Definir:

- stack;
- estrutura de apps;
- autenticacao;
- banco;
- padrao de API;
- seeds;
- migrations;
- ambiente local;
- organizacao de settings;
- convencao de nomes.

Resultado esperado:

```text
Backend foundation documentado
+ primeira tree de backend
+ plano de setup local
```

### 3. Montar o MER

Objetivo: modelar o sistema antes da migracao dos mocks.

Entidades iniciais:

- organizacao;
- cliente;
- usuario/admin;
- endereco;
- produto;
- categoria;
- plano;
- assinatura;
- ciclo da assinatura;
- pedido;
- item do pedido;
- entrega;
- pagamento;
- estoque;
- carteira;
- transacao de carteira;
- voucher;
- uso de voucher;
- ajuste de credito;
- auditoria.

Resultado esperado:

```text
MER inicial
+ entidades
+ relacionamentos
+ campos principais
+ regras de ownership
```

### 4. Transformar mocks em contratos

Objetivo: decidir o que cada mock vira no sistema real.

Cada mock deve ser classificado como:

- entidade;
- DTO;
- response de API;
- seed;
- tipo compartilhado;
- dado temporario de UI;
- dado que deve morrer depois do backend.

Resultado esperado:

```text
Mapa mock -> contrato/API/seed
```

### 5. Criar camada de API e hooks

Objetivo: evitar tela chamando regra diretamente.

Hooks/clientes esperados:

- `apiClient`;
- `useCustomer`;
- `useAddresses`;
- `useProducts`;
- `useOrders`;
- `useSubscriptionCycle`;
- `useAdminOrders`;
- `useAdminProducts`;
- `useAdminCustomers`.

Resultado esperado:

```text
shared-core/api
shared-core/hooks
shared-core/contracts
shared-core/mappers
```

### 6. Comecar migracao real

Comecar por leitura antes de escrita:

1. produtos;
2. cliente;
3. enderecos;
4. assinatura ativa;
5. ciclo ativo;
6. pedidos.

Depois migrar escrita:

1. criar pedido;
2. alterar status no admin;
3. editar ciclo da assinatura;
4. ajustar estoque;
5. pagamento manual.

Regra:

```text
Nao implementar backend antes de fechar tree e MER.
Nao conectar screen direto em endpoint sem hook/client.
Nao promover nada para ServiceOS antes do RoyalPrime provar o fluxo.
```

Documento sugerido para a proxima rodada:

```text
frontend/client/web/docs/ROYALPRIME_BACKEND_FOUNDATION_PLAN.md
```

Esse documento deve conter:

- tree final proposta;
- MER;
- entidades;
- responsabilidades;
- endpoints iniciais;
- plano de migracao dos mocks;
- ordem de implementacao.

## Resumo executivo

O RoyalPrime agora deve ser tratado como produto principal.

O ServiceOS continua sendo um bom espelho de organizacao, mas nao deve ser o centro da execucao. A execucao agora e RoyalPrime-first: backend, pedidos, admin, assinatura, delivery, estoque simples e pagamento manual. Depois, com o produto real validado, o ServiceOS pode absorver as capacidades que se provarem reutilizaveis.
