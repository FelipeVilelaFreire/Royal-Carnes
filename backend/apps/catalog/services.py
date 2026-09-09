from django.db import transaction
from django.utils.text import slugify

from .models import (
    CatalogAvailability,
    Category,
    Collection,
    CollectionProduct,
    CommercialMode,
    MeasurementUnit,
    Product,
    ProductCategory,
    ProductMedia,
    ProductPrice,
    ProductVariant,
)

class CatalogValidationError(ValueError):
    def __init__(self, code: str, detail: str):
        self.code = code
        self.detail = detail
        super().__init__(detail)


@transaction.atomic
def upsert_collection(
    *,
    organization,
    key: str,
    name: str,
    description: str = "",
    image_url: str = "",
    image_alt: str = "",
) -> Collection:
    collection, _created = Collection.objects.update_or_create(
        organization=organization,
        key=key,
        defaults={
            "name": name,
            "description": description,
            "image_url": image_url,
            "image_alt": image_alt,
            "status": Collection.Status.ACTIVE,
        },
    )
    return collection


@transaction.atomic
def upsert_category(
    *,
    organization,
    key: str,
    name: str,
    parent: Category | None = None,
    sort_order: int = 0,
) -> Category:
    category, _created = Category.objects.update_or_create(
        organization=organization,
        key=key,
        defaults={
            "name": name,
            "parent": parent,
            "sort_order": sort_order,
            "is_active": True,
        },
    )
    return category


@transaction.atomic
def update_category(
    *,
    category: Category,
    key: str | None = None,
    name: str | None = None,
    sort_order: int | None = None,
    is_active: bool | None = None,
) -> Category:
    update_fields = []
    if key is not None:
        category.key = key
        update_fields.append("key")
    if name is not None:
        category.name = name
        update_fields.append("name")
    if sort_order is not None:
        category.sort_order = sort_order
        update_fields.append("sort_order")
    if is_active is not None:
        category.is_active = is_active
        update_fields.append("is_active")
    if update_fields:
        category.save(update_fields=update_fields)
    return category


@transaction.atomic
def create_category(
    *,
    organization,
    key: str,
    name: str,
    parent_key: str = "",
    sort_order: int = 0,
    is_active: bool = True,
) -> Category:
    parent = None
    if parent_key:
        try:
            parent = Category.objects.get(organization=organization, key=parent_key)
        except Category.DoesNotExist as exc:
            raise CatalogValidationError("category_parent_not_found", f"Category parent not found: {parent_key}") from exc

    return Category.objects.create(
        organization=organization,
        key=key,
        name=name,
        parent=parent,
        sort_order=sort_order,
        is_active=is_active,
    )


@transaction.atomic
def upsert_commercial_mode(*, organization, key: str, name: str) -> CommercialMode:
    commercial_mode, _created = CommercialMode.objects.update_or_create(
        organization=organization,
        key=key,
        defaults={
            "name": name,
            "is_active": True,
        },
    )
    return commercial_mode


@transaction.atomic
def upsert_measurement_unit(
    *,
    organization,
    key: str,
    name: str,
    kind: str,
    symbol: str = "",
    decimal_places: int = 0,
) -> MeasurementUnit:
    measurement_unit, _created = MeasurementUnit.objects.update_or_create(
        organization=organization,
        key=key,
        defaults={
            "name": name,
            "kind": kind,
            "symbol": symbol,
            "decimal_places": decimal_places,
            "is_active": True,
        },
    )
    return measurement_unit


@transaction.atomic
def upsert_product(
    *,
    organization,
    key: str,
    name: str,
    unit: str = "unit",
    description: str = "",
    status: str = Product.Status.ACTIVE,
    is_perishable: bool = False,
) -> Product:
    product, _created = Product.objects.update_or_create(
        organization=organization,
        key=key,
        defaults={
            "name": name,
            "slug": slugify(key or name),
            "unit": unit,
            "description": description,
            "status": status,
            "is_perishable": is_perishable,
        },
    )
    return product


@transaction.atomic
def set_product_categories(*, organization, product: Product, categories: list[Category]) -> None:
    category_ids = [category.id for category in categories]
    ProductCategory.objects.filter(organization=organization, product=product).exclude(
        category_id__in=category_ids,
    ).delete()
    for sort_order, category in enumerate(categories):
        ProductCategory.objects.update_or_create(
            organization=organization,
            product=product,
            category=category,
            defaults={
                "sort_order": sort_order,
                "is_primary": sort_order == 0,
            },
        )


def resolve_categories_for_keys(*, organization, category_keys: list[str]) -> list[Category]:
    if not category_keys:
        raise CatalogValidationError("product_category_required", "Product requires at least one category")

    categories_by_key = {
        category.key: category
        for category in Category.objects.filter(
            organization=organization,
            key__in=category_keys,
        )
    }
    missing_keys = [category_key for category_key in category_keys if category_key not in categories_by_key]
    if missing_keys:
        raise CatalogValidationError("product_category_not_found", f"Category not found: {', '.join(missing_keys)}")
    return [categories_by_key[category_key] for category_key in category_keys]


@transaction.atomic
def set_product_collections(*, organization, product: Product, collections: list[Collection]) -> None:
    collection_ids = [collection.id for collection in collections]
    CollectionProduct.objects.filter(organization=organization, product=product).exclude(
        collection_id__in=collection_ids,
    ).delete()
    for sort_order, collection in enumerate(collections):
        CollectionProduct.objects.update_or_create(
            organization=organization,
            collection=collection,
            product=product,
            defaults={"sort_order": sort_order},
        )


@transaction.atomic
def set_product_media(*, organization, product: Product, media_items: list[dict]) -> None:
    active_urls = []
    for sort_order, media_data in enumerate(media_items):
        url = media_data["url"]
        active_urls.append(url)
        ProductMedia.objects.update_or_create(
            organization=organization,
            product=product,
            url=url,
            defaults={
                "alt": media_data.get("alt", product.name),
                "sort_order": media_data.get("sortOrder", sort_order),
                "is_primary": media_data.get("isPrimary", sort_order == 0),
            },
        )
    if active_urls:
        ProductMedia.objects.filter(organization=organization, product=product).exclude(
            url__in=active_urls,
        ).delete()
    else:
        ProductMedia.objects.filter(organization=organization, product=product).delete()


@transaction.atomic
def set_product_price(
    *,
    organization,
    product: Product,
    commercial_mode: CommercialMode,
    amount_cents: int,
    currency: str,
    variant: ProductVariant | None = None,
    collection: Collection | None = None,
    price_type: str = ProductPrice.PriceType.BASE,
) -> ProductPrice:
    price, _created = ProductPrice.objects.update_or_create(
        organization=organization,
        product=product,
        variant=variant,
        commercial_mode=commercial_mode,
        collection=collection,
        price_type=price_type,
        defaults={
            "amount_cents": amount_cents,
            "currency": currency,
        },
    )
    return price


@transaction.atomic
def upsert_product_variant(
    *,
    organization,
    product: Product,
    sku: str = "",
    name: str,
    unit: str = "unit",
    measurement_unit: MeasurementUnit | None = None,
    unit_quantity=1,
    weight_grams: int | None = None,
    attributes: dict | None = None,
    is_active: bool = True,
) -> ProductVariant:
    lookup = {
        "organization": organization,
        "product": product,
        "sku": sku,
    }
    if not sku:
        lookup = {
            "organization": organization,
            "product": product,
            "name": name,
        }
    variant, _created = ProductVariant.objects.update_or_create(
        **lookup,
        defaults={
            "name": name,
            "unit": unit,
            "measurement_unit": measurement_unit,
            "unit_quantity": unit_quantity,
            "weight_grams": weight_grams,
            "attributes": attributes or {},
            "is_active": is_active,
        },
    )
    return variant


@transaction.atomic
def set_product_availability(
    *,
    organization,
    product: Product,
    commercial_mode: CommercialMode,
    is_available: bool = True,
) -> CatalogAvailability:
    availability, _created = CatalogAvailability.objects.update_or_create(
        organization=organization,
        product=product,
        commercial_mode=commercial_mode,
        defaults={"is_available": is_available},
    )
    return availability


@transaction.atomic
def create_admin_product(
    *,
    organization,
    key: str,
    name: str,
    category_keys: list[str],
    description: str = "",
    status: str = Product.Status.ACTIVE,
    unit: str = "unit",
    price_cents: int | None = None,
    commercial_mode_keys: list[str] | None = None,
    collection_keys: list[str] | None = None,
    media_items: list[dict] | None = None,
    price_type: str = ProductPrice.PriceType.BASE,
    variants: list[dict] | None = None,
) -> Product:
    product = upsert_product(
        organization=organization,
        key=key,
        name=name,
        description=description,
        status=status,
        unit=unit,
    )
    categories = resolve_categories_for_keys(organization=organization, category_keys=category_keys)
    set_product_categories(organization=organization, product=product, categories=categories)
    collections = list(
        Collection.objects.filter(
            organization=organization,
            key__in=collection_keys or [],
        )
    )
    set_product_collections(organization=organization, product=product, collections=collections)
    if media_items:
        set_product_media(organization=organization, product=product, media_items=media_items)
    if variants:
        for variant_data in variants:
            variant = upsert_product_variant(
                organization=organization,
                product=product,
                sku=variant_data.get("sku", ""),
                name=variant_data["name"],
                unit=variant_data.get("unit", unit),
                measurement_unit=MeasurementUnit.objects.filter(
                    organization=organization,
                    key=variant_data.get("unit_key", variant_data.get("unit", unit)),
                ).first(),
                unit_quantity=variant_data.get("unit_quantity", 1),
                weight_grams=variant_data.get("weight_grams"),
                attributes=variant_data.get("attributes", {}),
                is_active=variant_data.get("is_active", True),
            )
            variant_price_cents = variant_data.get("price_cents")
            if variant_price_cents is not None:
                for commercial_mode in CommercialMode.objects.filter(
                    organization=organization,
                    key__in=variant_data.get("commercial_mode_keys", commercial_mode_keys or []),
                ):
                    set_product_price(
                        organization=organization,
                        product=product,
                        variant=variant,
                        commercial_mode=commercial_mode,
                        amount_cents=variant_price_cents,
                        currency=organization.currency,
                        price_type=variant_data.get("price_type", price_type),
                    )

    if price_cents is not None:
        for commercial_mode in CommercialMode.objects.filter(
            organization=organization,
            key__in=commercial_mode_keys or [],
        ):
            set_product_price(
                organization=organization,
                product=product,
                commercial_mode=commercial_mode,
                amount_cents=price_cents,
                currency=organization.currency,
                price_type=price_type,
            )
            set_product_availability(
                organization=organization,
                product=product,
                commercial_mode=commercial_mode,
            )
    return product


@transaction.atomic
def update_admin_product(
    *,
    organization,
    product: Product,
    key: str | None = None,
    name: str | None = None,
    description: str | None = None,
    status: str | None = None,
    category_keys: list[str] | None = None,
    unit: str | None = None,
    price_cents: int | None = None,
    commercial_mode_keys: list[str] | None = None,
    collection_keys: list[str] | None = None,
    media_items: list[dict] | None = None,
    price_type: str = ProductPrice.PriceType.BASE,
    variants: list[dict] | None = None,
) -> Product:
    update_fields = []
    if key is not None:
        product.key = key
        product.slug = slugify(key or product.name)
        update_fields.extend(["key", "slug"])
    if name is not None:
        product.name = name
        update_fields.append("name")
    if description is not None:
        product.description = description
        update_fields.append("description")
    if status is not None:
        product.status = status
        update_fields.append("status")
    if unit is not None:
        product.unit = unit
        update_fields.append("unit")
    if update_fields:
        product.save(update_fields=update_fields)

    if category_keys is not None:
        categories = resolve_categories_for_keys(organization=organization, category_keys=category_keys)
        set_product_categories(organization=organization, product=product, categories=categories)

    if collection_keys is not None:
        collections = list(
            Collection.objects.filter(
                organization=organization,
                key__in=collection_keys,
            )
        )
        set_product_collections(organization=organization, product=product, collections=collections)

    if media_items is not None:
        set_product_media(organization=organization, product=product, media_items=media_items)

    if commercial_mode_keys is not None:
        modes = list(
            CommercialMode.objects.filter(
                organization=organization,
                key__in=commercial_mode_keys,
            )
        )
        mode_ids = [mode.id for mode in modes]
        CatalogAvailability.objects.filter(organization=organization, product=product).exclude(
            commercial_mode_id__in=mode_ids,
        ).update(is_available=False)
        for commercial_mode in modes:
            set_product_availability(
                organization=organization,
                product=product,
                commercial_mode=commercial_mode,
            )
            if price_cents is not None:
                set_product_price(
                    organization=organization,
                    product=product,
                    commercial_mode=commercial_mode,
                    amount_cents=price_cents,
                    currency=organization.currency,
                    price_type=price_type,
                )

    if price_cents is not None and commercial_mode_keys is None:
        existing_prices = ProductPrice.objects.filter(
            organization=organization,
            product=product,
            variant__isnull=True,
            collection__isnull=True,
            price_type=price_type,
        )
        for price in existing_prices:
            price.amount_cents = price_cents
            price.currency = organization.currency
            price.save(update_fields=["amount_cents", "currency"])

    if variants is not None:
        active_variant_ids = []
        for variant_data in variants:
            variant = upsert_product_variant(
                organization=organization,
                product=product,
                sku=variant_data.get("sku", ""),
                name=variant_data["name"],
                unit=variant_data.get("unit", unit or product.unit),
                measurement_unit=MeasurementUnit.objects.filter(
                    organization=organization,
                    key=variant_data.get("unit_key", variant_data.get("unit", unit or product.unit)),
                ).first(),
                unit_quantity=variant_data.get("unit_quantity", 1),
                weight_grams=variant_data.get("weight_grams"),
                attributes=variant_data.get("attributes", {}),
                is_active=variant_data.get("is_active", True),
            )
            active_variant_ids.append(variant.id)
            variant_price_cents = variant_data.get("price_cents")
            if variant_price_cents is not None:
                for commercial_mode in CommercialMode.objects.filter(
                    organization=organization,
                    key__in=variant_data.get("commercial_mode_keys", commercial_mode_keys or []),
                ):
                    set_product_price(
                        organization=organization,
                        product=product,
                        variant=variant,
                        commercial_mode=commercial_mode,
                        amount_cents=variant_price_cents,
                        currency=organization.currency,
                        price_type=variant_data.get("price_type", price_type),
                    )
        ProductVariant.objects.filter(organization=organization, product=product).exclude(
            id__in=active_variant_ids,
        ).update(is_active=False)

    return product
