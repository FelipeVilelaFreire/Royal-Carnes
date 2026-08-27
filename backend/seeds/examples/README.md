# Example Seeds

Status inicial: `planned`

Seeds pequenos para provar que o backend nao ficou preso em Royal Carnes.

Regra:

```text
seed exemplo valida reuso
seed exemplo nao tenta virar produto completo
```

Primeiro exemplo:

```text
backend/seeds/examples/bikeclub/
```

Segundo exemplo:

```text
backend/seeds/examples/camisaclub/
```

Cada exemplo deve ter:

```text
README.md
seed.manifest.json
kits/
  organizations.seed.json
  auth-users.seed.json
  customers.seed.json
  catalog.seed.json
  subscriptions.seed.json
```

Regra:

```text
o README explica o motivo do exemplo
o seed.manifest.json lista os modulos do seed
kits/*.seed.json contem dados executaveis pelo comando futuro de seed
```
