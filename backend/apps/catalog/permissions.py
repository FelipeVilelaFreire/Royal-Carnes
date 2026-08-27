from apps.accounts.permissions import RequiresOrganizationPermission


class CanManageProducts(RequiresOrganizationPermission):
    required_permission = "products.manage"
