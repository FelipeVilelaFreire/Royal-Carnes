# Frontend Copy/Locale Audit

Data: 2026-08-28

## Objetivo

Mapear textos hardcoded nas surfaces principais e definir a ordem para mover
copy de UI para `locales`, manifests ou dados/mock, sem criar regra nova no
shared-core.

## Regra Central

```text
texto de UI
  -> locales

texto configuravel por pagina/fluxo
  -> manifest do escopo correto, apontando para keys de locale quando fizer sentido

dado comercial de exemplo/dev
  -> mock/seed temporario

regra, status, limite, preco e disponibilidade
  -> backend/config, nao JSX
```

## O Que Nao Fazer

```text
nao criar novas funcionalidades agora
nao extrair fluxo grande para shared-core sem necessidade
nao mover copy para hooks
nao transformar locale em banco de regra comercial
nao reescrever visual enquanto move texto
nao tentar zerar todo hardcode em uma rodada so
```

Para estrategia de funcionalidades por kit, usar:

```text
frontend/KIT_FUNCTIONALITY_STRATEGY.md
```

## Classificacao

### Locale

Use `frontend/client/shared-core/locales/pt-BR.ts` quando for:

```text
titulo
subtitulo
botao
label
placeholder
empty state
aria-label
texto de modal
texto de aviso
texto institucional fixo do produto
```

### Manifest

Use manifest quando o texto fizer parte de uma estrutura configuravel:

```text
tabs
steps
cards repetidos
FAQ
menus
filtros
colunas
acoes por tela
secoes da landing
screen types de admin
```

O manifest pode guardar `labelKey`, `titleKey`, `descriptionKey` em vez de
texto direto.

### Mock/Seed

Use mock/seed quando for dado de entidade ou demonstracao:

```text
nome de produto
nome de plano
imagem
preco de exemplo
endereco de cliente
pedido fake
historico fake
faq de negocio ainda nao vinda de CMS/config
```

## Prioridade 0 - Landing

Arquivos:

```text
frontend/client/web/src/screens/landing/HeroMarketplaceView.tsx
frontend/client/web/src/screens/landing/LandingView.tsx
frontend/client/web/src/screens/landing/sections/*.tsx
frontend/client/shared-core/locales/pt-BR.ts
```

Achados:

```text
HeroMarketplaceView ainda tem textos em JSX:
- VAGAS LIMITADAS PARA NOVOS SOCIOS
- A Experiencia Suprema do Churrasco em sua Casa
- Total liberdade...
- Como Funciona a Assinatura
- Escolha a sua Experiencia

LandingView ainda tem arrays e blocos de copy comercial no proprio arquivo:
- subtitles
- FAQ
- hero copy
- cards de formas de compra
- features dos planos
- Royal Box copy
```

Direcao:

```text
primeiro mover copy simples para clientPtBR.landing
depois transformar cards/FAQ/steps em arrays dentro do locale ou manifest
nao mudar layout
```

Aceite:

```text
HeroMarketplaceView nao contem copy comercial literal no JSX
LandingView nao define FAQ/cards comerciais inline
screen so le strings/config
build client passa
```

## Prioridade 1 - MinhaConta

Arquivo:

```text
frontend/client/web/src/screens/portal/tabs/MinhaContaView.tsx
```

Achados:

```text
tabs locais: Minha Assinatura
header: Ola, {nome}. Gerencie seu plano...
secoes: Uso & Capacidade da Assinatura, Pedidos e entregas
botoes: Ver detalhes, Salvar Alteracoes, Adicionar endereco, Encerrar Conta
textos legais longos hardcoded
modal de troca de plano com copy inline
```

Direcao:

```text
criar clientPtBR.minhaConta ou expandir estrutura existente
manter dados pessoais/endereco/pagamento em mock ou API futura
manter calculos e regras fora do locale
```

Aceite:

```text
labels, titulos, botoes e textos legais saem do JSX
dados de cliente continuam vindo de mock/hook/API
view permanece igual
```

## Prioridade 1 - MeusPedidos

Arquivo:

```text
frontend/client/web/src/screens/portal/tabs/MeusPedidosView.tsx
```

Status:

```text
ja consome clientPtBR.meusPedidos em parte
```

Achados restantes:

```text
texto de plano vinculado ainda inline
algumas composicoes ainda montam copy com Royal/labels diretamente
status vem do view-model, mas label visual auxiliar ainda precisa padrao
```

Direcao:

```text
completar clientPtBR.meusPedidos
usar helpers pequenos para interpolacao de labels
nao recolocar status hardcoded na screen
```

## Prioridade 1 - OrderDetailModal

Arquivo:

```text
frontend/client/web/src/product-components/ecommerce/OrderDetailModal.tsx
```

Achados:

```text
Total
Entrega
Pagamento
Codigo
labels comparados por string para definir estilo
```

Direcao:

```text
mover labels para locale
nao comparar label traduzido para decidir estilo
usar key estrutural, exemplo deliveryCode, payment, estimate
```

Aceite:

```text
modal recebe labels por locale/config
estilo depende de key, nao de texto exibido
```

## Prioridade 2 - PedidoView

Arquivo:

```text
frontend/client/web/src/screens/portal/tabs/PedidoView.tsx
```

Status:

```text
ja usa bastante clientPtBR.pedido
mas ainda mistura fluxo, calculo, labels e estado local
```

Direcao:

```text
nao tentar resolver tudo agora
primeiro mover apenas copy/labels restantes
depois, em outra rodada, separar checkout manifest e hook real
```

Aceite deste corte:

```text
sem novos textos comerciais literais em JSX
arrays de label/steps apontam para strings
build client passa
```

## Prioridade 2 - Cortes/Home/MinhaCaixa/MeuClube

Arquivos:

```text
frontend/client/web/src/screens/portal/tabs/CortesView.tsx
frontend/client/web/src/screens/cuts/HeroCortesView.tsx
frontend/client/web/src/screens/portal/tabs/HomeView.tsx
frontend/client/web/src/screens/portal/tabs/HomeOrientationView.tsx
frontend/client/web/src/screens/portal/tabs/MinhaCaixaView.tsx
frontend/client/web/src/screens/portal/tabs/MeuClubeView.tsx
frontend/client/web/src/screens/portal/NovoPortalHomeView.tsx
```

Achados:

```text
placeholders
titulos
copy comercial
comentarios de estrutura
alert fake
labels de cota/plano/entrega
```

Direcao:

```text
fazer depois das telas mais criticas
se houver texto que parece dado comercial, decidir mock/seed antes de locale
alert fake deve virar TODO/documentacao ou comando real futuro, nao locale
```

## Prioridade 3 - Admin Web

Arquivos:

```text
frontend/admin/web/src/engines/rendering/screen-types/dashboard/DashboardPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/pages/ListPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/settings/SettingsPage.tsx
```

Direcao:

```text
admin deve receber copy de manifests/admin shared-core
screen type generico nao deve carregar texto de RoyalPrime
colunas, filtros, acoes e empty states devem vir de config
```

## Ordem Recomendada

```text
1. HeroMarketplaceView
2. LandingView
3. OrderDetailModal
4. MeusPedidosView
5. MinhaContaView
6. PedidoView copy-only
7. Cortes/Home/MinhaCaixa/MeuClube
8. Admin screen types/manifests
```

## Prompt Para Proxima IA

```text
Voce esta no RoyalPrime.

Leia:
AGENTS.md
ROYALPRIME_CODEX_RULES.md
ROYALPRIME_ARCHITECTURE_CONTRACT.md
docs/CODEX_ENTRYPOINTS.md
frontend/COPY_LOCALE_AUDIT.md
frontend/RENDER_ONLY_AUDIT.md

Objetivo:
fazer uma rodada copy-only nas telas principais, movendo textos hardcoded para
locales ou manifests sem criar novas funcionalidades e sem alterar visual.

Regras:
- texto de UI vai para locales;
- estrutura configuravel repetida vai para manifest/locales;
- dado comercial de mock continua em mock/seed;
- nao mover regra para locale;
- nao criar hook/fluxo novo;
- nao reescrever layout;
- nao promover nada para frontend/shared-core global;
- se trocar label por locale, nao usar o texto traduzido como condicao de estilo;
- depois de mexer no client web, rodar npm run build em frontend/client/web;
- rodar git diff --check.

Comece por:
1. HeroMarketplaceView
2. LandingView
3. OrderDetailModal
4. MeusPedidosView
5. MinhaContaView
```

## Criterio De Conclusao

```text
as telas alteradas nao contem copy comercial literal em JSX
aria-labels e placeholders novos estao em locale
arrays de FAQ/cards/steps saem da screen ou usam keys
visual permanece equivalente
build da surface alterada passa
git diff --check passa
```
