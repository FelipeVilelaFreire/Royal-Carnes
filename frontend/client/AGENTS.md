# RoyalPrime Client Parity

`web` e `mobile` compartilham a mesma arvore de produto. A diferenca permitida
e somente o adaptador de plataforma (`web/src/app` para Next e
`mobile/src/app` para host native), nunca uma surface, rota, regra ou tela
paralela.

Arvore canonica obrigatoria:

```text
src/screens/
  landing/
  portal/
    Home/
    Cortes/
    MontarBox/
    MeusPedidos/
    Perfil/
```

Cada pasta de tela consome os mesmos hooks, view-models, strings e contratos
de `client/shared-core`; Web e Mobile apenas implementam a composicao visual
adequada ao host. Nao reintroduzir `tabs/`, nomes de dominio divergentes como
`PedidoView`/`MinhaContaView`, ou uma biblioteca de produto exclusiva de uma
plataforma sem uma justificativa de host documentada.

Landing tambem e uma surface Client. A implementacao Native nasce em
`mobile/src/screens/landing`, com a mesma composicao declarada do shared-core;
nao criar uma segunda origem de dados ou copy.
