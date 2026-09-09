from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("catalog", "0005_remove_productprice_catalog_product_price_unique_mode_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="collection",
            name="image_alt",
            field=models.CharField(blank=True, max_length=180),
        ),
        migrations.AddField(
            model_name="collection",
            name="image_url",
            field=models.URLField(blank=True),
        ),
    ]
