from django.test import SimpleTestCase

from apps.core.seed_loader import BackendSeedLoader


class BackendSeedLoaderTests(SimpleTestCase):
    def test_loads_royalprime_modules(self):
        manifest = BackendSeedLoader().load("royalprime")

        self.assertEqual(manifest.key, "royalprime")
        self.assertEqual(
            [module.kit for module in manifest.modules],
            ["organizations", "auth-users", "customers", "catalog", "subscriptions", "inventory"],
        )

    def test_loads_example_modules(self):
        manifest = BackendSeedLoader().load("examples/bikeclub")

        self.assertEqual(manifest.key, "bikeclub")
        self.assertEqual(manifest.seed_type, "example")
        self.assertEqual(manifest.modules[0].kit, "organizations")
        self.assertEqual(manifest.modules[-1].kit, "inventory")
