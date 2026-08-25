from django.urls import path
from apps.subscriptions.views import SubscriptionListView

urlpatterns = [
    path("", SubscriptionListView.as_view(), name="subscription-list"),
]
