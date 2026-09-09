from django.urls import path

from .views import admin_categories, admin_category, admin_collections, admin_media_upload, admin_product, admin_products, categories, collections, commercial_modes, measurement_units, product, products

urlpatterns = [
    path("categories/", categories, name="catalog-categories"),
    path("collections/", collections, name="catalog-collections"),
    path("commercial-modes/", commercial_modes, name="catalog-commercial-modes"),
    path("measurement-units/", measurement_units, name="catalog-measurement-units"),
    path("products/", products, name="catalog-products"),
    path("products/<int:product_id>/", product, name="catalog-product-detail"),
    path("admin/categories/", admin_categories, name="catalog-admin-categories"),
    path("admin/categories/<int:category_id>/", admin_category, name="catalog-admin-category-detail"),
    path("admin/collections/", admin_collections, name="catalog-admin-collections"),
    path("admin/uploads/media/", admin_media_upload, name="catalog-admin-media-upload"),
    path("admin/products/", admin_products, name="catalog-admin-products"),
    path("admin/products/<int:product_id>/", admin_product, name="catalog-admin-product-detail"),
]
