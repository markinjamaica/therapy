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


# add login required
def goals(request):
    return render(request, "goals.html")


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
        # note: login() saves the user’s ID in the session, using Django’s session framework.
        login(request, user)
        return redirect('index')
    return render(request, "register.html")


def login_view(request):
    if request.method == "POST":

        # Get form data
        username = request.POST["username"]
        password = request.POST["password"]

        # Check if valid credentials, if not, a user object is not retrieved
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect("index")
        else:
            return render(request, "login.html", {
                "error": "Invalid username/password"
            })


    return render(request, "login.html")


def logout_view(request):
    logout(request)
    return redirect("index")
