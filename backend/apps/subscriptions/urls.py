from django.urls import path

from .views import (
    admin_cycles,
    admin_plans,
    admin_subscription_detail,
    admin_subscriptions,
    my_current_cycle,
    my_current_cycle_items,
    my_subscription,
    plans,
)

urlpatterns = [
    path("plans/", plans, name="subscriptions-plans"),
    path("me/", my_subscription, name="subscriptions-me"),
    path("me/cycles/current/", my_current_cycle, name="subscriptions-me-current-cycle"),
    path("me/cycles/current/items/", my_current_cycle_items, name="subscriptions-me-current-cycle-items"),
    path("admin/plans/", admin_plans, name="subscriptions-admin-plans"),
    path("admin/subscriptions/", admin_subscriptions, name="subscriptions-admin-subscriptions"),
    path("admin/subscriptions/<int:subscription_id>/", admin_subscription_detail, name="subscriptions-admin-subscription-detail"),
    path("admin/cycles/", admin_cycles, name="subscriptions-admin-cycles"),
]
