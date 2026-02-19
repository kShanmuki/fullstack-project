
from django.db import models
class User(models.Model):
    ROLE_CHOICES = [
        ("student", "Student"),
        ("instructor", "Instructor"),
    ]

    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    def __str__(self):
        return self.name


class Assignment(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Submission(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    student_name = models.CharField(max_length=100)
    submission_text = models.TextField(blank=True, null=True)
    submission_file = models.FileField(upload_to="submissions/", blank=True, null=True)


    status = models.CharField(max_length=50, default="Submitted")
    feedback = models.TextField(blank=True, null=True)
    plagiarism_score = models.FloatField(default=0)
    marks = models.IntegerField(default=0)


    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.student_name

# Create your models here.
