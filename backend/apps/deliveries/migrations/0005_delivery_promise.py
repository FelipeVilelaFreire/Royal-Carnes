from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("deliveries", "0004_alter_delivery_order_and_more")]

    operations = [
        migrations.AddField(model_name="delivery", name="delivery_promise_snapshot", field=models.JSONField(blank=True, default=dict)),
        migrations.AddField(model_name="delivery", name="promised_delivery_by_on", field=models.DateField(blank=True, null=True)),
        migrations.AddField(model_name="delivery", name="promised_delivery_starts_on", field=models.DateField(blank=True, null=True)),
    ]
