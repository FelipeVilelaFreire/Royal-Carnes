# Royal Carnes MVP - Escopo de Produto

Este documento registra o escopo atual do MVP da Royal Carnes/Royal Prime conforme alinhado com o cliente.

## Visao Geral

O produto publico do MVP deve ser organizado em uma landing page e tres telas principais do portal:

- Landing Page
- Home vitrine
- Catalogo de produtos
- Produtos

A area de conta, assinatura do usuario, historico e perfil nao deve ser apagada, mas por enquanto nao entra como fluxo principal. No header, o acesso de conta fica substituido por um botao `Entrar`, ainda sem acao real de login.

## Tipos Comerciais

Existem tres tipos comerciais principais:

1. Assinatura fechada
2. Assinatura a escolha - Royal Box
3. A escolha - Royal Delivery

Esses tres itens nao estao todos no mesmo nivel de "plano". A Assinatura fechada possui planos. Royal Box e Royal Delivery sao produtos comerciais proprios.

```txt
Produtos comerciais
├─ Assinatura fechada
│  ├─ Basic
│  ├─ Premium
│  └─ Pro
├─ Royal Box
└─ Royal Delivery
```

## 1. Assinatura Fechada

A Assinatura fechada e o produto de promocao com planos prontos. O cliente escolhe um plano e recebe de forma recorrente.

### Basic

Preco:

- R$ 300 mensal
- R$ 289 no anual

Regras:

- Escolhe apenas 4 produtos/carnes.
- Usa os produtos mais baratos do catalogo.
- O cliente escolhe como deseja receber cada produto do plano, por exemplo: espeto, peca, isca, fatiado.

### Premium

Preco:

- R$ 500 mensal
- R$ 489 no anual

Regras:

- Escolhe 6 produtos/carnes.
- Inclui os produtos da Basic.
- Inclui Picanha e Contra file.
- Inclui 2 pacotes de carvao.
- O cliente escolhe como deseja receber cada produto do plano.
- O cliente escolhe ate 2 tipos de tempero.

### Pro

Preco:

- R$ 800 mensal
- R$ 789 no anual

Regras:

- Escolhe 8 produtos/carnes.
- Inclui os produtos da Basic e Premium.
- Inclui Chorizo e produtos nobres.
- O cliente escolhe ate 5 pacotes de carvao.
- O cliente escolhe como deseja receber cada produto do plano.
- Recebe uma faca no pacote.
- O cliente escolhe ate 4 tipos de tempero.

## 2. Royal Box

Royal Box e uma assinatura a escolha. Ela nao e um pedido avulso.

O cliente monta uma caixa personalizada, define a composicao uma vez, e essa caixa passa a ser entregue todo mes no dia escolhido. Para o MVP, o comportamento padrao pode ser mensal com dia do mes mockado, por exemplo todo dia 10.

Regras:

- Pagamento mensal.
- Nunca anual no MVP.
- Valor conforme os produtos aderidos.
- O cliente pode escolher todos os produtos disponiveis no estoque Royal Carnes.
- O estoque elegivel inclui os produtos dos planos Basic, Premium e Pro.
- O cliente escolhe quantidade de carvao livremente.
- O cliente escolhe utensilios, como faca, espeto, prato, afiador de faca e tabua.
- O cliente escolhe como deseja receber cada produto, por exemplo: espeto, peca, isca, fatiado.
- O cliente seleciona o endereco onde recebera todo mes.
- O cliente seleciona o dia do mes da recorrencia.
- Frete gratis, pois o valor da composicao tende a ser maior.

Resumo conceitual:

```txt
Royal Box = caixa personalizada recorrente mensal
```

Exemplo:

```txt
Todo dia 10, entregar a minha Royal Box com:
- 1kg Picanha
- 1kg Fraldinha
- 1kg Linguica toscana
- 2 pacotes de carvao
- 1 tabua
```

## 3. Royal Delivery

Royal Delivery e o pedido avulso. A montagem e parecida com a Royal Box, mas sem recorrencia.

Regras:

- Pedido unico.
- Sem assinatura mensal.
- Valor maior que Royal Box, pois nao existe recorrencia.
- O cliente seleciona o endereco de entrega, podendo ser o endereco cadastrado ou outro endereco.
- O cliente seleciona o frete de entrega.
- Pode existir opcao de repetir o mesmo pedido da ultima vez.

Resumo conceitual:

```txt
Royal Delivery = compra avulsa para receber agora
```

## Telas

### Landing Page

Objetivo:

- Apresentar a loja.
- Explicar onde a Royal Carnes esta situada.
- Explicar o que ela faz.
- Oferecer a opcao de entender mais sobre a Royal Carnes.

Acao principal:

- Ao selecionar entender mais sobre a Royal Carnes, o cliente vai para a Home Page.

### Home Vitrine

Objetivo:

- Apresentar uma vitrine da Royal Carnes.
- Mostrar um botao para visualizar o catalogo.
- Apresentar os tipos comerciais.

Conteudo principal:

- Botao para visualizar o catalogo de produtos.
- Area com os tipos comerciais:
  - Assinatura
  - Royal Box
  - Royal Delivery
- Botao para conhecer os tipos de assinatura/produtos.

### Catalogo de Produtos

Objetivo:

- Demonstracao visual.
- Sem compra direta obrigatoria no MVP.

Conteudo principal:

- Produtos com nome, descricao, imagem, categoria e disponibilidade.
- Tipos de corte/formato possiveis.
- Indicar quais produtos fazem parte de Basic, Premium e Pro.
- Lembrar que todos os produtos dos planos podem fazer parte de Box e Delivery.
- Demonstrar catalogo de temperos.
- Demonstrar catalogos editoriais, por exemplo:
  - Mais pedidos 2026
  - Churrasco para familia
  - Linha nobre
  - Linha argentina
  - Espetinhos
  - Utensilios e preparo

### Produtos

Objetivo:

- Tela onde a decisao comercial acontece.
- Primeiro demonstra os tipos comerciais.
- Depois permite iniciar a simulacao de aquisicao.

Conteudo demonstrativo:

- Secao de Assinatura fechada com Basic, Premium e Pro.
- Secao de Royal Box explicando a recorrencia mensal personalizada.
- Secao de Royal Delivery explicando o pedido avulso.
- Botao `Desejo adquirir`.

Ao selecionar `Desejo adquirir`, aparecem tres opcoes:

- Assinatura
- Royal Box
- Royal Delivery

Comportamento:

- Se selecionar Assinatura:
  - Aparecem os planos Basic, Premium e Pro.
  - Ao selecionar um plano, aparecem os produtos permitidos para aquele plano.
  - O cliente escolhe formato de recebimento dos produtos.

- Se selecionar Royal Box:
  - Aparece grid de produtos/carnes e quantidade.
  - Ao marcar um produto, o cliente escolhe o formato/corte.
  - Aparece grid de utensilios com quantidade.
  - Aparece opcao de carvao e quantidade.
  - Aparece campo de endereco mensal.
  - Aparece selecao do dia do mes da recorrencia.

- Se selecionar Royal Delivery:
  - Aparece montagem parecida com a Royal Box.
  - Nao existe cobranca mensal.
  - O pagamento e feito na hora.
  - Os valores podem ser maiores que Royal Box.
  - Aparece endereco de entrega.
  - Aparece selecao de frete.
  - Pode existir opcao de repetir ultimo pedido.

## Mocks

A organizacao atual dos mocks deve refletir esta separacao:

```txt
frontend/client/shared-core/mocks/catalog/
├─ products.mock.ts
├─ categories.mock.ts
├─ catalogs.mock.ts
├─ productOptions.mock.ts
├─ commercialProducts.mock.ts
├─ plans.mock.ts
└─ types.ts
```

Responsabilidades:

- `products.mock.ts`: produtos reais do estoque.
- `categories.mock.ts`: categorias por tipo de produto.
- `catalogs.mock.ts`: vitrines editoriais que apontam para produtos por ID.
- `productOptions.mock.ts`: formatos de recebimento/corte.
- `commercialProducts.mock.ts`: Assinatura fechada, Royal Box e Royal Delivery.
- `plans.mock.ts`: apenas Basic, Premium e Pro.
- `types.ts`: contratos compartilhados dos mocks.
