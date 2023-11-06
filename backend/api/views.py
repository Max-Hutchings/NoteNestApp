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

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['name'] = user.first_name + " " + user.last_name
        token["email"] = user.email
        token["userId"] = user.id
        print(user.first_name)
        print(user)


        # ...
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            # Optionally include CSRF token for additional security
            response.data['csrf_token'] = get_token(request)
        return response


@api_view(["GET"])
def check_auth(request):
    user = request.user
    if user.is_authenticated:
        return JsonResponse({'isAuthenticated': True, 'email': user.email})
    else:
        return JsonResponse({'isAuthenticated': False})



@api_view(["GET"])
def get_user_note_sections(request):
    print("GET SECTIONS WAS CALLED")
    user = request.user.id
    print(user)
    try:
        sections = NoteSection.objects.filter(user=user).prefetch_related("notes")
        serialized_sections = NoteSectionSerializer(sections, many=True).data
        print("Completed Get")
        return Response(serialized_sections)
    except:
        print("Failed to get")
        return JsonResponse({"Status": "Failed to get sections, but API worked"})


class AddNoteSection(APIView):
    def post(self, request):
        user = request.user.id
        user = User.objects.get(pk=user)
        try:
            sections_so_far = NoteSection.objects.filter(user=user).count()
            if sections_so_far >= 6:
                return JsonResponse({"data": "maximumSectionsReached"})
            added_section = NoteSection.objects.create(
                user=user,

            )
            serialized_sections = NoteSectionSerializer(NoteSection.objects.filter(user=user),
                                                        many=True).data
            if added_section:
                return Response(serialized_sections)
        except Exception as e:  # It's better to specify which exception you're catching
            print(f"Failed to executive add section: {e}")
            return JsonResponse({"status": "API working, but failed to add"})





@api_view(["POST"])
def add_user_section_title(request):
    user = User.objects.get(pk=request.user.id)
    section_id = request.data.get("section_id")
    section_title = request.data.get("section_title")
    print(section_id)
    try:
        section_to_update = NoteSection.objects.get(pk=section_id)
        section_to_update.title = section_title  # Use '=' to assign the new title
        section_to_update.save()
        serialized_sections = NoteSectionSerializer(NoteSection.objects.filter(user=user),
                                                    many=True).data
        return Response(serialized_sections)
    except NoteSection.DoesNotExist:  # It's better to specify which exception you're catching
        return JsonResponse({"status": "Section not found"})
    except Exception as e:  # General exception as a fallback
        print(f"An error occurred: {e}")
        return JsonResponse({"status": "Failed to update title"})





from rest_framework import status

class AddUserNote(APIView):


    def post(self, request, *args, **kwargs):

        try:
            user = User.objects.get(pk=request.user.id)
            section_id = request.data.get("sectionId")
            print(section_id)

            note_text = request.data.get("noteText")
            Note.objects.create(
                user=user,
                text=note_text,
                section_id=section_id
            )
            print("Create new note")
            serialized_sections = NoteSectionSerializer(NoteSection.objects.filter(user=user), many=True).data
            return Response(serialized_sections, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"Exception while adding new note: {e}")
            return JsonResponse({"status": "Failed to add new Note"}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        try:
            user = User.objects.get(pk=request.user.id)
            note = Note.objects.get(pk=request.data.get("noteId"))
            note_text = request.data.get("noteText")
            note.text = note_text
            note.save()
            serialized_sections = NoteSectionSerializer(NoteSection.objects.filter(user=user), many=True).data
            return Response(serialized_sections, status=status.HTTP_200_OK)
        except Note.DoesNotExist:
            return JsonResponse({"status": "Note does not exist"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Exception while updating note: {e}")
            return JsonResponse({"status": "Failed to update note"}, status=status.HTTP_400_BAD_REQUEST)



@api_view(["DELETE"])
def delete_note(request, noteId):
    try:
        print("Section called")
        user = User.objects.get(pk=request.user.id)
        note = Note.objects.get(pk=noteId)
        if note.user == user:
            note.delete()
        else:
            print("User is not the owner of this post")
        serialized_sections = NoteSectionSerializer(NoteSection.objects.filter(user=user),
                                                    many=True).data
        return Response(serialized_sections)

    except Note.DoesNotExist:
        print("Note not found")
        return Response({"status": "Note not found"}, status=status.HTTP_404_NOT_FOUND)
    except User.DoesNotExist:
        print("User not found")
        return Response({"status": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Failed to delete due to {e}")
        return Response({"status": "Failed to delete"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
def delete_section(request, sectionId):
    print("Section called")
    try:
        user = User.objects.get(pk=request.user.id)
        print(user)
        section_id = sectionId
        print(section_id)
        section = NoteSection.objects.get(pk=section_id)
        if section.user == user:
            section.delete()
        else:
            print("user did not own post")

        serialized_sections = NoteSectionSerializer(NoteSection.objects.filter(user=user),
                                                    many=True).data
        return Response(serialized_sections)
    except:
        print("did not work on backend")
        return JsonResponse({"status": "Failed"})


@api_view(["POST"])
def create_user_account(request):
    response = request.data
    print(response)

    try:
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



