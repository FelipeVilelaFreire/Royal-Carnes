from django.urls import path

from .views import admin_dashboard_summary, health_check

urlpatterns = [
    path("admin/dashboard/summary/", admin_dashboard_summary, name="admin-dashboard-summary"),
    path("health/", health_check, name="health-check"),
]
