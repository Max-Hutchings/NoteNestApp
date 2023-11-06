from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from . import views
from .views import MyTokenObtainPairSerializer, MyTokenObtainPairView, check_auth, AddUserNote, AddNoteSection

urlpatterns = [
    path("create-account/", views.create_user_account, name="create_account"),
    path("get-sections/", views.get_user_note_sections),
    path("add-section/", AddNoteSection.as_view()),
    path("add-section-title/", views.add_user_section_title),
    path("add-section-note/", AddUserNote.as_view()),
    path("delete-note/<noteId>", views.delete_note),
    path("delete-section/<sectionId>", views.delete_section),



    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("check-auth/", check_auth)
]