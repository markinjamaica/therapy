from django.db.models.fields import CharField
from django.forms import ModelForm, widgets
from .models import Goal
from django import forms

class GoalForm(ModelForm):
    class Meta:
        model = Goal
        exclude = ['setter']
        widgets = {
            'topic': forms.Textarea(attrs={'class': 'form-control'})
        }

    #     topic = models.CharField(max_length=100)
    # goal = models.CharField(max_length=500)
    # cite = models.CharField(max_length=100)
    # scripture_text = models.CharField(max_length=1000)
    # personal_goal = models.CharField(max_length=1000, blank=True)