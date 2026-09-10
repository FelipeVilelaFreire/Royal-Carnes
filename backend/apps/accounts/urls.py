from django.urls import path

from .views import change_my_password, deactivate_my_account, me, users

urlpatterns = [
    path("me/", me, name="accounts-me"),
    path("me/password/", change_my_password, name="accounts-me-password"),
    path("me/deactivate/", deactivate_my_account, name="accounts-me-deactivate"),
    path("users/", users, name="accounts-users"),
]
