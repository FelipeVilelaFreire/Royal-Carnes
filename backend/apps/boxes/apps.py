from django.apps import AppConfig


class BoxesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.boxes"

    def ready(self):
        from apps.boxes.handlers import register_handlers

        register_handlers()
