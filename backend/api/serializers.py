from rest_framework import serializers

from .models import Note, User, NoteSection

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class NoteSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Note
        fields = "__all__"


class NoteSectionSerializer(serializers.ModelSerializer):
    notes = NoteSerializer(many=True)

    class Meta:
        model = NoteSection
        fields = ["id", "title", "created_date", "title", "notes", "section_type"]