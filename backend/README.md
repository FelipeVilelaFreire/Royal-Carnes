# RoyalPrime Backend

Esta pasta contem o backend Django do RoyalPrime: models, API, services, seeds e testes. Confira implementacao e ambiente reais antes de executar comandos.

O backend historico anterior nao e referencia de implementacao. O codigo atual em apps/ e o contrato API_CONTRACTS.md devem ser inspecionados juntos.

## Como continuar

A entrada obrigatoria e [../AGENTS.md](../AGENTS.md). Selecione a tarefa em
[../docs/CODEX_ENTRYPOINTS.md](../docs/CODEX_ENTRYPOINTS.md).
Leia ARCHITECTURE.md e API_CONTRACTS.md para a area alterada.
ROADMAP.md e PHASE_3_SUBSCRIPTIONS.md sao planejamento/referencia, nao
uma segunda ordem obrigatoria nem prova de que uma capacidade falta.

## Decisao atual

O RoyalPrime passa a ser tratado como produto principal. O ServiceOS continua como referencia de organizacao, contratos, AppShell, shared-core e separacao de responsabilidades, mas nao deve travar a entrega nem forcar abstracao antes da necessidade real.

## Foundation tecnica

A decisao inicial de stack esta em `backend/FOUNDATION.md`.

Resumo:

```text
Django + Django REST Framework
PostgreSQL como banco alvo
SQLite permitido para boot local inicial
codigo e MER pensados para Postgres desde o inicio
Vercel para frontends
Supabase Postgres para banco gerenciado
Render para Django API/web server
```

O contrato de variaveis fica em `backend/.env.example`.

O arquivo `backend/.env` pode existir localmente, mas nao deve ser versionado.

## Scaffold atual

O scaffold Django inicial ja segue:

```text
config/settings/base.py
config/settings/development.py
config/settings/production.py
apps/core
apps/organizations
apps/accounts
apps/customers
apps/catalog
apps/subscriptions
apps/inventory
apps/orders
apps/deliveries
api/v1
```

Registro incremental:

```text
backend/IMPLEMENTATION_LOG.md
```

Contrato inicial da API:

```text
backend/API_CONTRACTS.md
```

## Comandos backend

Instalar dependencias:

```bash
py -m pip install -r backend/requirements.txt
```

Validar configuracao:

```bash
cd backend
py manage.py check
```

Criar migrations quando os models estiverem aprovados:

```bash
cd backend
py manage.py makemigrations
py manage.py migrate
```

Aplicar seed principal da Fase 1:

```bash
cd backend
py manage.py seed_backend --seed royalprime
```

Validar seed sem escrever no banco:

```bash
cd backend
py manage.py seed_backend --seed examples/bikeclub --dry-run
py manage.py seed_backend --seed examples/camisaclub --dry-run
```

Rodar testes da fundacao:

```bash
cd backend
py manage.py test apps.core
```

Rodar a suite completa:

```bash
cd backend
py manage.py test
```

## Estado e continuidade

O historico das fases antes desta consolidacao foi preservado em
docs/archive/2026-09-07-documentation-baseline/backend/README.md, relativo a raiz.
Nao usar seus proximos passos como backlog vigente.

Para estado atual, consulte ../continuacao.md, ../docs/kits/KITS_RUNTIME_LEDGER.md
e IMPLEMENTATION_LOG.md, confirmando o trecho pertinente em codigo/testes.
Este README documenta entrada e comandos, nao certifica integracao de cada tela.
