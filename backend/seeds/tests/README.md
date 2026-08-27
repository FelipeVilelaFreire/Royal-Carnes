# Test Seeds

Status inicial: `planned`

Fixtures pequenas para testes automatizados.

Regra:

```text
deterministico
rapido
minimo
sem depender de copy real de Royal Carnes
```

Primeiro alvo:

```text
1 organization
1 owner
1 customer
2 collections
3 products
1 order quando orders existir
```

Arquivo de seed:

```text
backend/seeds/tests/minimal.seed.manifest.json
backend/seeds/tests/kits/organizations.seed.json
backend/seeds/tests/kits/auth-users.seed.json
backend/seeds/tests/kits/customers.seed.json
backend/seeds/tests/kits/catalog.seed.json
backend/seeds/tests/kits/subscriptions.seed.json
```
