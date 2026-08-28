from django.contrib import admin

from .models import CodeSequence


@admin.register(CodeSequence)
class CodeSequenceAdmin(admin.ModelAdmin):
    list_display = ("key", "prefix", "padding", "next_number", "organization")
    list_filter = ("organization",)
