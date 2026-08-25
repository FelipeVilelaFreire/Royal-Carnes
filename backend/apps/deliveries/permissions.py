from rest_framework.permissions import BasePermission

class IsDeliveryAdmin(BasePermission):
    def has_permission(self, request, view):
        return True
