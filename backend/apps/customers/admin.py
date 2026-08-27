from django.contrib import admin

from .models import Address, Customer, CustomerNote, CustomerProfile, PaymentMethodRef


class AddressInline(admin.TabularInline):
    model = Address
    extra = 0


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone", "organization", "status")
    search_fields = ("name", "email", "phone", "document")
    list_filter = ("organization", "status")
    inlines = [AddressInline]


admin.site.register(CustomerProfile)
admin.site.register(CustomerNote)
admin.site.register(PaymentMethodRef)
