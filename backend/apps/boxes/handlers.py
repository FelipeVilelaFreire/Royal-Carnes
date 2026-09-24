from apps.scheduling.services import register_schedule_handler


def prepare_royal_box(occurrence):
    from .services import prepare_box_cycle

    prepare_box_cycle(occurrence=occurrence)


def register_handlers():
    register_schedule_handler("royal_box.prepare", prepare_royal_box)
