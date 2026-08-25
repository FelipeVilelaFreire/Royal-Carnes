from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/core/", include("apps.core.urls")),
    path("api/v1/plans/", include("apps.plans.urls")),
    path("api/v1/subscriptions/", include("apps.subscriptions.urls")),
    path("api/v1/billing/", include("apps.billing.urls")),
    path("api/v1/deliveries/", include("apps.deliveries.urls")),
]
