# Admin Catalog Kit

Status:

```text
local foundation
```

## O Que Este Kit Faz

Organiza a operacao admin de produtos, categorias, variants, precos, midias e
disponibilidade.

Ordem interna correta:

```text
1. Categorias
2. Colecoes
3. Unidades de medida
4. Produtos
5. Variantes
6. Precos
7. Midia
8. Disponibilidade por modo comercial
```

Produto nao deve ser tratado como registro solto. Produto precisa de categoria,
unidade, preco base e modo comercial para ser vendavel no admin.

## Backend

```text
backend/apps/catalog/
backend/API_CONTRACTS.md
```

Mapa de arquivos reais:

```text
backend/apps/catalog/models.py
  -> Collection, Category, Product, ProductCategory, ProductVariant,
     ProductMedia, ProductPrice, MeasurementUnit, CommercialMode e
     disponibilidade/preco relacionados

backend/apps/catalog/selectors.py
  -> list/detail para produtos, categorias, colecoes, unidades e modos
  -> deve concentrar prefetch de categorias, colecoes, variants, prices e media

backend/apps/catalog/services.py
  -> criar/atualizar produto, categoria, colecao, preco e relacoes
  -> backend valida obrigatoriedade real de categoria/unidade/preco

backend/apps/catalog/serializers.py
  -> DTOs admin/public e inputs de create/update
  -> traduz FKs/keys para models sem deixar o frontend decidir regra

backend/apps/catalog/views.py
  -> endpoints admin/public de catalogo

backend/apps/catalog/urls.py
  -> rotas publicadas de catalogo

backend/apps/catalog/tests/test_api.py
  -> seed, list/detail/create/update e permissoes

backend/apps/catalog/migrations/
  -> schema de categorias, colecoes, imagens, variantes, unidades e precos
```

Endpoints principais:

```text
GET /api/v1/catalog/admin/categories/
POST /api/v1/catalog/admin/categories/
GET /api/v1/catalog/admin/categories/:id/
PATCH /api/v1/catalog/admin/categories/:id/
GET /api/v1/catalog/admin/collections/
POST /api/v1/catalog/admin/collections/
GET /api/v1/catalog/admin/collections/:id/
PATCH /api/v1/catalog/admin/collections/:id/
GET /api/v1/catalog/admin/measurement-units/
GET /api/v1/catalog/admin/commercial-modes/
GET /api/v1/catalog/admin/products/
POST /api/v1/catalog/admin/products/
GET /api/v1/catalog/admin/products/:id/
PATCH /api/v1/catalog/admin/products/:id/
```

## Admin Shared-Core

```text
frontend/admin/shared-core/contracts/catalog.contract.ts
frontend/admin/shared-core/api/catalog.api.ts
frontend/admin/shared-core/hooks/useAdminCatalog.ts
frontend/admin/shared-core/hooks/useAdminProductDetail.ts
frontend/admin/shared-core/mappers/catalog.mapper.ts
frontend/admin/shared-core/view-models/catalog.view-model.ts
frontend/admin/shared-core/manifest/pages/produtos.config.jsx
frontend/admin/shared-core/manifest/pages/categorias.config.jsx
frontend/admin/shared-core/manifest/pages/colecoes.config.jsx
```

Responsabilidade por arquivo:

```text
contracts/catalog.contract.ts
  -> DTOs/inputs de produto, categoria, colecao, unidade, preco e modo comercial

api/catalog.api.ts
  -> list/detail/create/update reais para catalogo admin
  -> sources auxiliares: categorias, colecoes, unidades e commercialModes

hooks/useAdminCatalog.ts
hooks/useAdminProductDetail.ts
hooks/useAdminProductForm.ts
  -> ainda servem para fluxos especificos fora do standard quando necessario

mappers/catalog.mapper.ts
  -> DTO -> modelo admin
  -> preserva keys/ids para selects e payloads

view-models/catalog.view-model.ts
  -> rows de listagem
  -> detail fields
  -> options para categorias/colecoes/unidades/modos
  -> labels de status/preco/unidade/imagem

data-sources/standard.data-source.ts
  -> conecta categorias, colecoes, produtos e fontes auxiliares ao StandardScreen

manifest/pages/categorias.config.jsx
manifest/pages/colecoes.config.jsx
manifest/pages/produtos.config.jsx
  -> colunas, tabs, fields, required, editable, multiSelect, currency e asset

locales/pt-BR.ts
  -> copy das telas de catalogo, fields, tabs, empty e acoes
```

Campos importantes por tela:

```text
Categorias
  ListPage -> Nome, Chave, Categoria pai, Ordem, Status
  DetailPage -> Nome, Chave, Categoria pai, Ordem, Status
  AddPage -> Nome, Chave, Categoria pai opcional, Ordem, Status
  Obs -> deixar Categoria pai vazio torna a categoria uma categoria pai

Colecoes
  ListPage -> Nome, Chave, Produtos, Status
  DetailPage -> Nome, Chave, Imagem, Descricao, Produtos, Ordem, Status
  AddPage futuro -> Nome, Chave, Imagem, Descricao, Ordem, Status

Produtos
  ListPage -> Produto/Imagem, Categoria, Unidade, Preco, Status
  DetailPage -> Dados, Precos, Midia
  AddPage -> Chave, Nome, Descricao, Status, Unidade, Categorias,
     Preco base, Modos comerciais, Colecoes, Imagem
```

Controles standard usados:

```text
multiSelect
  -> categorias, colecoes e modos comerciais

currency
  -> preco base e precos editaveis em centavos no backend

asset
  -> imagem primaria com preview/URL/upload local futuro
```

## Render Admin

```text
ListPage -> produtos
DetailPage -> detalhe do produto
AddPage -> criar produto
```

Arquivos render que devem ser conferidos ao mexer:

```text
frontend/admin/web/src/engines/rendering/screen-types/standard/pages/ListPage/ListPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/pages/DetailPage/DetailPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/pages/AddPage/AddPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/components/LineItemsEditor/LineItemsEditor.tsx
```

Fluxo esperado de Produto:

```text
ListPage
  -> mostra imagem, nome, categoria principal, unidade, preco e status

DetailPage
  -> Dados: nome, chave, descricao, status, unidade, categorias, colecoes,
     modos comerciais e variantes resumidas
  -> Precos: lista/edicao de preco base e futuro preco por modo/variant
  -> Midia: imagem primaria via asset

AddPage
  -> exige nome, chave, unidade, categoria, preco base e modo comercial
  -> categoria e colecao vem do backend, nunca de array hardcoded no TSX
```

## Proximo Passo

```text
validar criar/editar categoria, colecao e produto no browser
garantir que produto exige categoria/unidade/preco base
evoluir variantes e precos por modo comercial sem regra no TSX
```

Checklist antes de considerar completo:

```text
seed cria categorias e colecoes suficientes para selects
categorias List/Detail/Add funcionam e persistem
colecoes List/Detail/Add funcionam e imagem aparece
produtos List mostra imagem real/URL quando existir
produto Add exige categoria/unidade/preco base
produto Detail edita multiSelect sem quebrar layout
currency salva amount_cents correto
asset nao transforma upload local em falso sucesso
npm run build:admin passa
py manage.py test apps.catalog passa quando backend for alterado
git diff --check passa
```
