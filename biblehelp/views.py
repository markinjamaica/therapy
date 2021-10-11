from django.shortcuts import render
from django.http import HttpResponse
from .data import stress

# Create your views here.
emotions = [
    'anger',
    'anxiety',
    'discouragement',
    'despair',
    'fear',
    'guilt',
    'jealousy',
    'lonliness',
    'sadness',
    'stress'
]


def index(request):
    return render(request, "index.html", {
        "emotions": emotions
    })


def feeling(request, title):
    if not title in emotions:
        return HttpResponse('feeling does not exist')
    return render(request, "emotion.html", {
        "data": stress, "title": title
    })


def register(request):
    if request.method == "POST":
        # Get form data
        ###### Make sure to hash password!! #########
        username = request.POST["username"]
        password = request.POST["password"]
        confirm = request.POST["confirm"]

        if password != confirm:
            return HttpResponse('passwords must match')
        return HttpResponse(password)
    return render(request, "register.html")
