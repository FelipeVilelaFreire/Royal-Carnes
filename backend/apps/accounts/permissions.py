from rest_framework.permissions import BasePermission, IsAuthenticated

from apps.core.tenant import get_request_organization

from .selectors import user_has_permission, user_memberships_for_organization

class IsAuthenticatedOrganizationUser(IsAuthenticated):
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        organization = get_request_organization(request)
        return user_memberships_for_organization(request.user, organization).exists()


class RequiresOrganizationPermission(BasePermission):
    required_permission = ""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        organization = get_request_organization(request)
        permission_key = getattr(view, "required_permission", "") or self.required_permission
        if not permission_key:
            return user_memberships_for_organization(request.user, organization).exists()
        return user_has_permission(request.user, organization, permission_key)


def require_organization_permission(user, organization, permission_key: str) -> None:
    if not user_has_permission(user, organization, permission_key):
        from rest_framework.exceptions import PermissionDenied

        raise PermissionDenied(
            {
                "code": "permission_denied",
                "permission": permission_key,
            }
        )
