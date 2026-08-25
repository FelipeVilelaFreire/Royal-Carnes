from apps.core.models import Organization, Customer, User

def get_organization_by_slug(slug: str) -> Organization | None:
    return Organization.objects.filter(slug=slug).first()

def get_customer_by_id(customer_id: str) -> Customer | None:
    return Customer.objects.filter(id=customer_id).first()

def get_customer_by_user(user_id: str) -> Customer | None:
    return Customer.objects.filter(user_id=user_id).first()

def list_customers_by_organization(organization_id: str):
    return Customer.objects.filter(organization_id=organization_id).order_by("-created_at")
