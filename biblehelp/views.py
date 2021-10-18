from django.http.response import JsonResponse
from django.shortcuts import redirect, render
from django.http import HttpResponse
from django.db import IntegrityError
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required

from .forms import GoalForm
from .data import initial_data
from .models import User, Goal
import json

# Create your views here.
# Anger
# Anxiety
# Discouragement
# Despair
# Fear
# Guilt
# Jealousy
# Lonliness
# Sadness
# Stress


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


def goals(request):
    # Redirect if user not logged in
    if not request.user.is_authenticated:
        messages.info(request, 'Log in to Make a Goal')
        return redirect('login')
    
    # Delete goal
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


def set_goal(request, topic, id):
    # Redirect if user not logged in
    if not request.user.is_authenticated:
        messages.info(request, 'Log in to Make a Goal')
        return redirect('login')

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

    return redirect('create')


@login_required(login_url='login')
def create_goal(request):

    if request.method == "POST":
        # Retrieve form data
        form = GoalForm(request.POST)

        # Check if valid form
        if form.is_valid():

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
            messages.error(request, 'Passwords must match')
            return redirect('register')

        # Try to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            messages.error(request, f"Username: '{username}' already taken")
            return redirect('register')

        # Login user
        # note: login() saves the user’s ID in the session, using Django’s session framework.
        login(request, user)
        return redirect('index')
    return render(request, "register.html")


def login_view(request):
    if request.method == "POST":
        next_url = request.POST.get('next')

        # Get form data
        username = request.POST["username"]
        password = request.POST["password"]

        # Check if valid credentials, if not, a user object is not retrieved
        user = authenticate(request, username=username, password=password)

        # Check to see if user exists
        if user is not None:
            login(request, user)

            # Check if there was a next parameter to redirect back to
            if next_url:
                return redirect(next_url)
            return redirect("index")

        else:
            messages.error(request, "Invalid Username/Password")

    return render(request, "login.html")


def logout_view(request):
    logout(request)
    return redirect("index")
