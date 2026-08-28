# Kit Template

Status inicial: `planned | local | kit-ready | serviceos-candidate`

Fase principal: `Fase X - Nome`

## Objetivo

Descreva a capacidade que este kit resolve.

## Produtos Que Podem Reutilizar

- RoyalPrime;
- outro ecommerce;
- assinatura;
- appointments;
- restaurante;
- admin operacional;
- outro produto especifico.

## Regra Central

```text
Backend faz a regra real.
Shared-core organiza contratos, API clients, hooks e mappers.
Render apenas apresenta e dispara acoes.
```

## Escopo Backend

Responsabilidades:

- responsabilidade 1;
- responsabilidade 2;
- responsabilidade 3.

Arquivos fonte:

```text
backend/apps/<app>/
backend/api/v1/<resource>/
backend/core/<shared>/
```

Entidades esperadas:

- `EntityA`;
- `EntityB`.

Services/use-cases esperados:

- `createSomething`;
- `updateSomething`;
- `listSomething`.

Endpoints esperados:

- `GET /...`;
- `POST /...`;
- `PATCH /...`;

Regras reais:

- regra 1;
- regra 2.

## Escopo Shared-Core

Local inicial:

```text
frontend/client/shared-core
frontend/admin/shared-core
frontend/shared-core
```

Contratos:

- `ContractA`;
- `InputA`;
- `ErrorCodeA`.

API clients:

- `resourceApi.list()`;
- `resourceApi.create(input)`;

Hooks:

- `useResource`;
- `useResourceMutation`;

Mappers:

- API DTO -> view model;
- error code -> locale key.

Arquivos fonte:

```text
frontend/<scope>/shared-core/contracts/<name>.contract.ts
frontend/<scope>/shared-core/api/<name>.api.ts
frontend/<scope>/shared-core/hooks/use<Name>.ts
frontend/<scope>/shared-core/mappers/<name>.mapper.ts
```

## Escopo Render

Responsabilidades:

- screen;
- modal;
- card;
- formulario;
- tabela;
- estado visual local.

Arquivos fonte:

```text
frontend/client/web/src/screens/...
frontend/client/web/src/product-components/...
frontend/admin/web/src/...
```

Proibido na tela:

- regra real;
- calculo de negocio;
- permissao real;
- persistencia direta;
- endpoint direto quando houver hook compartilhavel.

## Generico vs Especifico

Generico:

- item generico 1;
- item generico 2.

Especifico do RoyalPrime:

- copy;
- produto;
- imagem;
- regra comercial local.

## Como Copiar/Adaptar Para Outro Produto

1. Leia este kit.
2. Abra os arquivos fonte.
3. Copie/adapte backend generico.
4. Troque seed/config da organization.
5. Copie/adapte contratos e hooks.
6. Recrie visual na surface do novo produto.
7. Remova copy/regra RoyalPrime.
8. Rode builds/testes.
9. Atualize o kit do novo produto.

## Seeds Esperados

### Seed principal: Royal Carnes

Dados minimos:

- dado real do negocio atual;
- organization `royalprime`;
- roles/permissoes necessarias;
- registros suficientes para validar fluxo real;
- copy e nomes comerciais como dados, nao como regra hardcoded.

### Seed exemplo: dominio alternativo

Dados minimos:

- outra organization pequena;
- nomes comerciais diferentes;
- categorias/produtos/fluxos diferentes;
- somente o suficiente para provar que o contrato e reutilizavel.

### Seed dev

Dados minimos:

- usuarios de desenvolvimento;
- registros previsiveis para testar tela e API manualmente;
- dados que podem ser recriados em banco limpo.

### Seed test

Dados minimos:

- fixture pequena;
- deterministica;
- rapida;
- sem depender de copy real do negocio.

Regra:

```text
codigo define capacidade generica
seed veste a capacidade para um negocio
```

## Criterio Para Kit-Ready

- arquivos reais implementados;
- contratos claros;
- backend separado de render;
- shared-core com hooks/API clients;
- lista de arquivos fonte atualizada;
- pelo menos uma tela consumindo por hook.
- seed principal e seed exemplo documentados.

## Criterio Para ServiceOS Candidate

- reutilizado em segundo produto;
- contrato nao depende de RoyalPrime;
- extracao reduz complexidade;
- API e hooks estao maduros;
- documentacao aponta os arquivos de origem e destino.
