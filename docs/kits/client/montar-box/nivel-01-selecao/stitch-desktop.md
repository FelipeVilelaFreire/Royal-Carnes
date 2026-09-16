# Referencia visual Stitch - Montar Box Client

Status: referencia visual recebida do usuario em 2026-09-15 para a rota
Client `/montar-box`. Nao e codigo de producao e nao autoriza Tailwind, fontes
remotas, Material Symbols, valores CSS fisicos, dados demonstrativos ou uma
casca paralela ao AppShell.

## Origem preservada

O usuario enviou um documento HTML completo gerado pelo Stitch, em modo escuro,
para a experiencia de montar uma Royal Box. O original usa Tailwind CDN,
Google Fonts, Material Symbols, imagens externas, valores CSS literais e dados
demonstrativos. Ele serve exclusivamente como referencia visual: nunca deve ser
executado, copiado para o runtime ou usado como fonte de dados comerciais.

## Direcao visual aprovada para estudar

Checkout editorial de acougue premium contemporaneo: fundo grafite muito
escuro, superfices em camadas discretas, cobre/dourado como acento funcional e
fotografia de cortes como ponto focal. A densidade e alta, mas a leitura segue
uma ordem muito clara: modalidade, etapa, selecao e resumo.

```text
AppShell Foundation existente
  -> ScreenHeader Foundation
  -> modalidades de compra reais
  -> etapas reais do checkout
  -> busca, categorias e produtos da API
  -> endereco, frete, pagamento e revisao reais
  -> resumo sticky do pedido
  -> loading, erro e vazio reais
```

## Anatomia proposta pelo Stitch

| Regiao | Composicao Stitch | Traducao RoyalPrime |
| --- | --- | --- |
| Casca global | Header fixo com marca, navegacao, notificacoes, modo escuro e perfil | Nao copiar. Header, navegacao, tema e perfil pertencem ao AppShell Client. |
| Cabeca da tela | Eyebrow cobre, titulo editorial, descricao e selo de cadeia fria | Manter `ScreenHeader` real, com copy via locale. O selo somente entra se existir capacidade e dado real. |
| Modalidades | Tres cards: Assinatura, Royal Box e Delivery; um ativo | Usar as modalidades verdadeiras de `useClientCheckout`; estado selecionado vem do fluxo, nao de mock local. |
| Progresso | Etapas Selecao, Logistica e Revisao | Mapear o stepper para as etapas existentes do manifest de checkout, sem alterar transicoes de dominio. |
| Selecao | Busca, categorias, cards de produtos e quantidade | Produtos, precos, imagens, peso, disponibilidade e categorias continuam no catalog API/shared-core. |
| Logistica | Endereco, entrega refrigerada e janela de horario | Renderizar somente endereco e frete que venham dos contratos reais. Nao inventar CEP, prazo, cadeia fria ou cortesia. |
| Revisao | Linhas do pedido, subtotal, frete, total e CTA | Os totais e a criacao do pedido continuam autoritativos no backend. |
| Resumo lateral | Card sticky com itens, peso, valores e acao | Adaptar `StickyOrderSummary` existente; no mobile, transformar no resumo acessivel do fluxo nativo. |
| Estados de preview | Botoes fixos para normal, loading, vazio e alerta | Nao copiar. Loading, vazio e erro sao condicionais ao hook real, nunca painel de demonstracao publicado. |
| Footer | Marca, suporte, privacidade e termos | Nao copiar. O Footer pertence ao AppShell. |

## Elementos visuais a aproveitar

1. Hierarquia inicial: marcador cobre discreto, titulo editorial de alto
   contraste e descricao com largura de leitura controlada.
2. Três modalidades compactas, com a escolha ativa inequívoca sem converter a
   tela em banners promocionais.
3. Stepper com numero, nome e estado progressivo; a proxima decisao deve estar
   visualmente mais forte que as demais.
4. Produtos em duas colunas no desktop, com imagem pequena, metadados acima do
   nome, preco forte e quantidade simples.
5. Resumo sticky leve, com produtos compactos, subtotal, frete e total bem
   separados, e uma unica acao primaria.
6. Superficies em camadas, bordas sutis, brilho muito contido e hover curto
   somente em ponteiro desktop.
7. No mobile, uma coluna, cards de modalidade compactos e resumo acionavel no
   rodape; nunca tentar comprimir a coluna lateral desktop.

## Elementos que nao entram no produto

| Elemento Stitch | Motivo |
| --- | --- |
| Tailwind CDN, config inline e CSS literal | RoyalPrime usa TSX, CSS Modules, Theme, semi-composed e Foundation. |
| Google Fonts e Material Symbols | Fontes e icones pertencem ao Theme/Foundation; UI usa AppIcons SVG. |
| Header, footer, notificacoes, avatar e modo escuro locais | Duplicariam capacidades do AppShell. |
| Nome de cliente, endereco, CEP, cortes, precos, pesos, origem e frete de exemplo | Sao dados comerciais/pessoais; devem vir da API e do shared-core. |
| Selos de certificacao, beneficios, prazo, parcelamento ou cortesia inventados | Exigem contrato e regra real, nao decoracao. |
| Painel fixo de simulacao de estados | Estados sao consequencia do fluxo real, nao controles de producao. |
| Scripts, `onclick`, favoritos e controles locais do HTML | Interacoes vivem nos componentes React e callbacks do checkout existente. |

## Contrato de implementacao

```text
backend
  -> catalogo, endereco, frete, pagamento, entitlements e pedido
  -> client shared-core: contracts, API, mapper, useClientCheckout, view-model
  -> MontarBox Web/Native: apenas estado visual e composicao render-only
  -> Foundation: AppShell, ScreenHeader, Layout, Input, Surface, Button,
     Icon, ProductItemCard e componentes de checkout existentes
```

Nenhuma mudanca visual pode alterar preco, estoque, peso, frete, elegibilidade,
endereco, pagamento, criacao de pedido ou os estados de loading/erro/vazio.
Toda copy adicional nasce no locale ativo. `ScreenHeader` continua como primeiro
filho real da screen e fora de qualquer ancestral transformado.

## Sequencia segura de adaptacao

1. Abrir `/montar-box` no navegador e registrar desktop e mobile antes de
   alterar a composicao.
2. Refinar `ScreenHeader`, modalidades e stepper usando contratos existentes.
3. Refinar busca, categoria e cards sem duplicar o Catalogo nem dados reais.
4. Refinar endereco, frete e revisao somente com estados obtidos do checkout.
5. Adaptar o resumo sticky desktop e o resumo mobile sem mudar calculos.
6. Conferir loading, vazio, erro e feedback de salvamento no fluxo real.
7. Executar regras, build Client e QA visual antes de considerar o corte pronto.
