from apps.accounts.permissions import IsAuthenticatedOrganizationUser


class IsOrganizationMember(IsAuthenticatedOrganizationUser):
    pass
