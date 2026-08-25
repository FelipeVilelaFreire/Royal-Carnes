from rest_framework.permissions import BasePermission

class IsBillingOwnerOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return True
