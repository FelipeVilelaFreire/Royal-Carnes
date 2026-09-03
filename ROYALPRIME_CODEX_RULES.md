# RoyalPrime Codex Rules

Este documento resume as regras praticas para trabalhar no RoyalPrime sem perder a direcao do produto.

## Leitura Obrigatoria

Ao entrar no projeto, leia:

1. `AGENTS.md`
2. `ROYALPRIME_ARCHITECTURE_CONTRACT.md`
3. `docs/CODEX_ENTRYPOINTS.md`
4. `backend/ROADMAP.md`
5. `backend/ARCHITECTURE.md`
6. `docs/frontend/TREE.md`
7. `docs/kits/README.md`

## Produto-Foco

RoyalPrime e o produto principal agora.

O objetivo e entregar um sistema real para:

1. cliente comprar;
2. loja receber;
3. loja aprovar;
4. loja separar;
5. entrega acontecer;
6. cliente acompanhar;
7. admin controlar;
8. dados ficarem persistidos;
9. pagamento entrar quando fizer sentido.

ServiceOS continua como espelho arquitetural, nao como bloqueio.

## Estrategia de Branches

```text
main
  -> MVP atual estavel, apresentavel e ainda majoritariamente mockado

feature/backend-foundation
  -> trabalho novo de MER, backend, API, shared-core/hooks e conexao real
```

Depois que `feature/backend-foundation` existir, a evolucao de backend real deve acontecer nela.

Nao quebrar a `main` com migracao incompleta de backend. A `main` deve continuar como base estavel do MVP visual.

Na branch de backend, substituir mocks aos poucos:

```text
mock
  -> contrato
  -> api client
  -> hook
  -> endpoint real
  -> screen render-only
```

## Regra Central de Implementacao

```text
backend
  -> regra real, banco, validacao, autorizacao, calculo, auditoria

shared-core do escopo correto
  -> contratos, DTOs, API clients, hooks, mappers, view-models, manifest e mocks temporarios

web/mobile/admin
  -> renderizacao, layout, inputs, botoes, modais, chamada dos hooks

foundation
  -> visual-only: design system, primitives, AppShell, tokens e componentes visuais genericos
```

Regra curta:

```text
Regra mora no backend.
Fluxo reutilizavel mora no shared-core do escopo correto.
Tela apenas apresenta e dispara acao.
Foundation nao conhece regra de produto.
```

## Tres Camadas De Reuso

O RoyalPrime deve evoluir com tres formas diferentes de reuso.

```text
backend
  -> reutilizavel por seed/config
  -> entidades e services genericos
  -> RoyalPrime, PeixeClub ou CamisaClub trocam dados, nao o core

frontend/*/shared-core
  -> reutilizavel por funcao/kit
  -> hooks, API clients, DTOs, mappers e view-models podem ser copiados/adaptados
  -> nao dependem de JSX nem de uma tela especifica

frontend/*/web e frontend/*/mobile
  -> render-only por padrao
  -> hoje podem ter hardcode de transicao
  -> aos poucos devem ser guiados por manifest, locale, navigation e config
```

Exemplo:

```text
Assinatura de carne
Assinatura de peixe
Assinatura de camisa

backend
  -> mesmo app de subscriptions, plans, entitlements e cycles
  -> muda seed/config da organization

client/shared-core/kits/subscriptions
  -> mesmo useSubscription/usePlans/useCurrentCycle
  -> muda endpoint/config/mapper quando necessario

client/web ou client/mobile
  -> renderiza pelo hook e por manifest/locale
  -> nao calcula regra de assinatura
```

Regra:

```text
backend reutiliza por seed
shared-core reutiliza por kit
web/native reutiliza por manifest/render
```

## Exemplo Canonico: Adicionar Item

Use este exemplo para decidir onde colocar codigo quando uma tela precisa
adicionar um produto, item ou entidade a uma lista.

Fluxo correto:

```text
frontend/client/web/src/...
  -> renderiza botao/card/lista
  -> onClick chama uma action do hook
  -> nao monta regra comercial

frontend/client/shared-core/kits/checkout ou orders
  -> documenta a capacidade
  -> define fronteira: adicionar item ao carrinho/pedido

frontend/client/shared-core/hooks/useOrderCart.ts ou useCheckout.ts
  -> expoe addItem(productId, options)
  -> controla loading, erro e estado reutilizavel
  -> chama api client

frontend/client/shared-core/api/orders.api.ts
  -> monta payload no contrato do backend
  -> chama endpoint real

frontend/client/shared-core/mappers
  -> converte DTO do backend para view-model quando necessario

backend
  -> valida organization
  -> valida produto
  -> valida estoque
  -> valida limite do plano/ciclo
  -> calcula preco, peso e quantidade
  -> persiste Order/OrderItem
  -> retorna DTO atualizado
```

Na tela, o padrao esperado e simples:

```tsx
<Button onClick={() => orderActions.addItem(product.id)}>
  {strings.add}
</Button>
```

O que NUNCA fazer:

```text
screen calcular se o produto pode entrar no plano
screen decidir estoque disponivel
screen calcular preco final persistido
screen montar payload divergente do backend
screen chamar fetch direto quando houver fluxo reutilizavel
shared-core global receber essa logica antes de client/admin/mobile provarem o mesmo contrato
locale guardar regra como limite, preco, status permitido ou estoque
```

Regra de escopo:

```text
pedido do cliente nasce em frontend/client/shared-core/kits/orders ou checkout
operacao admin nasce em frontend/admin/shared-core/kits/orders ou inventory
global so recebe tipos base realmente compartilhados
```

## Como Decidir Onde Algo Mora

### Backend

Coloque no backend quando for:

- validacao real;
- calculo de preco, peso, limite, saldo ou estoque;
- regra de assinatura;
- regra de pedido;
- status de pedido ou entrega;
- pagamento;
- carteira, credito ou voucher;
- permissao;
- auditoria;
- persistencia.

### Client Shared-Core

Use `frontend/client/shared-core` quando o fluxo for reutilizavel entre cliente web e cliente mobile.

Exemplos:

- carrinho do cliente;
- montagem do ciclo da assinatura;
- meus pedidos;
- conta do cliente;
- enderecos do cliente;
- pagamentos do cliente;
- catalogo consumido pelo cliente.

### Admin Shared-Core

Use `frontend/admin/shared-core` quando o fluxo for reutilizavel dentro do admin.

Exemplos:

- listar pedidos recebidos;
- aprovar pedido;
- mudar status;
- filtrar por data/status/tipo;
- editar produto;
- ajustar estoque;
- ver cliente/endereco/telefone.

### Frontend Shared-Core Global

Use `frontend/shared-core` apenas quando o contrato for realmente comum entre client, mobile e admin.

Exemplos possiveis:

- `OrganizationId`;
- `Money`;
- `Address`;
- `OrderStatus`;
- `PaymentStatus`;
- contratos base iguais para todas as surfaces.

Nao promova para global por previsao abstrata.

### Web, Mobile e Admin Web

Use tela/render quando for:

- layout;
- responsivo;
- card;
- modal;
- botao;
- input;
- tabela;
- estado visual local;
- aba ativa;
- chamada para hook.

Tela nao deve calcular regra de negocio.

## Frontend Render-Only

O frontend deve ser o mais render-only possivel.

Permitido na screen:

- abrir/fechar modal;
- controlar input;
- mostrar loading/erro;
- trocar aba;
- chamar hook;
- renderizar lista recebida.

Proibido na screen:

- calcular limite de plano;
- decidir estoque;
- calcular preco final;
- validar regra de assinatura;
- persistir dado direto;
- montar regra comercial complexa;
- duplicar regra do backend.
- chamar `fetch` direto para fluxo reutilizavel.

## Config e Manifest

Sempre que possivel, comportamento editavel ou variacao de produto deve nascer em config/manifest.

O caminho e gradual. Nao precisa parar o produto para abstrair tudo de uma vez.
Quando tocar em uma tela hardcoded, mova o que for claramente configuravel para
o shared-core/manifest do escopo correto.

Exemplos:

- labels de etapa;
- status exibidos;
- abas;
- filtros;
- campos visiveis;
- modalidades comerciais;
- limites visuais;
- navegacao;
- AppShell.
- screen types como ListPage, DetailPage, FormPage e DashboardPage;
- colunas, filtros, acoes e estados vazios de admin.

O objetivo e permitir que RoyalPrime seja a primeira configuracao real, sem prender o codigo a Royal Carnes para sempre.

## Shared-Core Como Kits

Todo shared-core deve ser pensado por capacidade/kit.

```text
frontend/shared-core/kits
  -> identity, organization, money, address, manifest

frontend/client/shared-core/kits
  -> auth, customer, catalog, subscriptions, orders, deliveries, checkout

frontend/admin/shared-core/kits
  -> auth, users, customers, catalog, subscriptions, inventory, orders, deliveries, dashboard
```

Regra:

```text
kit descreve capacidade e fronteira de reuso
contracts/api/hooks/mappers/view-models implementam o fluxo
surface renderiza
backend decide regra real
```

## Backend Reutilizavel

O backend deve ser pensado para mais de uma organizacao desde o MER.

Exemplo:

```text
Hoje:
  Organization = royalprime
  Produtos = carnes, carvao, temperos, utensilios
  Planos = Basic, Premium, Pro

Amanha:
  Organization = bikeclub
  Produtos = bicicletas, capacetes, acessorios, manutencao
  Planos = Urbano, Performance, Pro
```

O codigo core deve continuar o mesmo. O que muda e seed/config, ambiente, dominio, tema, copy e dados.

## ServiceOS

Nada sobe cru para ServiceOS.

So promover quando:

- nasceu de necessidade real no RoyalPrime;
- nao e regra especifica do RoyalPrime;
- tem contrato claro;
- reduz complexidade;
- tem chance real de segundo uso.

## Validacao

- Alterou client web: rodar build do client.
- Alterou admin web: rodar build do admin.
- Alterou apenas docs: nao precisa build.

## Git

Nao fazer reset, checkout, clean, commit ou push sem autorizacao explicita.
