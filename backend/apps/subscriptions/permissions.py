from rest_framework.permissions import BasePermission

class IsSubscriptionOwnerOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return True
