from .data import initial_data

# To add keys(emotions) to layout.html dynamically
def get_keys(request):
    return {
        'emotion_keys': initial_data.keys()
    }