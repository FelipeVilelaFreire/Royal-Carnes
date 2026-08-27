from rest_framework import serializers

from .models import (
    Category,
    Collection,
    CommercialMode,
    MeasurementUnit,
    Product,
    ProductMedia,
    ProductPrice,
    ProductVariant,
)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("id", "key", "name", "parent_id", "sort_order", "is_active")


class CommercialModeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommercialMode
        fields = ("id", "key", "name", "is_active", "sort_order")


class MeasurementUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeasurementUnit
        fields = (
            "id",
            "key",
            "name",
            "symbol",
            "kind",
            "decimal_places",
            "is_active",
            "sort_order",
        )


class CollectionSerializer(serializers.ModelSerializer):
    product_ids = serializers.SerializerMethodField()

    class Meta:
        model = Collection
        fields = ("id", "key", "name", "description", "status", "sort_order", "product_ids")

    def get_product_ids(self, collection):
        return [
            link.product_id
            for link in collection.collection_products.all()
        ]


class ProductPriceSerializer(serializers.ModelSerializer):
    variant_id = serializers.IntegerField(source="variant.id", read_only=True, allow_null=True)
    variant_sku = serializers.CharField(source="variant.sku", read_only=True, allow_null=True)
    commercial_mode_key = serializers.CharField(source="commercial_mode.key", read_only=True)
    commercial_mode_name = serializers.CharField(source="commercial_mode.name", read_only=True)
    collection_key = serializers.CharField(source="collection.key", read_only=True, allow_null=True)

    class Meta:
        model = ProductPrice
        fields = (
            "id",
            "variant_id",
            "variant_sku",
            "commercial_mode_key",
            "commercial_mode_name",
            "collection_key",
            "price_type",
            "currency",
            "amount_cents",
        )


class ProductVariantSerializer(serializers.ModelSerializer):
    unit_key = serializers.CharField(source="measurement_unit.key", read_only=True, allow_null=True)
    unit_name = serializers.CharField(source="measurement_unit.name", read_only=True, allow_null=True)
    unit_kind = serializers.CharField(source="measurement_unit.kind", read_only=True, allow_null=True)
    unit_symbol = serializers.CharField(
        source="measurement_unit.symbol",
        read_only=True,
        allow_null=True,
    )

    class Meta:
        model = ProductVariant
        fields = (
            "id",
            "sku",
            "name",
            "unit",
            "unit_key",
            "unit_name",
            "unit_kind",
            "unit_symbol",
            "unit_quantity",
            "weight_grams",
            "attributes",
            "is_active",
        )


class ProductMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductMedia
        fields = ("id", "url", "alt", "sort_order", "is_primary")


class ProductSerializer(serializers.ModelSerializer):
    categories = serializers.SerializerMethodField()
    primary_category_key = serializers.SerializerMethodField()
    collection_keys = serializers.SerializerMethodField()
    primary_media_url = serializers.SerializerMethodField()
    media = ProductMediaSerializer(many=True, read_only=True)
    prices = ProductPriceSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    commercial_mode_keys = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            "id",
            "key",
            "name",
            "slug",
            "description",
            "unit",
            "status",
            "is_perishable",
            "sort_order",
            "categories",
            "primary_category_key",
            "collection_keys",
            "commercial_mode_keys",
            "primary_media_url",
            "media",
            "variants",
            "prices",
        )

    def get_categories(self, product):
        return [
            CategorySerializer(link.category).data
            for link in product.category_links.all()
        ]

    def get_primary_category_key(self, product):
        primary_link = next(
            (link for link in product.category_links.all() if link.is_primary),
            None,
        )
        return primary_link.category.key if primary_link else None

    def get_collection_keys(self, product):
        return [
            link.collection.key
            for link in product.collection_links.all()
        ]

    def get_commercial_mode_keys(self, product):
        return [
            availability.commercial_mode.key
            for availability in product.availability.all()
            if availability.is_available
        ]

    def get_primary_media_url(self, product):
        primary_media = next(
            (media for media in product.media.all() if media.is_primary),
            None,
        )
        return primary_media.url if primary_media else None


class ProductCreateSerializer(serializers.Serializer):
    key = serializers.SlugField(max_length=120)
    name = serializers.CharField(max_length=180)
    category_keys = serializers.ListField(
        child=serializers.SlugField(max_length=100),
        allow_empty=False,
    )
    unit = serializers.CharField(max_length=32, required=False, default="unit")
    price_cents = serializers.IntegerField(min_value=0, required=False)
    price_type = serializers.ChoiceField(
        choices=ProductPrice.PriceType.choices,
        required=False,
        default=ProductPrice.PriceType.BASE,
    )
    commercial_mode_keys = serializers.ListField(
        child=serializers.SlugField(max_length=80),
        required=False,
        default=list,
    )
    collection_keys = serializers.ListField(
        child=serializers.SlugField(max_length=100),
        required=False,
        default=list,
    )
    variants = serializers.ListField(
        child=serializers.DictField(),
        required=False,
        default=list,
    )
