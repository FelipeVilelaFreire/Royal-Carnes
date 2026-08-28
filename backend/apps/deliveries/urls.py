from django.urls import path

from . import views

urlpatterns = [
    path("config/", views.delivery_config),
    path("me/", views.my_deliveries),
    path("me/<int:delivery_id>/", views.my_delivery_detail),
    path("admin/deliveries/", views.admin_deliveries),
    path("admin/deliveries/<int:delivery_id>/", views.admin_delivery_detail),
    path("admin/deliveries/<int:delivery_id>/transition/", views.admin_delivery_transition),
    path("admin/deliveries/<int:delivery_id>/confirm/", views.admin_delivery_confirm),
]
