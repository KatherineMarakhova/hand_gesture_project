from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', include('main.urls')),
    path('hand_gestures/', include('hand_gesture.urls')),
    path('ex_config/', include('ex_config.urls')),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
