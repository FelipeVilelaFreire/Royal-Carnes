from apps.core.models import Organization
from apps.plans.models import Plan

def create_plan(
    organization: Organization,
    key: str,
    name: str,
    price_cents: int,
    billing_frequency: str = "monthly",
    fulfillment_type: str = "physical_delivery",
    metadata: dict | None = None
) -> Plan:
    return Plan.objects.create(
        organization=organization,
        key=key,
        name=name,
        price_cents=price_cents,
        billing_frequency=billing_frequency,
        fulfillment_type=fulfillment_type,
        metadata=metadata or {}
    )
