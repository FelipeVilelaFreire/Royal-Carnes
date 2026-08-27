from django.db import transaction

from .models import OrganizationMember, Permission, Role, RolePermission, User


@transaction.atomic
def create_user_with_membership(
    *,
    email: str,
    password: str | None,
    organization,
    role_key: str,
    name: str = "",
) -> User:
    user = User.objects.create_user(email=email, password=password, name=name)
    role = Role.objects.get(organization=organization, key=role_key)
    OrganizationMember.objects.create(organization=organization, user=user, role=role)
    return user


@transaction.atomic
def upsert_permission(*, key: str, name: str | None = None, description: str = "") -> Permission:
    permission, _created = Permission.objects.update_or_create(
        key=key,
        defaults={
            "name": name or key,
            "description": description,
        },
    )
    return permission


@transaction.atomic
def upsert_role(*, organization, key: str, name: str | None = None, description: str = "") -> Role:
    role, _created = Role.objects.update_or_create(
        organization=organization,
        key=key,
        defaults={
            "name": name or key,
            "description": description,
        },
    )
    return role


@transaction.atomic
def assign_permission_to_role(*, role: Role, permission: Permission) -> RolePermission:
    role_permission, _created = RolePermission.objects.get_or_create(
        role=role,
        permission=permission,
    )
    return role_permission


@transaction.atomic
def upsert_user_with_roles(
    *,
    organization,
    email: str,
    roles: list[str],
    name: str = "",
    password: str | None = None,
    phone: str = "",
) -> User:
    user, created = User.objects.get_or_create(
        email=User.objects.normalize_email(email),
        defaults={
            "name": name,
            "phone": phone,
            "is_active": True,
        },
    )
    if not created:
        changed_fields = []
        if name and user.name != name:
            user.name = name
            changed_fields.append("name")
        if phone and user.phone != phone:
            user.phone = phone
            changed_fields.append("phone")
        if changed_fields:
            user.save(update_fields=changed_fields + ["updated_at"])
    if created and password:
        user.set_password(password)
        user.save(update_fields=["password"])
    elif created:
        user.set_unusable_password()
        user.save(update_fields=["password"])

    for role_key in roles:
        role = Role.objects.get(organization=organization, key=role_key)
        OrganizationMember.objects.get_or_create(
            organization=organization,
            user=user,
            role=role,
            defaults={"status": OrganizationMember.Status.ACTIVE},
        )
    return user
