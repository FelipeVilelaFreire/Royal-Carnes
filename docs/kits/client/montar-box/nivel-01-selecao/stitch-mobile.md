# Referencia visual Stitch - Montar Box Client Mobile

Status: referencia visual mobile recebida do usuario em 2026-09-15 para a rota
Client `/montar-box`. Complementa `stitch-desktop.md`. Nao e
codigo de producao e nao autoriza Tailwind, fontes remotas, Material Symbols,
valores CSS fisicos, dados demonstrativos ou casca paralela ao AppShell.

## Origem preservada

O usuario enviou um HTML completo do Stitch para viewport mobile, em modo
escuro. A origem usa Tailwind CDN, Google Fonts, Material Symbols, imagens
externas, scripts vanilla, valores CSS literais, endereco e produtos de
demonstracao. Ela e uma referencia visual exclusiva; jamais deve ser executada
ou copiada para o runtime do RoyalPrime.

## Direcao visual aprovada para estudar

Checkout mobile premium, tactil e focado na progressao. O usuario deve saber
imediatamente em qual etapa esta, o conteudo atual da Box e a proxima acao. A
paleta grafite e cobre mantem continuidade com a referencia desktop, mas a
composicao troca a coluna lateral por uma barra inferior de resumo/acao.

```text
AppShell mobile Foundation
  -> Header mobile e BottomTabBar por config
  -> ScreenHeader mobile fixo/recolhivel
  -> modalidades em trilho horizontal
  -> stepper compacto
  -> conteudo de checkout em uma coluna
  -> resumo/acao de pedido em barra inferior segura
```

## Anatomia proposta pelo Stitch

| Regiao | Composicao Stitch | Traducao RoyalPrime |
| --- | --- | --- |
| Header | Hamburger, wordmark, sacola e avatar | Nao copiar. O AppShell e o dono de Header, drawer, conta e acoes globais. |
| Cabeca contextual | Eyebrow, titulo e descricao curta | Usar o `ScreenHeader` existente, primeiro filho real da screen e com strings ativas. |
| Modalidades | Carrossel horizontal de Assinatura, Royal Box e Delivery | Renderizar opcoes reais do checkout; o ativo reflete o estado do fluxo. |
| Stepper | Tres etapas compactas: Selecao, Entrega e Revisao | Consumir as etapas reais do manifest. Nao criar transicao ou validacao local. |
| Capacidade da Box | Peso, numero de cortes e barra de ocupacao | Mostrar somente metricas que o view-model/contrato expuser. Nao inventar minimo ou certificacao. |
| Itens selecionados | Lista de cards horizontais com imagem, metadados, preco, remover e quantidade | Adaptar os componentes reais da selecao. Preco, peso, disponibilidade e midia continuam no shared-core. |
| Entrega | Bloco expansivel de endereco, frete e preferencia | Usar dados e acoes reais de endereco/frete; sem endereco, prazo, temperatura ou gratuidade ficticios. |
| Estados QA | Bloco manual de vazio, skeleton e erro | Nao copiar para producao. Os estados devem ser derivados do hook real. |
| Barra inferior | Itens, peso, total e CTA “Continuar” | Implementar pelo contrato mobile existente, respeitando BottomTabBar e safe area. |
| Navegacao inferior | Inicio, Catalogo, Montar Box, Pedidos e Perfil | Nao copiar: BottomTabBar e navegacao pertencem ao AppShell/config. |

## Elementos visuais a aproveitar

1. Carrossel de modalidades com largura tactil, snap horizontal e estado ativo
   cobre claro, sem cards gigantes.
2. Stepper compacto que mantem o passo atual legivel mesmo em telas estreitas.
3. Medidor de composicao da Box imediatamente antes da lista de produtos,
   desde que os valores sejam reais.
4. Cards de item em uma coluna, com foto quadrada, dados essenciais e controle
   de quantidade com alvos confortaveis para toque.
5. Entrega como secao progressiva/recolhivel, em vez de despejar todo o
   checkout abaixo da selecao.
6. Barra inferior persistente com total e proxima acao, acima da BottomTabBar
   e respeitando a safe area.
7. Motion curta de toque/seleção; sem hover assumido no mobile e sem animacao
   que faca o conteudo saltar.

## Elementos que nao entram no produto

| Elemento Stitch | Motivo |
| --- | --- |
| Header, sacola, avatar e BottomTabBar locais | Duplicariam o AppShell Foundation. |
| Tailwind, fontes remotas, Material Symbols, CSS inline e script vanilla | Violam a arquitetura TSX, CSS Modules, Theme, semi-composed e Foundation. |
| Produtos, imagens, badges, peso, preco, descontos e estoque de demonstracao | Dados comerciais devem vir da API/shared-core. |
| Endereco, CEP, horario, frete gratis, temperatura e promessa de entrega de exemplo | Dependem dos contratos reais de customer e logistics. |
| Barra de capacidade sem dado de dominio | So entra se o checkout/view-model puder informa-la corretamente. |
| Painel de estados auxiliares | Loading, vazio, erro e retry sao estados reais, nunca controles publicados. |
| Emoji ou icones Unicode soltos | A interface RoyalPrime usa somente AppIcons SVG da Foundation. |

## Contrato de implementacao

```text
backend
  -> regras de catalogo, endereco, frete, pagamento e pedido
  -> client shared-core: contracts, API, mappers, useClientCheckout, view-model
  -> MontarBox Mobile: composicao render-only e estado visual de interacao
  -> Foundation: Native AppShell, ScreenHeader, BottomTabBar, Surface, Button,
     Icon, Layout e controles ja existentes
```

`webIsMobile` deve seguir o mesmo contrato e comportamento da surface Native.
Nenhuma referencia visual autoriza uma regra local de total, frete, peso,
elegibilidade, pagamento ou criacao de pedido.

## Sequencia segura de adaptacao

1. Abrir `/montar-box` em viewport mobile real e comparar com esta referencia.
2. Ajustar primeiro cabeca, modalidades e stepper do fluxo existente.
3. Ajustar cards de selecao e resumo inferior sem duplicar dados do Catalogo.
4. Revisar endereco, frete, pagamento e revisao com estados reais.
5. Validar loading, vazio, erro, teclado, safe area e sobreposicao da
   BottomTabBar.
6. Executar verificacoes Client e fazer QA visual Web mobile e Native antes de
   considerar a paridade concluida.
