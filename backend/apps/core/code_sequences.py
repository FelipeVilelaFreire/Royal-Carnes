from django.db import transaction

from .models import CodeSequence


@transaction.atomic
def upsert_code_sequence(
    *,
    organization,
    key: str,
    prefix: str = "",
    padding: int = 6,
    next_number: int = 1,
    template: str = "{prefix}-{number}",
) -> CodeSequence:
    sequence, created = CodeSequence.objects.get_or_create(
        organization=organization,
        key=key,
        defaults={
            "prefix": prefix,
            "padding": padding,
            "next_number": next_number,
            "template": template,
        },
    )
    sequence.prefix = prefix
    sequence.padding = padding
    sequence.template = template
    if created:
        sequence.next_number = next_number
    sequence.save(update_fields=["prefix", "padding", "template", "next_number", "updated_at"])
    return sequence


@transaction.atomic
def generate_code(*, organization, key: str) -> str:
    sequence = CodeSequence.objects.select_for_update().get(
        organization=organization,
        key=key,
    )
    number = str(sequence.next_number).zfill(sequence.padding)
    code = sequence.template.format(
        prefix=sequence.prefix,
        number=number,
        key=sequence.key,
    )
    sequence.next_number += 1
    sequence.save(update_fields=["next_number", "updated_at"])
    return code
