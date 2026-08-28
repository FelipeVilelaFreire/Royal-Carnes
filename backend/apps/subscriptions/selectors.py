from django.db.models import Prefetch

from .models import Plan, PlanEntitlement, Subscription, SubscriptionCycle, SubscriptionCycleItem


ENTITLEMENT_SELECT_RELATED = (
    "collection",
    "category",
    "product",
    "variant",
    "measurement_unit",
)


PLAN_PREFETCH = Prefetch(
    "entitlements",
    queryset=PlanEntitlement.objects.select_related(*ENTITLEMENT_SELECT_RELATED),
)


CYCLE_ITEM_PREFETCH = Prefetch(
    "items",
    queryset=SubscriptionCycleItem.objects.select_related(
        "entitlement",
        "product",
        "variant",
        "measurement_unit",
    ),
)


def public_plans_for_organization(organization):
    return (
        Plan.objects.filter(organization=organization, status=Plan.Status.ACTIVE)
        .prefetch_related("prices", PLAN_PREFETCH)
    )


def admin_plans_for_organization(organization):
    return Plan.objects.filter(organization=organization).prefetch_related(
        "prices",
        PLAN_PREFETCH,
    )


def active_subscription_for_customer(organization, customer):
    return (
        Subscription.objects.filter(
            organization=organization,
            customer=customer,
            status=Subscription.Status.ACTIVE,
        )
        .select_related("customer", "plan")
        .prefetch_related("plan__prices", "plan__entitlements", "cycles")
        .first()
    )


def subscriptions_for_organization(organization):
    return (
        Subscription.objects.filter(organization=organization)
        .select_related("customer", "plan")
        .prefetch_related("cycles")
    )


def cycles_for_organization(organization):
    return (
        SubscriptionCycle.objects.filter(organization=organization)
        .select_related("subscription", "subscription__customer", "subscription__plan")
        .prefetch_related(CYCLE_ITEM_PREFETCH)
    )


def current_cycle_for_subscription(subscription):
    return (
        SubscriptionCycle.objects.filter(
            organization=subscription.organization,
            subscription=subscription,
            status=SubscriptionCycle.Status.OPEN,
        )
        .prefetch_related(CYCLE_ITEM_PREFETCH)
        .order_by("-starts_at", "-cycle_number")
        .first()
    )
