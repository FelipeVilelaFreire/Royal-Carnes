from .models import OrganizationMember


def user_memberships(user):
    return (
        OrganizationMember.objects.select_related("organization", "role")
        .prefetch_related("role__role_permissions__permission")
        .filter(user=user, status=OrganizationMember.Status.ACTIVE)
    )


def user_memberships_for_organization(user, organization):
    return user_memberships(user).filter(organization=organization)


def user_role_keys(user, organization) -> set[str]:
    return {
        membership.role.key
        for membership in user_memberships_for_organization(user, organization)
    }


def user_permission_keys(user, organization) -> set[str]:
    permission_keys: set[str] = set()
    for membership in user_memberships_for_organization(user, organization):
        for role_permission in membership.role.role_permissions.all():
            permission_keys.add(role_permission.permission.key)
    return permission_keys


def user_has_role(user, organization, role_key: str) -> bool:
    return role_key in user_role_keys(user, organization)


def user_has_permission(user, organization, permission_key: str) -> bool:
    if getattr(user, "is_superuser", False):
        return True
    return permission_key in user_permission_keys(user, organization)
