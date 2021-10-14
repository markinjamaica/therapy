from django.forms import ModelForm
from .models import Goal

class GoalForm(ModelForm):
    class Meta:
        model = Goal
        fields = ['setter', 'goal', 'cite', 'scripture_text', 'personal_goal']
