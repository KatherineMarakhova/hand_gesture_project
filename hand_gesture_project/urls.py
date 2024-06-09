from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', include('main.urls')),
    path('hand_gesture/', include('hand_gesture.urls')),
    path('form_config/', include('form_config.urls')),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
