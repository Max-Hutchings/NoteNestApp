from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.db.models import Max

from .managers import CustomUserManager


class User(AbstractUser):
    username = None
    email = models.EmailField(blank=False, null=False, unique=True)
    first_name = models.CharField(blank=False, null=False, max_length=50)
    last_name = models.CharField(blank=False, null=False, max_length=80)
    date_of_birth = models.DateField()


    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['first_name', 'last_name', 'date_of_birth']

    objects = CustomUserManager()

    def __str__(self):
        return self.email


class NoteSection(models.Model):

    SECTION_CHOICES = [
        ("standard", "Standard Section"),
        ("completed_notes", "Completed Tasks")
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # section = models.IntegerField(choices=section_choices)
    created_date = models.DateField(auto_now_add=True)
    title = models.CharField(max_length=100,)
    section_type = models.CharField(
        max_length=20,
        choices=SECTION_CHOICES,
        default="standard"
    )


class Note(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    section = models.ForeignKey(NoteSection, related_name="notes", on_delete=models.CASCADE)
    text = models.CharField(max_length=300, null=True)
    created_date = models.DateField(auto_now_add=True)
    due_date = models.DateField(null=True)
    completed = models.BooleanField(default=False, null=True)
    position = models.IntegerField(default=1)


@receiver(pre_save, sender=Note)
def set_default_position(sender, instance, **kwargs):
    if not instance.pk:
        max_position = Note.objects.filter(section=instance.section).aggregate(Max('position'))['position__max']
        if max_position is not None:
            instance.position = max_position + 1
        else:
            # This handles the case where there are no existing notes in the section
            instance.position = 1
