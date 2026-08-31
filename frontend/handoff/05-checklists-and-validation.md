# 05 - Checklists And Validation

Use estes checklists antes de finalizar cada corte.

## Checklist Arquitetural

```text
[ ] docs/architecture/RENDER_APPS_RULES.md foi lido
[ ] backend continua dono da regra real
[ ] shared-core correto recebeu contrato/fluxo
[ ] global shared-core nao recebeu codigo especifico cedo demais
[ ] screen nao chama endpoint direto
[ ] screen nao importa mock direto quando hook existe
[ ] foundation nao conhece regra de produto
[ ] copy nova foi para locale/strings
[ ] nenhum emoji de UI foi adicionado
[ ] icones usam Foundation/ServiceOS e intencao semantica
[ ] web e native futuro compartilham o mesmo significado de icone por action
[ ] manifest nao declara comportamento que runtime nao suporta
```

## Checklist Client

```text
[ ] client web preserva visual
[ ] webIsMobile tem o mesmo comportamento esperado para native
[ ] hooks tem loading/error/data/reload quando aplicavel
[ ] API client usa contrato tipado
[ ] fallback mock e explicito e temporario
[ ] MeusPedidos/Pedido/MinhaConta nao duplicam regra de status
[ ] npm run build em frontend/client/web passa
```

## Checklist Admin

```text
[ ] admin page renderiza screen type
[ ] columns/filters/actions saem de manifest/config
[ ] status label/tone vem de manifest/view-model
[ ] comandos chamam hook/api
[ ] workflow de status nao e recalculado no render
[ ] npm run build em frontend/admin/web passa
```

## Checklist Git

```text
[ ] git diff --check passa
[ ] git status revisado
[ ] commit/push somente com autorizacao explicita
```

## Ordem De Validacao

Docs-only:

```text
git diff --check
```

Client web:

```text
cd frontend/client/web
npm run build
```

Admin web:

```text
cd frontend/admin/web
npm run build
```

Backend tocado:

```text
cd backend
py manage.py check
py manage.py test
```
