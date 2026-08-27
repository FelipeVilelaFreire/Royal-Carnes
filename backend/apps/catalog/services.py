from django.db import transaction
from django.utils.text import slugify

from .models import (
    CatalogAvailability,
    Category,
    Collection,
    CollectionProduct,
    CommercialMode,
    Product,
    ProductCategory,
    ProductMedia,
    ProductPrice,
    ProductVariant,
)


@transaction.atomic
def upsert_collection(*, organization, key: str, name: str, description: str = "") -> Collection:
    collection, _created = Collection.objects.update_or_create(
        organization=organization,
        key=key,
        defaults={
            "name": name,
            "description": description,
            "status": Collection.Status.ACTIVE,
        },
    )
    return collection


@transaction.atomic
def upsert_category(*, organization, key: str, name: str) -> Category:
    category, _created = Category.objects.update_or_create(
        organization=organization,
        key=key,
        defaults={
            "name": name,
            "is_active": True,
        },
    )
    return category


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


@transaction.atomic
def set_product_collections(*, organization, product: Product, collections: list[Collection]) -> None:
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
    unit_quantity=1,
    weight_grams: int | None = None,
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
            "unit_quantity": unit_quantity,
            "weight_grams": weight_grams,
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
    unit: str = "unit",
    price_cents: int | None = None,
    commercial_mode_keys: list[str] | None = None,
    collection_keys: list[str] | None = None,
    price_type: str = ProductPrice.PriceType.BASE,
    variants: list[dict] | None = None,
) -> Product:
    product = upsert_product(
        organization=organization,
        key=key,
        name=name,
        unit=unit,
    )
    categories = list(
        Category.objects.filter(
            organization=organization,
            key__in=category_keys,
        )
    )
    set_product_categories(organization=organization, product=product, categories=categories)
    collections = list(
        Collection.objects.filter(
            organization=organization,
            key__in=collection_keys or [],
        )
    )
    set_product_collections(organization=organization, product=product, collections=collections)
    if variants:
        for variant_data in variants:
            variant = upsert_product_variant(
                organization=organization,
                product=product,
                sku=variant_data.get("sku", ""),
                name=variant_data["name"],
                unit=variant_data.get("unit", unit),
                unit_quantity=variant_data.get("unit_quantity", 1),
                weight_grams=variant_data.get("weight_grams"),
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
