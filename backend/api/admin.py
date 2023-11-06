from django.contrib import admin

from.models import User, NoteSection, Note
# Register your models here.

admin.site.register(User)
admin.site.register(NoteSection)
admin.site.register(Note)