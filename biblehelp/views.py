from django.http.response import JsonResponse
from django.shortcuts import redirect, render
from django.http import HttpResponse
from django.db import IntegrityError
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ValidationError

from .forms import GoalForm, CustomUserCreationForm, LoginForm
from .data import initial_data
from .models import Goal
from therapy.settings import BIBLE_API_KEY
import json
import requests


def index(request):
    keys = initial_data.keys()
    return render(request, "index.html", {
        "emotions": keys
    })


def feeling(request, title):
    title = title.capitalize()

    emotion_object = initial_data.get(title)
    if emotion_object:
        data = emotion_object['entries']
        src = 'images/' + emotion_object['image']['src']
        alt = emotion_object['image']['alt']
        return render(request, "emotion.html", {
            "data": data, "title": title, "src": src, "alt": alt
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
        for dict in initial_data[topic]['entries']:
            if ("id", id) in dict.items():
                # Prepopulate form
                form = GoalForm(initial=dict)
                return render(request, "create.html", {
                    'form': form
                })
    except:
        pass

    return redirect('create')


def bible(request):
    # TODO: when changing translation, store data from book and chapter--don't reset
    if request.method == 'POST':
        # Retrieve form data
        data = json.loads(request.body)
        bible_id = data.get('bibleId')
        book_id = data.get('bookId')
        chapter_id = data.get('chapterId')

        # Only Bible id found, send request to get bible books
        if bible_id and not book_id and not chapter_id:
            url = f'https://api.scripture.api.bible/v1/bibles/{bible_id}/books'
            headers = {'api-key': BIBLE_API_KEY}
            response = requests.get(url, headers=headers)
            data = response.json()
            bible_books = data["data"]

            return JsonResponse({
                'data': bible_books
            })

        # Bible and book id found, send request to get book chapters
        if bible_id and book_id:
            url = f'https://api.scripture.api.bible/v1/bibles/{bible_id}/books/{book_id}/chapters'
            headers = {'api-key': BIBLE_API_KEY}
            response = requests.get(url, headers=headers)
            data = response.json()
            try:
                book_chapters = data["data"]
            except KeyError:
                return JsonResponse({
                    'data': 'keyError'
                })

            return JsonResponse({
                'data': book_chapters
            })

        # Bible and chapter id found, send request to get chapter verses
        if bible_id and chapter_id:
            url = f'https://api.scripture.api.bible/v1/bibles/{bible_id}/chapters/{chapter_id}'
            headers = {'api-key': BIBLE_API_KEY}
            response = requests.get(url, headers=headers)
            data = response.json()
            try:
                chapter_verses = data["data"]
            except KeyError:
                return JsonResponse({
                    'data': 'keyError'
                })
            return JsonResponse({
                'data': chapter_verses
            })

        # No data was found
        return JsonResponse({
            'data': 'not found'
        })

    # Use requests for server-side api calls, https://docs.python-requests.org/en/latest/

    url = 'https://api.scripture.api.bible/v1/bibles?language=eng'
    headers = {'api-key': BIBLE_API_KEY}
    response = requests.get(url, headers=headers)
    bibles = response.json()

    # Remove repetition of translation names
    name_list = []
    bible_list = []
    for bible in bibles["data"]:
        if not bible["name"] in name_list:
            name_list.append(bible["name"])
            bible_list.append(bible)

    # Sort bibles by abbreviation name
    bible_list = sorted(
        bible_list, key=lambda bible: bible["abbreviationLocal"])

    return render(request, "bible.html", {
        "bibles": bible_list
    })


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
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()

            next_url = request.POST.get('next')
            username = request.POST['username']
            password = request.POST['password1']
            user = authenticate(username=username, password=password)

            login(request, user)
            messages.success(request, 'Account created successfully!')
            if next_url:
                return redirect(next_url)
            return redirect('index')

    else:
        form = CustomUserCreationForm()

    return render(request, "register.html", {
        'form': form
    })


def login_view(request):
    if request.method == "POST":
        form = LoginForm(data=request.POST)
        if form.is_valid():

            # Get form data
            next_url = request.POST.get('next')
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
        form = LoginForm()
    return render(request, "login.html", {
        'form': form
    })


def logout_view(request):
    logout(request)
    return redirect("index")
