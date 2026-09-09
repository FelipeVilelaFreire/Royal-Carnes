from django.contrib import admin

from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("reference", "customer", "subscription", "order", "status", "amount_cents", "due_at")
    list_filter = ("organization", "status", "currency")
    search_fields = ("reference", "customer__name", "customer__email", "order__code")

