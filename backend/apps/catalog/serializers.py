from rest_framework import serializers

from .models import Category, Collection, CommercialMode, Product, ProductPrice


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("id", "key", "name", "parent_id", "sort_order", "is_active")


class CommercialModeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommercialMode
        fields = ("id", "key", "name", "is_active", "sort_order")


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
    commercial_mode_key = serializers.CharField(source="commercial_mode.key", read_only=True)
    commercial_mode_name = serializers.CharField(source="commercial_mode.name", read_only=True)

    class Meta:
        model = ProductPrice
        fields = (
            "id",
            "commercial_mode_key",
            "commercial_mode_name",
            "currency",
            "amount_cents",
        )


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    collection_keys = serializers.SerializerMethodField()
    prices = ProductPriceSerializer(many=True, read_only=True)
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
            "category",
            "collection_keys",
            "commercial_mode_keys",
            "prices",
        )

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


class ProductCreateSerializer(serializers.Serializer):
    key = serializers.SlugField(max_length=120)
    name = serializers.CharField(max_length=180)
    category_key = serializers.SlugField(max_length=100)
    unit = serializers.CharField(max_length=32, required=False, default="unit")
    price_cents = serializers.IntegerField(min_value=0, required=False)
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
