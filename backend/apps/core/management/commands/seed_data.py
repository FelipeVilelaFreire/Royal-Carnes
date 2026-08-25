from django.core.management.base import BaseCommand
from apps.core.models import Organization, User, Customer
from apps.plans.models import Plan

class Command(BaseCommand):
    help = "Popula o banco de dados com a massa de dados inicial (Seed) espelhada nos mocks do frontend."

    def handle(self, *args, **options):
        self.stdout.write("Iniciando SEED do PrimeCutClub...")

        # 1. Organização Principal
        org, _ = Organization.objects.get_or_create(
            slug="primecut-club",
            defaults={"name": "Prime Cut Club"}
        )

        # 2. Planos de Assinatura (Mesmos do mock frontend)
        plans_data = [
            {
                "key": "essential",
                "name": "Essencial Barbecue",
                "price_cents": 19900,
                "billing_frequency": "monthly",
                "fulfillment_type": "physical_delivery",
                "metadata": {"tagline": "Cortes nobres essenciais para o seu churrasco mensal"}
            },
            {
                "key": "master",
                "name": "Master Churrasco",
                "price_cents": 34900,
                "billing_frequency": "monthly",
                "fulfillment_type": "physical_delivery",
                "metadata": {"tagline": "A experiência completa de churrascaria no conforto de casa", "recommended": True}
            },
            {
                "key": "wagyu",
                "name": "Exclusive Wagyu",
                "price_cents": 69900,
                "billing_frequency": "monthly",
                "fulfillment_type": "physical_delivery",
                "metadata": {"tagline": "Para apreciadores do mais alto nível do churrasco mundial"}
            }
        ]

        for pdata in plans_data:
            plan, created = Plan.objects.get_or_create(
                organization=org,
                key=pdata["key"],
                defaults=pdata
            )
            if created:
                self.stdout.write(f"  + Plano criado: {plan.name}")

        # 3. Usuário & Cliente de Teste
        user, u_created = User.objects.get_or_create(
            email="felipe@primecut.club",
            defaults={
                "password_hash": "pbkdf2_sha256$mock_hash_for_dev",
                "full_name": "Felipe Vila Nova",
                "role": "admin"
            }
        )

        customer, c_created = Customer.objects.get_or_create(
            organization=org,
            user=user,
            defaults={
                "cpf_cnpj": "123.456.789-00",
                "phone": "(21) 99999-8888",
                "default_shipping_address": {
                    "street": "Av. Atlântica",
                    "number": "1500",
                    "city": "Rio de Janeiro",
                    "state": "RJ"
                }
            }
        )

        if c_created:
            self.stdout.write(f"  + Cliente de teste criado: {customer.user.full_name}")

        self.stdout.write(self.style.SUCCESS("SEED concluído com sucesso! Banco populado e alinhado com o Frontend."))
