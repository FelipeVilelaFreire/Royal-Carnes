from django.urls import path

from . import views

urlpatterns = [
    path("me/", views.my_payments, name="payments-me"),
    path("admin/payments/", views.admin_payments, name="payments-admin-payments"),
    path("admin/payments/<int:payment_id>/", views.admin_payment_detail, name="payments-admin-payment-detail"),
]
