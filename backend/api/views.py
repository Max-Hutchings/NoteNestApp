from django.db.models import Prefetch, F
from django.shortcuts import render, HttpResponseRedirect
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .serializers import UserSerializer, NoteSectionSerializer, NoteSerializer
from .models import User, NoteSection, Note
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.middleware.csrf import get_token
from rest_framework.views import APIView
from django.db import transaction
from rest_framework import status



def get_serialized_note_sections(user):
    """
    Fetches and serializes all user note sections and notes.
    User object inputted.
    """

    sections = NoteSection.objects.filter(user=user).prefetch_related("notes")
    serialized_sections = NoteSectionSerializer(sections, many=True).data
    print("Got and serialized note section")
    return serialized_sections


def get_user_instance(user_id):
    return User.objects.get(pk=user_id)



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    """
    Serializes token before sent to user on frontend
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['name'] = user.first_name + " " + user.last_name
        token["email"] = user.email
        token["userId"] = user.id
        print(user.first_name)
        print(user)

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    """
    Generates token to send to frontend.
    """
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            # Optionally include CSRF token for additional security
            response.data['csrf_token'] = get_token(request)
        return response


@api_view(["GET"])
def check_auth(request):
    """
    Basic authentication: checking if the user is authenticated
    """

    user = request.user
    if user.is_authenticated:
        return JsonResponse({'isAuthenticated': True, 'email': user.email})
    else:
        return JsonResponse({'isAuthenticated': False})


############################################################
## These API's evolve around creating user accounts, and performing CRUD opperation
## on their note sections and notes.
###########################################################

@api_view(["GET"])
def get_user_note_sections(request):
    """
    Send user note sections to frontend.
    """
    try:
        user = get_user_instance(request.user.id)
        return Response(get_serialized_note_sections(user))
    except Exception as e:
        print(e)
        return JsonResponse({"Status": f"Failed to get sections due to: {e} "})


class AddNoteSection(APIView):
    """
    Adding a section to model and returning sections.
    Limit of  6 sections per user.

    """

    def post(self, request):
        try:
            user = get_user_instance(request.user.id)
            sections_so_far = NoteSection.objects.filter(user=user).count()
            if sections_so_far >= 6:
                return JsonResponse({"data": "maximumSectionsReached"})
            added_section = NoteSection.objects.create(user=user)
            if added_section:
                return Response(get_serialized_note_sections(user))

        except Exception as e:  # It's better to specify which exception you're catching
            return JsonResponse({"status": f"Failed due to: {e}"})


@api_view(["POST"])
def add_user_section_title(request):
    """
    Adding a title to the note section and returning all sections
    """
    try:
        user = get_user_instance(request.user.id)
        section_id = request.data.get("section_id")
        section_title = request.data.get("section_title")

        section_to_update = NoteSection.objects.get(pk=section_id)
        section_to_update.title = section_title
        section_to_update.save()

        return Response(get_serialized_note_sections(user))

    except NoteSection.DoesNotExist:
        return JsonResponse({"status": "Section not found"})

    except Exception as e:  # General exception as a fallback
        print(f"An error occurred: {e}")
        return JsonResponse({"status": f"Failed to update title due to: {e}"})



class AddUserNote(APIView):
    """
    Adding or editing a user note.
    Returns all note sections.
    """

    def post(self, request):
        try:
            user = get_user_instance(request.user.id)
            section_id = request.data.get("sectionId")
            note_text = request.data.get("noteText")
            Note.objects.create(
                user=user,
                text=note_text,
                section_id=section_id
            )
            return Response(get_serialized_note_sections(user))

        except Exception as e:
            return JsonResponse({"status": f"Failed to add new Note due to {e}"})

    def put(self, request):
        try:
            user = get_user_instance(request.user.id)
            note = Note.objects.get(pk=request.data.get("noteId"))
            note_text = request.data.get("noteText")
            note.text = note_text
            note.save()
            return Response(get_serialized_note_sections(user))
        except Note.DoesNotExist:
            return JsonResponse({"status": "Note does not exist"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Exception while updating note: {e}")
            return JsonResponse({"status": f"Failed to update note due to: {e}"}, status=status.HTTP_400_BAD_REQUEST)



@api_view(["DELETE"])
def delete_note(request, noteId):
    """
    Deleting a note and returning all sections
    """
    try:
        user = get_user_instance(request.user.id)
        note = Note.objects.get(pk=noteId)
        if note.user == user:
            note.delete()
        else:
            return JsonResponse({"status": "User does not have permission to delete"})
        return Response(get_serialized_note_sections(user))

    except Note.DoesNotExist:
        return Response({"status": "Note not found"}, status=status.HTTP_404_NOT_FOUND)
    except User.DoesNotExist:
        return Response({"status": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"status": f"Failed to delete due to {e}"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
def delete_section(request, sectionId):
    """
    Delete Note section and return all sections
    """
    try:
        section_id = sectionId
        user = get_user_instance(request.user.id)
        section = NoteSection.objects.get(pk=section_id)
        if section.user == user:
            section.delete()
        else:
            return JsonResponse({"status": "User does not have permission to delete"})

        return Response(get_serialized_note_sections(user))
    except Exception as e:
        print("did not work on backend")
        return JsonResponse({"status": f"Failed to delete section due to {e}"})


@api_view(["PUT"])
def complete_note(request):
    """
    When the user wants to 'tick off' a note, they mark it as complete.
    A field on the note in the databases is updated to complete.
    Returns all serialized sections
    """

    try:
        user = get_user_instance(request.user.id)
        note = Note.objects.get(id=request.data.get("noteId"))
        note.completed = not note.completed
        note.save()
        return Response(get_serialized_note_sections(user))

    except Note.DoesNotExist:
        print("Note not found")
        return Response({"status": "Note not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Failed to delete due to {e}")
        return Response({"status": f"Failed to mark as complete due to {e}"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def clear_completed_tasks(request):
    """
    When the user clicks "Clear complete tasks", this function:
        checks if "completed tasks" section exists.
        If it doesn't, creates one.
        Adds all notes marked as completed into the completed task section.
        returns all sections
    transaction.atomic() prevents the serializing of each note individually.
    """
    try:
        "API called"
        user = get_user_instance(request.user.id)
        completed_section, created = NoteSection.objects.get_or_create(
            user=user,
            section_type="completed_notes",
            defaults={"title": "Completed Tasks"})
        notes_to_update = Note.objects.filter(user=user, completed=True).exclude(section=completed_section)

        with transaction.atomic():
            for note in notes_to_update:
                if note.completed == True:
                    note.section = completed_section
                    note.save()
        return Response(get_serialized_note_sections(user))

    except Note.DoesNotExist:
        return Response({"status": "Note not found"}, status=status.HTTP_404_NOT_FOUND)
    except User.DoesNotExist:
        return Response({"status": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Failed to delete due to {e}")
        return Response({"status": f"Failed move completed tasks to section because: {e}"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT"])
def update_note_position(request):
    try:
        user = get_user_instance(request.user.id)
        new_note_position = request.data.get("newPosition")
        section_id = request.data.get("sectionId")

        with transaction.atomic():
            note_to_update = Note.objects.get(pk=request.data.get("noteId"))

            notes_to_push = Note.objects.filter(section=section_id, position__gte=new_note_position)
            notes_to_push.update(position=F("position")+1)

            note_to_update.position = new_note_position
            note_to_update.save()

        return Response(get_serialized_note_sections(user))

    except Exception as e:
        return JsonResponse({"status": f"Failed to update order due to: {e}"})



@api_view(["PUT"])
def assign_new_note_position(request):
    """
    Assigns a new note position and updates them in the database.
    Utilizes a database transaction to ensure all updates are done atomically.
    Returns a success or failure response.
    Assumes that `notePositions` is a list of dictionaries with note IDs as keys and their new positions as values.
    """

    try:
        note_positions = request.data.get("notePositions")

        with transaction.atomic():
            for note in note_positions:
                updated_notes = Note.objects.filter(id=note).update(position=note_positions[note])
                print("updated note position")
                print(updated_notes)
            return JsonResponse({"status": "Successfully updated note position"})
    except Exception as e:
        return JsonResponse({"status": f"Failed to change note position due to: {e}"})

@api_view(["POST"])
def create_user_account(request):
    """
    Creates user account
    """
    try:
        response = request.data
        user, created = User.objects.get_or_create(
            first_name=response["first_name"],
            last_name=response["last_name"],
            email=response["email"],
            date_of_birth=response["date_of_birth"],
        )
        password = response["password"]

    except KeyError:
        return JsonResponse({"status": "Bad request", "error": "Missing required fields"},
                            status=400)

    if created:
        user.set_password(password)
        user.save()
        return JsonResponse({"Status": "successful", "user_id": user.id})
    else:
        return JsonResponse({"status": "User already exists", "user_id": user.id}, status=409)



