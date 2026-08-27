# RoyalPrime Seed

Status inicial: `planned`

Seed principal do produto real atual.

Organization:

```text
slug: royalprime
name: RoyalPrime
businessName: Royal Carnes
locale: pt-BR
timezone: America/Sao_Paulo
currency: BRL
```

Objetivo:

```text
criar dados suficientes para validar Royal Carnes em banco limpo
```

Primeiras capacidades:

- organization;
- roles/permissoes;
- users dev;
- customers dev;
- catalogo;
- planos;
- pedidos exemplo depois que orders existir.

Kit relacionado:

```text
kits/royal-carnes-seed-kit.md
```

Arquivo de seed:

```text
backend/seeds/royalprime/seed.manifest.json
backend/seeds/royalprime/kits/organizations.seed.json
backend/seeds/royalprime/kits/auth-users.seed.json
backend/seeds/royalprime/kits/customers.seed.json
backend/seeds/royalprime/kits/catalog.seed.json
backend/seeds/royalprime/kits/subscriptions.seed.json
```

Regra:

```text
seed.manifest.json e indice
kits/*.seed.json contem dados por capacidade
```
