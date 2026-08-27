from django.urls import path

from .views import me, users

urlpatterns = [
    path("me/", me, name="accounts-me"),
    path("users/", users, name="accounts-users"),
]
