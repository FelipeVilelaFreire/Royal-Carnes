import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("organizations", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Category",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("deleted_at", models.DateTimeField(blank=True, db_index=True, null=True)),
                ("key", models.SlugField(max_length=100)),
                ("name", models.CharField(max_length=160)),
                ("sort_order", models.PositiveIntegerField(default=0)),
                ("is_active", models.BooleanField(default=True)),
                ("organization", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="catalog_category_set", to="organizations.organization")),
                ("parent", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="children", to="catalog.category")),
            ],
            options={
                "ordering": ["sort_order", "name"],
                "indexes": [
                    models.Index(fields=["organization", "is_active"], name="catalog_cat_organiz_81c46f_idx"),
                    models.Index(fields=["organization", "sort_order"], name="catalog_cat_organiz_3bcfa0_idx"),
                ],
            },
        ),
        migrations.CreateModel(
            name="Collection",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("deleted_at", models.DateTimeField(blank=True, db_index=True, null=True)),
                ("key", models.SlugField(max_length=100)),
                ("name", models.CharField(max_length=160)),
                ("description", models.TextField(blank=True)),
                ("status", models.CharField(choices=[("active", "Active"), ("draft", "Draft"), ("archived", "Archived")], default="active", max_length=20)),
                ("sort_order", models.PositiveIntegerField(default=0)),
                ("starts_at", models.DateTimeField(blank=True, null=True)),
                ("ends_at", models.DateTimeField(blank=True, null=True)),
                ("organization", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="catalog_collection_set", to="organizations.organization")),
            ],
            options={
                "ordering": ["sort_order", "name"],
                "indexes": [
                    models.Index(fields=["organization", "status"], name="catalog_col_organiz_5ff963_idx"),
                    models.Index(fields=["organization", "sort_order"], name="catalog_col_organiz_10eb6c_idx"),
                ],
            },
        ),
        migrations.CreateModel(
            name="CommercialMode",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("key", models.SlugField(max_length=80)),
                ("name", models.CharField(max_length=140)),
                ("is_active", models.BooleanField(default=True)),
                ("sort_order", models.PositiveIntegerField(default=0)),
                ("organization", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="catalog_commercialmode_set", to="organizations.organization")),
            ],
            options={
                "ordering": ["sort_order", "name"],
                "indexes": [
                    models.Index(fields=["organization", "is_active"], name="catalog_com_organiz_929d31_idx"),
                ],
            },
        ),
        migrations.CreateModel(
            name="Product",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("deleted_at", models.DateTimeField(blank=True, db_index=True, null=True)),
                ("key", models.SlugField(max_length=120)),
                ("name", models.CharField(max_length=180)),
                ("slug", models.SlugField(max_length=140)),
                ("description", models.TextField(blank=True)),
                ("unit", models.CharField(default="unit", max_length=32)),
                ("status", models.CharField(choices=[("active", "Active"), ("draft", "Draft"), ("archived", "Archived")], default="active", max_length=20)),
                ("is_perishable", models.BooleanField(default=False)),
                ("sort_order", models.PositiveIntegerField(default=0)),
                ("category", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="products", to="catalog.category")),
                ("organization", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="catalog_product_set", to="organizations.organization")),
            ],
            options={
                "ordering": ["sort_order", "name"],
                "indexes": [
                    models.Index(fields=["organization", "status"], name="catalog_pro_organiz_882f5d_idx"),
                    models.Index(fields=["organization", "category"], name="catalog_pro_organiz_b9ecff_idx"),
                    models.Index(fields=["organization", "sort_order"], name="catalog_pro_organiz_4d855a_idx"),
                ],
            },
        ),
        migrations.CreateModel(
            name="ProductVariant",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("deleted_at", models.DateTimeField(blank=True, db_index=True, null=True)),
                ("sku", models.CharField(blank=True, max_length=80)),
                ("name", models.CharField(max_length=140)),
                ("unit", models.CharField(default="unit", max_length=32)),
                ("unit_quantity", models.DecimalField(decimal_places=3, default=1, max_digits=10)),
                ("weight_grams", models.PositiveIntegerField(blank=True, null=True)),
                ("is_active", models.BooleanField(default=True)),
                ("organization", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="catalog_productvariant_set", to="organizations.organization")),
                ("product", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="variants", to="catalog.product")),
            ],
            options={
                "ordering": ["name"],
                "indexes": [
                    models.Index(fields=["organization", "product", "is_active"], name="catalog_pro_organiz_40a83b_idx"),
                    models.Index(fields=["organization", "sku"], name="catalog_pro_organiz_554870_idx"),
                ],
            },
        ),
        migrations.CreateModel(
            name="ProductMedia",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("url", models.URLField()),
                ("alt", models.CharField(blank=True, max_length=180)),
                ("sort_order", models.PositiveIntegerField(default=0)),
                ("is_primary", models.BooleanField(default=False)),
                ("organization", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="catalog_productmedia_set", to="organizations.organization")),
                ("product", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="media", to="catalog.product")),
            ],
            options={
                "ordering": ["sort_order"],
                "indexes": [
                    models.Index(fields=["organization", "product", "is_primary"], name="catalog_pro_organiz_77e2fe_idx"),
                ],
            },
        ),
        migrations.CreateModel(
            name="CollectionProduct",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("sort_order", models.PositiveIntegerField(default=0)),
                ("is_featured", models.BooleanField(default=False)),
                ("starts_at", models.DateTimeField(blank=True, null=True)),
                ("ends_at", models.DateTimeField(blank=True, null=True)),
                ("collection", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="collection_products", to="catalog.collection")),
                ("organization", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="catalog_collectionproduct_set", to="organizations.organization")),
                ("product", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="collection_links", to="catalog.product")),
            ],
            options={
                "ordering": ["sort_order", "product__name"],
                "indexes": [
                    models.Index(fields=["organization", "collection", "sort_order"], name="catalog_col_organiz_62cd1c_idx"),
                    models.Index(fields=["organization", "product"], name="catalog_col_organiz_23ac93_idx"),
                ],
            },
        ),
        migrations.CreateModel(
            name="ProductPrice",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("currency", models.CharField(default="BRL", max_length=3)),
                ("amount_cents", models.PositiveIntegerField()),
                ("starts_at", models.DateTimeField(blank=True, null=True)),
                ("ends_at", models.DateTimeField(blank=True, null=True)),
                ("commercial_mode", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="product_prices", to="catalog.commercialmode")),
                ("organization", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="catalog_productprice_set", to="organizations.organization")),
                ("product", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="prices", to="catalog.product")),
                ("variant", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name="prices", to="catalog.productvariant")),
            ],
            options={
                "ordering": ["commercial_mode__sort_order", "amount_cents"],
                "indexes": [
                    models.Index(fields=["organization", "product"], name="catalog_pro_organiz_f9f2e5_idx"),
                    models.Index(fields=["organization", "commercial_mode"], name="catalog_pro_organiz_6fc6f1_idx"),
                ],
            },
        ),
        migrations.CreateModel(
            name="CatalogAvailability",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("is_available", models.BooleanField(default=True)),
                ("reason", models.CharField(blank=True, max_length=160)),
                ("commercial_mode", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="product_availability", to="catalog.commercialmode")),
                ("organization", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="catalog_catalogavailability_set", to="organizations.organization")),
                ("product", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="availability", to="catalog.product")),
            ],
            options={
                "indexes": [
                    models.Index(fields=["organization", "is_available"], name="catalog_cat_organiz_b55681_idx"),
                ],
            },
        ),
        migrations.AddConstraint(
            model_name="category",
            constraint=models.UniqueConstraint(fields=("organization", "key"), name="catalog_category_unique_key"),
        ),
        migrations.AddConstraint(
            model_name="collection",
            constraint=models.UniqueConstraint(fields=("organization", "key"), name="catalog_collection_unique_key"),
        ),
        migrations.AddConstraint(
            model_name="commercialmode",
            constraint=models.UniqueConstraint(fields=("organization", "key"), name="catalog_commercial_mode_unique_key"),
        ),
        migrations.AddConstraint(
            model_name="product",
            constraint=models.UniqueConstraint(fields=("organization", "key"), name="catalog_product_unique_key"),
        ),
        migrations.AddConstraint(
            model_name="product",
            constraint=models.UniqueConstraint(fields=("organization", "slug"), name="catalog_product_unique_slug"),
        ),
        migrations.AddConstraint(
            model_name="collectionproduct",
            constraint=models.UniqueConstraint(fields=("organization", "collection", "product"), name="catalog_collection_product_unique"),
        ),
        migrations.AddConstraint(
            model_name="productprice",
            constraint=models.UniqueConstraint(fields=("organization", "product", "variant", "commercial_mode"), name="catalog_product_price_unique_mode"),
        ),
        migrations.AddConstraint(
            model_name="catalogavailability",
            constraint=models.UniqueConstraint(fields=("organization", "product", "commercial_mode"), name="catalog_availability_unique_mode"),
        ),
    ]
