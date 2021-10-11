from django.shortcuts import redirect, render
from django.http import HttpResponse
from django.db import IntegrityError
from django.contrib.auth import authenticate, login, logout

from .data import stress
from .models import User

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
        username = request.POST["username"]
        email = request.POST["email"]

        # Django hashes password automatically when new user is created
        password = request.POST["password"]
        confirm = request.POST["confirm"]

        # Check to see if passwords match
        if password != confirm:
            ####### send json response instead, so their form data isn't cleared ####
            return render(request, "register.html", {
                "error": "Passwords must match"
            })

        # Try to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            ####### send json response instead, so their form data isn't cleared ####
            return render(request, "register.html", {
                "error": "Username already taken"
            })

        # Login user
        login(request, user)
        return redirect('index')
    return render(request, "register.html")
