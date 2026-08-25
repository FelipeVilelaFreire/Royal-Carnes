from django.contrib import admin
from apps.subscriptions.models import Subscription, PauseLog

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ("id", "customer", "plan", "status", "current_period_start", "current_period_end", "cancel_at_period_end")

@admin.register(PauseLog)
class PauseLogAdmin(admin.ModelAdmin):
    list_display = ("id", "subscription", "paused_at", "resumes_at", "reason")
