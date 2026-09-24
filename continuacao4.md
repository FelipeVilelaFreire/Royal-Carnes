# Continuacao 4 - RoyalPrime Home Client

> Handoff operacional da reconstrucao da Home Client. Atualizado em 2026-09-24.
> Este arquivo e exclusivo da Home/vitrine; `continuacao.md` permanece geral,
> Admin e backend, e `continuacao2.md` cobre o estado amplo de Client/Checkout.

## Como retomar

Leia nesta ordem antes de alterar Home Web, Native ou o contrato de colecoes:

```text
1. AGENTS.md
2. ROYALPRIME_ARCHITECTURE_CONTRACT.md
3. docs/CODEX_ENTRYPOINTS.md
4. frontend/AGENTS.md
5. frontend/client/web/AGENTS.md
6. frontend/client/mobile/AGENTS.md
7. docs/handoff/13-home-vitrine-navigation.md
8. frontend/client/web/src/screens/portal/Home/HomeView.md
9. frontend/admin/shared-core/manifest/pages/colecoes.config.jsx
10. frontend/client/shared-core/contracts/catalog.contract.ts
11. frontend/client/shared-core/mappers/catalog.mapper.ts
```

Confirme branch e `git status` antes de editar. O worktree e compartilhado e
contem trabalho paralelo em Admin, Checkout, Perfil, Catalogo e Foundation.
Nao usar `reset`, `clean`, `checkout`, `git add .`, commit ou push sem
autorizacao explicita.

## Atualizacao 2026-09-24: laboratorio visual da Home

Foi criado um laboratorio Web-only e estatico para escolher a direcao visual
antes de implementar a Home oficial. Ele fica isolado em:

```text
frontend/client/web/src/screens/portal/Experiments/
```

As rotas abaixo usam o `PortalView` somente para preservar AppShell/Header e
nao entram na navegacao oficial:

```text
/home-teste-1
/home-teste-2
/home-teste-3
/home-teste-4
/home-teste-5
```

O modal `Aparencia da experiencia` do Header do Portal oferece os atalhos para
essas rotas, alem dos testes de Landing e Catalogo ja existentes. O modal foi
reduzido aos botoes de prototipos; ele nao persiste tema, tipografia, material,
raio ou bordas.

### Estado das secoes dos testes

```text
Secao 1
  -> congelada nas cinco rotas
  -> abertura fotografica "Selecao da churrasqueira"

Secao 2
  -> opcoes restauradas, uma por rota
  -> 1: mosaico assimetrico
  -> 2: faixa horizontal de colecoes
  -> 3: quatro colecoes no mesmo plano
  -> 4: dois banners editoriais
  -> 5: lista por forma de servir

Secao 3
  -> cinco leituras de cards/produtos
  -> 1: carrossel de cards pretos com setas sobrepostas nas pontas do trilho
  -> 2: carrossel de cards escuros em carvao quente, com setas no cabecalho
  -> 3: carrossel de cards claros em amarelo queimado, com setas nas laterais
  -> 4: ProductItemCard real com controles abaixo do trilho, sem alteracao visual interna
  -> 5: carrossel editorial amarelo com progresso, contador e botoes
  -> todas as rotas: min-height explicito de 760px no desktop e 700px no mobile

Secao 4
  -> quatro variacoes implementadas nas Homes 1 a 4; Home 5 preserva a referencia anterior
  -> Royal Assinatura: selecao pronta recorrente, por plano definido
  -> Royal Box: caixa personalizada recorrente mensal, no dia escolhido
  -> Royal Delivery/Avulso: pedido unico, sem recorrencia
  -> 1: tres cards verticais
  -> 2: Royal Box em destaque e duas opcoes laterais
  -> 3: tres faixas horizontais
  -> 4: foto grande e lista editorial
  -> ainda hardcoded no laboratorio; nao simular plano ativo, preco, frete,
     elegibilidade ou criacao de assinatura

Secao 5
  -> cinco variacoes implementadas: catalogo de complementos
  -> titulo: "Voce tambem pode escolher."
  -> carrossel: carvao, sal e temperos, utensilios, acompanhamentos e presentes
  -> 1: cards escuros, fundo amarelo e setas compactas no cabecalho
  -> 2: catalogo claro e controles em texto
  -> 3: cards fotograficos e setas externas
  -> 4: tiles compactos por arraste
  -> 5: catalogo editorial com linha de progresso

Secao 6
  -> cinco variacoes estaticas de feedback, sem dados reais
  -> seis depoimentos ficticios por variacao, para comparar densidade
  -> 1: foto grande, depoimento editorial e mini-carrossel de apoios
  -> 2: seis cartoes de feedback
  -> 3: mosaico de seis mesas
  -> 4: trilho horizontal de seis depoimentos
  -> 5: frase central em fundo escuro e cinco apoios menores
  -> producao exige reviews reais, autorizados e provenientes de fonte valida

Secao 7
  -> cinco fechamentos implementados
  -> 1: CTA central em fundo preto com foto sutil
  -> 2: foto grande e CTA lateral
  -> 3: fechamento amarelo direto
  -> 4: composicao editorial clara
  -> 5: tres caminhos finais (Cortes, Royal Box e Assinatura)

Home teste 6 - cliente recorrente
  -> rota isolada `/home-teste-6`, dentro do AppShell e Web-only
  -> estudo hardcoded de Home de uso recorrente, nao Landing
  -> topo contextual: proximo ciclo da Royal Box
  -> atalhos: Cortes, Minha Box, Pedidos e Assinatura
  -> prateleira curta de recompra e uma unica selecao editorial
  -> responsivo: grid de atalhos vira duas colunas e prateleira vira gesto
  -> nao representa sessao, pedido, ciclo, precos ou recomendacoes reais

Home testes 7 e 8 - enquadramento WebIsMobile
  -> rotas isoladas `/home-teste-7` e `/home-teste-8`, dentro do AppShell e Web-only
  -> 7: visitante, com descoberta curta por ocasiao, duas portas de catalogo e acesso
  -> 8: cliente, com proxima entrega, atalhos, recompra e revisao da Box
  -> ambos usam conteudo hardcoded apenas para comparar a fisica compacta
  -> eles nao substituem Native, nao declaram paridade funcional e nao criam uma segunda Home oficial
```

Os cinco testes agora permitem comparar navegacao de carrossel. Cada um
tem oito opcoes estaticas, quatro cards inteiros e parte do quinto no desktop,
scroll horizontal com snap e sem barra aparente: 1 usa setas sobrepostas nas
pontas, 2 usa setas no cabecalho, 3 usa setas nas laterais, 4 usa controles
abaixo do ProductItemCard e 5 usa progresso, contador e botoes. Falta decidir
a direcao aprovada e entao consolidar
gestos, setas, indicadores, quantidade de cards visiveis e comportamento
responsivo em uma unica versao.

A sequencia alvo da Home em estudo e: abertura -> colecoes -> produtos ->
forma de comprar -> selecao correspondente -> reviews -> CTA final. A Secao 4
nao deve repetir cortes ou colecoes: ela explica os tres modelos comerciais que
ja existem no produto. A fonte de verdade atual e `productOptions` no locale
pt-BR; quando a direcao visual for aprovada, a Home oficial deve renderizar a
copy via locale e o fluxo funcional real, nunca a copia hardcoded do estudo.

### Limites obrigatorios do laboratorio

- Conteudo, imagens, precos, links e CSS sao hardcoded deliberadamente para
  prototipagem rapida; nao representam catalogo, estoque ou compra reais.
- Nao conectar backend, shared-core, manifest de produto, preco, estoque ou
  regras comerciais enquanto a direcao ainda estiver em comparacao.
- Nenhum teste substitui `/home`, `/catalogo`, Web/Mobile, locale ativo ou a
  cadeia oficial `backend -> shared-core -> manifest -> JSX render-only`.
- Somente apos uma direcao ser aprovada ela pode migrar para a Home oficial com
  dados reais, Foundation, locales e paridade Web/Native.

O guia operacional curto e a matriz completa ficam em:

```text
frontend/client/web/src/screens/portal/Experiments/HOME_TESTES.md
frontend/client/web/src/screens/portal/Experiments/README.md
```

### Evidencias e proximo passo seguro do laboratorio

```text
node scripts/code-rules.test.mjs
  -> 30/30 passaram

npm run verify:rules
  -> continua bloqueado por 6 violacoes legadas fora do laboratorio:
     theme.manifest.js (ui-copy) e Button/Card/Input/Surface (inline-style)
```

Nao houve QA visual em navegador nesta retomada. O proximo passo seguro e abrir
as cinco rotas, escolher a combinacao de Secao 2 e Secao 3 com mais potencial,
congelar essas escolhas e so entao comparar alternativas para a Secao 4. Nao
promover nenhum teste para a Home oficial antes dessa decisao e da adaptacao
real de dados/contratos.

## Decisao de produto

A Home sera reconstruida do zero como uma vitrine editorial de colecoes e
produtos reais. Ela deve se aproximar da progressao comercial de um acougue
premium online: imagem forte -> ocasiao/colecao -> produtos -> nova colecao.

Ela nao e:

```text
dashboard de portal
Landing duplicada
Catalogo completo com filtros copiados
resumo ficticio de pedido, entrega, assinatura ou saldo
```

A separacao correta e:

```text
Home
  -> curadoria, descoberta e vitrine de colecoes

Catalogo
  -> busca, filtros, todas as categorias e listagem completa

Montar Box / Meus Pedidos / Minha Conta
  -> fluxos e acoes especificas
```

Visitante e cliente veem a mesma vitrine como base. Para cliente logado, uma
faixa discreta de continuidade pode aparecer entre secoes somente quando o
backend/shared-core entregar um fato real, como Box aberta ou pedido em curso.
Essa faixa jamais toma o lugar da vitrine e jamais usa dado simulado.

## Estado atual: Home esvaziada intencionalmente

As renderizacoes existentes foram removidas para evitar reaproveitar uma Home
que nao seguia a direcao escolhida:

```text
frontend/client/web/src/screens/portal/Home/HomeView.tsx
  -> componente vazio; rota /home e AppShell permanecem

frontend/client/mobile/src/screens/portal/Home/HomeView.tsx
  -> componente vazio; NativeAppShell e navegacao permanecem

frontend/client/shared-core/manifest/portal/homeVitrine.config.ts
  -> removido; era exclusivo da Home antiga

frontend/client/web/src/screens/portal/Home/HomeView.module.css
  -> removido; era exclusivo da Home antiga
```

O guia local da nova direcao esta em:

```text
frontend/client/web/src/screens/portal/Home/HomeView.md
```

Nao declarar Home como entregue: nao existe composicao, QA visual, fluxo de
colecoes no renderer ou paridade Native neste momento.

## Colecoes sao o motor da vitrine

O Admin ja tem a tela de detalhe de colecoes em `/colecoes/detalhes`. O
manifesto `colecoes.config.jsx` permite editar nome, chave, imagem, descricao,
ordem, status e produtos vinculados.

```text
Admin Colecoes
  -> Collection do backend
  -> GET /api/v1/catalog/collections/
  -> client/shared-core DTO -> mapper -> view-model
  -> Home Web e Native render-only
```

Cada colecao possui no backend:

```text
name + description + image_url + image_alt + status + sort_order + product_ids
```

O endpoint local respondeu com cinco colecoes ativas:

```text
Churrasco
Cortes para preparar
Essenciais
Para compartilhar
Selecao da churrasqueira
```

Essas colecoes devem orientar o Hero, cards de ocasiao, banners editoriais e
prateleiras de produto. Produtos vinculados pertencem a cada colecao e devem
ser mostrados pelo vinculo/ordem real, nunca escolhidos manualmente na screen.

## Lacuna de contrato identificada

O backend ja serializa `image_url` e `image_alt` em `CollectionSerializer`, e
o contrato global `CollectionBase` ja aceita `imageUrl` e `imageAlt`.

O Client ainda perde esses campos porque:

```text
ClientCollectionDto
  -> ainda nao declara image_url/image_alt

mapClientCollectionDto
  -> ainda nao mapeia imageUrl/imageAlt
```

Antes de criar a primeira faixa visual de colecao, corrigir essa cadeia no
shared-core e validar o endpoint real. Essa e uma adaptacao pequena e nao exige
novo backend.

Tambem foi observado que as colecoes locais retornam todas `sort_order: 0`.
Definir ordens distintas no Admin/seed antes de depender da sequencia visual;
a curadoria deve vir do dado administrativo, nao de condicoes no JSX.

## Composicao visual alvo

```text
AppShell
  -> Home
    -> hero para a colecao principal
    -> trilho de cards de colecoes fotografadas
    -> prateleira de produtos da colecao ativa
    -> banner editorial de outra colecao
    -> segunda prateleira/grade de descoberta
    -> acao para Catalogo completo
```

- A Home mostra poucas colecoes e poucos produtos por vez para criar desejo e
  curadoria; o Catalogo continua dono da exploracao completa.
- Usar fotografia, imagem de colecao, titulo, descricao e produtos reais.
- A referencia Meat N' Bone serve para progressao de loja e descoberta, nunca
  para copiar HTML, CSS, fontes, marca ou componentes.
- O estilo RoyalPrime continua premium e escuro: produtos e imagens sao o
  centro, nao cards de dashboard.
- AppShell continua dono de Header, Footer e BottomTabBar. A screen nao recria
  essas capacidades.

## Donos e limites

```text
backend
  -> Collection, produtos vinculados, imagem, status, ordem e disponibilidade

client/shared-core
  -> DTO, API, mapper, view-model de vitrine, strings e estados de dados

Web / Native
  -> composicao render-only e eventos de navegacao
```

- Nao fazer fetch direto, mock, calculo de preco ou ordenacao comercial na
  `HomeView`.
- Nao criar componentes genericos novos sem verificar Foundation e ServiceOS;
  reutilizar `ProductItemCard` e primitives existentes quando o contrato for
  suficiente.
- UI nova usa locale ativo e icones Foundation, sem emoji ou copy hardcoded.
- Web e Native compartilham dados, ordem e intencao; somente a fisica pode ser
  diferente.

## Validacao realizada nesta preparacao

```text
GET http://localhost:3001/colecoes/detalhes
  -> respondeu 200; runtime Admin local identificado

GET http://localhost:8000/api/v1/catalog/collections/
  com X-Organization-Slug: royalprime
  -> respondeu 5 colecoes ativas com imagem e produtos vinculados

GET http://localhost:3000/home
  -> respondeu 200 apos Home Web ser esvaziada

git diff --check
  -> passou nos arquivos da limpeza da Home e neste handoff

npm run verify:rules
  -> bloqueado por duas violacoes preexistentes de UI copy em
     frontend/client/shared-core/manifest/theme.manifest.js, linhas 8 e 9
```

Nao havia navegador conectado para inspecao visual. O endpoint/Admin foram
verificados por runtime HTTP e leitura do contrato; nao declarar QA visual
concluido por essa evidencia.

## Proximo corte seguro

1. Corrigir `ClientCollectionDto` e `mapClientCollectionDto` para propagar
   `image_url` e `image_alt` ja existentes no endpoint.
2. Definir `sort_order` real para as colecoes no Admin/seed e conferir a ordem
   retornada pelo endpoint.
3. Criar no shared-core um view-model pequeno da vitrine: colecao principal,
   colecoes de descoberta e produtos vinculados, todos derivados do snapshot
   real.
4. Compor primeiro a Home Web com Hero de colecao, trilho de colecoes e uma
   prateleira de produtos; validar visualmente em desktop antes de ampliar.
5. Adaptar a mesma composicao/dados para Native e validar em dispositivo ou
   host Native real.
