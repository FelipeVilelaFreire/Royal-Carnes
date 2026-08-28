import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from django.conf import settings
from django.db import transaction

from apps.accounts.models import User
from apps.accounts.services import (
    assign_permission_to_role,
    upsert_permission,
    upsert_role,
    upsert_user_with_roles,
)
from apps.customers.services import upsert_customer
from apps.organizations.models import Organization
from apps.catalog.models import (
    Category,
    Collection,
    CommercialMode,
    MeasurementUnit,
    Product,
    ProductVariant,
)
from apps.catalog.services import (
    set_product_availability,
    set_product_collections,
    set_product_media,
    set_product_price,
    upsert_category,
    upsert_collection,
    upsert_commercial_mode,
    upsert_measurement_unit,
    upsert_product,
    set_product_categories,
    upsert_product_variant,
)
from apps.customers.models import Customer
from apps.subscriptions.models import Plan, PlanEntitlement, SubscriptionCycleItem
from apps.subscriptions.services import (
    set_plan_price,
    upsert_plan,
    upsert_plan_entitlement,
    upsert_subscription,
    upsert_subscription_cycle,
    upsert_subscription_cycle_item,
)
from apps.inventory.services import upsert_inventory_item
from apps.core.code_sequences import upsert_code_sequence
from apps.orders.models import Order, OrderKindDefinition, OrderStatusDefinition
from apps.orders.services import (
    create_order,
    transition_order_status,
    upsert_order_kind,
    upsert_order_status,
)
from apps.deliveries.models import Delivery, DeliveryStatusDefinition
from apps.deliveries.services import (
    create_delivery_for_order,
    transition_delivery_status,
    upsert_delivery_status,
)


@dataclass(frozen=True)
class SeedModule:
    kit: str
    path: Path
    data: dict[str, Any]


@dataclass(frozen=True)
class SeedManifest:
    key: str
    seed_type: str
    path: Path
    modules: list[SeedModule]


class SeedLoaderError(ValueError):
    pass


class BackendSeedLoader:
    def __init__(self, base_dir: Path | None = None):
        self.base_dir = base_dir or settings.BASE_DIR / "seeds"

    def manifest_path(self, seed: str) -> Path:
        normalized_seed = seed.strip("/\\")
        if not normalized_seed:
            raise SeedLoaderError("Seed key is required")
        if normalized_seed == "royalprime":
            return self.base_dir / "royalprime" / "seed.manifest.json"
        if normalized_seed.startswith("examples/"):
            return self.base_dir / normalized_seed / "seed.manifest.json"
        if normalized_seed.startswith("tests/"):
            return self.base_dir / "tests" / "minimal.seed.manifest.json"
        return self.base_dir / normalized_seed / "seed.manifest.json"

    def load(self, seed: str) -> SeedManifest:
        manifest_path = self.manifest_path(seed)
        if not manifest_path.exists():
            raise SeedLoaderError(f"Seed manifest not found: {manifest_path}")

        manifest_data = self._load_json(manifest_path)
        modules = []
        for module_ref in manifest_data.get("modules", []):
            kit = module_ref["kit"]
            relative_path = module_ref["path"]
            module_path = manifest_path.parent / relative_path
            if not module_path.exists():
                raise SeedLoaderError(f"Seed module not found: {module_path}")
            module_data = self._load_json(module_path)
            if module_data.get("kit") != kit:
                raise SeedLoaderError(
                    f"Seed module kit mismatch: {module_path} expected {kit}"
                )
            modules.append(SeedModule(kit=kit, path=module_path, data=module_data))

        return SeedManifest(
            key=manifest_data["seedKey"],
            seed_type=manifest_data["seedType"],
            path=manifest_path,
            modules=modules,
        )

    def _load_json(self, path: Path) -> dict[str, Any]:
        with path.open("r", encoding="utf-8") as file:
            return json.load(file)


class BackendSeedApplier:
    def __init__(self, manifest: SeedManifest, *, dry_run: bool = False):
        self.manifest = manifest
        self.dry_run = dry_run
        self.summary: list[str] = []
        self.organization: Organization | None = None
        self.users_by_customer_key: dict[str, User] = {}
        self.customers_by_key: dict[str, Customer] = {}
        self.collections_by_key: dict[str, Collection] = {}
        self.categories_by_key: dict[str, Category] = {}
        self.commercial_modes_by_key: dict[str, CommercialMode] = {}
        self.measurement_units_by_key: dict[str, MeasurementUnit] = {}
        self.products_by_key: dict[str, Product] = {}
        self.variants_by_sku: dict[str, ProductVariant] = {}
        self.plans_by_key: dict[str, Plan] = {}
        self.entitlements_by_key: dict[str, PlanEntitlement] = {}
        self.orders_by_key: dict[str, Order] = {}
        self.order_kinds_by_key: dict[str, OrderKindDefinition] = {}
        self.order_statuses_by_key: dict[str, OrderStatusDefinition] = {}
        self.deliveries_by_key: dict[str, Delivery] = {}
        self.delivery_statuses_by_key: dict[str, DeliveryStatusDefinition] = {}

    def apply(self) -> list[str]:
        if self.dry_run:
            self.summary.append(f"dry-run seed={self.manifest.key}")
            for module in self.manifest.modules:
                self.summary.append(f"would apply {module.kit}: {module.path}")
            return self.summary

        with transaction.atomic():
            for module in self.manifest.modules:
                if module.kit == "organizations":
                    self.apply_organizations(module.data)
                elif module.kit == "auth-users":
                    self.apply_auth_users(module.data)
                elif module.kit == "customers":
                    self.apply_customers(module.data)
                elif module.kit == "catalog":
                    self.apply_catalog(module.data)
                elif module.kit == "subscriptions":
                    self.apply_subscriptions(module.data)
                elif module.kit == "inventory":
                    self.apply_inventory(module.data)
                elif module.kit == "orders":
                    self.apply_orders(module.data)
                elif module.kit == "deliveries":
                    self.apply_deliveries(module.data)
                else:
                    self.summary.append(f"skipped planned kit={module.kit}")
        return self.summary

    def apply_organizations(self, data: dict[str, Any]) -> None:
        organization_data = data["organization"]
        self.organization, _created = Organization.objects.update_or_create(
            slug=organization_data["slug"],
            defaults={
                "name": organization_data["name"],
                "business_name": organization_data.get("businessName", ""),
                "default_locale": organization_data.get("locale", "pt-BR"),
                "timezone": organization_data.get("timezone", "America/Sao_Paulo"),
                "currency": organization_data.get("currency", "BRL"),
            },
        )
        self.summary.append(f"applied organizations: {self.organization.slug}")

    def apply_auth_users(self, data: dict[str, Any]) -> None:
        organization = self.require_organization()
        permissions_by_key = {
            permission_key: upsert_permission(key=permission_key)
            for permission_key in data.get("permissions", [])
        }
        roles_by_key = {
            role_data["key"]: upsert_role(
                organization=organization,
                key=role_data["key"],
                name=role_data.get("name"),
            )
            for role_data in data.get("roles", [])
        }
        for role_key, permission_keys in data.get("rolePermissions", {}).items():
            role = roles_by_key[role_key]
            for permission_key in permission_keys:
                assign_permission_to_role(
                    role=role,
                    permission=permissions_by_key[permission_key],
                )
        for user_data in data.get("users", []):
            user = upsert_user_with_roles(
                organization=organization,
                email=user_data["email"],
                name=user_data.get("fullName", ""),
                phone=user_data.get("phone", ""),
                password=user_data.get("password"),
                roles=user_data.get("roles", []),
            )
            customer_key = user_data.get("customerKey")
            if customer_key:
                self.users_by_customer_key[customer_key] = user
        self.summary.append(f"applied auth-users: users={len(data.get('users', []))}")

    def apply_customers(self, data: dict[str, Any]) -> None:
        organization = self.require_organization()
        for customer_data in data.get("customers", []):
            customer = upsert_customer(
                organization=organization,
                key=customer_data.get("key", ""),
                name=customer_data["name"],
                email=customer_data.get("email", ""),
                phone=customer_data.get("phone", ""),
                user=self.users_by_customer_key.get(customer_data.get("key", "")),
            )
            customer_key = customer_data.get("key")
            if customer_key:
                self.customers_by_key[customer_key] = customer
        self.summary.append(f"applied customers: count={len(data.get('customers', []))}")

    def apply_catalog(self, data: dict[str, Any]) -> None:
        organization = self.require_organization()
        for collection_data in data.get("collections", []):
            self.collections_by_key[collection_data["key"]] = upsert_collection(
                organization=organization,
                key=collection_data["key"],
                name=collection_data["name"],
                description=collection_data.get("description", ""),
            )

        for category_data in data.get("categories", []):
            self.categories_by_key[category_data["key"]] = upsert_category(
                organization=organization,
                key=category_data["key"],
                name=category_data["name"],
            )

        for commercial_mode_data in data.get("commercialModes", []):
            self.commercial_modes_by_key[commercial_mode_data["key"]] = upsert_commercial_mode(
                organization=organization,
                key=commercial_mode_data["key"],
                name=commercial_mode_data["name"],
            )

        for unit_data in data.get("measurementUnits", []):
            self.measurement_units_by_key[unit_data["key"]] = upsert_measurement_unit(
                organization=organization,
                key=unit_data["key"],
                name=unit_data["name"],
                kind=unit_data["kind"],
                symbol=unit_data.get("symbol", ""),
                decimal_places=unit_data.get("decimalPlaces", 0),
            )

        for product_data in data.get("products", []):
            product = upsert_product(
                organization=organization,
                key=product_data["key"],
                name=product_data["name"],
                unit=product_data.get("unit", "unit"),
                description=product_data.get("description", ""),
            )
            self.products_by_key[product_data["key"]] = product
            category_keys = product_data.get("categoryKeys") or [product_data["categoryKey"]]
            product_categories = [
                self.categories_by_key[category_key]
                for category_key in category_keys
            ]
            set_product_categories(
                organization=organization,
                product=product,
                categories=product_categories,
            )
            product_collections = [
                self.collections_by_key[collection_key]
                for collection_key in product_data.get("collections", [])
            ]
            set_product_collections(
                organization=organization,
                product=product,
                collections=product_collections,
            )
            set_product_media(
                organization=organization,
                product=product,
                media_items=product_data.get("media", []),
            )
            for commercial_mode_key in product_data.get("commercialModes", []):
                commercial_mode = self.commercial_modes_by_key[commercial_mode_key]
                set_product_price(
                    organization=organization,
                    product=product,
                    commercial_mode=commercial_mode,
                    amount_cents=product_data["priceCents"],
                    currency=organization.currency,
                )
                set_product_availability(
                    organization=organization,
                    product=product,
                    commercial_mode=commercial_mode,
                )
            for variant_data in product_data.get("variants", []):
                variant_unit_key = variant_data.get(
                    "unitKey",
                    variant_data.get("unit", product.unit),
                )
                variant = upsert_product_variant(
                    organization=organization,
                    product=product,
                    sku=variant_data.get("sku", ""),
                    name=variant_data["name"],
                    unit=variant_unit_key,
                    measurement_unit=self.measurement_units_by_key.get(variant_unit_key),
                    unit_quantity=variant_data.get("unitQuantity", 1),
                    weight_grams=variant_data.get("weightGrams"),
                    attributes=variant_data.get("attributes", {}),
                    is_active=variant_data.get("isActive", True),
                )
                if variant.sku:
                    self.variants_by_sku[variant.sku] = variant
                variant_price_cents = variant_data.get("priceCents")
                if variant_price_cents is not None:
                    for commercial_mode_key in variant_data.get(
                        "commercialModes",
                        product_data.get("commercialModes", []),
                    ):
                        set_product_price(
                            organization=organization,
                            product=product,
                            variant=variant,
                            commercial_mode=self.commercial_modes_by_key[commercial_mode_key],
                            amount_cents=variant_price_cents,
                            currency=organization.currency,
                        )
        self.summary.append(f"applied catalog: products={len(data.get('products', []))}")

    def apply_subscriptions(self, data: dict[str, Any]) -> None:
        organization = self.require_organization()
        for sort_order, plan_data in enumerate(data.get("plans", [])):
            plan = upsert_plan(
                organization=organization,
                key=plan_data["key"],
                name=plan_data["name"],
                description=plan_data.get("description", ""),
                status=plan_data.get("status", Plan.Status.ACTIVE),
                billing_interval=plan_data.get("billingInterval", Plan.BillingInterval.MONTH),
                trial_days=plan_data.get("trialDays", 0),
                sort_order=plan_data.get("sortOrder", sort_order),
            )
            self.plans_by_key[plan.key] = plan
            prices = plan_data.get("prices")
            if prices is None and "priceCents" in plan_data:
                prices = [{"amountCents": plan_data["priceCents"]}]
            for price_data in prices or []:
                set_plan_price(
                    organization=organization,
                    plan=plan,
                    amount_cents=price_data["amountCents"],
                    currency=price_data.get("currency", organization.currency),
                    billing_interval=price_data.get("billingInterval", plan.billing_interval),
                    billing_interval_count=price_data.get("billingIntervalCount", 1),
                    price_type=price_data.get("priceType", "recurring"),
                )
            for entitlement_order, entitlement_data in enumerate(plan_data.get("entitlements", [])):
                entitlement = upsert_plan_entitlement(
                    organization=organization,
                    plan=plan,
                    key=entitlement_data["key"],
                    target_type=entitlement_data["targetType"],
                    target_key=entitlement_data["targetKey"],
                    quantity=entitlement_data["quantity"],
                    measurement_unit_key=entitlement_data.get("measurementUnitKey"),
                    constraints=entitlement_data.get("constraints", {}),
                    sort_order=entitlement_data.get("sortOrder", entitlement_order),
                )
                self.entitlements_by_key[f"{plan.key}:{entitlement.key}"] = entitlement

        subscriptions_by_key = {}
        cycles_by_key = {}
        for subscription_data in data.get("subscriptions", []):
            customer = self.customers_by_key[subscription_data["customerKey"]]
            plan = self.plans_by_key[subscription_data["planKey"]]
            subscription = upsert_subscription(
                organization=organization,
                customer=customer,
                plan=plan,
                status=subscription_data.get("status", "active"),
                started_at=subscription_data["startedAt"],
                current_cycle_starts_at=subscription_data.get("currentCycleStartsAt"),
                current_cycle_ends_at=subscription_data.get("currentCycleEndsAt"),
            )
            subscriptions_by_key[subscription_data["key"]] = subscription

        for cycle_data in data.get("cycles", []):
            subscription = subscriptions_by_key[cycle_data["subscriptionKey"]]
            cycle = upsert_subscription_cycle(
                organization=organization,
                subscription=subscription,
                cycle_number=cycle_data["cycleNumber"],
                starts_at=cycle_data["startsAt"],
                ends_at=cycle_data["endsAt"],
                status=cycle_data.get("status", "open"),
            )
            cycles_by_key[cycle_data["key"]] = cycle

        for item_data in data.get("cycleItems", []):
            cycle = cycles_by_key[item_data["cycleKey"]]
            plan_key = cycle.subscription.plan.key
            entitlement = self.entitlements_by_key[f"{plan_key}:{item_data['entitlementKey']}"]
            product = self.products_by_key.get(item_data.get("productKey", ""))
            variant = self.variants_by_sku.get(item_data.get("variantSku", ""))
            measurement_unit = self.measurement_units_by_key.get(item_data.get("measurementUnitKey", ""))
            upsert_subscription_cycle_item(
                organization=organization,
                cycle=cycle,
                entitlement=entitlement,
                product=product,
                variant=variant,
                quantity=item_data["quantity"],
                measurement_unit=measurement_unit,
                status=item_data.get("status", SubscriptionCycleItem.Status.PENDING),
            )

        self.summary.append(f"applied subscriptions: plans={len(data.get('plans', []))}")

    def apply_inventory(self, data: dict[str, Any]) -> None:
        organization = self.require_organization()
        for item_data in data.get("items", []):
            product = self.products_by_key[item_data["productKey"]]
            variant = self.variants_by_sku.get(item_data.get("variantSku", ""))
            measurement_unit = self.measurement_units_by_key.get(item_data.get("measurementUnitKey", ""))
            upsert_inventory_item(
                organization=organization,
                product=product,
                variant=variant,
                measurement_unit=measurement_unit,
                available_quantity=item_data.get("availableQuantity", 0),
                reserved_quantity=item_data.get("reservedQuantity", 0),
                low_stock_threshold=item_data.get("lowStockThreshold", 0),
                status=item_data.get("status"),
                notes=item_data.get("notes", ""),
            )
        self.summary.append(f"applied inventory: items={len(data.get('items', []))}")

    def apply_orders(self, data: dict[str, Any]) -> None:
        organization = self.require_organization()
        for sequence_data in data.get("codeSequences", []):
            upsert_code_sequence(
                organization=organization,
                key=sequence_data["key"],
                prefix=sequence_data.get("prefix", ""),
                padding=sequence_data.get("padding", 6),
                next_number=sequence_data.get("nextNumber", 1),
                template=sequence_data.get("template", "{prefix}-{number}"),
            )
        for sort_order, kind_data in enumerate(data.get("kinds", [])):
            kind = upsert_order_kind(
                organization=organization,
                key=kind_data["key"],
                label=kind_data["label"],
                commercial_mode_key=kind_data.get("commercialModeKey"),
                code_sequence_key=kind_data.get("codeSequenceKey", "orders"),
                requires_inventory=kind_data.get("requiresInventory", True),
                creates_delivery=kind_data.get("createsDelivery", True),
                is_active=kind_data.get("isActive", True),
                sort_order=kind_data.get("sortOrder", sort_order),
                metadata=kind_data.get("metadata", {}),
            )
            self.order_kinds_by_key[kind.key] = kind
        for sort_order, status_data in enumerate(data.get("statuses", [])):
            status = upsert_order_status(
                organization=organization,
                key=status_data["key"],
                label=status_data["label"],
                sort_order=status_data.get("sortOrder", sort_order),
                is_initial=status_data.get("isInitial", False),
                is_terminal=status_data.get("isTerminal", False),
                is_public=status_data.get("isPublic", True),
                allowed_next_keys=status_data.get("allowedNextKeys", []),
                effects=status_data.get("effects", {}),
                metadata=status_data.get("metadata", {}),
            )
            self.order_statuses_by_key[status.key] = status
        for order_data in data.get("orders", []):
            customer = self.customers_by_key[order_data["customerKey"]]
            address = customer.addresses.filter(is_default=True).first()
            subscription = None
            subscription_key = order_data.get("subscriptionKey")
            if subscription_key:
                subscription = customer.subscriptions.filter(plan__key=order_data.get("planKey", "")).first()
            order = create_order(
                organization=organization,
                customer=customer,
                address=address,
                subscription=subscription,
                kind_key=order_data["kindKey"],
                items=order_data.get("items", []),
                notes=order_data.get("notes", ""),
            )
            target_status_key = order_data.get("statusKey")
            if target_status_key and target_status_key != order.status_key:
                transition_order_status(
                    organization=organization,
                    order=order,
                    to_status_key=target_status_key,
                    note="Seed status",
                )
            self.orders_by_key[order_data["key"]] = order
        self.summary.append(f"applied orders: orders={len(data.get('orders', []))}")

    def apply_deliveries(self, data: dict[str, Any]) -> None:
        organization = self.require_organization()
        for sequence_data in data.get("codeSequences", []):
            upsert_code_sequence(
                organization=organization,
                key=sequence_data["key"],
                prefix=sequence_data.get("prefix", ""),
                padding=sequence_data.get("padding", 6),
                next_number=sequence_data.get("nextNumber", 1),
                template=sequence_data.get("template", "{prefix}-{number}"),
            )
        for sort_order, status_data in enumerate(data.get("statuses", [])):
            status = upsert_delivery_status(
                organization=organization,
                key=status_data["key"],
                label=status_data["label"],
                sort_order=status_data.get("sortOrder", sort_order),
                is_initial=status_data.get("isInitial", False),
                is_terminal=status_data.get("isTerminal", False),
                is_public=status_data.get("isPublic", True),
                allowed_next_keys=status_data.get("allowedNextKeys", []),
                effects=status_data.get("effects", {}),
                metadata=status_data.get("metadata", {}),
            )
            self.delivery_statuses_by_key[status.key] = status
        for delivery_data in data.get("deliveries", []):
            order = self.orders_by_key[delivery_data["orderKey"]]
            delivery = create_delivery_for_order(
                organization=organization,
                order=order,
                code_sequence_key=delivery_data.get("codeSequenceKey", "deliveries"),
                confirmation_code=delivery_data.get("confirmationCode", ""),
                notes=delivery_data.get("notes", ""),
            )
            target_status_key = delivery_data.get("statusKey")
            if target_status_key and target_status_key != delivery.status_key:
                transition_delivery_status(
                    organization=organization,
                    delivery=delivery,
                    to_status_key=target_status_key,
                    note="Seed status",
                )
            self.deliveries_by_key[delivery_data["key"]] = delivery
        self.summary.append(f"applied deliveries: deliveries={len(data.get('deliveries', []))}")

    def require_organization(self) -> Organization:
        if self.organization is None:
            raise SeedLoaderError("organizations module must run before this module")
        return self.organization
