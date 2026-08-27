from django.test import RequestFactory, TestCase

from apps.core.tenant.resolver import requested_organization_slug, resolve_request_organization
from apps.organizations.models import Organization


class TenantResolverTests(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_uses_default_organization_without_header(self):
        request = self.factory.get("/api/v1/health/")

        organization = resolve_request_organization(request)

        self.assertEqual(organization.slug, "royalprime")

    def test_uses_header_slug(self):
        Organization.objects.create(
            slug="bikeclub",
            name="BikeClub",
            business_name="BikeClub Assinaturas",
        )
        request = self.factory.get(
            "/api/v1/customers/",
            HTTP_X_ORGANIZATION_SLUG="bikeclub",
        )

        self.assertEqual(requested_organization_slug(request), "bikeclub")
        self.assertEqual(resolve_request_organization(request).slug, "bikeclub")

    def test_unknown_header_slug_returns_none(self):
        request = self.factory.get(
            "/api/v1/customers/",
            HTTP_X_ORGANIZATION_SLUG="missing",
        )

        self.assertIsNone(resolve_request_organization(request))
