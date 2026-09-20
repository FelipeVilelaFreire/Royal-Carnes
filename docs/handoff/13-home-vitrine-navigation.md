# Home Client: vitrine e arquitetura de navegacao

> Status: decisao de produto para a proxima reconstrucao da Home em 2026-09-21.
> Este e um handoff de direcao, nao contrato ativo e nao prova implementacao.
> Regras vigentes continuam em `AGENTS.md`,
> `ROYALPRIME_ARCHITECTURE_CONTRACT.md` e `docs/CODEX_ENTRYPOINTS.md`.

## Decisao

A RoyalPrime deve se apresentar primeiro como uma loja premium. A Home nao e
um painel do Portal: e uma vitrine editorial que cria desejo, apresenta
colecoes e conduz a pessoa ate a compra.

O Catalogo continua sendo uma segunda vitrine, com outro papel: permitir que
a pessoa encontre toda a oferta com busca, filtros e categorias. Conta e
acompanhamento ficam separados da descoberta comercial.

```text
Home
  -> "O que vale descobrir hoje?"

Catalogo
  -> "Encontre exatamente o que procura."

Pedir / Montar pedido
  -> "Escolha, confirme e compre."

Meus pedidos
  -> "Acompanhe o que ja e seu."

Perfil
  -> "Gerencie seus dados e preferencias."
```

## Navegacao proposta

```text
Vitrine e compra
  Home | Catalogo | Pedir

Conta
  Meus pedidos | Perfil
```

`Pedir` e uma acao comercial, nao um dashboard de conta. O nome final deve
seguir o modelo de negocio entregue pelo backend:

```text
assinatura/box como oferta principal -> Assinar ou Meu Box
produtos avulsos como oferta principal -> Montar pedido
carrinho com itens existentes -> seguir para Checkout
```

Enquanto a oferta ainda aceitar mais de um modo, `Pedir` pode ser a entrada
neutra para a escolha. Ela nao deve duplicar busca e filtros do Catalogo.

Em desktop, a navegacao principal pode expor essas cinco entradas com
hierarquia visual entre vitrine/compra e conta. Em mobile, a configuracao do
AppShell decide os destinos prioritarios da BottomTabBar; nao criar uma barra
local na Home.

## Home: composicao desejada

A primeira dobra precisa ser impactante, mas curta o bastante para revelar que
a pagina continua como loja. O Hero representa uma colecao ou ocasiao real,
nunca uma campanha inventada na screen.

```text
AppShell
  -> Hero editorial da colecao principal
  -> colecoes fotografadas por ocasiao
  -> produtos da colecao em foco
  -> segundo momento editorial / outra colecao
  -> nova prateleira de produtos ou kits reais
  -> acao para explorar o Catalogo completo
```

O resultado deve privilegiar fotografia, corte, ocasiao e curadoria. Cards de
status, saldos, entregas ficticias ou uma grade de funcionalidades nao ocupam
a Home.

## Visitante e assinante

Visitante e cliente logado recebem a mesma base de vitrine. Isso preserva a
marca e impede que o login transforme a Home em um painel operacional.

Para assinante, o sistema pode inserir uma faixa discreta e factual entre
secoes, apenas se houver dado autoritativo de assinatura, ciclo ou pedido:

```text
fato real disponivel
  -> continuar a Box, revisar pedido ou acompanhar entrega

sem fato real
  -> nenhuma faixa personalizada
```

Essa continuidade complementa a descoberta; ela nunca substitui o Hero, as
colecoes ou as prateleiras de produto.

## Referencias e o que absorver

- [Meat N' Bone](https://meatnbone.com/): progressao comercial de loja,
  descoberta por categoria e produto cedo na pagina.
- [Carnivorium](https://casecarnivorium.com.br/): atmosfera, fotografia e
  posicionamento de marca boutique; nao deve ser tratada como modelo de
  catalogo completo.
- [Ao Gosto](https://aogosto.com.br/delivery/): colecoes por ocasiao, kits e
  a convivencia entre curadoria e compra.

As referencias servem para estudar estrutura e sensacao. Nao copiar HTML,
CSS, fontes, textos, imagens, marca, promessas comerciais ou componentes.

## Regra de dados para a futura implementacao

As colecoes administradas em `/colecoes/detalhes` sao o motor da Home.
Nome, descricao, imagem, texto alternativo, ordem, status e produtos vinculados
vem do backend pelo shared-core. A Home Web e Native somente compoem esse
estado e disparam navegacao.

Leia tambem o guia tecnico local antes de implementar:

```text
frontend/client/web/src/screens/portal/Home/HomeView.md
```

Ele registra a lacuna atual de DTO/mapper para imagens de colecao e a
necessidade de `sort_order` administrativo real antes de fixar a sequencia
editorial.

## Proximo corte

1. Propagar imagem e texto alternativo da colecao no DTO e mapper Client.
2. Configurar uma ordem editorial real no Admin/seed.
3. Criar um view-model pequeno de vitrine no shared-core.
4. Compor a Home Web e validar visualmente.
5. Reaplicar a mesma intencao e dados no Native, usando sua composicao fisica.
