from django.urls import path

from . import views

urlpatterns = [
    path("config/", views.order_config),
    path("me/", views.my_orders),
    path("me/<int:order_id>/", views.my_order_detail),
    path("admin/orders/", views.admin_orders),
    path("admin/orders/<int:order_id>/", views.admin_order_detail),
    path("admin/orders/<int:order_id>/transition/", views.admin_order_transition),
]
