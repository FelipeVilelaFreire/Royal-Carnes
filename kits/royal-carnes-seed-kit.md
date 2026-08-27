# Royal Carnes Seed Kit

Status inicial: `local scaffold`

Fase principal: Fase 1 - Backend Base Real

## Objetivo

Documentar o seed principal da primeira organization do RoyalPrime.

Este kit veste o core generico com o negocio atual:

```text
RoyalPrime / Royal Carnes
```

## Regra Central

```text
Royal Carnes e seed/config.
Royal Carnes nao e regra hardcoded no core.
```

## Organization

```text
slug: royalprime
name: RoyalPrime
businessName: Royal Carnes
locale: pt-BR
timezone: America/Sao_Paulo
currency: BRL
```

Fonte atual:

```text
backend/.env.example
backend/apps/organizations/services.py
```

## Roles

```text
owner
admin
operator
customer
```

## Permissions

```text
orders.read
orders.approve
orders.updateStatus
products.manage
customers.read
customers.manage
deliveries.manage
payments.markPaid
settings.manage
```

## Users Dev

```text
admin@royalprime.local
operador@royalprime.local
cliente@royalprime.local
```

Regra:

```text
User e login.
OrganizationMember define acesso.
Customer define cliente comercial.
```

## Customers Dev

```text
Felipe Vilela
Lucas Dias
```

Esses clientes devem compartilhar semantica com os mocks atuais.

## Collections

```text
colecao-inverno
colecao-verao
colecao-familia
churrasco-premium
dia-a-dia
```

Regra:

```text
Collection organiza campanha/vitrine/sazonalidade.
Category organiza taxonomia.
Product e item vendavel.
```

## Categories

```text
carnes
carvao
temperos
utensilios
combos
```

## Plans

```text
basic
premium
pro
```

Limites esperados:

```text
proteinKgLimit
charcoalKgLimit
maxCuts
```

## Products

Primeiros produtos esperados:

```text
Picanha
Ancho
Fraldinha
Maminha
Tomahawk
Carvao Premium
Tempero seco
Kit churrasco
```

## Commercial Modes

```text
subscription
delivery
box
```

Nomes comerciais como `Royal Delivery` e `Royal Box` pertencem a seed/copy,
nao ao core.

## Payment Methods

```text
pixManual
cashOnDelivery
cardManual
whatsapp
```

Gateway real fica para fase posterior.

## Delivery

Primeiros dados:

```text
janela hoje
janela amanha
janela agendada
delivery refrigerado
codigo de confirmacao
```

## Arquivos Relacionados

Backend atual:

```text
backend/apps/organizations/
backend/apps/accounts/
backend/apps/customers/
backend/seeds/royalprime/seed.manifest.json
backend/MER.md
backend/API_CONTRACTS.md
```

Mocks atuais para converter:

```text
frontend/client/shared-core/mocks/catalog/
frontend/client/shared-core/mocks/customer.mock.ts
frontend/client/shared-core/mocks/orders/
frontend/admin/shared-core/mocks/
```

## Criterio Para Kit-Ready

Este seed vira `kit-ready` quando:

- existir comando de seed;
- criar organization RoyalPrime;
- criar roles/permissoes;
- criar usuarios dev;
- criar clientes dev;
- criar catalogo inicial;
- criar planos Basic/Premium/Pro;
- conseguir rodar em banco limpo.

## Criterio Para ServiceOS Candidate

Este kit nao vira ServiceOS candidate diretamente.

Ele e especifico do RoyalPrime/Royal Carnes. O que pode virar ServiceOS e o
padrao generico de seed por organization, nao os dados Royal Carnes.
