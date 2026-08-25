from django.urls import path
from apps.deliveries.views import ShipmentListView

urlpatterns = [
    path("shipments/", ShipmentListView.as_view(), name="shipment-list"),
]
