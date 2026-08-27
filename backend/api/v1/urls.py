from django.urls import include, path

urlpatterns = [
    path("", include("apps.core.urls")),
    path("auth/", include("apps.accounts.auth_urls")),
    path("organizations/", include("apps.organizations.urls")),
    path("accounts/", include("apps.accounts.urls")),
    path("customers/", include("apps.customers.urls")),
]
