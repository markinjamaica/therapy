# from django.test import TestCase
import re

# Create your tests here.
# string = f"'hello! \"Is that you?\"'"
string = f"'hello \"Frank! You goon!\" said Marlon'"
string = re.sub(r"[\"\“\”]", '\"', string)
f = open('junk.py', 'w')
f.write(string)
f.close()
