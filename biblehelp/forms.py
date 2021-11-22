from django.forms import ModelForm
from .models import Goal, User
from django import forms
from django.contrib.auth.forms import UserCreationForm


class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = UserCreationForm.Meta.fields


class GoalForm(ModelForm):
    class Meta:
        model = Goal
        exclude = ['setter']
        widgets = {
            'topic': forms.TextInput(attrs={'class': 'form-control'}),
            'goal': forms.TextInput(attrs={'class': 'form-control'}),
            'cite': forms.TextInput(attrs={'class': 'form-control'}),
            'scripture_text': forms.TextInput(attrs={'class': 'form-control'}),
            'personal_goal': forms.TextInput(attrs={'class': 'form-control'})
        }
