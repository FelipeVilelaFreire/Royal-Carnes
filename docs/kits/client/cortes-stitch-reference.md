# Referencia visual Stitch - Catalogo de Cortes Client

Status: referencia visual recebida do usuario em 2026-09-13 para a rota
Client `/cortes`. Nao e codigo de producao e nao autoriza Tailwind, fontes
remotas, Material Symbols, valores CSS fisicos, dados demonstrativos ou uma
casca paralela ao AppShell.

## Origem preservada

O usuario enviou o HTML completo gerado pelo Stitch no chat. A resposta veio
repetida tres vezes e contem um unico conceito visual canonico. O codigo de
origem usa Tailwind CDN, Google Fonts, Material Symbols, handlers `onclick`,
dados inventados e tres documentos HTML iguais; ele serve somente como
referencia visual e nao deve ser executado, copiado ou importado no runtime.

## Direcao visual aprovada para estudar

Catalogo de acougue premium contemporaneo, escuro e editorial. A fotografia de
produto e o elemento dominante; cobre/dourado e usado apenas para foco, preco,
estado ativo e detalhes de marca. A interface e densa, mas calma, com cards
retangulares e pouco brilho.

```text
AppShell Foundation existente
  -> ScreenHeader Foundation
  -> trilho horizontal de categorias
  -> barra de busca e ordenacao
  -> contador de resultados
  -> grade de ProductItemCard
  -> loading, erro e vazio reais
```

## Anatomia proposta pelo Stitch

| Regiao | Composicao Stitch | Traducao RoyalPrime |
| --- | --- | --- |
| Casca global | Header fixo com logo, navegacao, busca, carrinho, notificacoes e perfil | Nao copiar. O AppShell Client ja e o unico dono dessa capacidade. |
| Cabeca da tela | Eyebrow em cobre, titulo editorial, descricao ampla, divisor discreto | Manter `ScreenHeader` existente; aperfeicoar apenas por props/tokens ja suportados. |
| Selos laterais | "Safra 2024" e "Cortes Inspecionados" | Nao copiar: sao dados comerciais inventados e nao existem no contrato da API. |
| Categorias | Trilho de pills horizontal, ativo cobre e demais tons escuros | Evoluir o rail real de categorias da API no `CortesView`. |
| Descoberta | Busca ampla, contador e ordenacao em uma faixa de superficie baixa | Evoluir `Input`, `DropdownPicker` e contador existentes, sem criar controles paralelos. |
| Grade | Quatro cards desktop, dois tablet, um mobile; foto 4:3 | Evoluir a composicao da grade existente e `ProductItemCard`. |
| Card | Foto, badge opcional, favorito, linha/categoria, nome, descricao, peso/origem e preco | Dados continuam vindos de `useClientCatalog` e `catalogo.view-model.ts`. |
| Estados | Loading skeleton, vazio e erro | Preservar os estados reais ja renderizados por `EmptyState`; nao criar uma tela de demonstracao de estados. |
| Footer | Rodape de termos e suporte | Nao copiar: pertence ao AppShell. |

## Elementos visuais a aproveitar

1. Hierarquia de cabeca: marcador pequeno, titulo de alto contraste,
   descricao com largura de leitura e divisor suave.
2. Trilho de categorias com densidade compacta e estado ativo realmente claro.
3. Barra de busca e ordenacao tratada como uma superficie baixa unica no
   desktop; no mobile os controles passam para leitura vertical.
4. Grade de quatro colunas no desktop quando a largura permitir, com imagens
   4:3 e cards de altura consistente.
5. Metadados discretos acima e abaixo do nome, preco com maior contraste e
   favorito como acao secundaria sobre a imagem.
6. Hover curto e contido: elevacao e zoom de midia minimo somente em desktop.

## Elementos que nao entram no produto

| Elemento Stitch | Motivo |
| --- | --- |
| Tailwind CDN e config inline | RoyalPrime usa TSX, CSS Modules, Theme e Foundation. |
| Google Fonts e Material Symbols | Fontes e icones pertencem ao Theme/Foundation; UI usa AppIcons SVG. |
| Header, footer, carrinho, notificacoes e perfil locais | Duplicariam o AppShell. |
| Produtos, precos, origem, BMS, selos e disponibilidade de exemplo | O catalogo real e a unica fonte de dados comerciais. |
| "Falar com Concierge", alertas e mensagens de inventario | Nao existem no contrato ou nas strings atuais. |
| Painel de demonstracao de loading/vazio/erro | Estados sao condicionais ao hook real, nao uma secao fixa da tela. |
| `onclick` e scripts de favoritos/filtros | Interacao fica no React, usando estados e callbacks existentes. |

## Contrato de implementacao

```text
backend catalog API
  -> client shared-core: contracts, API, mapper, useClientCatalog, view-model
  -> CortesView: estados locais de busca, categoria, ordenacao e favorito
  -> Foundation: ScreenHeader, Layout, Input, DropdownPicker, Button,
     Surface, EmptyState, Icon e ProductItemCard
```

Nenhuma mudanca visual pode alterar busca, ordenacao, filtros, loading, erro,
vazio, fonte de preco, origem, midia ou disponibilidade. A tela continua
render-only e toda nova copy de UI deve nascer em locale.

## Sequencia segura de adaptacao

1. Confirmar no navegador a hierarquia visual atual de `/cortes`.
2. Ajustar apenas cabeca, rail de categorias e barra de descoberta.
3. Validar desktop e mobile com dados reais.
4. Ajustar a grade e `ProductItemCard` sem inventar atributos de produto.
5. Revisar loading, erro e vazio no mesmo ritmo visual.
6. Executar regras, build Client e QA visual antes de considerar o corte pronto.
