import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("organizations", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Customer",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("deleted_at", models.DateTimeField(blank=True, db_index=True, null=True)),
                ("name", models.CharField(max_length=180)),
                ("email", models.EmailField(blank=True, max_length=254)),
                ("phone", models.CharField(blank=True, max_length=32)),
                ("document", models.CharField(blank=True, max_length=40)),
                ("status", models.CharField(choices=[("active", "Active"), ("paused", "Paused"), ("blocked", "Blocked"), ("archived", "Archived")], default="active", max_length=20)),
                ("member_since", models.DateField(blank=True, null=True)),
                ("created_by", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="customers_customer_created", to=settings.AUTH_USER_MODEL)),
                ("organization", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="customers_customer_set", to="organizations.organization")),
                ("updated_by", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="customers_customer_updated", to=settings.AUTH_USER_MODEL)),
                ("user", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="customer_profiles", to=settings.AUTH_USER_MODEL)),
            ],
            options={
                "ordering": ["name"],
                "indexes": [
                    models.Index(fields=["organization", "status"], name="customers_c_organiz_d6cb52_idx"),
                    models.Index(fields=["organization", "email"], name="customers_c_organiz_20db34_idx"),
                    models.Index(fields=["organization", "phone"], name="customers_c_organiz_62e208_idx"),
                ],
            },
        ),
        migrations.CreateModel(
            name="Address",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("deleted_at", models.DateTimeField(blank=True, db_index=True, null=True)),
                ("label", models.CharField(blank=True, max_length=80)),
                ("recipient_name", models.CharField(blank=True, max_length=180)),
                ("postal_code", models.CharField(blank=True, max_length=20)),
                ("street", models.CharField(max_length=180)),
                ("number", models.CharField(blank=True, max_length=40)),
                ("complement", models.CharField(blank=True, max_length=120)),
                ("district", models.CharField(blank=True, max_length=120)),
                ("city", models.CharField(max_length=120)),
                ("state", models.CharField(max_length=40)),
                ("country", models.CharField(default="BR", max_length=2)),
                ("is_default", models.BooleanField(default=False)),
                ("delivery_instructions", models.TextField(blank=True)),
                ("customer", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="addresses", to="customers.customer")),
                ("organization", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="customers_address_set", to="organizations.organization")),
            ],
            options={
                "ordering": ["-is_default", "city", "street"],
                "indexes": [
                    models.Index(fields=["organization", "customer"], name="customers_a_organiz_49c533_idx"),
                    models.Index(fields=["organization", "city", "state"], name="customers_a_organiz_94f767_idx"),
                    models.Index(fields=["customer", "is_default"], name="customers_a_custome_21542d_idx"),
                ],
            },
        ),
        migrations.CreateModel(
            name="CustomerProfile",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("birth_date", models.DateField(blank=True, null=True)),
                ("notes", models.TextField(blank=True)),
                ("preferences", models.JSONField(blank=True, default=dict)),
                ("notification_settings", models.JSONField(blank=True, default=dict)),
                ("customer", models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name="profile", to="customers.customer")),
            ],
        ),
        migrations.CreateModel(
            name="CustomerNote",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("body", models.TextField()),
                ("is_internal", models.BooleanField(default=True)),
                ("author", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="customer_notes", to=settings.AUTH_USER_MODEL)),
                ("customer", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="notes", to="customers.customer")),
                ("organization", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="customer_notes", to="organizations.organization")),
            ],
            options={
                "ordering": ["-created_at"],
                "indexes": [
                    models.Index(fields=["organization", "customer"], name="customers_c_organiz_e1aa66_idx"),
                    models.Index(fields=["author"], name="customers_c_author__ad6642_idx"),
                ],
            },
        ),
        migrations.CreateModel(
            name="PaymentMethodRef",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("deleted_at", models.DateTimeField(blank=True, db_index=True, null=True)),
                ("method_type", models.CharField(choices=[("pix", "Pix"), ("card", "Card"), ("cashOnDelivery", "Cash on delivery"), ("manual", "Manual")], max_length=32)),
                ("label", models.CharField(blank=True, max_length=120)),
                ("provider", models.CharField(blank=True, max_length=80)),
                ("provider_reference", models.CharField(blank=True, max_length=180)),
                ("metadata", models.JSONField(blank=True, default=dict)),
                ("is_default", models.BooleanField(default=False)),
                ("customer", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="payment_method_refs", to="customers.customer")),
                ("organization", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="customers_paymentmethodref_set", to="organizations.organization")),
            ],
            options={
                "indexes": [
                    models.Index(fields=["organization", "customer"], name="customers_p_organiz_fd158c_idx"),
                    models.Index(fields=["customer", "is_default"], name="customers_p_custome_8598df_idx"),
                ],
            },
        ),
    ]
