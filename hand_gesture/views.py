from django.shortcuts import render

def index(request):
    return render(request, 'hand_gesture/index.html')