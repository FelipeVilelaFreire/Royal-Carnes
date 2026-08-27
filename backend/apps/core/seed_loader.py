import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from django.conf import settings
from django.db import transaction

from apps.accounts.models import User
from apps.accounts.services import (
    assign_permission_to_role,
    upsert_permission,
    upsert_role,
    upsert_user_with_roles,
)
from apps.customers.services import upsert_customer
from apps.organizations.models import Organization
from apps.catalog.models import Category, Collection, CommercialMode
from apps.catalog.services import (
    set_product_availability,
    set_product_collections,
    set_product_price,
    upsert_category,
    upsert_collection,
    upsert_commercial_mode,
    upsert_product,
)


@dataclass(frozen=True)
class SeedModule:
    kit: str
    path: Path
    data: dict[str, Any]


@dataclass(frozen=True)
class SeedManifest:
    key: str
    seed_type: str
    path: Path
    modules: list[SeedModule]


class SeedLoaderError(ValueError):
    pass


class BackendSeedLoader:
    def __init__(self, base_dir: Path | None = None):
        self.base_dir = base_dir or settings.BASE_DIR / "seeds"

    def manifest_path(self, seed: str) -> Path:
        normalized_seed = seed.strip("/\\")
        if not normalized_seed:
            raise SeedLoaderError("Seed key is required")
        if normalized_seed == "royalprime":
            return self.base_dir / "royalprime" / "seed.manifest.json"
        if normalized_seed.startswith("examples/"):
            return self.base_dir / normalized_seed / "seed.manifest.json"
        if normalized_seed.startswith("tests/"):
            return self.base_dir / "tests" / "minimal.seed.manifest.json"
        return self.base_dir / normalized_seed / "seed.manifest.json"

    def load(self, seed: str) -> SeedManifest:
        manifest_path = self.manifest_path(seed)
        if not manifest_path.exists():
            raise SeedLoaderError(f"Seed manifest not found: {manifest_path}")

        manifest_data = self._load_json(manifest_path)
        modules = []
        for module_ref in manifest_data.get("modules", []):
            kit = module_ref["kit"]
            relative_path = module_ref["path"]
            module_path = manifest_path.parent / relative_path
            if not module_path.exists():
                raise SeedLoaderError(f"Seed module not found: {module_path}")
            module_data = self._load_json(module_path)
            if module_data.get("kit") != kit:
                raise SeedLoaderError(
                    f"Seed module kit mismatch: {module_path} expected {kit}"
                )
            modules.append(SeedModule(kit=kit, path=module_path, data=module_data))

        return SeedManifest(
            key=manifest_data["seedKey"],
            seed_type=manifest_data["seedType"],
            path=manifest_path,
            modules=modules,
        )

    def _load_json(self, path: Path) -> dict[str, Any]:
        with path.open("r", encoding="utf-8") as file:
            return json.load(file)


class BackendSeedApplier:
    def __init__(self, manifest: SeedManifest, *, dry_run: bool = False):
        self.manifest = manifest
        self.dry_run = dry_run
        self.summary: list[str] = []
        self.organization: Organization | None = None
        self.users_by_customer_key: dict[str, User] = {}

    def apply(self) -> list[str]:
        if self.dry_run:
            self.summary.append(f"dry-run seed={self.manifest.key}")
            for module in self.manifest.modules:
                self.summary.append(f"would apply {module.kit}: {module.path}")
            return self.summary

        with transaction.atomic():
            for module in self.manifest.modules:
                if module.kit == "organizations":
                    self.apply_organizations(module.data)
                elif module.kit == "auth-users":
                    self.apply_auth_users(module.data)
                elif module.kit == "customers":
                    self.apply_customers(module.data)
                elif module.kit == "catalog":
                    self.apply_catalog(module.data)
                else:
                    self.summary.append(f"skipped planned kit={module.kit}")
        return self.summary

    def apply_organizations(self, data: dict[str, Any]) -> None:
        organization_data = data["organization"]
        self.organization, _created = Organization.objects.update_or_create(
            slug=organization_data["slug"],
            defaults={
                "name": organization_data["name"],
                "business_name": organization_data.get("businessName", ""),
                "default_locale": organization_data.get("locale", "pt-BR"),
                "timezone": organization_data.get("timezone", "America/Sao_Paulo"),
                "currency": organization_data.get("currency", "BRL"),
            },
        )
        self.summary.append(f"applied organizations: {self.organization.slug}")

    def apply_auth_users(self, data: dict[str, Any]) -> None:
        organization = self.require_organization()
        permissions_by_key = {
            permission_key: upsert_permission(key=permission_key)
            for permission_key in data.get("permissions", [])
        }
        roles_by_key = {
            role_data["key"]: upsert_role(
                organization=organization,
                key=role_data["key"],
                name=role_data.get("name"),
            )
            for role_data in data.get("roles", [])
        }
        for role_key, permission_keys in data.get("rolePermissions", {}).items():
            role = roles_by_key[role_key]
            for permission_key in permission_keys:
                assign_permission_to_role(
                    role=role,
                    permission=permissions_by_key[permission_key],
                )
        for user_data in data.get("users", []):
            user = upsert_user_with_roles(
                organization=organization,
                email=user_data["email"],
                name=user_data.get("fullName", ""),
                phone=user_data.get("phone", ""),
                password=user_data.get("password"),
                roles=user_data.get("roles", []),
            )
            customer_key = user_data.get("customerKey")
            if customer_key:
                self.users_by_customer_key[customer_key] = user
        self.summary.append(f"applied auth-users: users={len(data.get('users', []))}")

    def apply_customers(self, data: dict[str, Any]) -> None:
        organization = self.require_organization()
        for customer_data in data.get("customers", []):
            upsert_customer(
                organization=organization,
                key=customer_data.get("key", ""),
                name=customer_data["name"],
                email=customer_data.get("email", ""),
                phone=customer_data.get("phone", ""),
                user=self.users_by_customer_key.get(customer_data.get("key", "")),
            )
        self.summary.append(f"applied customers: count={len(data.get('customers', []))}")

    def apply_catalog(self, data: dict[str, Any]) -> None:
        organization = self.require_organization()
        collections_by_key: dict[str, Collection] = {}
        categories_by_key: dict[str, Category] = {}
        commercial_modes_by_key: dict[str, CommercialMode] = {}

        for collection_data in data.get("collections", []):
            collections_by_key[collection_data["key"]] = upsert_collection(
                organization=organization,
                key=collection_data["key"],
                name=collection_data["name"],
                description=collection_data.get("description", ""),
            )

        for category_data in data.get("categories", []):
            categories_by_key[category_data["key"]] = upsert_category(
                organization=organization,
                key=category_data["key"],
                name=category_data["name"],
            )

        for commercial_mode_data in data.get("commercialModes", []):
            commercial_modes_by_key[commercial_mode_data["key"]] = upsert_commercial_mode(
                organization=organization,
                key=commercial_mode_data["key"],
                name=commercial_mode_data["name"],
            )

        for product_data in data.get("products", []):
            product = upsert_product(
                organization=organization,
                key=product_data["key"],
                name=product_data["name"],
                category=categories_by_key[product_data["categoryKey"]],
                unit=product_data.get("unit", "unit"),
                description=product_data.get("description", ""),
            )
            product_collections = [
                collections_by_key[collection_key]
                for collection_key in product_data.get("collections", [])
            ]
            set_product_collections(
                organization=organization,
                product=product,
                collections=product_collections,
            )
            for commercial_mode_key in product_data.get("commercialModes", []):
                commercial_mode = commercial_modes_by_key[commercial_mode_key]
                set_product_price(
                    organization=organization,
                    product=product,
                    commercial_mode=commercial_mode,
                    amount_cents=product_data["priceCents"],
                    currency=organization.currency,
                )
                set_product_availability(
                    organization=organization,
                    product=product,
                    commercial_mode=commercial_mode,
                )
        self.summary.append(f"applied catalog: products={len(data.get('products', []))}")

    def require_organization(self) -> Organization:
        if self.organization is None:
            raise SeedLoaderError("organizations module must run before this module")
        return self.organization
