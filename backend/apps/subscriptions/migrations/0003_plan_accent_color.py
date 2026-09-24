from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("subscriptions", "0002_subscription_default_delivery_address_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="plan",
            name="accent_color",
            field=models.CharField(default="#FFC665", max_length=7),
        ),
    ]
