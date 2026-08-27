from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Organization",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("deleted_at", models.DateTimeField(blank=True, db_index=True, null=True)),
                ("slug", models.SlugField(max_length=80, unique=True)),
                ("name", models.CharField(max_length=160)),
                ("business_name", models.CharField(blank=True, max_length=180)),
                ("legal_name", models.CharField(blank=True, max_length=180)),
                ("document", models.CharField(blank=True, max_length=40)),
                ("status", models.CharField(choices=[("active", "Active"), ("suspended", "Suspended"), ("archived", "Archived")], default="active", max_length=20)),
                ("default_locale", models.CharField(default="pt-BR", max_length=16)),
                ("timezone", models.CharField(default="America/Sao_Paulo", max_length=64)),
                ("currency", models.CharField(default="BRL", max_length=3)),
            ],
            options={
                "ordering": ["name"],
                "indexes": [
                    models.Index(fields=["slug"], name="organizatio_slug_c3d82b_idx"),
                    models.Index(fields=["status"], name="organizatio_status_7b766f_idx"),
                ],
            },
        ),
        migrations.CreateModel(
            name="OrganizationSettings",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("key", models.CharField(max_length=120)),
                ("value", models.JSONField(blank=True, default=dict)),
                ("organization", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="settings", to="organizations.organization")),
            ],
            options={
                "indexes": [
                    models.Index(fields=["organization", "key"], name="organizatio_organiz_d35f6c_idx"),
                ],
            },
        ),
        migrations.CreateModel(
            name="OrganizationDomain",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("domain", models.CharField(max_length=255, unique=True)),
                ("is_primary", models.BooleanField(default=False)),
                ("organization", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="domains", to="organizations.organization")),
            ],
            options={
                "indexes": [
                    models.Index(fields=["domain"], name="organizatio_domain_d9d8a5_idx"),
                    models.Index(fields=["organization", "is_primary"], name="organizatio_organiz_19b624_idx"),
                ],
            },
        ),
        migrations.CreateModel(
            name="OrganizationFeatureFlag",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("key", models.CharField(max_length=120)),
                ("enabled", models.BooleanField(default=False)),
                ("config", models.JSONField(blank=True, default=dict)),
                ("organization", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="feature_flags", to="organizations.organization")),
            ],
            options={
                "indexes": [
                    models.Index(fields=["organization", "enabled"], name="organizatio_organiz_a8c778_idx"),
                ],
            },
        ),
        migrations.AddConstraint(
            model_name="organizationsettings",
            constraint=models.UniqueConstraint(fields=("organization", "key"), name="organization_settings_unique_key"),
        ),
        migrations.AddConstraint(
            model_name="organizationfeatureflag",
            constraint=models.UniqueConstraint(fields=("organization", "key"), name="organization_feature_flag_unique_key"),
        ),
    ]
