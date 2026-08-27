from django.contrib import admin

from .models import (
    Organization,
    OrganizationDomain,
    OrganizationFeatureFlag,
    OrganizationSettings,
)


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "status", "currency", "default_locale")
    search_fields = ("name", "slug", "business_name", "legal_name")
    list_filter = ("status", "currency")


admin.site.register(OrganizationSettings)
admin.site.register(OrganizationDomain)
admin.site.register(OrganizationFeatureFlag)
