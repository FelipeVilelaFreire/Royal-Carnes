from .models import Category, Collection, CommercialMode, Product


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
        .select_related("category")
        .prefetch_related(
            "collection_links__collection",
            "prices__commercial_mode",
            "availability__commercial_mode",
            "media",
            "variants",
        )
    )


def admin_products_for_organization(organization):
    return (
        Product.objects.filter(organization=organization)
        .select_related("category")
        .prefetch_related("collection_links__collection", "prices__commercial_mode")
    )


def product_detail(product_id, organization):
    return (
        Product.objects.select_related("category")
        .prefetch_related(
            "collection_links__collection",
            "prices__commercial_mode",
            "availability__commercial_mode",
            "media",
            "variants",
        )
        .get(id=product_id, organization=organization)
    )
