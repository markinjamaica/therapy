from django.db.models.fields import CharField
from django.forms import ModelForm, widgets
from .models import Goal
from django import forms

class GoalForm(ModelForm):
    class Meta:
        model = Goal
        exclude = ['setter']
        widgets = {
            ###### working on this ########
            'topic': forms.TextInput(attrs={'class': 'form-control'}),
            'goal': forms.TextInput(attrs={'class': 'form-control'}),
            'cite': forms.TextInput(attrs={'class': 'form-control'}),
            'scripture_text': forms.TextInput(attrs={'class': 'form-control'}),
            'personal_goal': forms.TextInput(attrs={'class': 'form-control'})
        }