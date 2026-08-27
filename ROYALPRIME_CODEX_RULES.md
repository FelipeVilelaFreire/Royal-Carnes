# RoyalPrime Codex Rules

Este documento resume as regras praticas para trabalhar no RoyalPrime sem perder a direcao do produto.

## Leitura Obrigatoria

Ao entrar no projeto, leia:

1. `AGENTS.md`
2. `ROYALPRIME_ARCHITECTURE_CONTRACT.md`
3. `backend/ROADMAP.md`
4. `backend/ARCHITECTURE.md`

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
  -> contratos, API clients, hooks, mappers, fluxo reutilizavel

web/mobile/admin
  -> renderizacao, layout, inputs, botoes, modais, chamada dos hooks
```

Regra curta:

```text
Regra mora no backend.
Fluxo reutilizavel mora no shared-core do escopo correto.
Tela apenas apresenta e dispara acao.
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

## Config e Manifest

Sempre que possivel, comportamento editavel ou variacao de produto deve nascer em config/manifest.

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

O objetivo e permitir que RoyalPrime seja a primeira configuracao real, sem prender o codigo a Royal Carnes para sempre.

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
