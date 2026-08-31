# Backend Rules

## Objetivo

Este documento e a regra de leitura do backend RoyalPrime para Codex e
desenvolvedores.

O backend e a fonte de verdade para:

```text
regra de negocio
banco
validacao
permissao
calculo
workflow
auditoria
tenant/organization
seed/config de dominio
```

## Regra Central

```text
frontend pede
backend decide
```

Nenhuma tela ou shared-core deve recalcular aquilo que o backend ja decide.

## Organizacao Padrao De App

Cada app de dominio deve seguir:

```text
models.py
  -> entidades, relacoes, constraints, indexes

services.py
  -> use-cases, validacoes, calculos, transicoes, efeitos

selectors.py
  -> queries reutilizaveis e prefetch/select_related

serializers.py
  -> DTOs de entrada e saida da API

views.py
  -> endpoint, auth, permission, chamada de service/selector

urls.py
  -> contrato publicado

tests/
  -> API, permissao, regras, seed/config e fluxos principais
```

## Tenant E Organization

Regra:

```text
request -> X-Organization-Slug -> request.organization
```

Views devem usar:

```text
get_request_organization(request)
```

Services devem validar que entidades recebidas pertencem a mesma organization
quando a regra depende disso.

## Seeds E Config

Tudo que varia por empresa deve ser seed/config:

```text
status
workflow
allowedNextKeys
effects
commercial modes
plan entitlements
measurement units
code sequence prefix
labels operacionais
```

Nao fazer:

```text
if organization.slug == "royalprime"
if product.key == "picanha"
if plan.key == "royal-pro"
if status_key == "received" para decidir regra generica
```

## Permissao

Permissao real mora no backend.

Padrao:

```text
require_organization_permission(request.user, organization, "capability.action")
```

Exemplos:

```text
inventory.read
inventory.manage
orders.read
orders.manage
deliveries.read
deliveries.manage
```

O frontend pode esconder ou mostrar comandos por UX quando tiver dados, mas nao
e a fonte de autorizacao.

## Contrato De API

`urls.py` e a fonte final do que esta publicado.

Antes de criar shared-core ou tela:

```text
1. abrir urls.py
2. abrir views.py
3. abrir serializers.py
4. abrir services.py
5. abrir tests/
```

Nao implementar client/shared-core para endpoint que aparece so em README antigo
e nao aparece em `urls.py`.

## Erros

APIs devem retornar `code` tecnico estavel.

Exemplos:

```text
order_reference_not_found
order_status_transition_not_allowed
delivery_already_exists
reserved_exceeds_available
```

Copy final do erro fica no frontend/locales, nao no backend.

## O Que Volta Para Backend

Se render-app ou shared-core precisar de qualquer item abaixo, parar e voltar
para backend:

```text
rota inexistente
novo filtro server-side obrigatorio
nova permissao
novo status/effect
novo calculo de total/preco/estoque
mudanca de workflow
payment/checkout/wallet/voucher
package management de delivery
scheduling
```

## Validacao Esperada

Para mudanca backend:

```text
py manage.py check
py manage.py test apps.<app>
```

Quando a mudanca impacta frontend:

```text
npm run build:client
npm run build:admin
```
