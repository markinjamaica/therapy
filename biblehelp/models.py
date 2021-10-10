from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class User(AbstractUser):
    pass

class Goal:
    goal = models.CharField(max_length=100)
    setter = models.ForeignKey(User, on_delete=models.CASCADE, null=True)