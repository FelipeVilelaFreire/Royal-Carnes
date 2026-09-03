# Render-Apps Tree Analysis

## Objetivo

Este documento analisa a tree atual das render-apps e define a arquitetura alvo
antes de comecar a migracao de telas.

Status:

```text
Passo 1 concluido: regras de render-apps definidas.
Proximo passo: analisar a tree atual em detalhe e escolher o primeiro corte.
Nao comecar tela nova sem confirmar o ponto de entrada abaixo.
```

Leia junto:

```text
docs/architecture/OWNERSHIP_TREE.md
docs/architecture/RENDER_APPS_RULES.md
docs/kits/PHASE_2_RENDER_ONLY_SCREEN_PLAN.md
```

## Estado Atual

Render-apps atuais:

```text
frontend/client/web
frontend/admin/web
```

Shared-cores que devem alimentar as telas:

```text
frontend/client/shared-core
frontend/admin/shared-core
frontend/shared-core
```

## Client Web Atual

Tree resumida:

```text
frontend/client/web/src
  app/
  legacy/
    app-shell/
    design-system/
  modules/
    account/
    catalog/
    checkout/
  product-components/
    ecommerce/
  screens/
    cuts/
    landing/
    library/
    portal/
```

Leitura:

```text
client web tem varias rotas e telas reais, mas ainda carrega muito legado
visual, mocks diretos, copy em JSX e logica de apresentacao antiga.
```

Principais riscos:

```text
legacy/design-system ainda e importado por telas e product-components
legacy/app-shell ainda e importado por telas client
legacy/design-system/Icons.tsx ainda funciona como pacote paralelo de icones
telas importam mocks diretamente
OrderDetailModal ainda depende de tipo/mock de order
algumas telas calculam status visual localmente
copy de UI ainda aparece em JSX
ha rotas duplicadas de portal antigo e novo
```

Decisao:

```text
nao migrar tudo de uma vez
recriar por fluxo quando a tela estiver muito misturada
preservar rota e visual essencial quando possivel
trocar primeiro a fonte de dados para hooks/view-models
depois reduzir legado visual com Foundation/AppShell
```

## Admin Web Atual

Tree resumida:

```text
frontend/admin/web/src
  App.tsx
  main.tsx
  builders/
  engines/
    rendering/
      screen-types/
        dashboard/
        history/
        settings/
        standard/
        trash/
```

Leitura:

```text
admin web esta mais proximo da arquitetura alvo porque ja renderiza por
screen-types e manifest, mas os screen-types ainda tem estilo inline,
fallbacks visuais e algumas labels/status locais.
```

Principais riscos:

```text
DashboardPage ainda possui labels/status/tones hardcoded
DashboardPage ainda pode escolher icones por regra visual local
screen-types standard ainda tem muito style inline
App.tsx ainda decide roteamento local e usa fallback visual hardcoded
comentarios antigos possuem encoding ruim
```

Decisao:

```text
manter a engine de screen-types
fazer os screen-types consumirem manifest/view-models
remover status/tones/copy do render
trocar valores visuais locais por Foundation/AppShell conforme capacidade real
```

## Arquitetura Alvo

```text
frontend/client/web
  src/app/
    -> rotas Next.js finas
  src/screens/
    -> telas render-only organizadas por fluxo
  src/screen-types/
    -> screen types client quando houver reuso real
  src/locales/
    -> somente se a render-app tiver copy local especifica
  src/adapters/
    -> adapters visuais sem regra de negocio, se necessario

frontend/admin/web
  src/App.tsx
    -> bootstrap e roteamento fino
  src/engines/rendering/screen-types/
    -> renderizadores genericos de manifest
  src/locales/
    -> somente se a render-app tiver copy local especifica
  src/adapters/
    -> adapters visuais sem regra de negocio, se necessario
```

Regra de ouro:

```text
rotas e telas ficam finas
hooks/view-models ficam no shared-core correto
backend continua dono da regra real
```

## O Que Nao Deve Ser A Arquitetura Alvo

```text
tela importando mock direto
tela importando api direto
tela decidindo status/tone/workflow
tela carregando copy nova hardcoded
client web chamando admin shared-core
admin web chamando client shared-core
mobile web com comportamento diferente do native esperado
legacy/design-system crescendo como biblioteca nova
legacy/app-shell crescendo como AppShell paralelo
icone web diferente do native para a mesma intencao/action
```

## Ordem De Inicio

Comecar pelo menor fluxo que prova a arquitetura sem destruir a UI:

```text
1. client MeusPedidosView + OrderDetailModal
2. client MinhaContaView apenas no resumo de pedidos/entregas
3. client Catalog/Cortes consumindo useClientCatalog
4. admin DashboardPage removendo status/tones locais
5. admin ListPage/DetailPage ligados aos manifest/view-models reais
```

Motivo:

```text
orders/deliveries ja tem Kits 05-06
ha telas client claras usando mocks diretos
admin ja tem screen-types e consegue evoluir sem trocar a casca inteira
```

## Passo 2 Para Continuar

Amanha, antes de codar, fazer esta leitura:

```text
1. listar rotas atuais de frontend/client/web/src/app
2. listar telas atuais de frontend/client/web/src/screens
3. listar imports de mocks/legacy nas telas do primeiro fluxo
4. abrir hooks/view-models do kit correspondente no shared-core
5. decidir se a tela sera migrada incrementalmente ou recomposta
6. so entao editar a primeira tela
```

Para o primeiro corte recomendado, os arquivos de leitura sao:

```text
frontend/client/web/src/app/(portal)/meus-pedidos/page.tsx
frontend/client/web/src/screens/portal/tabs/MeusPedidosView.tsx
frontend/client/web/src/product-components/ecommerce/OrderDetailModal.tsx
frontend/client/shared-core/hooks/useClientOrders.ts
frontend/client/shared-core/hooks/useClientDeliveries.ts
frontend/client/shared-core/view-models/orders.view-model.ts
frontend/client/shared-core/view-models/deliveries.view-model.ts
```

## Quando Recriar Do Zero

Recriar tela/modulo e aceitavel quando:

```text
o arquivo atual mistura mock, copy, regra e layout em excesso
a rota pode continuar igual
o visual essencial pode ser preservado
o shared-core ja oferece hook/view-model suficiente
a reescrita reduz risco em vez de aumentar
```

Preferencia:

```text
recriar arquivo de tela isolado
manter page.tsx/rota fina
nao apagar legacy compartilhado ate nenhuma tela depender dele
```

## Primeiro Corte Recomendado

```text
frontend/client/web/src/screens/portal/tabs/MeusPedidosView.tsx
frontend/client/web/src/product-components/ecommerce/OrderDetailModal.tsx
```

Resultado esperado:

```text
MeusPedidosView usa useClientOrders/useClientDeliveries
OrderDetailModal recebe view-model pronto por props
mock direto sai da tela
status/tone/label sai do TSX
icones usam intencao semantica e Foundation/AppIcons
copy nova fica em locale/strings
mobile web segue o mesmo contrato funcional de native
```

Validacao:

```text
cd frontend/client/web
npm run build
git diff --check
```
