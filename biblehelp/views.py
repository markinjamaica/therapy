from django.http.response import JsonResponse
from django.shortcuts import redirect, render
from django.http import HttpResponse
from django.db import IntegrityError
from django.contrib.auth import authenticate, login, logout

from .forms import GoalForm
from .data import initial_data
from .models import User, Goal
import json

# Create your views here.

def index(request):
    keys = initial_data.keys()
    return render(request, "index.html", {
        "emotions": keys
    })


def feeling(request, title):
    title = title.capitalize()

    challenge_list = initial_data.get(title)
    if challenge_list:
        return render(request, "emotion.html", {
            "data": challenge_list, "title": title
        })

    # If data not found, redirect home
    return redirect('index')


# add login required? or prompt for login when someone trys to make a goal?
def goals(request):
    if request.method == 'DELETE':
        # Parse json data from fetch request and convert into Python Dict
        data = json.loads(request.body)

        # Retrieve goal id
        goal_id = data.get("goalId")

        # Retrieve goal, verify goal was created by user
        try:
            goal_obj = Goal.objects.get(id=goal_id, setter=request.user)
            goal_obj.delete()
        except:
            return JsonResponse({"message": "problem"})

        #### delete works...but I want to update w/o page reload #########
        return JsonResponse({"message": "success"})

    goal_data = Goal.objects.filter(setter=request.user)
    return render(request, "goals.html", {
        "goals": goal_data
    })


# add login required
def set_goal(request, topic, id):

    topic = topic.capitalize()
    # Try to retrieve requested goal dict from data.py
    try:
        for dict in initial_data[topic]:
            if ("id", id) in dict.items():
                # Prepopulate form
                form = GoalForm(initial=dict)
                return render(request, "create.html", {
                    'form': form
                })
    except:
        pass
    
    # Render blank form if dict not found
    form = GoalForm()
    return render(request, "create.html", {
        'form': form
    })


# add login required
def create_goal(request):
    # if not logged in "Log in or register to create a goal"

    if request.method == "POST":
        # Retrieve form data
        form = GoalForm(request.POST)

        # Check if invalid form
        if not form.is_valid():
            return HttpResponse('Form invalid')

        # No need to use cleaned_data for ModelForm
        goal_obj = form.save(commit=False)
        goal_obj.setter = request.user
        goal_obj.save()

        return redirect('goals')

    form = GoalForm()
    return render(request, "create.html", {
        'form': form
    })


def register(request):
    if request.method == "POST":
        # perhaps use django form for this instead, can use modelform
        # Get form data
        username = request.POST["username"]
        email = request.POST["email"]

        # Django hashes password automatically when new user is CREATED
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
