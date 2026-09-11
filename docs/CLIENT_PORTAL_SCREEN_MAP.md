# Mapa Atual Do Portal Client

Status: inventario de decisao. Nao autoriza exclusao automatica.

Fonte de verdade para este mapa: navegacao ativa, rotas Web, renderizadores
Mobile e consumidores reais. Uma rota existente no codigo nao significa que ela
faz parte do produto atual.

## Portal Principal

Estas sao as cinco telas declaradas na barra principal em
`frontend/client/shared-core/manifest/portal/appshell.config.jsx`. Elas devem
existir e ter comportamento equivalente em Web e Mobile.

| Tela | Rota canonica | Web | Mobile | Estado funcional atual | Decisao |
| --- | --- | --- | --- | --- | --- |
| Home | `/home` | `HomeVitrineView` | `HomeView` | Web e Mobile usam `useClientCatalog`; carregamento, vazio e erro permanecem estados reais da API. | Manter; paridade de dados concluida. QA visual Web/Mobile continua pendente. |
| Cortes | `/cortes` | `CortesView` | `CortesView` | Ambos usam `ClientApiProvider` -> `useClientCatalog` -> catalogo real | Manter; primeira paridade funcional concluida |
| Montar Box | `/montar-box` | `PedidoView` | `PedidoView` | Ambos usam checkout shared-core, ainda com fonte fallback | Manter; proxima auditoria funcional quando selecionada |
| Meus Pedidos | `/meus-pedidos` | `MeusPedidosView` | `MeusPedidosView` | Ambos usam `useClientOrders({ fallbackOnError: true })` | Manter; candidato a proxima migracao real |
| Perfil | `/perfil` | `MinhaContaView` | `MinhaContaView` | Ambos existem, mas o Mobile ainda usa estado legado de customer | Manter; auditar depois de pedidos |

## Auditoria: Montar Box

`/montar-box` e uma unica jornada comercial com tres modalidades: assinatura,
Royal Box e Royal Delivery. Ela nao e uma sexta tela e Royal Delivery nao deve
voltar a existir como rota propria.

### Paridade Web e Mobile

| Aspecto | Web | Mobile | Resultado |
| --- | --- | --- | --- |
| Entrada e modalidades | `PedidoView` + `usePedidoRuntime` | `PedidoView` | Mesmo `useClientCheckout` e mesmo `checkout.config`. |
| Montagem, entrega, pagamento e resumo | Completo, com resumo lateral e gate de autenticacao | Fluxo compacto, sem resumo lateral e sem gate local da etapa | Regra compartilhada; experiencia visual ainda nao e equivalente. |
| Locale | `useClientStrings()` | strings recebidas do `PortalView` | Corrigido neste corte: nao importa mais `clientPtBR` diretamente. |
| Criacao do pedido | `POST /api/v1/orders/me/` pelo shared-core | Mesmo hook e mesmo client de orders | O envio ja chega ao backend real quando o input e valido. |

### Fontes atuais e decisao

| Dado ou acao | Fonte atual | Backend real disponivel | Decisao |
| --- | --- | --- | --- |
| Criar pedido, total, estoque e delivery | `useClientOrders` | `POST /api/v1/orders/me/` | Manter e validar com sessao cliente. |
| Catalogo e precos de produto | `checkoutFallbackDataSource` | Catalogo publico e precos existem | Migrar para mapper checkout dedicado; o mapper atual precisa respeitar variantes e modalidades do backend. |
| Planos, assinatura e ciclo | `checkoutFallbackDataSource` | `/subscriptions/plans/`, `/subscriptions/me/`, ciclo atual | Migrar para adapters do checkout, sem reutilizar limites ficticios do mock. |
| Enderecos do cliente | `checkoutFallbackDataSource` e `Date.now()` local | Modelo existe, mas nao ha endpoint self-service | Bloqueio de contrato: criar/listar endereco local nao pode fingir persistencia. |
| Frete e prazo | mocks de frete | Nenhuma cotacao/configuracao publicada | Bloqueio de contrato: backend precisa ser dono do calculo ou da tabela publicada. |
| Metodos e parcelas de pagamento | mocks de pagamento | Existem referencias internas, mas nao ha API cliente nem checkout de pagamento | Bloqueio de contrato: selecionar metodo hoje nao gera uma cobranca real. |

### Regra para remover mocks

`Montar Box` so sera marcado como sem mock quando Web e Mobile consumirem o
mesmo snapshot real de checkout e a submissao persistir endereco, frete,
pagamento e pedido no backend. Ate la, nenhum fallback pode ser escondido como
sucesso. O proximo corte deve nascer no backend como contrato de checkout
cliente; depois segue `api -> mapper -> hook -> view-model -> PedidoView`.

## Removido Nesta Simplificacao

Foram removidos por nao pertencerem ao portal principal ou por duplicarem uma
surface existente:

- Telas planejadas sem paridade: Minha Caixa, Meu Clube e a rota propria de
  Royal Delivery. Royal Delivery continua como modo dentro de Montar Box.
- Aliases: `/produtos`, `/portal-home`, `/portal-cortes`, `/minha-conta`,
  `/portal-minha-conta`, `/portal-minha-caixa` e `/minha-assinatura`.
- Rotas tecnicas duplicadas: `/hero` e `/library`, junto com o mostruario que
  carregava mocks de biblioteca.
- A segunda navegacao antiga em `navigation/portal.navigation.ts`.

Nao foram removidos hooks ou contratos reutilizaveis de subscriptions: eles nao
fazem parte da navegacao atual, mas podem ser consumidos por uma tela oficial
futura quando houver decisao de produto.

## Regra Para O Proximo Corte

1. Escolher somente uma tela da tabela Portal Principal.
2. Antes de alterar, abrir Web e Mobile da mesma tela.
3. Mapear dados, hook, fallback, acao e endpoint nos dois.
4. Migrar os dois no mesmo contrato ou registrar a diferenca real.
5. So depois marcar a tela como funcional sem mock.

Ordem sugerida, por impacto e aderencia ao portal visivel:

```text
Cortes (concluida)
  -> Home Mobile
  -> Meus Pedidos Web + Mobile
  -> Montar Box Web + Mobile
  -> Perfil Web + Mobile
```

Uma capacidade removida so volta quando houver tela oficial, rota canonica e
equivalente Web/Mobile definidos antes da implementacao.
