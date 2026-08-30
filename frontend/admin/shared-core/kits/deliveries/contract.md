# Admin Deliveries Contract

## Backend Real

```text
GET  /api/v1/deliveries/config/
GET  /api/v1/deliveries/admin/deliveries/
POST /api/v1/deliveries/admin/deliveries/
GET  /api/v1/deliveries/admin/deliveries/:id/
POST /api/v1/deliveries/admin/deliveries/:id/transition/
POST /api/v1/deliveries/admin/deliveries/:id/confirm/
```

## DTOs

```text
AdminDeliveryConfigDto
AdminDeliveryStatusDto
AdminDeliveryDto
AdminDeliveryPackageDto
AdminDeliveryStatusHistoryDto
AdminDeliveryConfirmationDto
AdminDeliveryCreateDto
AdminDeliveryTransitionDto
AdminDeliveryConfirmDto
```

## Views

```text
AdminDeliveryConfigView -> DeliveryConfigBase
AdminDeliveryView -> DeliveryBase
AdminDeliveryPackageView -> DeliveryPackageBase
AdminDeliveryStatusHistoryView -> DeliveryStatusHistoryBase
AdminDeliveryConfirmationView -> DeliveryConfirmationBase
```

## Inputs

```text
AdminDeliveryCreateInput
AdminDeliveryTransitionInput
AdminDeliveryConfirmInput
```

## Regras Que Nao Moram Aqui

```text
deliveries.read/manage
status inicial
transicao permitida
status terminal
confirmacao move para terminal quando configurado
duplicidade de delivery por pedido
```

Essas regras continuam no backend.
