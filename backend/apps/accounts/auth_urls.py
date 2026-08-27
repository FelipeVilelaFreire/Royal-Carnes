from django.urls import path

from .views import LoginView, RefreshView, logout, register

urlpatterns = [
    path("login/", LoginView.as_view(), name="auth-login"),
    path("refresh/", RefreshView.as_view(), name="auth-refresh"),
    path("register/", register, name="auth-register"),
    path("logout/", logout, name="auth-logout"),
]
