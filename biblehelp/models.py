from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class User(AbstractUser):
    pass

class Goal(models.Model):
    setter = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    topic = models.CharField(max_length=100)
    goal = models.CharField(max_length=500)
    cite = models.CharField(max_length=100)
    scripture_text = models.CharField(max_length=1000)
    personal_goal = models.CharField(max_length=1000, blank=True)