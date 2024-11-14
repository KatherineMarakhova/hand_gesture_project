from django.urls import path
from . import views

urlpatterns = [
    path('', views.ex_gesture, name='ex_gesture_page'),
    path('video_feed/', views.analyze_emotion, name='video_feed')
]
