from rest_framework.permissions import BasePermission

class IsTenantMember(BasePermission):
    def has_permission(self, request, view):
        return True
