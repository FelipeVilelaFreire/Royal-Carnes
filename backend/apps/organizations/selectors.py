from .models import Organization


def get_active_organization_by_slug(slug: str) -> Organization:
    return Organization.objects.get(slug=slug, status=Organization.Status.ACTIVE)
