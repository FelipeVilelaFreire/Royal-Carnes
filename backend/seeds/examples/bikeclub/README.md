# BikeClub Seed

Status inicial: `planned`

Seed exemplo para validar reuso do modelo.

Organization:

```text
slug: bikeclub
name: BikeClub
businessName: BikeClub Assinaturas
locale: pt-BR
timezone: America/Sao_Paulo
currency: BRL
```

Capacidades que deve testar:

- User e OrganizationMember fora de RoyalPrime;
- Customer fora de Royal Carnes;
- Collection, Category e Product sem carnes;
- planos com limites diferentes de kg de proteina.

Regra:

```text
se BikeClub exigir alterar core hardcoded, o modelo ainda esta preso demais
```

Arquivo de seed:

```text
backend/seeds/examples/bikeclub/seed.manifest.json
backend/seeds/examples/bikeclub/kits/organizations.seed.json
backend/seeds/examples/bikeclub/kits/auth-users.seed.json
backend/seeds/examples/bikeclub/kits/customers.seed.json
backend/seeds/examples/bikeclub/kits/catalog.seed.json
backend/seeds/examples/bikeclub/kits/subscriptions.seed.json
```
