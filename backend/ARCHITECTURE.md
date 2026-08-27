# RoyalPrime Backend Architecture Rules

Este documento substitui a arquitetura antiga do backend. O backend novo deve nascer do MER do RoyalPrime, nao do codigo Django anterior.

## Principios

### Ordem central do produto

Todo fluxo do RoyalPrime deve obedecer a separacao abaixo:

```text
backend
  -> regra real, persistencia, validacao, autorizacao, calculo e auditoria

frontend/*/shared-core
  -> contratos, DTOs, API clients, hooks, mappers e estado reutilizavel do fluxo dentro do escopo correto

frontend/*/web | frontend/*/mobile | frontend/*/admin/web
  -> renderizacao, layout, inputs, botoes, modais e chamadas aos hooks
```

Regra curta:

```text
Regra mora no backend.
Fluxo reutilizavel mora no shared-core do escopo correto.
Tela apenas apresenta e dispara acao.
```

`shared-core` nao significa automaticamente "global para tudo". Ele significa que o fluxo saiu da camada visual e pode ser reutilizado no escopo em que faz sentido:

```text
frontend/client/shared-core
  -> fluxos reutilizaveis entre cliente web e cliente mobile

frontend/admin/shared-core
  -> fluxos reutilizaveis dentro do admin

frontend/shared-core
  -> somente contratos/capacidades realmente comuns entre client, mobile e admin
```

Exemplos:

- carrinho do cliente, montagem de assinatura e meus pedidos do cliente ficam primeiro em `frontend/client/shared-core`;
- aprovar pedido, mudar status operacional e filtrar pedidos do painel ficam primeiro em `frontend/admin/shared-core`;
- tipos base como `OrderStatus`, `Money`, `OrganizationId`, `Address` ou contratos realmente iguais para client/admin podem subir para `frontend/shared-core`;
- se so uma screen usa o fluxo, ele pode ficar local na screen ou em `modules/` ate surgir reuso real.

Exemplo simples: adicionar produto ao pedido.

```text
backend/orders/addOrderItem
  -> valida organizationId
  -> valida cliente ou admin autorizado
  -> valida produto
  -> valida estoque
  -> valida limite do plano ou modalidade comercial
  -> calcula peso, quantidade, preco e saldo do ciclo
  -> salva o item
  -> retorna o pedido atualizado

frontend/client/shared-core/contracts/order.contract.ts
  -> define Order, OrderItem e AddOrderItemInput

frontend/client/shared-core/api/orders.api.ts
  -> chama POST /orders/:orderId/items

frontend/client/shared-core/hooks/useOrderCart.ts
  -> expoe addProduct(productId)
  -> controla loading, erro e estado do fluxo
  -> chama orders.api

frontend/client/web/src/screens/portal/tabs/PedidoView.tsx
  -> renderiza ProductItemCard
  -> renderiza botao Adicionar
  -> no click chama addProduct(product.id)
```

Proibido:

- screen calcular limite de plano;
- screen decidir disponibilidade de estoque;
- screen montar regra comercial complexa;
- screen salvar dado diretamente;
- admin/web duplicar regra que ja existe no client/shared-core ou no backend;
- web/mobile/admin chamar endpoint direto sem passar por shared-core quando o fluxo for reutilizavel.
- mover fluxo para `frontend/shared-core` global antes de comprovar que client/admin/mobile usam o mesmo contrato.

Permitido na screen:

- estado visual local;
- modal aberto ou fechado;
- aba ativa;
- input controlado;
- selecao temporaria;
- chamada para hook do shared-core.

### Produto primeiro

O RoyalPrime e o produto-foco. O backend deve resolver o fluxo real:

```text
cliente compra
loja recebe
loja aprova
loja separa
entrega acontece
cliente acompanha
admin controla
dados ficam salvos
pagamento entra quando fizer sentido
```

### Tenant-ready desde o MER

Mesmo com apenas uma loja hoje, o backend deve nascer preparado para mais de uma organizacao.

Regra:

```text
Organization existe desde o inicio.
Entidades de negocio carregam organizationId.
Queries filtram por organizationId.
Seeds criam a organizacao RoyalPrime.
```

Isso nao significa criar ServiceOS completo agora. Significa evitar um backend preso demais em Royal Carnes.

### Seed-driven e config-driven

O codigo deve definir capacidades genericas. O negocio ativo deve vir de seed/config.

Exemplos de entidades genericas:

- `Organization`;
- `Customer`;
- `Address`;
- `Product`;
- `Category`;
- `Plan`;
- `Subscription`;
- `SubscriptionCycle`;
- `Order`;
- `OrderItem`;
- `Delivery`;
- `Payment`;
- `Wallet`;
- `Voucher`;
- `InventoryItem`;
- `AuditLog`.

O que muda por negocio:

- marca;
- categorias;
- produtos;
- planos;
- precos;
- limites;
- recorrencia;
- regioes de entrega;
- metodos de pagamento;
- copy;
- imagens;
- tema;
- dominio;
- variaveis de ambiente.

### RoyalPrime como primeira organizacao

RoyalPrime deve ser a primeira organizacao do backend, nao um conjunto de regras hardcoded.

Exemplo:

```text
Organization: royalprime
Plans: Basic, Premium, Pro
Products: Fraldinha, Maminha, Picanha, Ancho
Rules: limite de cortes, limite de peso, ciclo mensal, delivery refrigerado
```

Outro produto futuro deveria trocar principalmente seed/config, nao a estrutura core.

### Backend antes do frontend real

O frontend pode continuar mockado enquanto o MER nasce. Quando o backend existir, as telas nao devem chamar endpoints direto.

Fluxo esperado:

```text
screen
  -> shared-core hook
  -> shared-core api client
  -> backend API
  -> regra real
```

### Nada sobe cru para ServiceOS

O ServiceOS continua como espelho arquitetural, mas a promocao futura so acontece depois de uso real.

Promover apenas quando:

- a capacidade foi validada no RoyalPrime;
- a regra nao e especifica do RoyalPrime;
- o contrato esta claro;
- existe chance real de segundo uso;
- a extracao reduz complexidade.

## O que nao fazer agora

- Nao restaurar o backend antigo como base.
- Nao implementar gateway antes de pedido/admin/status estarem firmes.
- Nao transformar estoque em ERP no MVP.
- Nao colocar regra comercial RoyalPrime hardcoded no codigo core.
- Nao conectar screen direto em endpoint.
- Nao promover para ServiceOS antes do fluxo real provar reuso.

## Ordem antes de codar

1. Fechar tree.
2. Fechar MER.
3. Definir entidades e relacionamentos.
4. Definir seeds/configs iniciais.
5. Definir contratos e DTOs.
6. Definir endpoints.
7. Criar backend foundation.
8. Migrar frontend por hooks.
