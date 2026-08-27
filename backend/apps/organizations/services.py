from django.conf import settings

from .models import Organization


def ensure_default_organization() -> Organization:
    data = settings.ROYALPRIME_DEFAULT_ORGANIZATION
    organization, _created = Organization.objects.get_or_create(
        slug=data["slug"],
        defaults={
            "name": data["name"],
            "business_name": data["business_name"],
            "default_locale": data["locale"],
            "timezone": data["timezone"],
            "currency": data["currency"],
        },
    )
    return organization
