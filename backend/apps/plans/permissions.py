from rest_framework.permissions import BasePermission

class IsPlanAdmin(BasePermission):
    def has_permission(self, request, view):
        return True
