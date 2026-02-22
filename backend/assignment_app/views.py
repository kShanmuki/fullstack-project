from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Assignment, Submission
from django.contrib.auth.models import User
from sklearn.metrics.pairwise import cosine_similarity


@csrf_exempt
def create_assignment(request):
    if request.method == "POST":
        data = json.loads(request.body)

        assignment = Assignment.objects.create(
            title=data.get("title"),
            description=data.get("description")
        )

        return JsonResponse({"message": "Assignment created", "id": assignment.id})

    return JsonResponse({"error": "Only POST method allowed"})


def list_assignments(request):
    assignments = list(Assignment.objects.all().values())
    return JsonResponse(assignments, safe=False)


def list_submissions(request):
    submissions = list(Submission.objects.all().values())
    return JsonResponse(submissions, safe=False)


@csrf_exempt
def submit_assignment(request):
    if request.method == "POST":

        # JSON request from React
        if request.content_type == "application/json":
            data = json.loads(request.body)

            assignment_id = data.get("assignment_id")
            student_name = data.get("student_name")

            student, created = User.objects.get_or_create(
    username=student_name,
    defaults={"email": student_name + "@mail.com"}
)





            
            submission_text = data.get("submission_text", "")
            submission_file = None

        else:
            assignment_id = request.POST.get("assignment_id")
            student_name = request.POST.get("student_name")
            submission_text = request.POST.get("submission_text", "")
            submission_file = request.FILES.get("submission_file")

        old_submissions = Submission.objects.filter(
            assignment_id=assignment_id
        ).values_list("submission_text", flat=True)

        plagiarism_percent = 0

        if old_submissions and submission_text.strip() != "":
            documents = list(old_submissions) + [submission_text]

            vectorizer = TfidfVectorizer()
            tfidf_matrix = vectorizer.fit_transform(documents)

            similarity_matrix = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1])
            max_similarity = similarity_matrix.max()

            plagiarism_percent = round(max_similarity * 100, 2)

        if plagiarism_percent > 70:
            marks = 30
            feedback = "High plagiarism detected. Please submit original work."
        elif plagiarism_percent > 40:
            marks = 60
            feedback = "Moderate plagiarism risk. Improve originality and rewrite sections."
        else:
            marks = 90
            feedback = "Good originality. Explanation is clear. Add more examples for improvement."

    submission = Submission.objects.create(
    assignment_id=assignment_id,
    student_name=student_name,
    submission_text=submission_text,
    submission_file=submission_file,
    status="Submitted",
    feedback=feedback,
    plagiarism_score=plagiarism_percent,
    marks=marks
)





        

    return JsonResponse({
            "message": "Submission successful",
            "id": submission.id,
            "plagiarism_score": plagiarism_percent,
            "marks": marks,
            "feedback": feedback
        })

    return JsonResponse({"error": "Only POST method allowed"})
