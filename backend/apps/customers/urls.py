from django.urls import path

from .views import customer, customers

urlpatterns = [
    path("", customers, name="customers-list-create"),
    path("<int:customer_id>/", customer, name="customers-detail"),
]
