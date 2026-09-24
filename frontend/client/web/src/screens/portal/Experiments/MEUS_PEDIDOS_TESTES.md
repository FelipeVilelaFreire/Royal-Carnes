# Testes de Meus Pedidos do Portal

## Objetivo atual

Estas cinco rotas sao estudos visuais isolados para decidir somente a
composicao de `Pedido Atual`. Cada uma e uma pagina independente, totalmente
hardcoded, inspirada no formato de comparacao de Home: nao existe um componente
base, uma grade comum ou uma tentativa de simular a tela oficial.

| URL | Pedido Atual comparado |
| --- | --- |
| `http://localhost:3000/meus-pedidos-teste-1` | Estado dominante, etapas horizontais e dados essenciais. |
| `http://localhost:3000/meus-pedidos-teste-2` | Linha do tempo operacional e painel de entrega. |
| `http://localhost:3000/meus-pedidos-teste-3` | Visao de pedido em tres blocos: contexto, estado e chegada. |
| `http://localhost:3000/meus-pedidos-teste-4` | Linha completa do pedido, do confirmado ao entregue. |
| `http://localhost:3000/meus-pedidos-teste-5` | Central com checklist de acompanhamento e resumo lateral. |

## Regra da comparacao

Cada rota usa a largura total disponivel, com conteudo amplo centralizado. Ela
mostra primeiro o acompanhamento atual e, abaixo, um Historico de pedidos com
composicao diferente em cada alternativa. Nenhuma delas deve parecer landing
page ou exibir Royal Box, metricas globais, modal de detalhe ou CTA comercial
ate que uma direcao seja aprovada.

## Limites importantes

- Sao prototipos estaticos e Web-only.
- Os dados sao ilustrativos; nao chamam `useClientOrders`, API, backend,
  sessao, pagamento, entrega ou rastreio real.
- A rota oficial continua em `/meus-pedidos` e nao foi substituida.
- Depois da escolha, a direcao deve ser reconstruida nos componentes oficiais
  com o view-model real, incluindo Web e Mobile.

## Proximo passo

Escolher uma direcao para Pedido Atual. Somente depois, comparar Historico,
proximo ciclo e detalhe como estudos separados.
