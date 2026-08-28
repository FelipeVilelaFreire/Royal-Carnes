from decimal import Decimal, ROUND_HALF_UP

from django.db import transaction

from apps.catalog.models import CommercialMode, Product, ProductPrice, ProductVariant
from apps.core.code_sequences import generate_code
from apps.inventory.models import InventoryItem, InventoryMovement
from apps.inventory.services import InventoryValidationError, adjust_inventory_item

from .models import Order, OrderItem, OrderKindDefinition, OrderStatusDefinition, OrderStatusHistory


class OrderValidationError(ValueError):
    def __init__(self, code: str, detail: str):
        self.code = code
        self.detail = detail
        super().__init__(detail)


@transaction.atomic
def upsert_order_kind(
    *,
    organization,
    key: str,
    label: str,
    commercial_mode_key: str | None = None,
    code_sequence_key: str = "orders",
    requires_inventory: bool = True,
    creates_delivery: bool = True,
    is_active: bool = True,
    sort_order: int = 0,
    metadata: dict | None = None,
) -> OrderKindDefinition:
    commercial_mode = None
    if commercial_mode_key:
        commercial_mode = CommercialMode.objects.get(organization=organization, key=commercial_mode_key)
    kind, _created = OrderKindDefinition.objects.update_or_create(
        organization=organization,
        key=key,
        defaults={
            "label": label,
            "commercial_mode": commercial_mode,
            "code_sequence_key": code_sequence_key,
            "requires_inventory": requires_inventory,
            "creates_delivery": creates_delivery,
            "is_active": is_active,
            "sort_order": sort_order,
            "metadata": metadata or {},
        },
    )
    return kind


@transaction.atomic
def upsert_order_status(
    *,
    organization,
    key: str,
    label: str,
    sort_order: int = 0,
    is_initial: bool = False,
    is_terminal: bool = False,
    is_public: bool = True,
    allowed_next_keys: list[str] | None = None,
    effects: dict | None = None,
    metadata: dict | None = None,
) -> OrderStatusDefinition:
    status, _created = OrderStatusDefinition.objects.update_or_create(
        organization=organization,
        key=key,
        defaults={
            "label": label,
            "sort_order": sort_order,
            "is_initial": is_initial,
            "is_terminal": is_terminal,
            "is_public": is_public,
            "allowed_next_keys": allowed_next_keys or [],
            "effects": effects or {},
            "metadata": metadata or {},
        },
    )
    return status


def initial_order_status(organization) -> OrderStatusDefinition:
    status = OrderStatusDefinition.objects.filter(organization=organization, is_initial=True).order_by("sort_order").first()
    if status is None:
        raise OrderValidationError("order_initial_status_not_configured", "Order initial status is not configured")
    return status


def resolve_product_price(*, organization, product: Product, variant: ProductVariant | None, commercial_mode: CommercialMode | None) -> ProductPrice:
    queryset = ProductPrice.objects.filter(organization=organization, product=product)
    if commercial_mode is not None:
        queryset = queryset.filter(commercial_mode=commercial_mode)
    variant_price = queryset.filter(variant=variant, collection__isnull=True).first() if variant else None
    if variant_price:
        return variant_price
    price = queryset.filter(variant__isnull=True, collection__isnull=True).first()
    if price is None:
        raise OrderValidationError("product_price_not_found", "Product price not found")
    return price


def inventory_item_for_order_item(*, organization, product: Product, variant: ProductVariant | None) -> InventoryItem:
    queryset = InventoryItem.objects.filter(organization=organization, product=product)
    if variant is not None:
        item = queryset.filter(variant=variant).first()
    else:
        item = queryset.filter(variant__isnull=True).first()
    if item is None:
        raise OrderValidationError("inventory_item_not_found", "Inventory item not found")
    return item


@transaction.atomic
def create_order(
    *,
    organization,
    customer,
    kind_key: str,
    items: list[dict],
    address=None,
    subscription=None,
    subscription_cycle=None,
    notes: str = "",
    actor=None,
) -> Order:
    if customer.organization_id != organization.id:
        raise OrderValidationError("customer_organization_mismatch", "Customer must belong to organization")
    if address is not None and (address.organization_id != organization.id or address.customer_id != customer.id):
        raise OrderValidationError("address_mismatch", "Address must belong to customer and organization")
    if subscription is not None and subscription.organization_id != organization.id:
        raise OrderValidationError("subscription_organization_mismatch", "Subscription must belong to organization")
    if subscription_cycle is not None and subscription_cycle.organization_id != organization.id:
        raise OrderValidationError("subscription_cycle_organization_mismatch", "Subscription cycle must belong to organization")
    if not items:
        raise OrderValidationError("order_items_required", "Order requires at least one item")

    kind = OrderKindDefinition.objects.select_related("commercial_mode").get(
        organization=organization,
        key=kind_key,
        is_active=True,
    )
    status = initial_order_status(organization)
    order = Order.objects.create(
        organization=organization,
        customer=customer,
        address=address,
        subscription=subscription,
        subscription_cycle=subscription_cycle,
        code=generate_code(organization=organization, key=kind.code_sequence_key),
        kind_key=kind.key,
        status_key=status.key,
        currency=organization.currency,
        notes=notes,
    )
    subtotal_cents = 0
    for item_data in items:
        product = Product.objects.get(organization=organization, key=item_data["product_key"])
        variant = None
        if item_data.get("variant_sku"):
            variant = ProductVariant.objects.select_related("measurement_unit").get(
                organization=organization,
                sku=item_data["variant_sku"],
            )
            if variant.product_id != product.id:
                raise OrderValidationError("variant_product_mismatch", "Variant does not belong to product")
        measurement_unit = variant.measurement_unit if variant else None
        price = resolve_product_price(
            organization=organization,
            product=product,
            variant=variant,
            commercial_mode=kind.commercial_mode,
        )
        quantity = Decimal(str(item_data["quantity"]))
        if quantity <= 0:
            raise OrderValidationError("order_item_quantity_invalid", "Order item quantity must be greater than zero")
        total_cents = int((Decimal(price.amount_cents) * quantity).to_integral_value(rounding=ROUND_HALF_UP))
        OrderItem.objects.create(
            organization=organization,
            order=order,
            product=product,
            variant=variant,
            measurement_unit=measurement_unit,
            name_snapshot=variant.name if variant else product.name,
            quantity=quantity,
            unit_price_cents=price.amount_cents,
            total_cents=total_cents,
            weight_grams=variant.weight_grams if variant else None,
            source_type=item_data.get("source_type", ""),
            source_key=item_data.get("source_key", ""),
            metadata=item_data.get("metadata", {}),
        )
        subtotal_cents += total_cents
        if kind.requires_inventory:
            inventory_item = inventory_item_for_order_item(
                organization=organization,
                product=product,
                variant=variant,
            )
            try:
                adjust_inventory_item(
                    organization=organization,
                    item=inventory_item,
                    reserved_delta=quantity,
                    movement_type=InventoryMovement.MovementType.RESERVATION,
                    reason=f"Order {order.code}",
                    actor=actor,
                    metadata={"orderCode": order.code},
                )
            except InventoryValidationError as error:
                raise OrderValidationError(error.code, error.detail) from error
    order.subtotal_cents = subtotal_cents
    order.total_cents = max(subtotal_cents - order.discount_cents + order.freight_cents, 0)
    order.save(update_fields=["subtotal_cents", "total_cents", "updated_at"])
    OrderStatusHistory.objects.create(
        organization=organization,
        order=order,
        to_status_key=status.key,
        actor=actor,
        note="Order created",
    )
    if kind.creates_delivery:
        from apps.deliveries.services import create_delivery_for_order

        create_delivery_for_order(
            organization=organization,
            order=order,
            actor=actor,
        )
    return order


@transaction.atomic
def transition_order_status(*, organization, order: Order, to_status_key: str, actor=None, note: str = "") -> Order:
    if order.organization_id != organization.id:
        raise OrderValidationError("organization_mismatch", "Order must belong to organization")
    current_status = OrderStatusDefinition.objects.get(organization=organization, key=order.status_key)
    next_status = OrderStatusDefinition.objects.get(organization=organization, key=to_status_key)
    if current_status.is_terminal:
        raise OrderValidationError("order_status_terminal", "Order status is terminal")
    allowed_next_keys = current_status.allowed_next_keys or []
    if allowed_next_keys and next_status.key not in allowed_next_keys:
        raise OrderValidationError("order_status_transition_not_allowed", "Order status transition is not allowed")
    previous = order.status_key
    order.status_key = next_status.key
    order.save(update_fields=["status_key", "updated_at"])
    OrderStatusHistory.objects.create(
        organization=organization,
        order=order,
        from_status_key=previous,
        to_status_key=next_status.key,
        actor=actor,
        note=note,
    )
    return order
