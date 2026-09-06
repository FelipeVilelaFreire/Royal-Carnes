from django.urls import path

from .views import admin_product, admin_products, collections, commercial_modes, product, products

urlpatterns = [
    path("collections/", collections, name="catalog-collections"),
    path("commercial-modes/", commercial_modes, name="catalog-commercial-modes"),
    path("products/", products, name="catalog-products"),
    path("products/<int:product_id>/", product, name="catalog-product-detail"),
    path("admin/products/", admin_products, name="catalog-admin-products"),
    path("admin/products/<int:product_id>/", admin_product, name="catalog-admin-product-detail"),
]
