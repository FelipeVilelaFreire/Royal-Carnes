# Client Catalog Kit

Fluxo de catalogo visto pelo cliente.

Inclui:

```text
colecoes
categorias
produtos
variants
precos publicados
disponibilidade exibivel
```

Regra de preco e estoque continua no backend.

Mapa vertical:

```text
docs/kits/kit-02-catalog-shared-core-map.md
contract.md
flow.md
```

Arquivos runtime:

```text
contracts/catalog.contract.ts
api/catalog.api.ts
hooks/useClientCatalog.ts
hooks/useClientProductDetail.ts
mappers/catalog.mapper.ts
view-models/catalog.view-model.ts
```

Nao inclui:

```text
criar produto
editar preco
controle de estoque
permissao admin
regra de assinatura
```
