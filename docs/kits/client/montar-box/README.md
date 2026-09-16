# Montar Box - mapa de fluxos Client

Este kit documenta o Montar Box por nivel de caso de uso. Uma referencia visual
nao descreve automaticamente toda a rota: ela pertence ao nivel e ao estado de
produto que representa.

## Mapa atual

```text
/montar-box
  -> nivel 01: selecao
     -> 01.0: entrada neutra, sem modalidade selecionada
     -> 01.1: modalidade selecionada, ainda sem itens
     -> 01.2: busca, categoria e adicao de produtos reais

futuros niveis, ainda sem referencia Stitch propria
  -> nivel 02: entrega
  -> nivel 03: pagamento
  -> nivel 04: revisao e pedido
```

As modalidades (`Assinatura`, `Royal Box` e `Royal Delivery`) definem o caso de
uso ativo. As etapas (`montagem`, `entrega`, `pagamento` e `resumo`) definem a
progressao dentro dele. Os dois estados nao podem ser confundidos.

No uso informal deste kit, `nivel 0` significa o estado visual `01.0`: a
entrada neutra dentro do nivel funcional de selecao. Ele nao deve mostrar
stepper, catalogo, resumo, total ou uma caixa vazia generica antes da escolha.

## Atualizacao consolidada (2026-09-16)

A rota publicada continua sendo `/montar-box`, mas a implementacao interna da
screen passou a ser `screens/portal/Checkout/` em Web e Native. Isso separa o
nome comercial da rota do dominio reutilizavel de checkout, sem mudar URLs.

O nivel de selecao e composto por quatro partes que nao devem voltar a se
misturar em um arquivo unico:

```text
1. acquisition/  -> modalidade de aquisicao
2. cycle/ + catalog/ -> contexto do plano/ciclo e produtos disponiveis
3. summary/      -> resumo persistente da selecao
4. delivery/, payment/, review/ -> proximos niveis, ainda progressivos
```

O catalogo do Checkout usa o mesmo `ProductItemCard` do Catalogo, com
`preset="catalogo"`. A diferenca fica na grade e na acao da screen:
`CheckoutProductGrid` organiza o card em tres colunas no Web desktop e em uma
coluna no Native, com adicionar e controle de quantidade. Nao criar um
`MontarBoxProductCard` nem um preset comercial exclusivo.

Categorias do filtro sao derivadas de todas as tags dos produtos. No modal, a
categoria e uma escolha temporaria; somente `Aplicar` atualiza a consulta. A
elegibilidade comercial definitiva por plano ainda depende de entitlement e
saldo autoritativos vindos do backend/shared-core.

## Regra de leitura

Cada nivel deve registrar:

```text
estado de entrada
-> acao do cliente
-> dados/contratos reais necessarios
-> proximo estado
-> Web, webIsMobile e Native afetados
-> referencias desktop/mobile aplicaveis
```

As referencias Stitch servem somente para composicao e hierarquia visual. Dados
comerciais, endereco, frete, pagamento, estoque e criacao de pedido continuam
no backend e no shared-core.

## Estado da implementacao

Leia [implementacao-atual.md](implementacao-atual.md) antes de alterar a tela.
Ele registra a tree real de Web/Native, a fonte de verdade, validacoes, limites
de paridade e o proximo corte seguro.

Leia tambem [checkout-composicao.md](checkout-composicao.md) para a divisao
visual entre aquisicao, ciclo, catalogo e resumo.
