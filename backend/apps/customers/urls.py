from django.urls import path

from .views import customer, customer_address, customer_addresses, current_customer, customers

urlpatterns = [
    path("me/", current_customer, name="customers-me"),
    path("me/addresses/", customer_addresses, name="customers-me-addresses"),
    path("me/addresses/<int:address_id>/", customer_address, name="customers-me-address-detail"),
    path("", customers, name="customers-list-create"),
    path("<int:customer_id>/", customer, name="customers-detail"),
]
