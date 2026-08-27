from django.conf import settings
from django.db import OperationalError, ProgrammingError

from apps.organizations.models import Organization
from apps.organizations.services import ensure_default_organization


def requested_organization_slug(request) -> str:
    header_name = getattr(settings, "ROYALPRIME_ORGANIZATION_HEADER", "HTTP_X_ORGANIZATION_SLUG")
    raw_slug = request.META.get(header_name) or request.GET.get("organization")
    if raw_slug:
        return str(raw_slug).strip().lower()
    return settings.ROYALPRIME_DEFAULT_ORGANIZATION["slug"]


def resolve_request_organization(request) -> Organization | None:
    slug = requested_organization_slug(request)
    try:
        if slug == settings.ROYALPRIME_DEFAULT_ORGANIZATION["slug"]:
            return ensure_default_organization()
        return Organization.objects.get(slug=slug, status=Organization.Status.ACTIVE)
    except Organization.DoesNotExist:
        return None
    except (OperationalError, ProgrammingError):
        return None


def get_request_organization(request) -> Organization:
    organization = getattr(request, "organization", None)
    if organization is None:
        from rest_framework.exceptions import NotFound

        raise NotFound(
            {
                "code": "organization_not_found",
            }
        )
    return organization
