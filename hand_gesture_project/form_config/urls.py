from django.urls import path
from . import views

urlpatterns = [
    path('', views.from_config, name='config_page')
]