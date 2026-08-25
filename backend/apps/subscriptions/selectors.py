from apps.subscriptions.models import Subscription

def list_subscriptions_by_organization(organization_id: str):
    return Subscription.objects.filter(organization_id=organization_id).select_related("customer", "plan").order_by("-created_at")

def list_subscriptions_by_customer(customer_id: str):
    return Subscription.objects.filter(customer_id=customer_id).select_related("plan").order_by("-created_at")

def get_subscription_by_id(subscription_id: str) -> Subscription | None:
    return Subscription.objects.filter(id=subscription_id).select_related("customer", "plan").first()
