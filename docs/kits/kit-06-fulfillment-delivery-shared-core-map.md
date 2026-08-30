# Kit 06 - Fulfillment & Delivery Shared-Core Map

## Objetivo

Fechar o shared-core de Delivery para o contrato backend real:

```text
GET  /api/v1/deliveries/config/
GET  /api/v1/deliveries/me/
GET  /api/v1/deliveries/me/:id/
GET  /api/v1/deliveries/admin/deliveries/
POST /api/v1/deliveries/admin/deliveries/
GET  /api/v1/deliveries/admin/deliveries/:id/
POST /api/v1/deliveries/admin/deliveries/:id/transition/
POST /api/v1/deliveries/admin/deliveries/:id/confirm/
```

Delivery nasce de Order, acompanha status logistico e registra confirmacao. O
backend continua dono de workflow, permissao, criacao e confirmacao.

## Arvore De Propriedade

```text
backend/apps/deliveries/
  models.py
  services.py
  selectors.py
  serializers.py
  views.py
  urls.py

frontend/shared-core/
  types/deliveries.types.ts
  contracts/deliveries.contract.ts

frontend/client/shared-core/
  contracts/deliveries.contract.ts
  api/deliveries.api.ts
  mappers/deliveries.mapper.ts
  view-models/deliveries.view-model.ts
  hooks/useClientDeliveries.ts
  hooks/useClientDeliveryDetail.ts
  kits/deliveries/README.md
  kits/deliveries/contract.md
  kits/deliveries/flow.md

frontend/admin/shared-core/
  contracts/deliveries.contract.ts
  api/deliveries.api.ts
  mappers/deliveries.mapper.ts
  view-models/deliveries.view-model.ts
  hooks/useAdminDeliveries.ts
  hooks/useAdminDeliveryDetail.ts
  hooks/useAdminDeliveryTransition.ts
  hooks/useAdminDeliveryConfirm.ts
  hooks/useAdminDeliveryForm.ts
  kits/deliveries/README.md
  kits/deliveries/contract.md
  kits/deliveries/flow.md
```

## Fronteira Global

`frontend/shared-core` contem apenas tipos e contratos puros:

```text
DeliveryStatusBase
DeliveryPackageBase
DeliveryStatusHistoryBase
DeliveryConfirmationBase
DeliveryBase
DeliveryConfigBase
DeliveryCreateInputBase
DeliveryTransitionInputBase
DeliveryConfirmInputBase
```

Nao ha fetch, hook, regra de workflow logistico, confirmacao terminal ou
scheduling no global.

## Fronteira Client

`frontend/client/shared-core` cobre:

```text
delivery config publica
listar minhas entregas
abrir detalhe da minha entrega
```

O client nao cria entrega, nao muda status e nao confirma entrega.

## Fronteira Admin

`frontend/admin/shared-core` cobre:

```text
delivery config publica
listar entregas da organization
criar delivery manual por orderId
abrir detalhe admin
transicionar status
confirmar entrega
form readiness minimo
```

Permissoes continuam no backend:

```text
deliveries.read
deliveries.manage
```

## Limites Intencionais

Nao foram implementados:

```text
PATCH delivery
DELETE delivery
package management API
client create/transition/confirm
scheduling
route optimization
driver app
recorrencia logistica
workflow hardcoded por nome de status
```

Status, efeitos e transicoes vem de seed/config e backend.

## Criterio De Pronto

```text
contrato global minimo criado
runtime client alinhado ao backend atual
runtime admin alinhado ao backend atual
docs do kit atualizadas
build client OK
build admin OK
backend check OK
deliveries tests OK
```
