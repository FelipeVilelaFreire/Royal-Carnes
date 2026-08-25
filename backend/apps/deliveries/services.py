from datetime import date
from apps.core.models import Organization, Customer
from apps.subscriptions.models import Subscription
from apps.deliveries.models import Shipment, ShipmentItem, DispatchBatch

def create_shipment(
    organization: Organization,
    subscription: Subscription,
    customer: Customer,
    scheduled_date: date,
    items: list[dict],
    shipping_address: dict | None = None
) -> Shipment:
    shipment = Shipment.objects.create(
        organization=organization,
        subscription=subscription,
        customer=customer,
        scheduled_date=scheduled_date,
        shipping_address=shipping_address or customer.default_shipping_address
    )
    for item in items:
        ShipmentItem.objects.create(
            shipment=shipment,
            product_name=item["product_name"],
            quantity=item.get("quantity", 1)
        )
    return shipment

def update_shipment_status(shipment: Shipment, status: str, tracking_code: str = "") -> Shipment:
    shipment.status = status
    if tracking_code:
        shipment.tracking_code = tracking_code
    shipment.save()
    return shipment
