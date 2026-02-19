from django.urls import path
from . import views

urlpatterns = [
    path("create-assignment/", views.create_assignment),
    path("assignments/", views.list_assignments),
    path("submit-assignment/", views.submit_assignment),
    path("submissions/", views.list_submissions),
]
