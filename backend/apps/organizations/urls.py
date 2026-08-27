from django.urls import path

from .views import default_organization

urlpatterns = [
    path("default/", default_organization, name="default-organization"),
]
