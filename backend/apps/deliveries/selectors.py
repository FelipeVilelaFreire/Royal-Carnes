from apps.deliveries.models import Shipment, DispatchBatch

def list_shipments_by_organization(organization_id: str):
    return Shipment.objects.filter(organization_id=organization_id).prefetch_related("items").order_by("-scheduled_date")

def list_shipments_by_customer(customer_id: str):
    return Shipment.objects.filter(customer_id=customer_id).prefetch_related("items").order_by("-scheduled_date")

def list_dispatch_batches(organization_id: str):
    return DispatchBatch.objects.filter(organization_id=organization_id).order_by("-batch_date")
