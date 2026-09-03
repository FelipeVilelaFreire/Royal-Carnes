# Render-Apps Rules

## Objetivo

Este documento define as regras da camada `render-apps` do RoyalPrime.

Ele foi escrito para Codex e desenvolvedores trabalharem nas telas sem mover
regra de negocio para o frontend visual.

## Entrada Rapida Para Codex

Antes de editar qualquer tela, responda:

```text
1. Qual render-app estou tocando?
   -> frontend/client/web ou frontend/admin/web

2. Qual kit/fluxo alimenta esta tela?
   -> auth, catalog, subscriptions, inventory, orders ou deliveries

3. Qual shared-core e o dono do hook?
   -> frontend/client/shared-core ou frontend/admin/shared-core

4. A tela atual esta aproveitavel ou deve ser recomposta?
   -> manter rota e visual essencial, mas remover regra/mocks/copy local

5. Qual comando valida a superficie?
   -> build client, build admin e git diff --check
```

Se a resposta exigir regra nova de negocio, pare e volte para backend. Se exigir
capacidade visual generica, verifique Foundation/ServiceOS antes de criar local.

## Nome Oficial

```text
render-apps
```

Pastas atuais:

```text
frontend/client/web
frontend/admin/web
```

Nao chamar esta camada de `webserver`.

## Regra Central

```text
render-app chama hook
hook chama api
api chama backend
backend decide
```

Render-app apresenta dados, coleta input e dispara acao. Ele nao decide regra.

## Relacao Com As Outras Camadas

```text
backend
  -> regra, validacao, permissao, calculo, workflow, auditoria

shared-core/global
  -> tipos e contratos base

shared-core/client
  -> hooks/view-models/API do cliente

shared-core/admin
  -> hooks/view-models/API do admin

render-apps
  -> telas, layouts, modais, tabelas, forms visuais e estados de UI
```

## Regra Render-Only

Cada tela deve seguir:

```text
screen/page/component
  -> importa hook do shared-core correto
  -> chama load/action
  -> recebe viewModel/data/loading/error
  -> renderiza loading/error/empty/data
  -> dispara actions com input de form
```

Nao fazer:

```text
fetch direto em TSX
importar api/*.api.ts direto na tela
converter snake_case em TSX
calcular preco/total/estoque/status
validar permissao real
codificar workflow
importar mock direto quando hook existe
criar if por nome de empresa, plano, produto ou status
```

## i18n First

Todo texto novo de interface nasce em locale/strings.

Permitido em TSX:

```text
strings.xxx
t("xxx")
props vindas de config/API
dados do usuario
```

Nao permitido:

```text
titulo hardcoded
label hardcoded
placeholder hardcoded
tooltip hardcoded
empty state hardcoded
mensagem de erro hardcoded
aria-label hardcoded
copy operacional hardcoded
```

Separacao:

```text
copy de UI -> locale/strings
label/status vindo do backend config -> dado/config
dado do usuario -> nao traduzir automaticamente
id tecnico -> nao traduzir
```

## Proibido Emoji Em UI

Nao usar caracteres de emoji em JSX/TSX, strings, manifest ou componentes de
interface.

Usar icones SVG da Foundation/ServiceOS quando houver necessidade visual.

## Icones Web E Native

Icone e contrato de significado, nao detalhe solto da tela.

Regra:

```text
feature/shared-core/manifest define intencao semantica
render-app resolve intencao para icone da plataforma
Foundation/ServiceOS define tamanho, tone, stroke e receita visual
```

Exemplos de intencao semantica:

```text
search
edit
delete
settings
user
order
delivery
subscription
catalog
inventory
success
warning
```

Web deve usar:

```text
frontend/foundation/ui/Icon/AppIcons.tsx
frontend/foundation/ui/Icon/Icon.tsx
frontend/foundation/ui/core/icon.ts
frontend/foundation/semi-composed/core/icon
```

Native futuro deve receber a mesma intencao semantica e mapear para o pacote de
icones nativo equivalente. A decisao de negocio nao muda por plataforma.

Nao fazer:

```text
emoji como icone
SVG inline novo dentro de tela
icone escolhido por index de array
icone escolhido por nome de empresa/produto/plano
cor/tamanho hardcoded em cada tela
web com icone semantico diferente do native para a mesma action
```

Se um icone generico ainda nao existir, criar ou amadurecer no dono correto de
Foundation/ServiceOS antes de duplicar localmente na render-app.

## Design E Foundation

Render-apps devem consumir Foundation/AppShell/Product Components existentes
antes de criar componente local.

Regra:

```text
ja existe em Foundation/AppShell?
  -> usar
e generico para duas telas/surfaces?
  -> amadurecer no lugar correto antes de duplicar
e especifico da tela?
  -> manter local na tela/modulo
```

Nao criar biblioteca paralela de Button, Card, Header, Sidebar, Footer ou
BottomTabBar.

## Web Is Mobile Igual Native

Regra obrigatoria:

```text
webIsMobile == native behavior
```

Quando uma tela client web roda em modo mobile, ela deve respeitar o mesmo
contrato funcional esperado para o futuro mobile native:

```text
mesmos hooks client
mesmos view-models client
mesmo estado loading/error/empty/data
mesmas actions permitidas
mesmos labels vindos de config/API/locales
mesma hierarquia de navegacao do contrato mobile
```

Nao fazer:

```text
mobile web com regra diferente do native
mobile web chamando endpoint diferente
mobile web com copy/estado que native nao conseguiria reproduzir
desktop-only assumptions em fluxo essencial
```

## Client Render-App

Pasta:

```text
frontend/client/web
```

Deve consumir:

```text
frontend/client/shared-core
frontend/shared-core
frontend/foundation
```

Nao deve consumir:

```text
frontend/admin/shared-core
endpoint admin
mock direto quando hook existe
```

Fluxos ja disponiveis:

```text
auth/session
catalog
subscriptions
orders
deliveries
customer/account parcial
```

## Admin Render-App

Pasta:

```text
frontend/admin/web
```

Deve consumir:

```text
frontend/admin/shared-core
frontend/shared-core
frontend/foundation
```

Nao deve consumir:

```text
frontend/client/shared-core
endpoint client quando existir endpoint admin equivalente
mock direto quando hook existe
```

Fluxos ja disponiveis:

```text
auth/session
users/permissions
catalog
subscriptions
inventory
orders
deliveries
```

## Manifest E Config

Render-app pode usar manifest/config para:

```text
rotas
navegacao
screen type
colunas visuais
filtros visuais
actions visuais
ordem de secoes
feature toggles de UI
```

Manifest/config nao pode virar backend paralelo:

```text
permissao real
workflow real
preco real
estoque real
status permitido como autoridade final
```

## Estado Visual

Render-app pode guardar:

```text
modal aberto
aba ativa
campo digitado
filtro local de apresentacao
ordenacao local visual
expanded/collapsed
toast local
```

Render-app nao deve guardar como fonte de verdade:

```text
pedido criado
estoque reservado
assinatura ativa
delivery confirmado
permissao real
status final
```

## Tratamento De Erro

Render-app mostra erro vindo do hook/shared-core.

Nao mascarar:

```text
erro de API
erro de permissao
erro de endpoint ausente
falha de token
falha de organization
```

Fallback mock, quando existir em fase de migracao, deve estar explicito e
visivel para debug. API client nao retorna mock como sucesso real.

## Ordem Para Construir Telas

Sequencia recomendada:

```text
1. client auth/session
2. client catalog
3. client subscriptions
4. client orders
5. client deliveries
6. admin catalog
7. admin subscriptions
8. admin inventory
9. admin orders
10. admin deliveries
```

## Quando Recriar Do Zero

Recriar uma tela/modulo do zero e aceitavel quando:

```text
o arquivo atual mistura mock, regra, copy hardcoded e layout demais
o custo de migrar incrementalmente for maior que recompor render-only
a rota/visual pode ser preservada por fora
o shared-core ja cobre o fluxo real
```

Antes de recriar:

```text
1. registrar qual tela sera substituida
2. preservar contrato de rota
3. preservar visual essencial quando ainda for desejado
4. garantir que novo TSX consome hook/view-model
5. validar build
```

## Checklist Para Codex

Antes de finalizar qualquer tela:

```text
[ ] li docs/architecture/OWNERSHIP_TREE.md
[ ] li docs/architecture/RENDER_APPS_RULES.md
[ ] li docs/architecture/RENDER_APPS_TREE_ANALYSIS.md
[ ] identifiquei o kit e hook correto
[ ] nao chamei fetch direto
[ ] nao importei api direto na tela
[ ] nao importei mock direto quando hook existe
[ ] nao coloquei snake_case em TSX
[ ] nao calculei regra de negocio
[ ] copy nova esta em locale/strings
[ ] nao usei emoji
[ ] icone usa intencao semantica e Foundation/ServiceOS
[ ] web mobile respeita comportamento native esperado
[ ] loading/error/empty/data existem
[ ] build da surface passa
```

## Validacao

Client:

```text
npm run build:client
```

Admin:

```text
npm run build:admin
```

Sempre:

```text
git diff --check
```
