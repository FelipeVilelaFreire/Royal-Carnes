# CamisaClub Seed

Status inicial: `planned`

Seed exemplo propositalmente simples para validar reuso em ecommerce/assinatura
de camisetas.

Organization:

```text
slug: camisaclub
name: CamisaClub
businessName: CamisaClub Assinaturas
locale: pt-BR
timezone: America/Sao_Paulo
currency: BRL
```

Capacidades que deve testar:

- catalogo de produtos nao pereciveis;
- colecoes por tema/estacao;
- planos com limite por quantidade de itens;
- entrega e assinatura sem regra de carne, kg ou mecanica.

Regra:

```text
se CamisaClub exigir alterar core hardcoded, o modelo ainda esta preso demais
```

Arquivo de seed:

```text
backend/seeds/examples/camisaclub/seed.manifest.json
backend/seeds/examples/camisaclub/kits/organizations.seed.json
backend/seeds/examples/camisaclub/kits/auth-users.seed.json
backend/seeds/examples/camisaclub/kits/customers.seed.json
backend/seeds/examples/camisaclub/kits/catalog.seed.json
backend/seeds/examples/camisaclub/kits/subscriptions.seed.json
```
