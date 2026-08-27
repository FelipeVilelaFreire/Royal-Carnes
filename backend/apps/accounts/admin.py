from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import (
    OrganizationMember,
    PasswordResetToken,
    Permission,
    Role,
    RolePermission,
    User,
)


@admin.register(User)
class RoyalPrimeUserAdmin(UserAdmin):
    model = User
    list_display = ("email", "name", "is_staff", "is_active")
    ordering = ("email",)
    search_fields = ("email", "name", "phone")
    fieldsets = UserAdmin.fieldsets + (
        ("RoyalPrime", {"fields": ("name", "phone", "deleted_at")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2", "is_staff", "is_active"),
            },
        ),
    )


admin.site.register(Role)
admin.site.register(Permission)
admin.site.register(RolePermission)
admin.site.register(OrganizationMember)
admin.site.register(PasswordResetToken)
