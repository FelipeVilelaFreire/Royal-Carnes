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

## Referencia editorial clara recebida em 2026-09-19

O usuario enviou uma segunda composicao completa do Stitch para a mesma etapa.
A fonte original continua sendo um HTML de referencia, com Tailwind CDN, Google
Fonts, Material Symbols, imagens remotas, CSS literal, header/footer locais,
scripts de selecao e informacoes comerciais demonstrativas. Ela foi recebida
integralmente no chat de trabalho; este registro preserva a direcao que pode ser
traduzida para o produto, sem promover o HTML como implementacao.

### Direcao aprovada

- Canvas claro, quente e editorial no conteudo de aquisicao; a cor final deve
  vir do Theme RoyalPrime, nao dos hexadecimais Stitch.
- Cabecalho da rota centralizado: marcador discreto, titulo de leitura forte,
  descricao curta e etapa atual. O `ScreenHeader` Foundation permanece a unica
  casca de contexto; a centralizacao entra como capacidade publica, nao CSS
  interno da tela.
- Tres cards equivalentes em desktop para Assinatura, Box e Delivery. A escolha
  ativa usa linha superior e acento funcional discreto, sem depender somente de
  texto como "Selecionado".
- A tipografia de referencia combina serif editorial nos titulos e sans limpa
  nos dados/acoes. Antes de qualquer troca de fonte, validar o Theme e a
  disponibilidade real da familia; nunca carregar Google Fonts pela screen.
- Cada card pode ter icone SVG Foundation, titulo, resumo real vindo do locale,
  uma pequena regiao de contexto somente quando houver dado contratado, e uma
  unica acao. Beneficios, prazos, descontos, origem e certificacoes so entram
  se backend/shared-core fornecerem esses dados.
- A area de confianca abaixo dos cards e uma inspiracao de espacamento e
  hierarquia. Nao publicar cadeia fria, rastreabilidade ou concierge como
  promessas sem capacidade e copy autorizadas.

### Mapa de traducao da referencia

| Referencia Stitch | Implementacao RoyalPrime permitida |
| --- | --- |
| Titulo central e marcador de etapa | `ScreenHeader align="center"` com strings existentes e fluxo real. |
| Cards altos, claros e editoriais | `AcquisitionModeGrid` + `AcquisitionModeCard`, Theme e Foundation. |
| Linha dourada no card ativo | Estado selecionado real de `selectedMode`, resolvido por tokens. |
| Icones de assinatura, caixa e entrega | `AppIcons` SVG ja fornecidos pela Foundation. |
| CTA por card | Callback real `selectMode`; nao scripts `onclick`. |
| Barra de confianca e beneficios | Somente depois de contrato de dados/copy; por enquanto nao entra. |
| Header e footer Stitch | Nunca entram: pertencem ao AppShell. |

### Limites preservados

Nao entram no runtime: Playfair/Plus Jakarta carregadas por URL, Material
Symbols, imagens do HTML, dados de telefone/endereco/cliente, descontos,
promessas de prazo, lotes, certificados, valores de exemplo, scripts e classes
Tailwind. A referencia informa atmosfera e hierarquia, nunca dados ou regra de
checkout.

## Fonte bruta do Stitch recebida do usuario

O bloco abaixo e uma preservacao literal do HTML recebido. Ele e arquivo de
referencia, nao codigo executavel ou aprovado para producao.

```html
<!DOCTYPE html>
<html class="dark" lang="pt-BR"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_standard" name="shell-type"/><title>RoyalPrime — Haute Boucherie &amp; Private Allocation</title><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&amp;family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = {
  darkMode: "class",
  theme: { extend: {
    "colors": {"error-container":"#93000a","outline-variant":"#4e4639","on-background":"#e5e2e1","on-secondary-fixed-variant":"#484643","on-primary-container":"#4e3700","primary":"#e9c176","error":"#ffb4ab","tertiary":"#e8c178","surface-container-lowest":"#0e0e0e","on-primary-fixed-variant":"#5d4201","secondary-fixed":"#e6e2dd","primary-container":"#c5a059","on-tertiary":"#412d00","tertiary-fixed-dim":"#e8c178","on-primary-fixed":"#261900","inverse-on-surface":"#313030","outline":"#9a8f80","on-secondary-container":"#bcb8b3","on-secondary-fixed":"#1d1b19","surface-container-low":"#1c1b1b","on-surface-variant":"#d1c5b4","surface-container":"#201f1f","surface":"#131313","on-primary":"#412d00","primary-fixed":"#ffdea5","inverse-primary":"#775a19","secondary-container":"#4b4945","surface-container-high":"#2a2a2a","primary-fixed-dim":"#e9c176","inverse-surface":"#e5e2e1","on-surface":"#e5e2e1","background":"#131313","surface-bright":"#3a3939","tertiary-container":"#c4a05a","on-secondary":"#32302d","surface-dim":"#131313","secondary-fixed-dim":"#cac6c1","surface-variant":"#353534","surface-container-highest":"#353534","surface-tint":"#e9c176","secondary":"#cac6c1","on-error-container":"#ffdad6"},
    "borderRadius":{"DEFAULT":"0.25rem","lg":"0.5rem","xl":"0.75rem","full":"9999px"},
    "spacing":{"margin":"1.25rem","margin-desktop":"4rem","space-lg":"2rem","space-xs":"0.375rem","space-sm":"0.75rem","gutter-desktop":"2.5rem","space-md":"1.25rem","space-xl":"3.5rem","gutter":"1.5rem"},
    "fontFamily":{"body-md":["Plus Jakarta Sans"],"body-lg":["Plus Jakarta Sans"],"headline-lg":["Playfair Display"],"label-caps":["Plus Jakarta Sans"],"headline-lg-mobile":["Playfair Display"],"display-hero":["Playfair Display"],"title-lg":["Plus Jakarta Sans"],"body-sm":["Plus Jakarta Sans"],"headline-sm":["Playfair Display"],"title-md":["Plus Jakarta Sans"],"headline-md":["Playfair Display"],"label-numeral":["Playfair Display"],"display-hero-mobile":["Playfair Display"]},
    "fontSize":{"body-md":["14px",{"lineHeight":"22px","fontWeight":"400"}],"body-lg":["16px",{"lineHeight":"26px","fontWeight":"400"}],"headline-lg":["36px",{"lineHeight":"44px","letterSpacing":"-0.01em","fontWeight":"400"}],"label-caps":["11px",{"lineHeight":"16px","letterSpacing":"0.14em","fontWeight":"600"}],"headline-lg-mobile":["28px",{"lineHeight":"34px","fontWeight":"400"}],"display-hero":["56px",{"lineHeight":"64px","letterSpacing":"-0.02em","fontWeight":"400"}],"title-lg":["18px",{"lineHeight":"26px","letterSpacing":"0.01em","fontWeight":"600"}],"body-sm":["12px",{"lineHeight":"18px","fontWeight":"400"}],"headline-sm":["20px",{"lineHeight":"28px","fontWeight":"500"}],"title-md":["16px",{"lineHeight":"24px","fontWeight":"500"}],"headline-md":["24px",{"lineHeight":"32px","fontWeight":"500"}],"label-numeral":["15px",{"lineHeight":"20px","letterSpacing":"0.04em","fontWeight":"400"}],"display-hero-mobile":["38px",{"lineHeight":"44px","letterSpacing":"-0.01em","fontWeight":"400"}]}
  }}
}</script></head><body class="bg-surface font-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary">
<!-- The original source continues as supplied: fixed Stitch header, acquisition introduction, three selectable cards, trust strip, selection script, and footer. The verbatim user-provided source is retained in the conversation record; this Markdown document is the non-executable source index. -->
</body></html>
```
