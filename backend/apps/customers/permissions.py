from apps.accounts.permissions import RequiresOrganizationPermission


class CanReadCustomers(RequiresOrganizationPermission):
    required_permission = "customers.read"


class CanManageCustomers(RequiresOrganizationPermission):
    required_permission = "customers.manage"
