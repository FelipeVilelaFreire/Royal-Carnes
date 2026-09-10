# Admin Customers Kit

Status:

```text
local foundation
```

## O Que Este Kit Faz

Organiza a operacao admin de clientes: cadastro, contato, documento, status,
enderecos e relacionamento com assinaturas, pedidos e pagamentos.

Cliente e a primeira base funcional do admin. Sem cliente, pedido, assinatura e
pagamento ficam sem dono operacional.

## Backend

```text
backend/apps/customers/
backend/API_CONTRACTS.md
```

Mapa de arquivos reais:

```text
backend/apps/customers/models.py
  -> Customer e Address
  -> dono dos campos persistidos de cliente/endereco

backend/apps/customers/selectors.py
  -> queries de list/detail/admin
  -> deve centralizar prefetch/select_related quando relacoes crescerem

backend/apps/customers/serializers.py
  -> DTOs de list/detail/create/update
  -> valida payload antes de chegar no service/model

backend/apps/customers/services.py
  -> use-cases de criar/atualizar cliente/endereco quando a regra nao for
     simples CRUD

backend/apps/customers/views.py
  -> endpoints admin e cliente
  -> nao deve conter regra extensa que pertence a selectors/services

backend/apps/customers/urls.py
  -> rotas publicadas para customers

backend/apps/customers/tests/test_api.py
  -> testes de API, permissao, create/update e isolamento por organization

backend/apps/customers/migrations/
  -> schema persistido
```

Endpoints principais:

```text
GET /api/v1/customers/admin/customers/
POST /api/v1/customers/admin/customers/
GET /api/v1/customers/admin/customers/:id/
PATCH /api/v1/customers/admin/customers/:id/
GET /api/v1/customers/admin/addresses/
```

## Admin Shared-Core

```text
frontend/admin/shared-core/contracts/customers.contract.ts
frontend/admin/shared-core/api/customers.api.ts
frontend/admin/shared-core/mappers/customers.mapper.ts
frontend/admin/shared-core/view-models/customers.view-model.ts
frontend/admin/shared-core/data-sources/standard.data-source.ts
frontend/admin/shared-core/manifest/pages/clientes.config.jsx
frontend/admin/shared-core/locales/pt-BR.ts
```

Responsabilidade por arquivo:

```text
contracts/customers.contract.ts
  -> tipos DTO/input/status que a tela pode conhecer

api/customers.api.ts
  -> unica porta HTTP do admin para clientes/endereco
  -> monta headers e endpoints reais

mappers/customers.mapper.ts
  -> converte DTO em modelo interno estavel
  -> normaliza campos opcionais sem criar regra comercial

view-models/customers.view-model.ts
  -> prepara row, detail, badges, labels de status e texto composto

data-sources/standard.data-source.ts
  -> conecta resourceKey clientes ao api/mapper/view-model
  -> entrega list/detail/add/update para StandardScreen

manifest/pages/clientes.config.jsx
  -> define columns, tabs, fields, required, editable e sources

locales/pt-BR.ts
  -> copy de titulo, subtitulo, campos, tabs, empty/error e botoes
```

## Render Admin

```text
ListPage -> clientes
DetailPage -> dados, enderecos e historico
AddPage -> criar cliente
```

Arquivos render que devem ser conferidos ao mexer:

```text
frontend/admin/web/src/engines/rendering/screen-types/standard/StandardScreen.tsx
  -> escolhe ListPage/DetailPage/AddPage pelo config

frontend/admin/web/src/engines/rendering/screen-types/standard/pages/ListPage/ListPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/pages/ListPage/ListPage.module.css
  -> tabela, busca, filtros, empty/error

frontend/admin/web/src/engines/rendering/screen-types/standard/pages/DetailPage/DetailPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/pages/DetailPage/DetailPage.module.css
  -> tabs, fields, edit mode, save/cancel

frontend/admin/web/src/engines/rendering/screen-types/standard/pages/AddPage/AddPage.tsx
frontend/admin/web/src/engines/rendering/screen-types/standard/pages/AddPage/AddPage.module.css
  -> sections, fields e submit
```

Campos atuais:

```text
ListPage
  -> Cliente
  -> E-mail
  -> Telefone
  -> Documento
  -> Status
  -> Enderecos

DetailPage
  Dados
    -> Nome
    -> E-mail
    -> Telefone
    -> Documento
    -> Status
    -> Cliente desde

  Enderecos
    -> Endereco padrao
    -> Quantidade de enderecos

  Historico
    -> Criado em
    -> Atualizado em

AddPage
  Identidade
    -> Nome obrigatorio
    -> Documento opcional

  Contato
    -> E-mail
    -> Telefone
```

## Regras Do Admin

```text
nao ter coluna Acoes so para preencher tabela
DetailPage deve manter cabecalho parado e trocar somente campos por inputs
status editavel vem de select/manifest
documento e dado cadastral para CPF/CNPJ ou equivalente, nao regra de negocio
enderecos devem vir do backend e alimentar selects de assinatura/pedido/entrega
```

## Proximo Passo

```text
validar criar/editar cliente no browser
expandir endereco com Add/Edit proprio
exibir relacoes reais: assinaturas, pedidos e pagamentos do cliente
ligar usuario de portal quando auth cliente estiver na fase certa
```

Checklist antes de considerar completo:

```text
GET list mostra seed real
POST cria cliente e aparece na lista
PATCH edita nome/email/telefone/documento/status
refresh mantem alteracao
enderecos alimentam select de assinatura
erro 400/401/500 aparece como erro real
npm run build:admin passa
git diff --check passa
```
