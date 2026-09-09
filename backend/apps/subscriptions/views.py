from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from apps.accounts.permissions import require_organization_permission
from apps.catalog.models import MeasurementUnit, Product, ProductVariant
from apps.core.tenant import get_request_organization
from apps.customers.models import Address, Customer

from .models import Plan, Subscription, SubscriptionCycleItem
from .selectors import (
    active_subscription_for_customer,
    admin_plans_for_organization,
    current_cycle_for_subscription,
    cycles_for_organization,
    public_plans_for_organization,
    subscription_for_organization,
    subscriptions_for_organization,
)
from .serializers import (
    AdminPlanSerializer,
    PlanCreateSerializer,
    PlanSerializer,
    SubscriptionCreateSerializer,
    SubscriptionCycleSerializer,
    SubscriptionCycleItemCreateSerializer,
    SubscriptionCycleItemSerializer,
    SubscriptionSerializer,
    SubscriptionUpdateSerializer,
)
from .services import (
    EntitlementValidationError,
    set_plan_price,
    upsert_plan,
    upsert_plan_entitlement,
    upsert_subscription,
    upsert_subscription_cycle_item,
    validate_cycle_item_selection,
)


@api_view(["GET"])
@permission_classes([AllowAny])
def plans(request):
    organization = get_request_organization(request)
    queryset = public_plans_for_organization(organization)
    return Response(PlanSerializer(queryset, many=True).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_subscription(request):
    organization = get_request_organization(request)
    customer = Customer.objects.filter(organization=organization, user=request.user).first()
    if customer is None:
        return Response({"subscription": None})
    subscription = active_subscription_for_customer(organization, customer)
    return Response({"subscription": SubscriptionSerializer(subscription).data if subscription else None})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_current_cycle(request):
    organization = get_request_organization(request)
    customer = Customer.objects.filter(organization=organization, user=request.user).first()
    if customer is None:
        return Response({"cycle": None})
    subscription = active_subscription_for_customer(organization, customer)
    if subscription is None:
        return Response({"cycle": None})
    cycle = current_cycle_for_subscription(subscription)
    return Response({"cycle": SubscriptionCycleSerializer(cycle).data if cycle else None})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def my_current_cycle_items(request):
    organization = get_request_organization(request)
    customer = Customer.objects.filter(organization=organization, user=request.user).first()
    if customer is None:
        return Response(
            {"code": "customer_not_found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    subscription = active_subscription_for_customer(organization, customer)
    if subscription is None:
        return Response(
            {"code": "subscription_not_found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    cycle = current_cycle_for_subscription(subscription)
    if cycle is None:
        return Response(
            {"code": "current_cycle_not_found"},
            status=status.HTTP_404_NOT_FOUND,
        )

    serializer = SubscriptionCycleItemCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data
    try:
        entitlement = subscription.plan.entitlements.select_related(
            "collection",
            "category",
            "product",
            "variant",
            "measurement_unit",
        ).get(key=data["entitlement_key"])
        variant = None
        if data.get("variant_sku"):
            variant = ProductVariant.objects.select_related("product", "measurement_unit").get(
                organization=organization,
                sku=data["variant_sku"],
            )
        if data.get("product_key"):
            product = Product.objects.get(organization=organization, key=data["product_key"])
        elif variant:
            product = variant.product
        else:
            return Response(
                {"code": "product_required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        measurement_unit = None
        if data.get("measurement_unit_key"):
            measurement_unit = MeasurementUnit.objects.get(
                organization=organization,
                key=data["measurement_unit_key"],
            )
        elif variant:
            measurement_unit = variant.measurement_unit
    except ObjectDoesNotExist:
        return Response(
            {"code": "selection_reference_not_found"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        validate_cycle_item_selection(
            organization=organization,
            cycle=cycle,
            entitlement=entitlement,
            product=product,
            variant=variant,
            quantity=data["quantity"],
            measurement_unit=measurement_unit,
        )
    except EntitlementValidationError as error:
        return Response(
            {"code": error.code, "detail": error.detail},
            status=status.HTTP_400_BAD_REQUEST,
        )

    item = upsert_subscription_cycle_item(
        organization=organization,
        cycle=cycle,
        entitlement=entitlement,
        product=product,
        variant=variant,
        quantity=data["quantity"],
        measurement_unit=measurement_unit,
        status=SubscriptionCycleItem.Status.SELECTED,
    )
    return Response(SubscriptionCycleItemSerializer(item).data, status=status.HTTP_201_CREATED)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def admin_plans(request):
    organization = get_request_organization(request)
    if request.method == "GET":
        require_organization_permission(request.user, organization, "plans.read")
        queryset = admin_plans_for_organization(organization)
        return Response(AdminPlanSerializer(queryset, many=True).data)

    require_organization_permission(request.user, organization, "plans.manage")
    serializer = PlanCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data
    plan = upsert_plan(
        organization=organization,
        key=data["key"],
        name=data["name"],
        description=data.get("description", ""),
        status=data.get("status", Plan.Status.ACTIVE),
        billing_interval=data.get("billing_interval", Plan.BillingInterval.MONTH),
        trial_days=data.get("trial_days", 0),
        sort_order=data.get("sort_order", 0),
    )
    if "price_cents" in data:
        set_plan_price(
            organization=organization,
            plan=plan,
            amount_cents=data["price_cents"],
            currency=organization.currency,
            billing_interval=plan.billing_interval,
        )
    try:
        for sort_order, entitlement_data in enumerate(data.get("entitlements", [])):
            upsert_plan_entitlement(
                organization=organization,
                plan=plan,
                key=entitlement_data["key"],
                target_type=entitlement_data["target_type"],
                target_key=entitlement_data["target_key"],
                quantity=entitlement_data["quantity"],
                measurement_unit_key=entitlement_data.get("measurement_unit_key"),
                constraints=entitlement_data.get("constraints", {}),
                sort_order=entitlement_data.get("sort_order", sort_order),
            )
    except ObjectDoesNotExist:
        return Response({"code": "plan_entitlement_reference_not_found"}, status=status.HTTP_400_BAD_REQUEST)
    except EntitlementValidationError as error:
        return Response({"code": error.code, "detail": error.detail}, status=status.HTTP_400_BAD_REQUEST)
    return Response(AdminPlanSerializer(plan).data, status=status.HTTP_201_CREATED)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def admin_subscriptions(request):
    organization = get_request_organization(request)
    if request.method == "GET":
        require_organization_permission(request.user, organization, "subscriptions.read")
        queryset = subscriptions_for_organization(organization)
        return Response(SubscriptionSerializer(queryset, many=True).data)

    require_organization_permission(request.user, organization, "subscriptions.manage")
    serializer = SubscriptionCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data
    try:
        customer = Customer.objects.get(organization=organization, id=data["customer_id"])
        plan = Plan.objects.get(organization=organization, key=data["plan_key"])
        default_delivery_address = None
        if data.get("default_delivery_address_id"):
            default_delivery_address = Address.objects.get(
                organization=organization,
                customer=customer,
                id=data["default_delivery_address_id"],
            )
    except ObjectDoesNotExist:
        return Response({"code": "subscription_reference_not_found"}, status=status.HTTP_400_BAD_REQUEST)
    subscription = upsert_subscription(
        organization=organization,
        customer=customer,
        plan=plan,
        status=data["status"],
        started_at=data.get("started_at") or timezone.now(),
    )
    subscription.default_delivery_address = default_delivery_address
    subscription.preferred_delivery_day = data.get("preferred_delivery_day", "")
    subscription.delivery_window = data.get("delivery_window", "")
    subscription.delivery_preferences = data.get("delivery_preferences", "")
    subscription.internal_notes = data.get("internal_notes", "")
    subscription.save()
    return Response(SubscriptionSerializer(subscription).data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def admin_subscription_detail(request, subscription_id):
    organization = get_request_organization(request)
    if request.method == "GET":
        require_organization_permission(request.user, organization, "subscriptions.read")
        try:
            subscription = subscription_for_organization(organization, subscription_id)
        except Subscription.DoesNotExist:
            return Response({"code": "subscription_not_found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(SubscriptionSerializer(subscription).data)

    require_organization_permission(request.user, organization, "subscriptions.manage")
    serializer = SubscriptionUpdateSerializer(data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data
    try:
        subscription = subscription_for_organization(organization, subscription_id)
        if "plan_key" in data:
            subscription.plan = Plan.objects.get(organization=organization, key=data["plan_key"])
        if "default_delivery_address_id" in data:
            address_id = data["default_delivery_address_id"]
            subscription.default_delivery_address = (
                None
                if address_id is None
                else Address.objects.get(
                    organization=organization,
                    customer=subscription.customer,
                    id=address_id,
                )
            )
    except ObjectDoesNotExist:
        return Response({"code": "subscription_reference_not_found"}, status=status.HTTP_400_BAD_REQUEST)

    for field in (
        "status",
        "started_at",
        "ended_at",
        "current_cycle_starts_at",
        "current_cycle_ends_at",
        "cancelled_at",
        "cancel_reason",
        "preferred_delivery_day",
        "delivery_window",
        "delivery_preferences",
        "internal_notes",
    ):
        if field in data:
            setattr(subscription, field, data[field])

    if data.get("status") == Subscription.Status.CANCELLED and subscription.cancelled_at is None:
        subscription.cancelled_at = timezone.now()
    if data.get("status") and data["status"] != Subscription.Status.CANCELLED:
        subscription.cancelled_at = None
        subscription.cancel_reason = data.get("cancel_reason", "")

    subscription.save()
    subscription = subscription_for_organization(organization, subscription.id)
    return Response(SubscriptionSerializer(subscription).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_cycles(request):
    organization = get_request_organization(request)
    require_organization_permission(request.user, organization, "subscriptions.read")
    queryset = cycles_for_organization(organization)
    return Response(SubscriptionCycleSerializer(queryset, many=True).data)
