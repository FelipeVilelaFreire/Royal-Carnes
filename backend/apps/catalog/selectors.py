from django.db.models import Prefetch

from .models import Category, Collection, CommercialMode, Product, ProductVariant


PRODUCT_VARIANT_PREFETCH = Prefetch(
    "variants",
    queryset=ProductVariant.objects.select_related("measurement_unit"),
)


def active_collections_for_organization(organization):
    return Collection.objects.filter(
        organization=organization,
        status=Collection.Status.ACTIVE,
    ).prefetch_related("collection_products__product")


def active_categories_for_organization(organization):
    return Category.objects.filter(organization=organization, is_active=True)


def active_commercial_modes_for_organization(organization):
    return CommercialMode.objects.filter(organization=organization, is_active=True)


def public_products_for_organization(organization):
    return (
        Product.objects.filter(organization=organization, status=Product.Status.ACTIVE)
        .prefetch_related(
            "category_links__category",
            "collection_links__collection",
            "prices__commercial_mode",
            "prices__collection",
            "availability__commercial_mode",
            "media",
            PRODUCT_VARIANT_PREFETCH,
        )
    )


def admin_products_for_organization(organization):
    return (
        Product.objects.filter(organization=organization)
        .prefetch_related(
            "category_links__category",
            "collection_links__collection",
            "prices__commercial_mode",
            "prices__collection",
            "availability__commercial_mode",
            "media",
            PRODUCT_VARIANT_PREFETCH,
        )
    )


def product_detail(product_id, organization):
    return (
        Product.objects.prefetch_related(
            "category_links__category",
            "collection_links__collection",
            "prices__commercial_mode",
            "prices__collection",
            "availability__commercial_mode",
            "media",
            PRODUCT_VARIANT_PREFETCH,
        )
        .get(id=product_id, organization=organization)
    )
