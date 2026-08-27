from django.contrib import admin

from .models import (
    CatalogAvailability,
    Category,
    Collection,
    CollectionProduct,
    CommercialMode,
    Product,
    ProductMedia,
    ProductPrice,
    ProductVariant,
)


@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    list_display = ("name", "key", "organization", "status", "sort_order")
    list_filter = ("organization", "status")
    search_fields = ("name", "key")


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "key", "organization", "is_active", "sort_order")
    list_filter = ("organization", "is_active")
    search_fields = ("name", "key")


@admin.register(CommercialMode)
class CommercialModeAdmin(admin.ModelAdmin):
    list_display = ("name", "key", "organization", "is_active", "sort_order")
    list_filter = ("organization", "is_active")
    search_fields = ("name", "key")


class ProductPriceInline(admin.TabularInline):
    model = ProductPrice
    extra = 0


class CollectionProductInline(admin.TabularInline):
    model = CollectionProduct
    extra = 0


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "key", "organization", "category", "status", "unit")
    list_filter = ("organization", "status", "category")
    search_fields = ("name", "key", "slug")
    inlines = [CollectionProductInline, ProductPriceInline]


admin.site.register(ProductVariant)
admin.site.register(ProductMedia)
admin.site.register(CatalogAvailability)
