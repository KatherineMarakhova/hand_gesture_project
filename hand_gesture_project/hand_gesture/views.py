from django.shortcuts import render


def ex_gesture(request):
    return render(request, 'hand_gesture/ex_gesture.html')
