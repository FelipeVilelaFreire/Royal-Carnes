# Client Deliveries Contract

## Backend Real

```text
GET /api/v1/deliveries/config/
GET /api/v1/deliveries/me/
GET /api/v1/deliveries/me/:id/
```

## DTOs

```text
ClientDeliveryConfigDto
ClientDeliveryStatusDto
ClientDeliveryDto
ClientDeliveryPackageDto
ClientDeliveryStatusHistoryDto
ClientDeliveryConfirmationDto
```

## Views

```text
ClientDeliveryConfigView -> DeliveryConfigBase
ClientDeliveryView -> DeliveryBase
ClientDeliveryPackageView -> DeliveryPackageBase
ClientDeliveryStatusHistoryView -> DeliveryStatusHistoryBase
ClientDeliveryConfirmationView -> DeliveryConfirmationBase
```

## Regras Que Nao Moram Aqui

```text
criacao de delivery
status inicial
workflow logistico
confirmacao
scheduling
permissao operacional
```

Essas regras continuam em `backend/apps/deliveries/services.py`.
