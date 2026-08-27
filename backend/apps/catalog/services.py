from django.db import transaction
from django.utils.text import slugify

from .models import (
    CatalogAvailability,
    Category,
    Collection,
    CollectionProduct,
    CommercialMode,
    Product,
    ProductPrice,
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
    category: Category,
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
            "category": category,
            "unit": unit,
            "description": description,
            "status": status,
            "is_perishable": is_perishable,
        },
    )
    return product


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
def set_product_price(
    *,
    organization,
    product: Product,
    commercial_mode: CommercialMode,
    amount_cents: int,
    currency: str,
) -> ProductPrice:
    price, _created = ProductPrice.objects.update_or_create(
        organization=organization,
        product=product,
        variant=None,
        commercial_mode=commercial_mode,
        defaults={
            "amount_cents": amount_cents,
            "currency": currency,
        },
    )
    return price


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
    category_key: str,
    unit: str = "unit",
    price_cents: int | None = None,
    commercial_mode_keys: list[str] | None = None,
    collection_keys: list[str] | None = None,
) -> Product:
    category = Category.objects.get(organization=organization, key=category_key)
    product = upsert_product(
        organization=organization,
        key=key,
        name=name,
        category=category,
        unit=unit,
    )
    collections = list(
        Collection.objects.filter(
            organization=organization,
            key__in=collection_keys or [],
        )
    )
    set_product_collections(organization=organization, product=product, collections=collections)
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
            )
            set_product_availability(
                organization=organization,
                product=product,
                commercial_mode=commercial_mode,
            )
    return product
