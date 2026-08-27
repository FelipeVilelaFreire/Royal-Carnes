from django.db import models

from apps.core.models import OrganizationScopedModel, SoftDeleteModel, TimestampedModel


class Collection(OrganizationScopedModel, TimestampedModel, SoftDeleteModel):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        DRAFT = "draft", "Draft"
        ARCHIVED = "archived", "Archived"

    key = models.SlugField(max_length=100)
    name = models.CharField(max_length=160)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    sort_order = models.PositiveIntegerField(default=0)
    starts_at = models.DateTimeField(null=True, blank=True)
    ends_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["sort_order", "name"]
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "key"],
                name="catalog_collection_unique_key",
            )
        ]
        indexes = [
            models.Index(fields=["organization", "status"]),
            models.Index(fields=["organization", "sort_order"]),
        ]

    def __str__(self) -> str:
        return self.name


class Category(OrganizationScopedModel, TimestampedModel, SoftDeleteModel):
    key = models.SlugField(max_length=100)
    name = models.CharField(max_length=160)
    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="children",
    )
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["sort_order", "name"]
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "key"],
                name="catalog_category_unique_key",
            )
        ]
        indexes = [
            models.Index(fields=["organization", "is_active"]),
            models.Index(fields=["organization", "sort_order"]),
        ]

    def __str__(self) -> str:
        return self.name


class CommercialMode(OrganizationScopedModel, TimestampedModel):
    key = models.SlugField(max_length=80)
    name = models.CharField(max_length=140)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "name"]
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "key"],
                name="catalog_commercial_mode_unique_key",
            )
        ]
        indexes = [
            models.Index(fields=["organization", "is_active"]),
        ]

    def __str__(self) -> str:
        return self.name


class Product(OrganizationScopedModel, TimestampedModel, SoftDeleteModel):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        DRAFT = "draft", "Draft"
        ARCHIVED = "archived", "Archived"

    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="products")
    key = models.SlugField(max_length=120)
    name = models.CharField(max_length=180)
    slug = models.SlugField(max_length=140)
    description = models.TextField(blank=True)
    unit = models.CharField(max_length=32, default="unit")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    is_perishable = models.BooleanField(default=False)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "name"]
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "key"],
                name="catalog_product_unique_key",
            ),
            models.UniqueConstraint(
                fields=["organization", "slug"],
                name="catalog_product_unique_slug",
            ),
        ]
        indexes = [
            models.Index(fields=["organization", "status"]),
            models.Index(fields=["organization", "category"]),
            models.Index(fields=["organization", "sort_order"]),
        ]

    def __str__(self) -> str:
        return self.name


class CollectionProduct(OrganizationScopedModel, TimestampedModel):
    collection = models.ForeignKey(
        Collection,
        on_delete=models.CASCADE,
        related_name="collection_products",
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="collection_links")
    sort_order = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    starts_at = models.DateTimeField(null=True, blank=True)
    ends_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["sort_order", "product__name"]
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "collection", "product"],
                name="catalog_collection_product_unique",
            )
        ]
        indexes = [
            models.Index(fields=["organization", "collection", "sort_order"]),
            models.Index(fields=["organization", "product"]),
        ]


class ProductVariant(OrganizationScopedModel, TimestampedModel, SoftDeleteModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variants")
    sku = models.CharField(max_length=80, blank=True)
    name = models.CharField(max_length=140)
    unit = models.CharField(max_length=32, default="unit")
    unit_quantity = models.DecimalField(max_digits=10, decimal_places=3, default=1)
    weight_grams = models.PositiveIntegerField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name"]
        indexes = [
            models.Index(fields=["organization", "product", "is_active"]),
            models.Index(fields=["organization", "sku"]),
        ]


class ProductMedia(OrganizationScopedModel, TimestampedModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="media")
    url = models.URLField()
    alt = models.CharField(max_length=180, blank=True)
    sort_order = models.PositiveIntegerField(default=0)
    is_primary = models.BooleanField(default=False)

    class Meta:
        ordering = ["sort_order"]
        indexes = [
            models.Index(fields=["organization", "product", "is_primary"]),
        ]


class ProductPrice(OrganizationScopedModel, TimestampedModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="prices")
    variant = models.ForeignKey(
        ProductVariant,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="prices",
    )
    commercial_mode = models.ForeignKey(
        CommercialMode,
        on_delete=models.PROTECT,
        related_name="product_prices",
    )
    currency = models.CharField(max_length=3, default="BRL")
    amount_cents = models.PositiveIntegerField()
    starts_at = models.DateTimeField(null=True, blank=True)
    ends_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["commercial_mode__sort_order", "amount_cents"]
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "product", "variant", "commercial_mode"],
                name="catalog_product_price_unique_mode",
            )
        ]
        indexes = [
            models.Index(fields=["organization", "product"]),
            models.Index(fields=["organization", "commercial_mode"]),
        ]


class CatalogAvailability(OrganizationScopedModel, TimestampedModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="availability")
    commercial_mode = models.ForeignKey(
        CommercialMode,
        on_delete=models.CASCADE,
        related_name="product_availability",
    )
    is_available = models.BooleanField(default=True)
    reason = models.CharField(max_length=160, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "product", "commercial_mode"],
                name="catalog_availability_unique_mode",
            )
        ]
        indexes = [
            models.Index(fields=["organization", "is_available"]),
        ]
