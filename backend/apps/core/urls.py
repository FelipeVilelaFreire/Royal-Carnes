from django.urls import path
from apps.core.views import CustomerListView

urlpatterns = [
    path("customers/", CustomerListView.as_view(), name="customer-list"),
]
