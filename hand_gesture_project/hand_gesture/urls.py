from django.urls import path
from . import views

# urlpatterns = [
#     path('', views.ex_gesture, name='ex_gesture_page'),
# ]
from .views import index, video_feed

urlpatterns = [
    path('', index, name='ex_gesture_page'),
    path('video_feed/', video_feed, name='video_feed'),
]
