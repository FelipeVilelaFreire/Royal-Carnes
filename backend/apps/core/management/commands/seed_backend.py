from django.core.management.base import BaseCommand, CommandError

from apps.core.seed_loader import BackendSeedApplier, BackendSeedLoader, SeedLoaderError


class Command(BaseCommand):
    help = "Apply a modular backend seed manifest."

    def add_arguments(self, parser):
        parser.add_argument(
            "--seed",
            required=True,
            help="Seed key, for example royalprime, examples/bikeclub or examples/camisaclub.",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Load and validate the seed without writing to the database.",
        )

    def handle(self, *args, **options):
        loader = BackendSeedLoader()
        try:
            manifest = loader.load(options["seed"])
            summary = BackendSeedApplier(
                manifest,
                dry_run=options["dry_run"],
            ).apply()
        except SeedLoaderError as exc:
            raise CommandError(str(exc)) from exc

        for line in summary:
            self.stdout.write(line)
        self.stdout.write(self.style.SUCCESS(f"seed complete: {manifest.key}"))
