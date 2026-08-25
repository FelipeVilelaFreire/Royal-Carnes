from apps.plans.models import Plan

def list_active_plans_by_organization(organization_id: str):
    return Plan.objects.filter(organization_id=organization_id, is_active=True).order_by("price_cents")

def get_plan_by_id(plan_id: str) -> Plan | None:
    return Plan.objects.filter(id=plan_id).first()

def get_plan_by_key(organization_id: str, key: str) -> Plan | None:
    return Plan.objects.filter(organization_id=organization_id, key=key).first()
