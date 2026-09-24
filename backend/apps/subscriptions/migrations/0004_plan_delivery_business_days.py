from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("subscriptions", "0003_plan_accent_color")]

    operations = [
        migrations.AddField(model_name="plan", name="delivery_min_business_days", field=models.PositiveIntegerField(default=3)),
        migrations.AddField(model_name="plan", name="delivery_max_business_days", field=models.PositiveIntegerField(default=8)),
        migrations.AddConstraint(
            model_name="plan",
            constraint=models.CheckConstraint(
                condition=models.Q(("delivery_min_business_days__lte", models.F("delivery_max_business_days"))),
                name="subscriptions_plan_delivery_business_days_range",
            ),
        ),
    ]
