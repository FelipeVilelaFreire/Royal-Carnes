# Backend Seeds

Status inicial: `planned`

Esta pasta guarda o contrato de seeds do backend. Os comandos reais ainda nao
existem, mas a organizacao ja fica definida antes de codar.

Regra central:

```text
codigo define capacidade generica
seed veste a capacidade para um negocio
```

## Tree Alvo

```text
backend/seeds/
  README.md
  royalprime/
    README.md
    seed.manifest.json
    kits/
      organizations.seed.json
      auth-users.seed.json
      customers.seed.json
      catalog.seed.json
      subscriptions.seed.json
  examples/
    README.md
    bikeclub/
      README.md
      seed.manifest.json
      kits/
        organizations.seed.json
        auth-users.seed.json
        customers.seed.json
        catalog.seed.json
        subscriptions.seed.json
    camisaclub/
      README.md
      seed.manifest.json
      kits/
        organizations.seed.json
        auth-users.seed.json
        customers.seed.json
        catalog.seed.json
        subscriptions.seed.json
  tests/
    README.md
    minimal.seed.manifest.json
    kits/
      organizations.seed.json
      auth-users.seed.json
      customers.seed.json
      catalog.seed.json
      subscriptions.seed.json
```

## Tipos

```text
royalprime
  -> seed principal Royal Carnes
  -> valida o produto real

examples
  -> seeds pequenos de dominio alternativo
  -> validam reuso sem prender o modelo em Royal Carnes

tests
  -> fixtures pequenas, deterministicas e rapidas
  -> validam services, selectors e endpoints
```

## Ordem Recomendada

```text
1. royalprime organization
2. royalprime roles/permissoes/users
3. royalprime customers
4. royalprime catalog/collections/products
5. royalprime plans
6. bikeclub exemplo completo pequeno
7. camisaclub exemplo completo pequeno
8. test fixtures minimas
```

## Arquivos De Seed

Seed real:

```text
backend/seeds/royalprime/seed.manifest.json
backend/seeds/royalprime/kits/*.seed.json
```

Seeds exemplo:

```text
backend/seeds/examples/bikeclub/seed.manifest.json
backend/seeds/examples/bikeclub/kits/*.seed.json
backend/seeds/examples/camisaclub/seed.manifest.json
backend/seeds/examples/camisaclub/kits/*.seed.json
```

Seed de teste:

```text
backend/seeds/tests/minimal.seed.manifest.json
backend/seeds/tests/kits/*.seed.json
```

Contrato futuro:

```text
py manage.py seed_backend --seed royalprime
py manage.py seed_backend --seed examples/bikeclub
py manage.py seed_backend --seed examples/camisaclub
py manage.py seed_backend --seed tests/minimal
```

O comando ainda nao existe. Esses arquivos definem o formato alvo.

## Contrato De Manifest

`seed.manifest.json` nao guarda dados de dominio completos. Ele e o indice do
seed e aponta para modulos por kit.

Exemplo:

```json
{
  "seedKey": "royalprime",
  "modules": [
    { "kit": "organizations", "path": "kits/organizations.seed.json" },
    { "kit": "auth-users", "path": "kits/auth-users.seed.json" }
  ]
}
```

Regra:

```text
manifest escolhe quais kits entram no seed
arquivo de kit guarda dados daquela capacidade
```

## Regra

Seed nao pode virar condicional no core.

Exemplo correto:

```text
CommercialMode = entidade/config generica
Royal Delivery = dado/copy do seed Royal Carnes
```
